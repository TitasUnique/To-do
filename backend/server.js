const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors"); // Importing CORS
const app = express();
const PORT = 3001;

app.use(bodyParser.json());
app.use(cors()); // Enabling CORS for the API

// Helper function to read the database
const readDatabase = (callback) => {
  fs.readFile("database.json", "utf8", (err, data) => {
    if (err) return callback(err, null);
    callback(null, JSON.parse(data));
  });
};

// Helper function to write to the database
const writeDatabase = (db, callback) => {
  fs.writeFile("database.json", JSON.stringify(db, null, 2), (err) => {
    callback(err);
  });
};

// Endpoint to read all tasks
app.get("/tasks", (req, res) => {
  readDatabase((err, db) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read database." });
    }
    res.json(db);
  });
});

// Endpoint to add a new task
app.post("/tasks", (req, res) => {
  const newTask = req.body;

  // Validate task data
  if (!newTask.text || typeof newTask.text !== "string") {
    return res.status(400).json({ error: "Task text is required and should be a string." });
  }

  readDatabase((err, db) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read database." });
    }

    // Incremental ID logic
    let lastId = db.lastId || 0; // Retrieve the last used ID
    const newId = lastId + 1;
    newTask.id = newId; // Assigning a new ID to the task
    db.lastId = newId;

    db.tasks.push(newTask);

    writeDatabase(db, (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to write database." });
      }
      res.status(201).json(db.tasks);
    });
  });
});

// Endpoint to delete a task
app.delete("/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id, 10);

  readDatabase((err, db) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read database." });
    }

    // Filter out the task to be deleted
    db.tasks = db.tasks.filter((task) => task.id !== taskId);

    writeDatabase(db, (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to write database." });
      }
      res.status(200).json(db.tasks);
    });
  });
});

// Endpoint to update a task (e.g., marking it as completed)
app.put("/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const { text, completed } = req.body;

  readDatabase((err, db) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read database." });
    }

    const taskIndex = db.tasks.findIndex((task) => task.id === taskId);

    if (taskIndex === -1) {
      return res.status(404).json({ error: "Task not found." });
    }

    // Update the task's status
    if (text !== undefined) db.tasks[taskIndex].text = text;
    if (completed !== undefined) db.tasks[taskIndex].completed = completed;

    writeDatabase(db, (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to update database." });
      }
      res.status(200).json(db.tasks);
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
