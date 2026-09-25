import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { CITIES } from "../data/seedData";

const CityContext = createContext();

// Comprehensive Pin-to-Pin Indian Cinema Hubs with Lat/Lon coordinates
export const CITY_COORDINATES = {
  // Andhra Pradesh
  "Tenali": { lat: 16.2437, lon: 80.6400 },
  "Guntur": { lat: 16.3067, lon: 80.4365 },
  "Vijayawada": { lat: 16.5062, lon: 80.6480 },
  "Visakhapatnam": { lat: 17.6868, lon: 83.2185 },
  "Tirupati": { lat: 13.6288, lon: 79.4192 },
  "Rajahmundry": { lat: 17.0005, lon: 81.8040 },
  "Kakinada": { lat: 16.9891, lon: 82.2475 },
  "Nellore": { lat: 14.4426, lon: 79.9865 },
  "Kurnool": { lat: 15.8281, lon: 78.0373 },
  "Kadapa": { lat: 14.4673, lon: 78.8242 },
  "Anantapur": { lat: 14.6819, lon: 77.6006 },
  "Eluru": { lat: 16.7107, lon: 81.0952 },
  "Ongole": { lat: 15.5057, lon: 80.0499 },
  "Vizianagaram": { lat: 18.1067, lon: 83.3956 },
  "Srikakulam": { lat: 18.2949, lon: 83.8938 },
  "Machilipatnam": { lat: 16.1875, lon: 81.1389 },
  "Bhimavaram": { lat: 16.5449, lon: 81.5212 },
  "Proddatur": { lat: 14.7527, lon: 78.5524 },
  "Nandyal": { lat: 15.4886, lon: 78.4836 },
  "Chittoor": { lat: 13.2172, lon: 79.1003 },

  // Telangana
  "Hyderabad": { lat: 17.3850, lon: 78.4867 },
  "Warangal": { lat: 17.9689, lon: 79.5941 },
  "Nizamabad": { lat: 18.6725, lon: 78.0941 },
  "Karimnagar": { lat: 18.4386, lon: 79.1288 },
  "Khammam": { lat: 17.2473, lon: 80.1514 },
  "Ramagundam": { lat: 18.8021, lon: 79.4678 },
  "Mahbubnagar": { lat: 16.7488, lon: 77.9863 },
  "Nalgonda": { lat: 17.0575, lon: 79.2684 },
  "Adilabad": { lat: 19.6641, lon: 78.5320 },
  "Suryapet": { lat: 17.1439, lon: 79.6239 },
  "Siddipet": { lat: 18.1018, lon: 78.8520 },
  "Mancherial": { lat: 18.8679, lon: 79.4639 },

  // Karnataka
  "Bengaluru": { lat: 12.9716, lon: 77.5946 },
  "Mysuru": { lat: 12.2958, lon: 76.6394 },
  "Mangaluru": { lat: 12.9141, lon: 74.8560 },
  "Hubballi-Dharwad": { lat: 15.3647, lon: 75.1240 },
  "Belagavi": { lat: 15.8497, lon: 74.4977 },
  "Davanagere": { lat: 14.4644, lon: 75.9218 },
  "Ballari": { lat: 15.1394, lon: 76.9214 },
  "Kalaburagi": { lat: 17.3297, lon: 76.8343 },
  "Shivamogga": { lat: 13.9299, lon: 75.5681 },
  "Tumakuru": { lat: 13.3379, lon: 77.1173 },
  "Udupi": { lat: 13.3409, lon: 74.7421 },

  // Tamil Nadu
  "Chennai": { lat: 13.0827, lon: 80.2707 },
  "Coimbatore": { lat: 11.0168, lon: 76.9558 },
  "Madurai": { lat: 9.9252, lon: 78.1198 },
  "Tiruchirappalli": { lat: 10.7905, lon: 78.7047 },
  "Salem": { lat: 11.6643, lon: 78.1460 },
  "Tirunelveli": { lat: 8.7139, lon: 77.7567 },
  "Tiruppur": { lat: 11.1085, lon: 77.3411 },
  "Vellore": { lat: 12.9165, lon: 79.1325 },
  "Erode": { lat: 11.3410, lon: 77.7172 },
  "Thoothukudi": { lat: 8.7642, lon: 78.1348 },
  "Thanjavur": { lat: 10.7870, lon: 79.1378 },
  "Dindigul": { lat: 10.3673, lon: 77.9803 },

  // Kerala
  "Kochi": { lat: 9.9312, lon: 76.2673 },
  "Thiruvananthapuram": { lat: 8.5241, lon: 76.9366 },
  "Kozhikode": { lat: 11.2588, lon: 75.7804 },
  "Thrissur": { lat: 10.5276, lon: 76.2144 },
  "Kollam": { lat: 8.8932, lon: 76.6141 },
  "Alappuzha": { lat: 9.4981, lon: 76.3388 },
  "Kannur": { lat: 11.8745, lon: 75.3704 },
  "Palakkad": { lat: 10.7867, lon: 76.6548 },
  "Kottayam": { lat: 9.5916, lon: 76.5222 },
  "Malappuram": { lat: 11.0510, lon: 76.0711 },

  // Maharashtra & Goa
  "Mumbai": { lat: 19.0760, lon: 72.8777 },
  "Pune": { lat: 18.5204, lon: 73.8567 },
  "Nagpur": { lat: 21.1458, lon: 79.0882 },
  "Nashik": { lat: 19.9975, lon: 73.7898 },
  "Aurangabad": { lat: 19.8762, lon: 75.3433 },
  "Thane": { lat: 19.2183, lon: 72.9781 },
  "Navi Mumbai": { lat: 19.0330, lon: 73.0297 },
  "Solapur": { lat: 17.6599, lon: 75.9064 },
  "Kolhapur": { lat: 16.7050, lon: 74.2433 },
  "Amravati": { lat: 20.9320, lon: 77.7523 },
  "Nanded": { lat: 19.1383, lon: 77.3210 },
  "Sangli": { lat: 16.8524, lon: 74.5815 },
  "Panaji (Goa)": { lat: 15.4909, lon: 73.8278 },

  // Gujarat
  "Ahmedabad": { lat: 23.0225, lon: 72.5714 },
  "Surat": { lat: 21.1702, lon: 72.8311 },
  "Vadodara": { lat: 22.3072, lon: 73.1812 },
  "Rajkot": { lat: 22.3039, lon: 70.8022 },
  "Bhavnagar": { lat: 21.7645, lon: 72.1519 },
  "Jamnagar": { lat: 22.4707, lon: 70.0577 },
  "Gandhinagar": { lat: 23.2156, lon: 72.6369 },
  "Junagadh": { lat: 21.5222, lon: 70.4579 },
  "Anand": { lat: 22.5645, lon: 72.9289 },
  "Navsari": { lat: 20.9467, lon: 72.9520 },

  // North India
  "Delhi NCR": { lat: 28.6139, lon: 77.2090 },
  "Noida": { lat: 28.5355, lon: 77.3910 },
  "Gurugram": { lat: 28.4595, lon: 77.0266 },
  "Faridabad": { lat: 28.4089, lon: 77.3178 },
  "Ghaziabad": { lat: 28.6692, lon: 77.4538 },
  "Lucknow": { lat: 26.8467, lon: 80.9462 },
  "Kanpur": { lat: 26.4499, lon: 80.3319 },
  "Varanasi": { lat: 25.3176, lon: 82.9739 },
  "Agra": { lat: 27.1767, lon: 78.0081 },
  "Prayagraj": { lat: 25.4358, lon: 81.8463 },
  "Jaipur": { lat: 26.9124, lon: 75.7873 },
  "Jodhpur": { lat: 26.2389, lon: 73.0243 },
  "Udaipur": { lat: 24.5854, lon: 73.7125 },
  "Kota": { lat: 25.2138, lon: 75.8648 },
  "Chandigarh": { lat: 30.7333, lon: 76.7794 },
  "Ludhiana": { lat: 30.9010, lon: 75.8573 },
  "Amritsar": { lat: 31.6340, lon: 74.8723 },
  "Dehradun": { lat: 30.3165, lon: 78.0322 },
  "Bhopal": { lat: 23.2599, lon: 77.4126 },
  "Indore": { lat: 22.7196, lon: 75.8577 },
  "Raipur": { lat: 21.2514, lon: 81.6296 },

  // East & North-East
  "Kolkata": { lat: 22.5726, lon: 88.3639 },
  "Siliguri": { lat: 26.7271, lon: 88.3953 },
  "Asansol": { lat: 23.6739, lon: 86.9524 },
  "Durgapur": { lat: 23.5204, lon: 87.3119 },
  "Bhubaneswar": { lat: 20.2961, lon: 85.8245 },
  "Cuttack": { lat: 20.4625, lon: 85.8828 },
  "Rourkela": { lat: 22.2604, lon: 84.8536 },
  "Patna": { lat: 25.5941, lon: 85.1376 },
  "Gaya": { lat: 24.7914, lon: 85.0002 },
  "Ranchi": { lat: 23.3441, lon: 85.3096 },
  "Jamshedpur": { lat: 22.8046, lon: 86.2029 },
  "Guwahati": { lat: 26.1445, lon: 91.7362 },
  "Agartala": { lat: 23.8315, lon: 91.2868 },
  "Shillong": { lat: 25.5788, lon: 91.8933 }
};

