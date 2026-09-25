import { useState, useEffect, useCallback, useMemo } from "react";

// Geographic coordinates and real cricket boundary metrics (in meters) for all stadium presets
export const STADIUM_COORDINATES = {
  "amd-modi": {
    id: "amd-modi",
    name: "Narendra Modi Stadium",
    city: "Ahmedabad",
    state: "Gujarat",
    lat: 23.0917,
    lng: 72.5975,
    boundaryDimensions: [
      { angle: 0, label: "Straight North", meters: 80, posLabel: "80m" },
      { angle: 45, label: "Deep Extra Cover", meters: 70, posLabel: "70m" },
      { angle: 90, label: "Deep Point (East)", meters: 66, posLabel: "66m" },
      { angle: 135, label: "Fine Leg", meters: 64, posLabel: "64m" },
      { angle: 180, label: "Straight South", meters: 80, posLabel: "80m" },
      { angle: 225, label: "Deep Backward Square", meters: 65, posLabel: "65m" },
      { angle: 270, label: "Deep Midwicket (West)", meters: 72, posLabel: "72m" },
      { angle: 315, label: "Long Off", meters: 76, posLabel: "76m" }
    ]
  },
  "hyd-uppal": {
    id: "hyd-uppal",
    name: "Rajiv Gandhi International Cricket Stadium",
    city: "Hyderabad",
    state: "Telangana",
    lat: 17.4065,
    lng: 78.5505,
    boundaryDimensions: [
      { angle: 0, label: "North Boundary", meters: 74, posLabel: "74m" },
      { angle: 45, label: "Deep Cover", meters: 68, posLabel: "68m" },
      { angle: 90, label: "East Boundary", meters: 65, posLabel: "65m" },
      { angle: 135, label: "Deep Fine Leg", meters: 62, posLabel: "62m" },
      { angle: 180, label: "South Pavilion End", meters: 75, posLabel: "75m" },
      { angle: 225, label: "Deep Square Leg", meters: 64, posLabel: "64m" },
      { angle: 270, label: "West Boundary", meters: 66, posLabel: "66m" },
      { angle: 315, label: "Long On", meters: 72, posLabel: "72m" }
    ]
  },
  "mum-wankhede": {
    id: "mum-wankhede",
    name: "Wankhede Stadium",
    city: "Mumbai",
    state: "Maharashtra",
    lat: 18.9389,
    lng: 72.8258,
    boundaryDimensions: [
      { angle: 0, label: "Tata End (North)", meters: 70, posLabel: "70m" },
      { angle: 45, label: "Deep Cover", meters: 65, posLabel: "65m" },
      { angle: 90, label: "East Boundary", meters: 64, posLabel: "64m" },
      { angle: 135, label: "Deep Fine Leg", meters: 62, posLabel: "62m" },
      { angle: 180, label: "Garware End (South)", meters: 71, posLabel: "71m" },
      { angle: 225, label: "Deep Square Leg", meters: 63, posLabel: "63m" },
      { angle: 270, label: "West Boundary", meters: 65, posLabel: "65m" },
      { angle: 315, label: "Long Off", meters: 69, posLabel: "69m" }
    ]
  },
  "blr-chinnaswamy": {
    id: "blr-chinnaswamy",
    name: "M. Chinnaswamy Stadium",
    city: "Bengaluru",
    state: "Karnataka",
    lat: 12.9788,
    lng: 77.5996,
    boundaryDimensions: [
      { angle: 0, label: "Pavilion End", meters: 68, posLabel: "68m" },
      { angle: 45, label: "Deep Cover", meters: 63, posLabel: "63m" },
      { angle: 90, label: "East Boundary", meters: 60, posLabel: "60m" },
      { angle: 135, label: "Deep Fine Leg", meters: 61, posLabel: "61m" },
      { angle: 180, label: "B Stand End", meters: 70, posLabel: "70m" },
      { angle: 225, label: "Deep Square Leg", meters: 62, posLabel: "62m" },
      { angle: 270, label: "West Boundary", meters: 62, posLabel: "62m" },
      { angle: 315, label: "Long On", meters: 67, posLabel: "67m" }
    ]
  },
  "che-chepauk": {
    id: "che-chepauk",
    name: "MA Chidambaram Stadium (Chepauk)",
    city: "Chennai",
    state: "Tamil Nadu",
    lat: 13.0628,
    lng: 80.2793,
    boundaryDimensions: [
      { angle: 0, label: "Anna Pavilion End", meters: 72, posLabel: "72m" },
      { angle: 45, label: "Deep Extra Cover", meters: 67, posLabel: "67m" },
      { angle: 90, label: "Marina Beach End", meters: 68, posLabel: "68m" },
      { angle: 135, label: "Deep Third Man", meters: 63, posLabel: "63m" },
      { angle: 180, label: "Pattabiraman Gate", meters: 73, posLabel: "73m" },
      { angle: 225, label: "Deep Square Leg", meters: 65, posLabel: "65m" },
      { angle: 270, label: "West Boundary", meters: 66, posLabel: "66m" },
      { angle: 315, label: "Long On", meters: 71, posLabel: "71m" }
    ]
  },
  "vizag-vdca": {
    id: "vizag-vdca",
    name: "ACA-VDCA International Cricket Stadium",
    city: "Visakhapatnam",
    state: "Andhra Pradesh",
    lat: 17.7974,
    lng: 83.3533,
    boundaryDimensions: [
      { angle: 0, label: "Hill End (North)", meters: 71, posLabel: "71m" },
      { angle: 45, label: "Deep Cover", meters: 66, posLabel: "66m" },
      { angle: 90, label: "East Boundary", meters: 65, posLabel: "65m" },
      { angle: 135, label: "Deep Fine Leg", meters: 63, posLabel: "63m" },
      { angle: 180, label: "City End (South)", meters: 72, posLabel: "72m" },
      { angle: 225, label: "Deep Square Leg", meters: 64, posLabel: "64m" },
      { angle: 270, label: "West Boundary", meters: 65, posLabel: "65m" },
      { angle: 315, label: "Long On", meters: 70, posLabel: "70m" }
    ]
  },
  "mangalagiri-aca": {
    id: "mangalagiri-aca",
    name: "ACA International Cricket Stadium, Mangalagiri",
    city: "Mangalagiri",
    state: "Andhra Pradesh",
    lat: 16.4350,
    lng: 80.5650,
    boundaryDimensions: [
      { angle: 0, label: "Amaravati End", meters: 75, posLabel: "75m" },
      { angle: 45, label: "Deep Extra Cover", meters: 68, posLabel: "68m" },
      { angle: 90, label: "Krishna River End", meters: 67, posLabel: "67m" },
      { angle: 135, label: "Deep Fine Leg", meters: 64, posLabel: "64m" },
      { angle: 180, label: "Guntur Highway End", meters: 76, posLabel: "76m" },
      { angle: 225, label: "Deep Square Leg", meters: 66, posLabel: "66m" },
      { angle: 270, label: "Hill End", meters: 68, posLabel: "68m" },
      { angle: 315, label: "Long On", meters: 73, posLabel: "73m" }
    ]
  },
  "kol-eden": {
    id: "kol-eden",
    name: "Eden Gardens Stadium",
    city: "Kolkata",
    state: "West Bengal",
    lat: 22.5646,
    lng: 88.3433,
    boundaryDimensions: [
      { angle: 0, label: "Club House End", meters: 76, posLabel: "76m" },
      { angle: 45, label: "Deep Extra Cover", meters: 70, posLabel: "70m" },
      { angle: 90, label: "KMC End (East)", meters: 66, posLabel: "66m" },
      { angle: 135, label: "Deep Fine Leg", meters: 64, posLabel: "64m" },
      { angle: 180, label: "Pavilion End (South)", meters: 77, posLabel: "77m" },
      { angle: 225, label: "Deep Square Leg", meters: 65, posLabel: "65m" },
      { angle: 270, label: "High Court End (West)", meters: 68, posLabel: "68m" },
      { angle: 315, label: "Long On", meters: 74, posLabel: "74m" }
    ]
  },
  "hpca-dharamshala": {
    id: "hpca-dharamshala",
    name: "HPCA International Cricket Stadium",
    city: "Dharamshala",
    state: "Himachal Pradesh",
    lat: 32.1976,
    lng: 76.3260,
    boundaryDimensions: [
      { angle: 0, label: "Dhauladhar End (North)", meters: 70, posLabel: "70m" },
      { angle: 45, label: "Deep Extra Cover", meters: 65, posLabel: "65m" },
      { angle: 90, label: "Monastery End", meters: 64, posLabel: "64m" },
      { angle: 135, label: "Deep Fine Leg", meters: 62, posLabel: "62m" },
      { angle: 180, label: "South Pavilion End", meters: 70, posLabel: "70m" },
      { angle: 225, label: "Deep Square Leg", meters: 63, posLabel: "63m" },
      { angle: 270, label: "West Stand End", meters: 65, posLabel: "65m" },
      { angle: 315, label: "Long On", meters: 69, posLabel: "69m" }
    ]
  },
  "del-kotla": {
    id: "del-kotla",
    name: "Arun Jaitley Stadium",
    city: "Delhi NCR",
    state: "Delhi",
    lat: 28.6379,
    lng: 77.2423,
    boundaryDimensions: [
      { angle: 0, label: "Kotla Fort End", meters: 68, posLabel: "68m" },
      { angle: 45, label: "Deep Cover", meters: 63, posLabel: "63m" },
      { angle: 90, label: "East Boundary", meters: 62, posLabel: "62m" },
      { angle: 135, label: "Deep Fine Leg", meters: 60, posLabel: "60m" },
      { angle: 180, label: "Virat Kohli Pavilion End", meters: 70, posLabel: "70m" },
      { angle: 225, label: "Deep Square Leg", meters: 61, posLabel: "61m" },
      { angle: 270, label: "West Boundary", meters: 63, posLabel: "63m" },
      { angle: 315, label: "Long On", meters: 67, posLabel: "67m" }
    ]
  },
  "lko-ekana": {
    id: "lko-ekana",
    name: "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium",
    shortName: "Ekana Cricket Stadium",
    city: "Lucknow",
    state: "Uttar Pradesh",
    lat: 26.7933,
    lng: 81.0142,
    boundaryDimensions: [
      { angle: 0, label: "North Pavilion End", meters: 75, posLabel: "75m" },
      { angle: 45, label: "Deep Extra Cover", meters: 69, posLabel: "69m" },
      { angle: 90, label: "East Stand Boundary", meters: 66, posLabel: "66m" },
      { angle: 135, label: "Deep Fine Leg", meters: 64, posLabel: "64m" },
      { angle: 180, label: "South Pavilion End", meters: 76, posLabel: "76m" },
      { angle: 225, label: "Deep Square Leg", meters: 65, posLabel: "65m" },
      { angle: 270, label: "West Stand Boundary", meters: 67, posLabel: "67m" },
      { angle: 315, label: "Long On", meters: 73, posLabel: "73m" }
    ]
  }
};

