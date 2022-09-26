import { Task } from './Task'

export class Tasks {
  constructor (tasks = []) {
    this._tasks = [...tasks]
  }

  static reconstruct(rawTasks) {
    return new Tasks(rawTasks.map(Task.reconstruct))
  }

  toPlain() {
    return this._tasks.map(task => task.toPlain())
  }

  _indexOf(task) {
    return  this._tasks.findIndex(({ id }) => id === task.id)
  }

  map(callback) {
    return this._tasks.map((task) => callback(task))
  }

  insert(task, index = this._tasks.length) {
    const tasks = [...this._tasks]
    tasks.splice(index, 0, task)

    return new Tasks(tasks)
  }

  insertAfter(task, newTask) {
    return this.insert(newTask, this._indexOf(task) + 1)
  }

  insertBefore(task, newTask) {
    return this.insert(newTask, this._indexOf(task))
  }

  move(task, offset) {
    const index = this._indexOf(task)

    const tasks = [...this._tasks]
    tasks.splice(index, 1)
    tasks.splice(index + offset, 0, task)

    return new Tasks(tasks)
  }

  replace(task) {
    const tasks = this._tasks.map((_task) => _task.id === task.id ? task : _task)

    return new Tasks(tasks)
  }

  remove(task) {
    const tasks = this._tasks.filter(({ id }) => id !== task.id)

    return new Tasks(tasks)
  }
}