// Haversine Distance in Kilometers
function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Find closest supported city from coordinates
function findClosestCity(lat, lon) {
  let closestCity = "Tenali";
  let minDistance = Infinity;

  Object.entries(CITY_COORDINATES).forEach(([cityName, coords]) => {
    const dist = getDistanceKm(lat, lon, coords.lat, coords.lon);
    if (dist < minDistance) {
      minDistance = dist;
      closestCity = cityName;
    }
  });

  return { city: closestCity, distance: Math.round(minDistance) };
}

// Normalize city names from reverse geocode APIs
function normalizeCityName(rawName) {
  if (!rawName) return null;
  const n = rawName.toLowerCase();
  
  for (const city of CITIES) {
    if (n.includes(city.toLowerCase())) {
      return city;
    }
  }

  // Aliases & Sub-regions
  if (n.includes("bangalore")) return "Bengaluru";
  if (n.includes("calcutta")) return "Kolkata";
  if (n.includes("madras")) return "Chennai";
  if (n.includes("bombay")) return "Mumbai";
  if (n.includes("secunderabad") || n.includes("cyberabad")) return "Hyderabad";
  if (n.includes("vizag") || n.includes("waltair")) return "Visakhapatnam";
  if (n.includes("cochin") || n.includes("ernakulam")) return "Kochi";
  if (n.includes("trivandrum")) return "Thiruvananthapuram";
  if (n.includes("calicut")) return "Kozhikode";
  if (n.includes("trichy")) return "Tiruchirappalli";
  if (n.includes("baroda")) return "Vadodara";
  if (n.includes("poona")) return "Pune";
  if (n.includes("gurgaon")) return "Gurugram";

  return null;
}

