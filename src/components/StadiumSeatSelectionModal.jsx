import React from "react";
import CricketStadium from "./stadium/CricketStadium";

export default function StadiumSeatSelectionModal({ event, onClose }) {
  if (!event) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl overflow-y-auto animate-fadeIn">
      <CricketStadium match={event} onCloseModal={onClose} />
    </div>
  );
}
