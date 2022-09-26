import './TaskList.css'
import classNames from 'classnames'
import { useEffect, useMemo, useRef } from 'react'
import { useInput } from '../hooks/useInput'
import { CheckButton } from './CheckButton'

export const TaskList = ({ children }) => {
  return (
    <ul className="TaskList">
      { children }
    </ul>
  )
}

const TaskListItem = ({
  task,
  onChangeText,
  onCreate,
  onRemove,
  onComplete,
  onCancelCompletion,
  onMoveToPrev,
  onMoveToNext
}) => {
  const className = classNames('TaskListItem', { 'TaskListItem-done': task.isDone })

  const inputRef = useRef(null)
  useEffect(() => { inputRef.current.focus() }, [])

  const handleToggleCompletion = useMemo(
    () => task.isDone ? onCancelCompletion : onComplete,
    [onCancelCompletion, onComplete, task.isDone],
  )

  /**
   * 次、または前のタスクへフォーカスを移動する
   *
   * @param target {"previous" | "next"}
   */
  const focusTo = (target) => (onExists = () => {}, onNotExists = () => {}) => {
    const targetElement = inputRef.current.parentNode[target + 'Sibling']

    if (targetElement) {
      onExists()
      targetElement.querySelector('input').focus()
    } else {
      onNotExists()
    }
  }
  focusTo.prev = focusTo('previous')
  focusTo.next = focusTo('next')

  const handleKeyDown = (e) => {
    // Ctrl + Enter で完了
    if (e.ctrlOrMetaKey && e.key === 'Enter' && !e.composition) {
      return e.preventDefaultWith(handleToggleCompletion)
    }

    // Enter で新しいタスクを追加
    if (e.key === 'Enter' && !e.composition) {
      const position = e.shiftKey ? 'before' : 'after'
      return e.preventDefaultWith(() => onCreate(position))
    }

    // テキストが空な状態で Backspace でタスク削除
    if (e.key === 'Backspace' && !task.text.length) {
      const action = () => focusTo.prev(onRemove, focusTo.next(onRemove))
      return e.preventDefaultWith(action)
    }

    // Tab キーで前後のタスクに移動
    if (e.key === 'Tab') {
      const action = e.shiftKey ? focusTo.prev : focusTo.next
      return e.preventDefaultWith(action)
    }

    // Ctrl + 上下キーでタスクを移動
    if (e.ctrlOrMetaKey && /^Arrow/.test(e.key)) {
      const action = e.key === 'ArrowUp' ? onMoveToPrev : onMoveToNext
      return e.preventDefaultWith(action)
    }
  }

  const inputProps = useInput({
    value: task.text,
    onChange: onChangeText,
    onKeyDown: handleKeyDown,
  })

  return (
    <li className={className}>
      <CheckButton
        active={task.isDone}
        onClick={handleToggleCompletion}
      />
      <input
        ref={inputRef}
        className="TaskListItem_input"
        {...inputProps}
      />
    </li>
  )
}

TaskList.Item = TaskListItem