/**
 * Haversine formula to compute great-circle distance between two GPS coordinates in kilometers
 */
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Format distance nicely
 */
export function formatDistance(distanceKm) {
  if (distanceKm == null || isNaN(distanceKm)) return null;
  if (distanceKm < 1) {
    return `${Math.max(10, Math.round(distanceKm * 1000))} m away`;
  }
  if (distanceKm < 10) {
    return `${distanceKm.toFixed(1)} km away`;
  }
  return `${Math.round(distanceKm).toLocaleString()} km away`;
}

/**
 * Helper to match stadium coordinates from object / string
 */
export function getStadiumCoords(stadium) {
  if (!stadium) return STADIUM_COORDINATES["amd-modi"];
  const id = stadium.id || stadium.stadiumId;
  if (id && STADIUM_COORDINATES[id]) {
    return STADIUM_COORDINATES[id];
  }
  const nameOrCity = `${stadium.name || ''} ${stadium.city || ''}`.toLowerCase();
  for (const key of Object.keys(STADIUM_COORDINATES)) {
    const s = STADIUM_COORDINATES[key];
    if (nameOrCity.includes(s.city.toLowerCase()) || nameOrCity.includes(s.name.toLowerCase())) {
      return s;
    }
  }
  return STADIUM_COORDINATES["amd-modi"];
}

