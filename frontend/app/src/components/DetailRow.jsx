import React from "react";

function DetailRow(props) {
  return (
    <div className="detail-row">
      <p>{props.label}</p>
      <p>{props.value}</p>
    </div>
  );
}

export default DetailRow;
