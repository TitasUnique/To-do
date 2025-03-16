import React, { useState } from "react";
import Tasks from "../src/Components/Tasks";
import Form from "../src/Components/AddTaskForm";
import EditTask from "../src/Components/EditForm";
import "./App.css";

// import LoadingBalls from "../src/Components/LoadingScreen";

const App = () => {

  const [showAddFormPopup, setShowAddFormPopup] = useState(false);
  const [showEditFormPopup, setShowEditFormFormPopup] = useState(false);

  const [PreText, setPreText] = useState("");
  const [CardID, setCardID] = useState();

  const handelAddFormClose = ()=> {
    setShowAddFormPopup(false);
  }

  const handelAddFormOpen = ()=> {
    setShowAddFormPopup(true);
  }

  const handelEditFormClose = ()=> {
    setShowEditFormFormPopup(false);
  }

  const handelEditFormOpen = (id, text)=> {
    setShowEditFormFormPopup(true);
    setPreText(text);
    setCardID(id);
  }

  return (
    <>
    {/* <LoadingBalls/> */}
      {showAddFormPopup && <Form onClose={handelAddFormClose}/>}
      {showEditFormPopup && <EditTask onClose={handelEditFormClose} PreText={PreText} CardID={CardID}/>}
      <Tasks onAddCardOpen={handelAddFormOpen} onEditCardOpen={handelEditFormOpen}/>
    </>
  );
};

export default App;
