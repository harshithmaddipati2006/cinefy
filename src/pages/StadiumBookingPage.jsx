import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import CricketStadium from "../components/stadium/CricketStadium";
import { EVENTS } from "../data/seedData";

export default function StadiumBookingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const matchId = searchParams.get("matchId") || "evt-cric-01";

  // Find match in seed events or create fallback match
  const selectedMatch = EVENTS.find((e) => e.id === matchId) || {
    id: "evt-cric-01",
    title: "IPL 2026: SRH vs CSK Super Clash",
    teamA: "SRH",
    teamAFlag: "🦅",
    teamB: "CSK",
    teamBFlag: "🦁",
    category: "Sports",
    sportType: "Cricket",
    city: "Visakhapatnam",
    venue: "ACA-VDCA International Cricket Stadium",
    distanceFromUser: "350 km from Tenali, AP",
    date: "2026-08-18",
    time: "07:30 PM",
    price: 1200
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <CricketStadium match={selectedMatch} onCloseModal={() => navigate("/events")} />
    </div>
  );
}
