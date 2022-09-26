import { useState } from 'react'

export const useInput = ({ value, onChange, onKeyDown }) => {
  const [composition, setComposition] = useState(false)

  return {
    value,
    onChange: (e) => onChange(e.target.value),
    onKeyDown: keyboardEventHandlerFactory((e) => onKeyDown({ ...e, composition })),
    onCompositionStart: () => setComposition(true),
    onCompositionEnd: () => setComposition(false),
  }
}

/**
 * イベントを渡すとデフォルトの動作をキャンセルして、与えられた処理を実行する関数を生成する
 *
 * @param e {Event}
 * @returns {function(callback: function(*): *): *}
 */
export const preventDefaultFactory = (e) => (callback) => {
  e.preventDefault()
  e.stopPropagation()

  return callback()
}

/**
 * キーボードイベントから Ctrl または Meta(Command) キーの押下を判定する
 *
 * @param e {KeyboardEvent}
 * @returns {boolean}
 */
export const ctrlOrMetaKey = (e) => (e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)

/**
 * キーボードイベントを拡張
 *
 * @param e
 * @returns {*&{ctrlOrMetaKey: boolean, preventDefaultWith: (function(function(*): *): *)}}
 */
export const createCustomKeyboardEvent = (e) => ({
  ...e,
  ctrlOrMetaKey: ctrlOrMetaKey(e),
  preventDefaultWith: preventDefaultFactory(e)
})

/**
 * 拡張されたキーボードイベントを使用したイベントハンドラーから通常のイベントハンドラーを生成する
 *
 * @param handler
 * @returns {function(*): *}
 */
export const keyboardEventHandlerFactory = (handler) => (e) => {
  return handler(createCustomKeyboardEvent(e))
}