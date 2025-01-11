const express = require("express");
const cors = require("cors");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory tasks array (for development/testing purposes)
let tasks = [
  {
    id: 1,
    title: "Sample Task 1",
    description: "Description of Task 1",
    completed: false,
  },
  {
    id: 2,
    title: "Sample Task 2",
    description: "Description of Task 2",
    completed: false,
  },
];

// CRUD API Endpoints

// 1. GET - Get all tasks
app.get("/api/tasks", (req, res) => {
  res.status(200).json(tasks); // Return all tasks in the tasks array
});

// 2. POST - Create a new task
app.post("/api/tasks", (req, res) => {
  const { title, description } = req.body;

  // Validate input
  if (!title || !description) {
    return res
      .status(400)
      .json({ error: "Title and description are required" });
  }

  // Create a new task object
  const newTask = {
    id: tasks.length + 1, // Generate a new ID (simple approach)
    title,
    description,
    completed: false, // New tasks are initially incomplete
  };

  tasks.push(newTask); // Add the new task to the tasks array
  res.status(201).json(newTask); // Return the newly created task
});

// 3. PUT - Update an existing task
app.put("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;

  // Find the task with the given id
  const taskIndex = tasks.findIndex((task) => task.id === parseInt(id));

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  // Update the task
  const updatedTask = {
    ...tasks[taskIndex],
    title: title || tasks[taskIndex].title, // Keep old title if new one isn't provided
    description: description || tasks[taskIndex].description, // Keep old description
    completed: completed !== undefined ? completed : tasks[taskIndex].completed, // Update completed status if provided
  };

  tasks[taskIndex] = updatedTask; // Replace the old task with the updated one
  res.status(200).json(updatedTask); // Return the updated task
});

// 4. DELETE - Delete a task
app.delete("/api/tasks/:id", (req, res) => {
  const { id } = req.params;

  // Find the task index with the given id
  const taskIndex = tasks.findIndex((task) => task.id === parseInt(id));

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  // Delete the task
  tasks.splice(taskIndex, 1); // Remove the task from the array
  res.status(200).json({ message: "Task deleted successfully" }); // Return a success message
});

// Start the server on port 5001 (or change if needed)
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
