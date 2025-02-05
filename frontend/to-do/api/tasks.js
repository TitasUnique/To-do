// import mongoose from "mongoose";
// import dotenv from "dotenv";

// dotenv.config(); // Load environment variables

// const MONGO_URI = process.env.MONGO_URI; // Store your database URL in Vercel's environment variables

// // Connect to MongoDB
// mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.error("MongoDB connection error:", err));

// // Define Task Schema
// const taskSchema = new mongoose.Schema({
//   text: String,
//   completed: Boolean,
// });

// const Task = mongoose.model("Task", taskSchema);

// // API Handler
// export default async function handler(req, res) {
//   if (req.method === "GET") {
//     const tasks = await Task.find(); // Fetch from MongoDB
//     res.status(200).json({ tasks });
//   } 
  
//   else if (req.method === "POST") {
//     const { text } = req.body;
//     if (!text) {
//       return res.status(400).json({ error: "Task text is required" });
//     }

//     const newTask = new Task({ text, completed: false });
//     await newTask.save();
//     res.status(201).json(newTask);
//   } 
  
//   else if (req.method === "PUT") {
//     const { id, text, completed } = req.body;
//     const updatedTask = await Task.findByIdAndUpdate(id, { text, completed }, { new: true });
//     if (!updatedTask) return res.status(404).json({ error: "Task not found" });
//     res.status(200).json(updatedTask);
//   } 
  
//   else if (req.method === "DELETE") {
//     const { id } = req.query;
//     await Task.findByIdAndDelete(id);
//     res.status(200).json({ message: "Task deleted" });
//   } 
  
//   else {
//     res.status(405).json({ error: "Method Not Allowed" });
//   }
// }


import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("Failed to connect to database");
  }
}

const taskSchema = new mongoose.Schema({
  text: String,
  completed: Boolean,
});

const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  await connectDB();

  try {
    if (req.method === "GET") {
      const tasks = await Task.find();
      return res.status(200).json({ tasks });
    }

    if (req.method === "POST") {
      const { text } = req.body;
      if (!text) return res.status(400).json({ error: "Task text is required." });

      const newTask = new Task({ text, completed: false });
      await newTask.save();
      return res.status(201).json(newTask);
    }

    if (req.method === "PUT") {
      const { id, text, completed } = req.body;
      const updatedTask = await Task.findByIdAndUpdate(id, { text, completed }, { new: true });
      if (!updatedTask) return res.status(404).json({ error: "Task not found." });
      return res.status(200).json(updatedTask);
    }

    if (req.method === "DELETE") {
      const { id } = req.query;
      const deletedTask = await Task.findByIdAndDelete(id);
      if (!deletedTask) return res.status(404).json({ error: "Task not found." });
      return res.status(200).json({ message: "Task deleted." });
    }

    res.status(405).json({ error: "Method Not Allowed" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
