// export default async function handler(req, res) {
//     // Simulated database (replace with real DB in production)
//     let tasks = [
//       { id: 1, text: "example02", completed: false },
//       { id: 2, text: "humm", completed: false },
//     ];
//     let lastId = 3;
  
//     if (req.method === "GET") {
//       res.status(200).json({ tasks });
//     } 
    
//     else if (req.method === "POST") {
//       const newTask = req.body;
//       if (!newTask.text || typeof newTask.text !== "string") {
//         return res.status(400).json({ error: "Task text is required" });
//       }
//       newTask.id = lastId++;
//       tasks.push(newTask);
//       res.status(201).json(newTask);
//     } 
    
//     else if (req.method === "PUT") {
//       const { id, text, completed } = req.body;
//       const taskIndex = tasks.findIndex((task) => task.id === id);
//       if (taskIndex !== -1) {
//         if (text !== undefined) tasks[taskIndex].text = text;
//         if (completed !== undefined) tasks[taskIndex].completed = completed;
//         res.status(200).json(tasks[taskIndex]);
//       } else {
//         res.status(404).json({ error: "Task not found" });
//       }
//     } 
    
//     else if (req.method === "DELETE") {
//       const { id } = req.query;
//       tasks = tasks.filter((task) => task.id !== parseInt(id));
//       res.status(200).json({ message: "Task deleted successfully" });
//     } 
    
//     else {
//       res.status(405).json({ error: "Method Not Allowed" });
//     }
//   }
  



import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const MONGO_URI = process.env.MONGO_URI; // Store your database URL in Vercel's environment variables

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define Task Schema
const taskSchema = new mongoose.Schema({
  text: String,
  completed: Boolean,
});

const Task = mongoose.model("Task", taskSchema);

// API Handler
export default async function handler(req, res) {
  if (req.method === "GET") {
    const tasks = await Task.find(); // Fetch from MongoDB
    res.status(200).json({ tasks });
  } 
  
  else if (req.method === "POST") {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Task text is required" });
    }

    const newTask = new Task({ text, completed: false });
    await newTask.save();
    res.status(201).json(newTask);
  } 
  
  else if (req.method === "PUT") {
    const { id, text, completed } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(id, { text, completed }, { new: true });
    if (!updatedTask) return res.status(404).json({ error: "Task not found" });
    res.status(200).json(updatedTask);
  } 
  
  else if (req.method === "DELETE") {
    const { id } = req.query;
    await Task.findByIdAndDelete(id);
    res.status(200).json({ message: "Task deleted" });
  } 
  
  else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
