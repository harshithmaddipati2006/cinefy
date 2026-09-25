import React from "react";
import StadiumSeat from "./StadiumSeat";

export default function StadiumRow({
  rowLabel,
  rowIdx,
  seats,
  stand,
  block,
  selectedSeats,
  onSelectSeat,
  onHoverSeat,
  onLeaveSeat
}) {
  // Group seats by bay
  const bayGroups = React.useMemo(() => {
    const groups = {};
    seats.forEach((seat) => {
      const bayKey = seat.bay || "Bay 1";
      if (!groups[bayKey]) groups[bayKey] = [];
      groups[bayKey].push(seat);
    });
    return Object.entries(groups);
  }, [seats]);

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 my-1">
      {/* Row Label Left */}
      <span className="text-[10px] font-black text-cyan-400/80 w-6 text-right shrink-0 font-mono">
        {rowLabel}
      </span>

      {/* Render each Bay group with Aisle divider in between */}
      <div className="flex items-center gap-2 sm:gap-3">
        {bayGroups.map(([bayName, baySeats], groupIdx) => (
          <React.Fragment key={bayName}>
            {groupIdx > 0 && (
              <div className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[8px] font-mono font-bold text-slate-500 uppercase tracking-wider shrink-0 select-none">
                AISLE
              </div>
            )}
            <div className="flex items-center gap-1 sm:gap-1.5">
              {baySeats.map((seat) => {
                const isSel = selectedSeats.some((s) => s.id === seat.id);
                return (
                  <StadiumSeat
                    key={seat.id}
                    seat={seat}
                    stand={stand}
                    block={block}
                    isSelected={isSel}
                    onSelect={onSelectSeat}
                    onHover={onHoverSeat}
                    onLeave={onLeaveSeat}
                  />
                );
              })}
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Row Label Right */}
      <span className="text-[10px] font-black text-cyan-400/80 w-6 text-left shrink-0 font-mono">
        {rowLabel}
      </span>
    </div>
  );
}
