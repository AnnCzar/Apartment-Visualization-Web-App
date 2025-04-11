import React from "react";
import ApartmentCard from "./ApartmentCard";

function FutureApartments() {
  return (
    <div className="apartment-cards">
      <h2>Future apartments coming soon</h2>
      <div className="container">
        <ApartmentCard
          title="SOON"
          description="A cozy apartment in the heart of Wrocław."
        />
        <ApartmentCard
          title="SOON"
          description="A modern and cozy apartment in the heart of the city."
        />
        <ApartmentCard
          title="SOON"
          description="A warm and cozy interior with a view of the Odra."
        />
      </div>
    </div>
  );
}

export default FutureApartments;
