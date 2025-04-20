import React, { useState } from "react";
import apartImg from "../assets/apartment-hero.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import DetailRow from "./DetailRow";

function ApartmentDetails() {
  const [showMore, setShowMore] = useState(false);
  return (
    <div className="apartment-details">
      <div className="details-item">
        <img className="image" src={apartImg}></img>
        <div className="details">
          <h4>APARTMENT DETAILS</h4>
          <div className="details-box">
            <DetailRow label="AREA" value="102,8 m²" />
            <DetailRow label="FLOOR" value="1" />
            <DetailRow label="ROOMS" value="3" />

            <button
              className="toggle-button"
              onClick={() => setShowMore(!showMore)}
            >
              <p>MORE DETAILS </p>
              {showMore ? (
                <FontAwesomeIcon icon={faChevronUp} />
              ) : (
                <FontAwesomeIcon icon={faChevronDown} />
              )}
            </button>

            {showMore && (
              <div className="more-details">
                <DetailRow label="Corridor" value="15,2 m²" />
                <DetailRow label="Kitchen + Livingroom" value="33,5 m²" />
                <DetailRow label="Walk-in closet" value="3,1 m²" />
                <DetailRow label="Toilet" value="2 m²" />
                <DetailRow label="Bathroom" value="6 m²" />
                <DetailRow label="Room 1" value="10,5 m²" />
                <DetailRow label="Room 2" value="12,4 m²" />
                <DetailRow label="Room 3" value="13,5 m²" />
                <DetailRow label="Office" value="6,6 m²" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApartmentDetails;
