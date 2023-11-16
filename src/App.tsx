import React, { useRef, useState } from "react";
import { Addr, PandaSigner, bsv } from "scrypt-ts";
import {
  OrdiMethodCallOptions,
  OrdiNFTP2PKH,
  OrdiProvider,
  ContentType,
} from "scrypt-ord";
import { Button } from "@mui/material";
import { DemoNFT } from "./contracts/mint";
import { Wallet } from "@mui/icons-material";

const App: React.FC = () => {
  const signerRef = useRef<PandaSigner>();

  const [isConnected, setIsConnected] = useState(false);

  const [image, setimage] = useState<string>("");

  async function connect() {
    const provider = new OrdiProvider(bsv.Networks.testnet);
    const signer = new PandaSigner(provider);

    signerRef.current = signer;
    const { isAuthenticated, error } = await signer.requestAuth();
    if (!isAuthenticated) {
      throw new Error(`Unauthenticated: ${error}`);
    }

    setIsConnected(true);
  }

  const handleConnect = async () => {
    await connect();
  };

  const mint = async () => {
    try {
      const signer = signerRef.current as PandaSigner;
      await signer.connect();
      const address = (await signer.getOrdAddress()).toByteString();
      let instance = new DemoNFT(1n, 1n);
      await instance.connect(signer);
  
      const inscriptionTx = await instance.inscribeImage(image, ContentType.JPG);
  
      console.log("Inscription TXID: ", inscriptionTx.id);
  
  
      // 5-second delay before transferring
      setTimeout(async () => {
        try {
          const { tx: unlockTx } = await instance.methods.unlock(2n, {
            transfer: new OrdiNFTP2PKH(Addr(address)),
          } as OrdiMethodCallOptions<DemoNFT>);
  
          console.log("Unlocked NFT: ", unlockTx.id);
        } catch (unlockError) {
          console.error("Error during unlock:", unlockError);
        }
      }, 5000); // 5000 milliseconds = 5 seconds
    } catch (error) {
      console.error("Error in mint function:", error);
    }
  };
  
  
  const handleFileInput = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        if (e.target.result instanceof ArrayBuffer) {
          const uint8Array = new Uint8Array(e.target.result);
          const base64Data = btoa(String.fromCharCode.apply(null, uint8Array));
          // Now, 'base64Data' contains the base64-encoded image data
          console.log(base64Data);
          setimage(base64Data);
          const imageElement = document.getElementById(
            "imagePreview"
          ) as HTMLImageElement;
          imageElement.src = `data:image/jpg;base64, ${base64Data}`;
        } else {
          console.error("Unsupported data type");
        }
        // Update the state with the base64 data
      };

      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div>
      {isConnected ? (
        <div style={{ padding: "25px" }}>
          
          <br />
          <input type="file" onChange={handleFileInput} />
          <br />

          <img id="imagePreview" alt="preview" height={400} width={350} />
          <br />

          <Button
            variant="contained"
            color="success"
            onClick={mint}
            sx={{ marginTop: 2 }}>
            Mint & Transfer
          </Button>
        </div>
      ) : (
        <div
          style={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Button
            startIcon={<Wallet />}
            variant="contained"
            color="success"
            size="large"
            onClick={handleConnect}>
            Connect Wallet
          </Button>
        </div>
      )}
    </div>
  );
};

export default App;
