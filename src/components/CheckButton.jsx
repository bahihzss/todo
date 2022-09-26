import './CheckButton.css'

export const CheckButton = ({ active, onClick }) => {
  const className = ['CheckButton']
  if (active) className.push('CheckButton-active')

  return <button
    className={className.join(' ')}
    onClick={onClick}
  >✔︎</button>
}