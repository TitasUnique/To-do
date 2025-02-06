const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = ["https://my-tasks-seven-rho.vercel.app","http://localhost:3000","http://192.168.29.145:3000"];

app.use(cors(
  {
    origin: function (origin, callback) {
      if(!origin || allowedOrigins.includes(origin)){
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods:["GET","POST","DELETE","PUT"],
    credentials: true
  }
));

// Middleware
app.use(bodyParser.json());
/* app.use(cors()); */

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI
// mongoose.connect(MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
mongoose.connect(MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// Define Task Schema
const taskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const Task = mongoose.model("Task", taskSchema);

//Basic API checking
app.get("/",async (req, res) => {
  res.json("Hello, API is working !!");
});

// Endpoint to fetch all tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve tasks." });
  }
});

// Endpoint to add a new task
app.post("/tasks", async (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Task text is required and should be a string." });
  }

  try {
    const newTask = new Task({ text });
    await newTask.save();
    const tasks = await Task.find();
    res.status(201).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to save task." });
  }
});

// Endpoint to delete a task
app.delete("/tasks/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task." });
  }
});

// Endpoint to update a task
app.put("/tasks/:id", async (req, res) => {
  const { text, completed } = req.body;
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { text, completed },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found." });
    }
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve tasks." });
  }
});

// Catch-all route for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
