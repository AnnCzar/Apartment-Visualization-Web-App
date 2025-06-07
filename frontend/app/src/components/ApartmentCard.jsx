import React from "react";

function ApartmentCard(props) {
  return (
    <div className="card">
      <img className="image" src={props.image} alt="Apartment" />
      <h4>{props.title}</h4>
      <p>{props.description}</p>
    </div>
  );
}

export default ApartmentCard;
