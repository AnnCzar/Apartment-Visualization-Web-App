import React from "react";
import apartImg from "../assets/apartment.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

function ApartmentHero() {
  return (
    <div className="apartment-hero">
      <h2>Choose your future place</h2>
      <div className="container">
        <div className="item">
          <img className="image" src={apartImg}></img>
          <h4>A modern apartment - see its potential.</h4>
          <button className="more" type="button">
            More
            {<FontAwesomeIcon icon={faChevronRight} />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ApartmentHero;
