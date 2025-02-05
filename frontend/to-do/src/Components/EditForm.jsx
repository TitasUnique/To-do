import React, { useState } from "react";
import { useDispatch } from "react-redux";
import "./AddTaskForm.css";

const EditForm = ({PreText, CardID, onClose}) => {
    const dispatch = useDispatch();

    const [newEditedText, setnewEditedText] = useState(PreText);

    const handleTextEdit= (event)=> {
      setnewEditedText(event.target.value);
    }

    const handleSubmit = (event) => {
      event.preventDefault();
  
      if (!newEditedText.trim()) {
        window.alert("Please Fill All The Details !!");
      } else {
        fetch(`http://localhost:3001/tasks/${CardID}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: newEditedText }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Error editing task");
            }
            return response.json();
          })
          .then((updatedTextData) => {
            dispatch({
              type: "updatedTextData",
              payload: updatedTextData,
            });
            setnewEditedText("");
            onClose();
          })
          .catch((error) => console.error("Error editing task:", error));
    };
    };

  return (
    <>
      <div className="blur">
        <form onSubmit={handleSubmit} className="add-task-form" aria-label="Add new task" >
          <input className="form-input-section" type="text" aria-label="Task details" placeholder="Enter new Text" value={newEditedText} onChange={handleTextEdit} />
          <button className="Form-save-btn" type="submit" aria-label="Save task" >Save</button>
        </form>
      </div>
    </>
  )
}

export default EditForm
