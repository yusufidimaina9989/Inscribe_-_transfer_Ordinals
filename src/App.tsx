import React, { useEffect, useRef, useState } from "react";
import TaskList from "./TaskList";
import NewTask from "./NewTask";
import {
  ScryptProvider,
  SensiletSigner,
  Scrypt,
  ContractCalledEvent,
  toByteString,
  MethodCallOptions,
  toHex,
  bsv,
} from "scrypt-ts";
import { Task, Todolist } from "./contracts/todolist";
import { Typography, Card, CardContent } from "@mui/material";

// `npm run deploycontract` to get deployment transaction id
const contract_id = {
  /** The deployment transaction id */
  txId: "89fa1730bfd02dd3474c7345b7d522363aa5e9b13a353d684c440f4df62938f2",
  // txId : "e396ff41896859bf2cc5607459bc4cd33b6beb32688aec3765f0e64a9e24888e",
  /** The output index */
  outputIndex: 0,
};

const App: React.FC = () => {
  const signerRef = useRef<SensiletSigner>();
  const [contractInstance, setContract] = useState<Todolist>();
  const [Address, setAddress] = useState("");

  useEffect(() => {
    const provider = new ScryptProvider();
    const signer = new SensiletSigner(provider);

    signerRef.current = signer;

    fetchContract();

    const subscription = Scrypt.contractApi.subscribe(
      {
        clazz: Todolist,
        id: contract_id,
      },
      (event: ContractCalledEvent<Todolist>) => {
        setContract(event.nexts[0]);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchContract() {
    try {
      const instance = await Scrypt.contractApi.getLatestInstance(
        Todolist,
        contract_id
      );
      setContract(instance);
    } catch (error: any) {
      alert("Error Fetching the Contract ");
      console.error("fetchContract error: ", error);
    }
  }

  const handleCompleted = async (idx: number) => {
    const signer = signerRef.current as SensiletSigner;

    if (contractInstance && signer) {
      const { isAuthenticated, error } = await signer.requestAuth();
      const owner = await signer.getDefaultPubKey();
      if (!isAuthenticated) {
        throw new Error(error);
      }

      await contractInstance.connect(signer);

      // Create the next instance from the current.
      const nextInstance = contractInstance.next();
      // Set empty slot for next instance.
      nextInstance.tasks[idx].isCompleted = true;

      // Call the method of current instance to apply the updates on chain.
      contractInstance.methods
        .taskCompleted(BigInt(idx), {
          changeAddress: await signer.getDefaultAddress(),
          next: {
            instance: nextInstance,
            balance: contractInstance.balance,
          },
        } as MethodCallOptions<Todolist>)
        .then((result) => {
          console.log(`Task Completed: ${result.tx.id}`);
          alert("Task Completed Successfully");
        })
        .catch((e) => {
          console.error("Error in Completing the task: ", e);
        });
    }
  };

  const handleAdd = async (newItem: { name: string }) => {
    const signer = signerRef.current as SensiletSigner;
    const Address = await signer.getDefaultAddress();
    setAddress(toHex(Address));
    if (contractInstance && signer) {
      const { isAuthenticated, error } = await signer.requestAuth();
      if (!isAuthenticated) {
        throw new Error(error);
      }

      await contractInstance.connect(signer);

      // Create the next instance from the current.
      const nextInstance = contractInstance.next();

      // Construct new item object.
      const toAdd: Task = {
        name: toByteString(newItem.name, true),
        isCompleted: false,
      };

      // Find first empty slot and insert new item.
      let itemIdx = undefined;
      for (let i = 0; i < Todolist.TASK_COUNT; i++) {
        const item = contractInstance.tasks[i];
        if (item.isCompleted) {
          itemIdx = BigInt(i);
          nextInstance.tasks[i] = toAdd;
          break;
        }
      }

      if (itemIdx === undefined) {
        console.error("All Task slots are filled.");
        return;
      }

      // Call the method of current instance to apply the updates on chain.
      contractInstance.methods
        .addTask(toAdd, itemIdx, {
          next: {
            instance: nextInstance,
            balance: contractInstance.balance,
          },
        })
        .then((result) => {
          console.log(`Task Added: ${result.tx.id}`);
          alert("Task Added Successfully");
        })
        .catch((e) => {
          console.error("Error in Adding Task : ", e);
        });
    }
  };

  return (
    <div>
      
      <Card sx={{ minWidth: 2, m : 8, justifyContent: "center" }}>
        <CardContent>
          <Typography variant="h6" component="div">
            Address : {Address}
          </Typography>
        </CardContent>
      </Card>

      <NewTask onAdd={handleAdd} />
      <TaskList
        tasks={contractInstance ? (contractInstance.tasks as Task[]) : []}
        onCompleted={handleCompleted}
      />
    </div>
  );
};

export default App;
