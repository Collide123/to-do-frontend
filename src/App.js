import React, { useState, useEffect } from 'react';

// The base URL for your Express backend
const API_BASE_URL = 'https://to-do-list-app-p79g.onrender.com/api/todos';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- API Functions ---

  // 1. Fetch Todos
  const fetchTodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }
      const data = await response.json();
      setTodos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // 2. Add Todo
  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;

    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newTodoText }),
      });
      if (!response.ok) {
        throw new Error('Failed to add todo');
      }
      const newTodo = await response.json();
      setTodos([...todos, newTodo]);
      setNewTodoText('');
    } catch (err) {
      setError('Error adding todo: ' + err.message);
    }
  };

  // 3. Toggle Todo (Mark as complete/incomplete)
  const handleToggleTodo = async (_id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${_id}`, { // Uses _id
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) {
            throw new Error('Failed to toggle todo');
        }
        const updatedTodo = await response.json();

        setTodos(todos.map(todo => 
            todo._id === _id ? updatedTodo : todo // Uses _id to update state
        ));
    } catch (err) {
        setError('Error toggling todo: ' + err.message);
    }
  };

  // 4. Delete Todo
  const handleDeleteTodo = async (_id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${_id}`, { // Uses _id
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete todo');
        }
        setTodos(todos.filter(todo => todo._id !== _id)); // Uses _id to filter state
    } catch (err) {
        setError('Error deleting todo: ' + err.message);
    }
  };

  // --- Rendering ---
  
  if (loading) return <div>Loading todos...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>React To-Do List</h1>
      
      {/* Add New Todo Form */}
      <form onSubmit={handleAddTodo} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          placeholder="Add a new task"
          style={{ padding: '10px', width: '70%', marginRight: '10px' }}
        />
        <button type="submit" style={{ padding: '10px' }}>Add</button>
      </form>
      
      {/* To-Do List */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map(todo => (
          <li key={todo._id} style={{ // <-- USES _id for key
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '10px', 
            borderBottom: '1px solid #eee' 
          }}>
            <span 
              onClick={() => handleToggleTodo(todo._id)} // <-- USES _id in handler
              style={{ 
                cursor: 'pointer',
                textDecoration: todo.completed ? 'line-through' : 'none',
                color: todo.completed ? '#aaa' : '#000'
              }}
            >
              {todo.text}
            </span>
            <button 
              onClick={() => handleDeleteTodo(todo._id)} // <-- USES _id in handler
              style={{ 
                background: 'red', 
                color: 'white', 
                border: 'none', 
                padding: '5px 10px', 
                cursor: 'pointer' 
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;