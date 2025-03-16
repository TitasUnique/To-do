import React from "react";
import "./LoadingScreen.css";
import LoadingText from "../Components/LoadingText";

const LoadingScreen = () => {
  return (
    <div className="Loader-div">
      <LoadingText/>
      <section className="dots-container">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </section>
    </div>
  );
};

export default LoadingScreen;
