import React from "react";
import ApartmentCard from "./ApartmentCard";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import apartImg1 from "../assets/apartment2.png";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import apartImg from "../assets/apartment.png";

function FutureApartments() {
  return (
    <div className="apartment-cards">
      <h3>Future apartments coming soon</h3>
      <div className="container">
        <ApartmentCard
          title="SOON"
          description="A cozy apartment in the heart of Wrocław."
          image={apartImg1}
        >
        </ApartmentCard>
        <ApartmentCard
          title="SOON"
          description="A modern and cozy apartment in the heart of the city."
          image={apartImg}
        />
          <Link
          to="/product/Model3"
          state={{ modelName: "model3" }}
          className="more link"
          style={{ marginTop: "15px" }}
        >
          More <FontAwesomeIcon icon={faChevronRight} />
        </Link>
        <ApartmentCard
          title="SOON"
          description="A warm and cozy interior with a view of the Odra."
          image={apartImg}
        />
      </div>
    </div>
  );
}

export default FutureApartments;
