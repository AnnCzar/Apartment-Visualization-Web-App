import React from "react";
import apartImg from "../assets/apartment.png";

function ApartmentHero() {
  return (
    <div className="apartment-hero">
      <h2>Choose your future place</h2>
      <div className="container">
        <div className="item">
          <img className="image" src={apartImg}></img>
          <h3>A modern apartment - see its potential.</h3>
          <button>More</button>
        </div>
      </div>
    </div>
  );
}

export default ApartmentHero;
