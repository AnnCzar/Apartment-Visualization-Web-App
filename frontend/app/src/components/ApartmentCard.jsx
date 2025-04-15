import React from "react";
import apartImg from "../assets/apartment.png";

function ApartmentCard(props) {
  return (
    <div className="card">
      <img className="image" src={apartImg}></img>
      <h4>{props.title}</h4>
      <p>{props.description}</p>
    </div>
  );
}

export default ApartmentCard;
