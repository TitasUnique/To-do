import React, { useEffect } from "react";
import "./Tasks.css";
import { useDispatch, useSelector } from "react-redux";

const Tasks = ({ onAddCardOpen, onEditCardOpen }) => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.cardsData);

  useEffect(() => {
    fetch("https://to-do-git-main-titas-projects.vercel.app//api/tasks") //http://localhost:3001/tasks
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error fetching tasks");
        }
        return response.json();
      })
      .then((data) => {
        dispatch({
          type: "reduxDataUpload",
          payload: data.tasks,
        });
      })
      .catch((error) => console.error("Error fetching tasks:", error));
  }, [dispatch]);

  const handelTaskStatus = (taskId) => {
    const taskStatusUpdate = tasks.find((task) => task.id === taskId);
    const updatedTaskStatus = {...taskStatusUpdate, completed: !taskStatusUpdate.completed,};

    fetch(`https://to-do-git-main-titas-projects.vercel.app//api/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: updatedTaskStatus.completed }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error updating task status");
        }
        return response.json();
      })
      .then((updatedStatus) => {
        dispatch({
          type: "updateTaskStatus",
          payload: updatedStatus,
        });
        console.log(updatedStatus);
      })
      .catch((error) => console.error("Error updating task:", error));
  };

  const handelDelete = (taskId) => {
    fetch(`https://to-do-git-main-titas-projects.vercel.app//api/tasks/${taskId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error deleting task");
        }
        return response.json();
      })
      .then((updateDeleteData) => {
        dispatch({
          type: "deleteTask",
          payload: updateDeleteData,
        });
      })
      .catch((error) => console.error("Error deleting task:", error));
  };

  return (
    <div className="main-div">
      <ul className="card-main-ul">
        {tasks.map((task) => (
          <li className="cards-li" key={task.id}>
            <div className="card-task-data">
              <span>{task.text}</span>
            </div>
            <div className="buttons-div">
              <button
                className={
                  task.completed ? "card-state-green" : "card-state-red"
                }
                onClick={() => handelTaskStatus(task.id)}
              >
                {task.completed ? "Done" : "Pending"}
              </button>
              <button
                className="edit-cardText-btn"
                onClick={() => onEditCardOpen(task.id, task.text)}
              >
                <i className="fa-solid fa-pen" style={{ color: "#000000" }}></i>
              </button>
              <button
                className="card-del-btn"
                onClick={() => handelDelete(task.id)}
              >
                <i
                  className="fa-solid fa-trash-can"
                  style={{ color: "#000000" }}
                ></i>
              </button>
            </div>
          </li>
        ))}
        <button className="add-task-btn" onClick={() => onAddCardOpen()}>
          <i
            className="fa-solid fa-plus add-task-size-btn"
            style={{ color: "rgba(0, 0, 0, 0.805)" }}
          ></i>
        </button>
      </ul>
    </div>
  );
};

export default Tasks;
