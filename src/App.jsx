import './App.css';
import { TaskList } from './components/TaskList'
import { useTasks } from './hooks/useTodo'

function App() {
  const {
    tasks,
    updateText,
    create,
    remove,
    done,
    undone,
    moveToPrev,
    moveToNext,
  } = useTasks()

  return (
    <div className="App">
      <TaskList>
        {tasks.map(task => (
          <TaskList.Item
            key={task.id}
            task={task}
            onChangeText={(text) => updateText(task, text)}
            onCreate={(position) => create(task, position)}
            onRemove={() => remove(task)}
            onComplete={() => done(task)}
            onCancelCompletion={() => undone(task)}
            onMoveToPrev={() => moveToPrev(task)}
            onMoveToNext={() => moveToNext(task)}
          />
        ))}
      </TaskList>
    </div>
  );
}

export default App;
