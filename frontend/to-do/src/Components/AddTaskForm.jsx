import React, { useState } from "react";
import "./AddTaskForm.css";
import { useDispatch } from "react-redux";

const AddTaskForm = ({ onClose }) => {
  const dispatch = useDispatch();

  const [NewtaskText, setNewTaskText] = useState("");

  const handleTargetValue = (event) => {
    setNewTaskText(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!NewtaskText.trim()) {
      window.alert("Please Fill All The Details !!");
    } else {
      const newTask = { text: NewtaskText, completed: false };
      fetch("http://localhost:3001/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error adding task to the database!");
          }
          return response.json();
        })
        .then((savedTask) => {
          dispatch({
            type: "newTaskAdd",
            payload: savedTask,
          });
          setNewTaskText("");
          alert("Task added successfully!");
        })
        .catch((error) => alert("Error adding task:", error));
    }
  };

  return (
    <>
      <div className="blur">
        <form
          onSubmit={handleSubmit}
          className="add-task-form"
          aria-label="Add new task"
        >
          <input
            className="form-input-section"
            type="text"
            aria-label="Task details"
            placeholder="Type new Task Details"
            value={NewtaskText}
            onChange={handleTargetValue}
          />
          <button
            className="Form-save-btn"
            type="submit"
            aria-label="Save task"
          >
            Save
          </button>
        </form>
      </div>
      <button className="close-form-btn" onClick={() => onClose()}>
        <i className="fa-solid fa-xmark"></i>
      </button>
    </>
  );
};

export default AddTaskForm;
