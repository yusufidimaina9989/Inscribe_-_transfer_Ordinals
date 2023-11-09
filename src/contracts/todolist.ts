import {
  method,
  prop,
  SmartContract,
  hash256,
  assert,
  ByteString,
  FixedArray,
  toByteString,
  fill,
} from 'scrypt-ts'

export type Task = {
  name: ByteString
  isCompleted: boolean
}


export class Todolist extends SmartContract {

  static readonly TASK_COUNT = 20

  @prop(true)
  tasks: FixedArray<Task, typeof Todolist.TASK_COUNT>

 constructor() {
      super(...arguments)
      this.tasks = fill(
          {
              name: toByteString(''),
              isCompleted: true
          },
          Todolist.TASK_COUNT
     )
  }

  @method()
  public addTask(task: Task, taskIdx: bigint) {
      assert(this.tasks[Number(taskIdx)].isCompleted, 'task slot not empty')

      assert(task.name != toByteString(''), 'task should not be empty')

      this.tasks[Number(taskIdx)] = task

      let outputs = this.buildStateOutput(this.ctx.utxo.value)
      outputs += this.buildChangeOutput()
      assert(hash256(outputs) == this.ctx.hashOutputs, 'hashOutputs mismatch')
  }

  @method()
  public taskCompleted(taskIdx: bigint) {
      const task = this.tasks[Number(taskIdx)]

      this.tasks[Number(taskIdx)].isCompleted = true

      let outputs = this.buildStateOutput(this.ctx.utxo.value)
      outputs += this.buildChangeOutput()
      assert(hash256(outputs) == this.ctx.hashOutputs, 'hashOutputs mismatch')
  }

}