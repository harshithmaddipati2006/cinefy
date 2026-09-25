import React from "react";
import ConcentricStadiumMap from "./ConcentricStadiumMap";

export default function StadiumOverview({
  stadium,
  match,
  selectedStand,
  onSelectStand,
  onSelectBlock,
  selectedSeats = [],
  onToggleSeat
}) {
  return (
    <div className="w-full">
      <ConcentricStadiumMap
        stadium={stadium}
        match={match}
        selectedBlock={selectedStand}
        onSelectBlock={onSelectBlock}
        onSelectStand={onSelectStand}
        selectedSeats={selectedSeats}
        onToggleSeat={onToggleSeat}
      />
    </div>
  );
}