/**
 * React Hook for real-time live location and stadium distance
 */
export function useStadiumRealtimeLocation(stadium) {
  const stadiumData = useMemo(() => getStadiumCoords(stadium), [stadium]);
  const [userCoords, setUserCoords] = useState(null);
  const [status, setStatus] = useState("loading"); // 'loading' | 'active' | 'denied' | 'unavailable'
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const updatePosition = useCallback((position) => {
    if (!position || !position.coords) return;
    const { latitude, longitude, accuracy } = position.coords;
    setUserCoords({
      lat: latitude,
      lng: longitude,
      accuracy: accuracy ? Math.round(accuracy) : null
    });
    setStatus("active");
    setError(null);
    setLastUpdated(new Date());
  }, []);

  const handleError = useCallback((err) => {
    console.warn("Geolocation warning:", err.message);
    if (err.code === 1) {
      // Permission denied
      setStatus("denied");
      setError("Location access permission was not granted.");
    } else {
      setStatus("unavailable");
      setError("Unable to retrieve live GPS location.");
    }
  }, []);

  const refreshLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus("unavailable");
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setStatus("loading");
    navigator.geolocation.getCurrentPosition(updatePosition, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 5000
    });
  }, [updatePosition, handleError]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus("unavailable");
      return;
    }

    // Initial fetch
    navigator.geolocation.getCurrentPosition(updatePosition, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 10000
    });

    // Real-time live watch position
    const watchId = navigator.geolocation.watchPosition(updatePosition, handleError, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 5000
    });

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [updatePosition, handleError]);

  const distanceKm = useMemo(() => {
    if (!userCoords || !stadiumData) return null;
    return calculateHaversineDistance(userCoords.lat, userCoords.lng, stadiumData.lat, stadiumData.lng);
  }, [userCoords, stadiumData]);

  const distanceFormatted = useMemo(() => {
    return formatDistance(distanceKm);
  }, [distanceKm]);

  return {
    stadiumData,
    userCoords,
    status,
    error,
    distanceKm,
    distanceFormatted,
    refreshLocation,
    lastUpdated
  };
}
