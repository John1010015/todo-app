import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  // ✅ Load tasks once on first render
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // ✅ Save tasks whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now().toString(),
          text: newTask,
          done: false,
          priority: 'Low',
        },
      ]);
      setNewTask('');
    }
  };

  const toggleDone = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, done: !task.done } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const changePriority = (id, priority) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, priority } : task
    ));
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
    document.body.classList.toggle('dark-mode');
  };

  const clearAll = () => {
    if (window.confirm('Clear all tasks?')) {
      setTasks([]);
      localStorage.removeItem('tasks');
    }
  };

  return (
    <div className="app">
      <h1>To-Do List</h1>
      <button className="toggle-theme" onClick={toggleDarkMode}>
        {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>

      <input
        type="text"
        value={newTask}
        placeholder="Add a task"
        onChange={e => setNewTask(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && addTask()}
      />
      <button onClick={addTask}>Add</button>
      {tasks.length > 0 && (
        <button onClick={clearAll} className="clear-all">
          🗑️ Clear All
        </button>
      )}

      <ul className="task-list">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`task-item ${task.priority} ${task.done ? 'done' : ''}`}
          >
            <span onClick={() => toggleDone(task.id)}>{task.text}</span>
            <select
              value={task.priority}
              onChange={(e) => changePriority(task.id, e.target.value)}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
            <button onClick={() => deleteTask(task.id)}>X</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
