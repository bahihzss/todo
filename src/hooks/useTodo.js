import { useCallback, useEffect, useMemo, useState } from 'react'
import { Task } from '../domain/Task'
import { Tasks } from '../domain/Tasks'

export const useTodo = (initTaskNames = ['']) => {
  const initTasks = localStorage.todoList ? JSON.parse(localStorage.todoList) : initTaskNames.map(createTask)
  const [todoList, setTodoList] = useState(initTasks)

  useEffect(() => {
    localStorage.todoList = JSON.stringify(todoList)
  }, [todoList])

  /* ステータスごとのリスト */
  const incompleteList = useMemo(
    () => todoList.filter(({ isDone }) => !isDone),
    [todoList],
  )

  const completedList = useMemo(
    () => todoList.filter(({ isDone }) => isDone),
    [todoList],
  )

  /* タスク操作 */
  const addAfter = useCallback((taskId) => {
    const index = todoList.findIndex(task => task.id === taskId)
    todoList.splice(index + 1, 0, createTask())

    setTodoList([...todoList])
  }, [todoList])

  const remove = useCallback((taskId) => {
    const newTodoList = todoList.filter((task) => task.id !== taskId)

    setTodoList(newTodoList)
  }, [todoList])

  const moveTo = useCallback((taskId, offset) => {
    const index = todoList.findIndex(task => task.id === taskId)

    if ([-1, todoList.length].includes(index + offset)) return

    const task = todoList.splice(index, 1)
    todoList.splice(index + offset, 0, task[0])

    setTodoList([...todoList])
  }, [todoList])

  const moveToPrev = useCallback((taskId) => moveTo(taskId, -1), [moveTo])

  const moveToNext = useCallback((taskId) => moveTo(taskId, 1), [moveTo])

  const complete = useCallback((taskId) => {
    const newTodoList = todoList.map((task) => task.id === taskId ? completeTask(task) : task)

    setTodoList(newTodoList)
  }, [todoList])

  const cancel = useCallback((taskId) => {
    const newTodoList = todoList.map((task) => task.id === taskId ? cancelCompletion(task) : task)

    setTodoList(newTodoList)
  }, [todoList])

  const updateText = useCallback((taskId, text) => {
    const newTodoList = todoList.map((task) => task.id === taskId ? updateTask(task, text) : task)

    setTodoList(newTodoList)
  }, [todoList])

  return { addAfter, remove, moveToPrev, moveToNext, complete, cancel, updateText, todoList, incompleteList, completedList }
}

const createTask = (text = '') => ({
  id: makeId(),
  text,
  isDone: false,
})

const updateTask = (task, text) => ({
  ...task,
  text,
})

const completeTask = (task) => ({
  ...task,
  isDone: true,
})

const cancelCompletion = (task) => ({
  ...task,
  isDone: false,
})

const makeId = (length = 20) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

class Storage {
  get(key) {
    return localStorage[key] && JSON.parse(localStorage[key])
  }

  set(key, value) {
    localStorage[key] = JSON.stringify(value)
  }
}
const storage = new Storage()

export const useTasks = (initTaskNames = ['']) => {
  const initTasks = Tasks.reconstruct(
    storage.get('tasks') ?? initTaskNames.map(Task.create)
  )
  const [tasks, setTasks] = useState(initTasks)

  useEffect(() => {
    storage.set('tasks', tasks.toPlain())
  }, [tasks])

  const updateText = (task, text) => {
    setTasks(tasks.replace(task.updateText(text)))
  }

  const create = (task, position) => {
    if (position === 'before') setTasks(tasks.insertBefore(task, Task.create()))
    if (position === 'after') setTasks(tasks.insertAfter(task, Task.create()))
  }

  const remove = (task) => {
    setTasks(tasks.remove(task))
  }

  const done = (task) => {
    setTasks(tasks.replace(task.done()))
  }

  const undone = (task) => {
    setTasks(tasks.replace(task.undone()))
  }

  const moveToPrev = (task) => {
    setTasks(tasks.move(task, -1))
  }

  const moveToNext = (task) => {
    setTasks(tasks.move(task, 1))
  }

  return {
    tasks,
    updateText,
    create,
    remove,
    done,
    undone,
    moveToPrev,
    moveToNext,
  }
}