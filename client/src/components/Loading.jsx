import React from "react";

function Loading() {
  return (
    <div className="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      {console.log("Loading")}
    </div>
  );
}

export default Loading;
