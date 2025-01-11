import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({ title: '', description: '' });
    const [searchQuery, setSearchQuery] = useState(''); // Search state

    // Fetch tasks
    useEffect(() => {
        axios.get('http://localhost:5000/api/tasks')
            .then(response => setTasks(response.data))
            .catch(error => console.error(error));
    }, []);

    // Create task
    const createTask = () => {
        axios.post('http://localhost:5000/api/tasks', newTask)
            .then(response => setTasks([...tasks, response.data]))
            .catch(error => console.error(error));
    };

    // Update task
    const updateTask = (id, updatedFields) => {
        axios.put(`http://localhost:5000/api/tasks/${id}`, updatedFields)
            .then(response => setTasks(tasks.map(task => task._id === id ? response.data : task)))
            .catch(error => console.error(error));
    };

    // Delete task
    const deleteTask = (id) => {
        axios.delete(`http://localhost:5000/api/tasks/${id}`)
            .then(() => setTasks(tasks.filter(task => task._id !== id)))
            .catch(error => console.error(error));
    };

    // Filter tasks based on search query
    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="App">
            <h1>To-Do List</h1>
            <div>
                <input
                    type="text"
                    placeholder="Task title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Task description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
                <button onClick={createTask}>Add Task</button>
            </div>

            {/* Search bar */}
            <div>
                <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} // Update search query
                />
            </div>

            {/* Display filtered tasks */}
            <ul>
                {filteredTasks.map(task => (
                    <li key={task._id}>
                        <h3>{task.title}</h3>
                        <p>{task.description}</p>
                        <button onClick={() => updateTask(task._id, { completed: !task.completed })}>
                            {task.completed ? 'Mark Uncompleted' : 'Mark Completed'}
                        </button>
                        <button onClick={() => deleteTask(task._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
