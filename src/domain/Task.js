import { randomId } from '../helpers/string'

export class Task {
  constructor (id, text, isDone = false) {
    this._id = id
    this._text = text
    this._isDone = isDone
  }

  get id() {
    return this._id
  }

  get text() {
    return this._text
  }

  get isDone() {
    return this._isDone
  }

  static create(text = '') {
    return new Task(randomId(), text)
  }

  static reconstruct(rawTask) {
    return new Task(rawTask.id, rawTask.text, rawTask.isDone)
  }

  toPlain() {
    return {
      id: this._id,
      text: this._text,
      isDone: this._isDone,
    }
  }

  done() {
    return new Task(
      this._id,
      this._text,
      true,
    )
  }

  undone() {
    return new Task(
      this._id,
      this._text,
      false,
    )
  }

  updateText(text) {
    return new Task(
      this._id,
      text,
      this._isDone,
    )
  }
}