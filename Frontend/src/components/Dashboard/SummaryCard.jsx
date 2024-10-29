import React from "react";

function SummaryCard({ icon, text, number }) {
  return (
    <div className="mainCard">
      <div className="dashicon">{icon}</div>

      <div className="dashCardContent">
        <p>{text}</p>
        <p>{number}</p>
      </div>
    </div>
  );
}

export default SummaryCard;