export const CityProvider = ({ children }) => {
  const [selectedCity, setSelectedCity] = useState(() => {
    return localStorage.getItem("cinefy_city") || "Tenali";
  });
  const [autoDetectEnabled, setAutoDetectEnabled] = useState(() => {
    return localStorage.getItem("cinefy_auto_detect") === "true";
  });
  const [detecting, setDetecting] = useState(false);
  const [lastCoords, setLastCoords] = useState(null);
  const watchIdRef = useRef(null);

  // Initialize and persist default city
  useEffect(() => {
    if (!localStorage.getItem("cinefy_city")) {
      setSelectedCity("Tenali");
      localStorage.setItem("cinefy_city", "Tenali");
    }
  }, []);

  // Handle location coordinate resolution silently with NO popup
  const resolveCoordinatesToCity = async (lat, lon) => {
    setLastCoords({ lat, lon });
    let resolvedCity = null;

    try {
      // Free client reverse geocoder with high precision
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
      );
      if (response.ok) {
        const data = await response.json();
        resolvedCity =
          normalizeCityName(data.city) ||
          normalizeCityName(data.locality) ||
          normalizeCityName(data.principalSubdivision) ||
          normalizeCityName(data.countrySubdivisionName);
      }
    } catch (e) {
      console.warn("Reverse geocode network fetch failed, using proximity calculation:", e);
    }

    // Fallback: calculate nearest distance to all cinema cities
    if (!resolvedCity) {
      const closest = findClosestCity(lat, lon);
      resolvedCity = closest.city;
    }

    if (resolvedCity) {
      setSelectedCity(resolvedCity);
      localStorage.setItem("cinefy_city", resolvedCity);
    }

    return resolvedCity;
  };

  // Manual or Click-based Auto Detect Trigger (Silent, no annoying popup)
  const detectLocation = () => {
    if (!("geolocation" in navigator)) {
      console.warn("Geolocation is not supported by your browser");
      return;
    }

    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        await resolveCoordinatesToCity(latitude, longitude);
        setDetecting(false);
        setAutoDetectEnabled(true);
        localStorage.setItem("cinefy_auto_detect", "true");
      },
      (error) => {
        console.warn("Geolocation permission or timeout error:", error);
        setDetecting(false);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }
    );
  };

  // Continuous Location Watching for when the user moves from one place to another (Silent)
  useEffect(() => {
    if (!autoDetectEnabled || !("geolocation" in navigator)) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      return;
    }

    // Trigger initial check
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolveCoordinatesToCity(pos.coords.latitude, pos.coords.longitude);
      },
      () => {},
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );

    // Watch for movement / location transitions
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        resolveCoordinatesToCity(latitude, longitude);
      },
      (err) => {
        console.warn("Watch position error:", err);
      },
      { enableHighAccuracy: true, maximumAge: 60000, timeout: 20000 }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [autoDetectEnabled]);

  const changeCity = (city) => {
    setSelectedCity(city);
    localStorage.setItem("cinefy_city", city);
  };

  const toggleAutoDetect = (enabled) => {
    setAutoDetectEnabled(enabled);
    localStorage.setItem("cinefy_auto_detect", enabled ? "true" : "false");
    if (enabled) {
      detectLocation();
    }
  };

  return (
    <CityContext.Provider
      value={{
        selectedCity,
        currentCity: selectedCity,
        changeCity,
        cities: CITIES,
        detectLocation,
        detecting,
        autoDetectEnabled,
        toggleAutoDetect,
        lastCoords
      }}
    >
      {children}
    </CityContext.Provider>
  );
};

export const useCity = () => useContext(CityContext);

