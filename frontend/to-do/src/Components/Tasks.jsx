import React, { useEffect, useState } from "react";
import "./Tasks.css";
import { useDispatch, useSelector } from "react-redux";

import Loading from "../Components/LoadingScreen";
import PencilLoading from "../Components/PencilLoader";
import DeleteLoader from "./DeleteLoader";

const Tasks = ({ onAddCardOpen, onEditCardOpen }) => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.cardsData);

  const [loading, setLoading] = useState(false);
  const [PLoading, setPLoading] = useState(false);
  const [DeleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("https://to-do-six-mauve.vercel.app/tasks") //http://localhost:3001/tasks
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error fetching tasks");
        }
        return response.json();
      })
      .then((data) => {
        dispatch({
          type: "reduxDataUpload",
          payload: data,
        });
      })
      .catch((error) => console.error("Error fetching tasks:", error))
      .finally(()=>{setLoading(false)});
  }, [dispatch]);

  const handelTaskStatus = (taskId) => {
    setPLoading(true);
    const taskStatusUpdate = tasks.find((task) => task._id === taskId);
    const updatedTaskStatus = {...taskStatusUpdate, completed: !taskStatusUpdate.completed,};

    fetch(`https://to-do-six-mauve.vercel.app/tasks/${taskId}`, {
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
      })
      .catch((error) => console.error("Error updating task:", error))
      .finally(()=>{
        setPLoading(false);
      });
  };

  const handelDelete = (taskId) => {
    setDeleteLoading(true);
    fetch(`https://to-do-six-mauve.vercel.app/tasks/${taskId}`, {
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
      .catch((error) => console.error("Error deleting task:", error))
      .finally(()=>{setDeleteLoading(false)});
  };

  return (
    <>
    {loading ? (<Loading />) : PLoading ? (<PencilLoading/>) : DeleteLoading ? (<DeleteLoader/>) : (((
    <div className="main-div">
      <ul className="card-main-ul">
        {tasks?.map((task) => (
          <li className="cards-li" key={task._id}>
            <div className="card-task-data">
              <span>{task.text}</span>
            </div>
            <div className="buttons-div">
              <button
                className={
                  task.completed ? "card-state-green" : "card-state-red"
                }
                onClick={() => handelTaskStatus(task._id)}
              >
                {task.completed ? "Done" : "Pending"}
              </button>
              <button
                className="edit-cardText-btn"
                onClick={() => onEditCardOpen(task._id, task.text)}
              >
                <i className="fa-solid fa-pen" style={{ color: "#000000" }}></i>
              </button>
              <button
                className="card-del-btn"
                onClick={() => handelDelete(task._id)}
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
    )))}
    </>
  );
};

export default Tasks;
