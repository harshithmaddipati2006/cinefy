import { loadJSON, saveJSON } from "./db.js";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
export const CUSTOM_LOCATIONS_FILE = path.join(DATA_DIR, "custom_locations.json");

// Comprehensive Indian States & Union Territories
export const INITIAL_STATES = [
  { id: "st-ap", name: "Andhra Pradesh", code: "AP" },
  { id: "st-tg", name: "Telangana", code: "TG" },
  { id: "st-ka", name: "Karnataka", code: "KA" },
  { id: "st-tn", name: "Tamil Nadu", code: "TN" },
  { id: "st-mh", name: "Maharashtra", code: "MH" },
  { id: "st-gj", name: "Gujarat", code: "GJ" },
  { id: "st-dl", name: "Delhi NCR", code: "DL" },
  { id: "st-up", name: "Uttar Pradesh", code: "UP" },
  { id: "st-kl", name: "Kerala", code: "KL" },
  { id: "st-wb", name: "West Bengal", code: "WB" },
  { id: "st-rj", name: "Rajasthan", code: "RJ" },
  { id: "st-pb", name: "Punjab", code: "PB" },
  { id: "st-mp", name: "Madhya Pradesh", code: "MP" },
  { id: "st-or", name: "Odisha", code: "OR" },
  { id: "st-br", name: "Bihar", code: "BR" },
  { id: "st-hr", name: "Haryana", code: "HR" },
  { id: "st-ga", name: "Goa", code: "GA" },
  { id: "st-as", name: "Assam", code: "AS" },
  { id: "st-jh", name: "Jharkhand", code: "JH" },
  { id: "st-ch", name: "Chandigarh", code: "CH" },
  { id: "st-ut", name: "Uttarakhand", code: "UT" },
  { id: "st-hp", name: "Himachal Pradesh", code: "HP" },
  { id: "st-jk", name: "Jammu and Kashmir", code: "JK" },
  { id: "st-py", name: "Puducherry", code: "PY" }
];

// District mappings across Indian states
export const INITIAL_DISTRICTS = [
  // Andhra Pradesh Districts
  { id: "dist-guntur", stateId: "st-ap", name: "Guntur", state: "Andhra Pradesh" },
  { id: "dist-krishna", stateId: "st-ap", name: "Krishna / NTR", state: "Andhra Pradesh" },
  { id: "dist-vizag", stateId: "st-ap", name: "Visakhapatnam", state: "Andhra Pradesh" },
  { id: "dist-bapatla", stateId: "st-ap", name: "Bapatla", state: "Andhra Pradesh" },
  { id: "dist-palnadu", stateId: "st-ap", name: "Palnadu", state: "Andhra Pradesh" },
  { id: "dist-chittoor", stateId: "st-ap", name: "Chittoor / Tirupati", state: "Andhra Pradesh" },
  { id: "dist-eg", stateId: "st-ap", name: "East Godavari / Kakinada", state: "Andhra Pradesh" },
  { id: "dist-wg", stateId: "st-ap", name: "West Godavari / Eluru", state: "Andhra Pradesh" },
  { id: "dist-nellore", stateId: "st-ap", name: "SPSR Nellore", state: "Andhra Pradesh" },
  { id: "dist-kurnool", stateId: "st-ap", name: "Kurnool / Nandyal", state: "Andhra Pradesh" },
  { id: "dist-kadapa", stateId: "st-ap", name: "YSR Kadapa", state: "Andhra Pradesh" },
  { id: "dist-anantapur", stateId: "st-ap", name: "Anantapur / Sri Sathya Sai", state: "Andhra Pradesh" },
  { id: "dist-prakasam", stateId: "st-ap", name: "Prakasam", state: "Andhra Pradesh" },
  { id: "dist-vzm", stateId: "st-ap", name: "Vizianagaram", state: "Andhra Pradesh" },
  { id: "dist-sklm", stateId: "st-ap", name: "Srikakulam", state: "Andhra Pradesh" },

  // Telangana Districts
  { id: "dist-hyd", stateId: "st-tg", name: "Hyderabad", state: "Telangana" },
  { id: "dist-ranga", stateId: "st-tg", name: "Rangareddy", state: "Telangana" },
  { id: "dist-medchal", stateId: "st-tg", name: "Medchal-Malkajgiri", state: "Telangana" },
  { id: "dist-warangal", stateId: "st-tg", name: "Warangal / Hanamkonda", state: "Telangana" },
  { id: "dist-khammam", stateId: "st-tg", name: "Khammam", state: "Telangana" },
  { id: "dist-karimnagar", stateId: "st-tg", name: "Karimnagar", state: "Telangana" },
  { id: "dist-nizamabad", stateId: "st-tg", name: "Nizamabad", state: "Telangana" },
  { id: "dist-mahbubnagar", stateId: "st-tg", name: "Mahbubnagar", state: "Telangana" },
  { id: "dist-nalgonda", stateId: "st-tg", name: "Nalgonda", state: "Telangana" },
  { id: "dist-siddipet", stateId: "st-tg", name: "Siddipet", state: "Telangana" },
  { id: "dist-sangareddy", stateId: "st-tg", name: "Sangareddy", state: "Telangana" },

  // Karnataka Districts
  { id: "dist-blr-urban", stateId: "st-ka", name: "Bengaluru Urban", state: "Karnataka" },
  { id: "dist-blr-rural", stateId: "st-ka", name: "Bengaluru Rural", state: "Karnataka" },
  { id: "dist-mysuru", stateId: "st-ka", name: "Mysuru", state: "Karnataka" },
  { id: "dist-mangaluru", stateId: "st-ka", name: "Dakshina Kannada", state: "Karnataka" },
  { id: "dist-dharwad", stateId: "st-ka", name: "Dharwad / Hubballi", state: "Karnataka" },
  { id: "dist-belagavi", stateId: "st-ka", name: "Belagavi", state: "Karnataka" },
  { id: "dist-davanagere", stateId: "st-ka", name: "Davanagere", state: "Karnataka" },
  { id: "dist-ballari", stateId: "st-ka", name: "Ballari", state: "Karnataka" },
  { id: "dist-kalaburagi", stateId: "st-ka", name: "Kalaburagi", state: "Karnataka" },
  { id: "dist-shivamogga", stateId: "st-ka", name: "Shivamogga", state: "Karnataka" },
  { id: "dist-udupi", stateId: "st-ka", name: "Udupi", state: "Karnataka" },

  // Tamil Nadu Districts
  { id: "dist-chennai", stateId: "st-tn", name: "Chennai", state: "Tamil Nadu" },
  { id: "dist-coimbatore", stateId: "st-tn", name: "Coimbatore", state: "Tamil Nadu" },
  { id: "dist-madurai", stateId: "st-tn", name: "Madurai", state: "Tamil Nadu" },
  { id: "dist-trichy", stateId: "st-tn", name: "Tiruchirappalli", state: "Tamil Nadu" },
  { id: "dist-salem", stateId: "st-tn", name: "Salem", state: "Tamil Nadu" },
  { id: "dist-tirunelveli", stateId: "st-tn", name: "Tirunelveli", state: "Tamil Nadu" },
  { id: "dist-vellore", stateId: "st-tn", name: "Vellore", state: "Tamil Nadu" },
  { id: "dist-kanchipuram", stateId: "st-tn", name: "Kanchipuram / Chengalpattu", state: "Tamil Nadu" },

  // Maharashtra Districts
  { id: "dist-mumbai-city", stateId: "st-mh", name: "Mumbai City", state: "Maharashtra" },
  { id: "dist-mumbai-sub", stateId: "st-mh", name: "Mumbai Suburban", state: "Maharashtra" },
  { id: "dist-pune", stateId: "st-mh", name: "Pune", state: "Maharashtra" },
  { id: "dist-thane", stateId: "st-mh", name: "Thane", state: "Maharashtra" },
  { id: "dist-nagpur", stateId: "st-mh", name: "Nagpur", state: "Maharashtra" },
  { id: "dist-nashik", stateId: "st-mh", name: "Nashik", state: "Maharashtra" },
  { id: "dist-aurangabad", stateId: "st-mh", name: "Chhatrapati Sambhajinagar", state: "Maharashtra" },
  { id: "dist-kolhapur", stateId: "st-mh", name: "Kolhapur", state: "Maharashtra" },

  // Gujarat Districts
  { id: "dist-ahmedabad", stateId: "st-gj", name: "Ahmedabad", state: "Gujarat" },
  { id: "dist-surat", stateId: "st-gj", name: "Surat", state: "Gujarat" },
  { id: "dist-vadodara", stateId: "st-gj", name: "Vadodara", state: "Gujarat" },
  { id: "dist-rajkot", stateId: "st-gj", name: "Rajkot", state: "Gujarat" },

  // Delhi NCR
  { id: "dist-delhi-central", stateId: "st-dl", name: "Central Delhi", state: "Delhi NCR" },
  { id: "dist-delhi-south", stateId: "st-dl", name: "South Delhi", state: "Delhi NCR" },
  { id: "dist-noida", stateId: "st-dl", name: "Gautam Buddha Nagar (Noida)", state: "Delhi NCR" },
  { id: "dist-gurugram", stateId: "st-dl", name: "Gurugram", state: "Delhi NCR" },
  { id: "dist-ghaziabad", stateId: "st-dl", name: "Ghaziabad", state: "Delhi NCR" }
];

// Comprehensive Towns & Cities (Including Tenali, Ponnuru, Guntur, Vijayawada, etc.)
export const INITIAL_CITIES = [
  // Andhra Pradesh Towns & Cities
  { id: "city-tenali", name: "Tenali", stateId: "st-ap", districtId: "dist-guntur", state: "Andhra Pradesh", district: "Guntur", isPopular: true, tier: "Town / Cultural Capital" },
  { id: "city-ponnuru", name: "Ponnuru", stateId: "st-ap", districtId: "dist-bapatla", state: "Andhra Pradesh", district: "Bapatla", isPopular: true, tier: "Town" },
  { id: "city-guntur", name: "Guntur", stateId: "st-ap", districtId: "dist-guntur", state: "Andhra Pradesh", district: "Guntur", isPopular: true, tier: "Major City" },
  { id: "city-vijayawada", name: "Vijayawada", stateId: "st-ap", districtId: "dist-krishna", state: "Andhra Pradesh", district: "Krishna / NTR", isPopular: true, tier: "Metropolitan City" },
  { id: "city-visakhapatnam", name: "Visakhapatnam", stateId: "st-ap", districtId: "dist-vizag", state: "Andhra Pradesh", district: "Visakhapatnam", isPopular: true, tier: "Metropolitan City" },
  { id: "city-bapatla", name: "Bapatla", stateId: "st-ap", districtId: "dist-bapatla", state: "Andhra Pradesh", district: "Bapatla", isPopular: false, tier: "Town" },
  { id: "city-chirala", name: "Chirala", stateId: "st-ap", districtId: "dist-bapatla", state: "Andhra Pradesh", district: "Bapatla", isPopular: false, tier: "Town" },
  { id: "city-mangalagiri", name: "Mangalagiri", stateId: "st-ap", districtId: "dist-guntur", state: "Andhra Pradesh", district: "Guntur", isPopular: false, tier: "Town" },
  { id: "city-narasaraopet", name: "Narasaraopet", stateId: "st-ap", districtId: "dist-palnadu", state: "Andhra Pradesh", district: "Palnadu", isPopular: false, tier: "Town" },
  { id: "city-tirupati", name: "Tirupati", stateId: "st-ap", districtId: "dist-chittoor", state: "Andhra Pradesh", district: "Chittoor / Tirupati", isPopular: true, tier: "Major City" },
  { id: "city-rajahmundry", name: "Rajahmundry", stateId: "st-ap", districtId: "dist-eg", state: "Andhra Pradesh", district: "East Godavari / Kakinada", isPopular: true, tier: "Major City" },
  { id: "city-kakinada", name: "Kakinada", stateId: "st-ap", districtId: "dist-eg", state: "Andhra Pradesh", district: "East Godavari / Kakinada", isPopular: true, tier: "Major City" },
  { id: "city-nellore", name: "Nellore", stateId: "st-ap", districtId: "dist-nellore", state: "Andhra Pradesh", district: "SPSR Nellore", isPopular: true, tier: "Major City" },
  { id: "city-kurnool", name: "Kurnool", stateId: "st-ap", districtId: "dist-kurnool", state: "Andhra Pradesh", district: "Kurnool / Nandyal", isPopular: true, tier: "Major City" },
  { id: "city-kadapa", name: "Kadapa", stateId: "st-ap", districtId: "dist-kadapa", state: "Andhra Pradesh", district: "YSR Kadapa", isPopular: false, tier: "Major City" },
  { id: "city-anantapur", name: "Anantapur", stateId: "st-ap", districtId: "dist-anantapur", state: "Andhra Pradesh", district: "Anantapur / Sri Sathya Sai", isPopular: false, tier: "Major City" },
  { id: "city-eluru", name: "Eluru", stateId: "st-ap", districtId: "dist-wg", state: "Andhra Pradesh", district: "West Godavari / Eluru", isPopular: false, tier: "City" },
  { id: "city-bhimavaram", name: "Bhimavaram", stateId: "st-ap", districtId: "dist-wg", state: "Andhra Pradesh", district: "West Godavari / Eluru", isPopular: false, tier: "Town" },
  { id: "city-ongole", name: "Ongole", stateId: "st-ap", districtId: "dist-prakasam", state: "Andhra Pradesh", district: "Prakasam", isPopular: false, tier: "City" },
  { id: "city-machilipatnam", name: "Machilipatnam", stateId: "st-ap", districtId: "dist-krishna", state: "Andhra Pradesh", district: "Krishna / NTR", isPopular: false, tier: "Town" },
  { id: "city-gudivada", name: "Gudivada", stateId: "st-ap", districtId: "dist-krishna", state: "Andhra Pradesh", district: "Krishna / NTR", isPopular: false, tier: "Town" },
  { id: "city-vizianagaram", name: "Vizianagaram", stateId: "st-ap", districtId: "dist-vzm", state: "Andhra Pradesh", district: "Vizianagaram", isPopular: false, tier: "City" },
  { id: "city-srikakulam", name: "Srikakulam", stateId: "st-ap", districtId: "dist-sklm", state: "Andhra Pradesh", district: "Srikakulam", isPopular: false, tier: "City" },
  { id: "city-proddatur", name: "Proddatur", stateId: "st-ap", districtId: "dist-kadapa", state: "Andhra Pradesh", district: "YSR Kadapa", isPopular: false, tier: "Town" },
  { id: "city-nandyal", name: "Nandyal", stateId: "st-ap", districtId: "dist-kurnool", state: "Andhra Pradesh", district: "Kurnool / Nandyal", isPopular: false, tier: "City" },
  { id: "city-hindupur", name: "Hindupur", stateId: "st-ap", districtId: "dist-anantapur", state: "Andhra Pradesh", district: "Anantapur / Sri Sathya Sai", isPopular: false, tier: "Town" },
  { id: "city-tadepalligudem", name: "Tadepalligudem", stateId: "st-ap", districtId: "dist-wg", state: "Andhra Pradesh", district: "West Godavari / Eluru", isPopular: false, tier: "Town" },
  { id: "city-tanuku", name: "Tanuku", stateId: "st-ap", districtId: "dist-wg", state: "Andhra Pradesh", district: "West Godavari / Eluru", isPopular: false, tier: "Town" },
  { id: "city-amalapuram", name: "Amalapuram", stateId: "st-ap", districtId: "dist-eg", state: "Andhra Pradesh", district: "East Godavari / Kakinada", isPopular: false, tier: "Town" },
  { id: "city-palakollu", name: "Palakollu", stateId: "st-ap", districtId: "dist-wg", state: "Andhra Pradesh", district: "West Godavari / Eluru", isPopular: false, tier: "Town" },

  // Telangana Cities & Towns
  { id: "city-hyderabad", name: "Hyderabad", stateId: "st-tg", districtId: "dist-hyd", state: "Telangana", district: "Hyderabad", isPopular: true, tier: "Metropolitan Mega City" },
  { id: "city-secunderabad", name: "Secunderabad", stateId: "st-tg", districtId: "dist-hyd", state: "Telangana", district: "Hyderabad", isPopular: true, tier: "Twin City" },
  { id: "city-warangal", name: "Warangal", stateId: "st-tg", districtId: "dist-warangal", state: "Telangana", district: "Warangal / Hanamkonda", isPopular: true, tier: "Major City" },
  { id: "city-nizamabad", name: "Nizamabad", stateId: "st-tg", districtId: "dist-nizamabad", state: "Telangana", district: "Nizamabad", isPopular: false, tier: "City" },
  { id: "city-karimnagar", name: "Karimnagar", stateId: "st-tg", districtId: "dist-karimnagar", state: "Telangana", district: "Karimnagar", isPopular: false, tier: "City" },
  { id: "city-khammam", name: "Khammam", stateId: "st-tg", districtId: "dist-khammam", state: "Telangana", district: "Khammam", isPopular: false, tier: "City" },
  { id: "city-mahbubnagar", name: "Mahbubnagar", stateId: "st-tg", districtId: "dist-mahbubnagar", state: "Telangana", district: "Mahbubnagar", isPopular: false, tier: "City" },
  { id: "city-nalgonda", name: "Nalgonda", stateId: "st-tg", districtId: "dist-nalgonda", state: "Telangana", district: "Nalgonda", isPopular: false, tier: "Town" },
  { id: "city-suryapet", name: "Suryapet", stateId: "st-tg", districtId: "dist-nalgonda", state: "Telangana", district: "Nalgonda", isPopular: false, tier: "Town" },
  { id: "city-siddipet", name: "Siddipet", stateId: "st-tg", districtId: "dist-siddipet", state: "Telangana", district: "Siddipet", isPopular: false, tier: "Town" },
  { id: "city-sangareddy", name: "Sangareddy", stateId: "st-tg", districtId: "dist-sangareddy", state: "Telangana", district: "Sangareddy", isPopular: false, tier: "Town" },

  // Karnataka Cities
  { id: "city-bengaluru", name: "Bengaluru", stateId: "st-ka", districtId: "dist-blr-urban", state: "Karnataka", district: "Bengaluru Urban", isPopular: true, tier: "Metropolitan Mega City" },
  { id: "city-mysuru", name: "Mysuru", stateId: "st-ka", districtId: "dist-mysuru", state: "Karnataka", district: "Mysuru", isPopular: true, tier: "Heritage City" },
  { id: "city-mangaluru", name: "Mangaluru", stateId: "st-ka", districtId: "dist-mangaluru", state: "Karnataka", district: "Dakshina Kannada", isPopular: true, tier: "Port City" },
  { id: "city-hubballi", name: "Hubballi-Dharwad", stateId: "st-ka", districtId: "dist-dharwad", state: "Karnataka", district: "Dharwad / Hubballi", isPopular: false, tier: "Commercial Hub" },
  { id: "city-belagavi", name: "Belagavi", stateId: "st-ka", districtId: "dist-belagavi", state: "Karnataka", district: "Belagavi", isPopular: false, tier: "City" },
  { id: "city-shivamogga", name: "Shivamogga", stateId: "st-ka", districtId: "dist-shivamogga", state: "Karnataka", district: "Shivamogga", isPopular: false, tier: "City" },
  { id: "city-udupi", name: "Udupi", stateId: "st-ka", districtId: "dist-udupi", state: "Karnataka", district: "Udupi", isPopular: false, tier: "Town" },

  // Tamil Nadu Cities
  { id: "city-chennai", name: "Chennai", stateId: "st-tn", districtId: "dist-chennai", state: "Tamil Nadu", district: "Chennai", isPopular: true, tier: "Metropolitan Mega City" },
  { id: "city-coimbatore", name: "Coimbatore", stateId: "st-tn", districtId: "dist-coimbatore", state: "Tamil Nadu", district: "Coimbatore", isPopular: true, tier: "Major City" },
  { id: "city-madurai", name: "Madurai", stateId: "st-tn", districtId: "dist-madurai", state: "Tamil Nadu", district: "Madurai", isPopular: true, tier: "Major City" },
  { id: "city-trichy", name: "Tiruchirappalli", stateId: "st-tn", districtId: "dist-trichy", state: "Tamil Nadu", district: "Tiruchirappalli", isPopular: false, tier: "Major City" },
  { id: "city-salem", name: "Salem", stateId: "st-tn", districtId: "dist-salem", state: "Tamil Nadu", district: "Salem", isPopular: false, tier: "City" },

  // Maharashtra Cities
  { id: "city-mumbai", name: "Mumbai", stateId: "st-mh", districtId: "dist-mumbai-city", state: "Maharashtra", district: "Mumbai City", isPopular: true, tier: "Financial Mega City" },
  { id: "city-pune", name: "Pune", stateId: "st-mh", districtId: "dist-pune", state: "Maharashtra", district: "Pune", isPopular: true, tier: "Metropolitan City" },
  { id: "city-nagpur", name: "Nagpur", stateId: "st-mh", districtId: "dist-nagpur", state: "Maharashtra", district: "Nagpur", isPopular: false, tier: "Major City" },
  { id: "city-nashik", name: "Nashik", stateId: "st-mh", districtId: "dist-nashik", state: "Maharashtra", district: "Nashik", isPopular: false, tier: "City" },
  { id: "city-navi-mumbai", name: "Navi Mumbai", stateId: "st-mh", districtId: "dist-thane", state: "Maharashtra", district: "Thane", isPopular: false, tier: "Planned City" },

  // Gujarat Cities
  { id: "city-ahmedabad", name: "Ahmedabad", stateId: "st-gj", districtId: "dist-ahmedabad", state: "Gujarat", district: "Ahmedabad", isPopular: true, tier: "Metropolitan City" },
  { id: "city-surat", name: "Surat", stateId: "st-gj", districtId: "dist-surat", state: "Gujarat", district: "Surat", isPopular: true, tier: "Major City" },
  { id: "city-vadodara", name: "Vadodara", stateId: "st-gj", districtId: "dist-vadodara", state: "Gujarat", district: "Vadodara", isPopular: false, tier: "Cultural City" },
  { id: "city-rajkot", name: "Rajkot", stateId: "st-gj", districtId: "dist-rajkot", state: "Gujarat", district: "Rajkot", isPopular: false, tier: "City" },

  // Delhi NCR
  { id: "city-delhi", name: "Delhi NCR", stateId: "st-dl", districtId: "dist-delhi-central", state: "Delhi NCR", district: "Central Delhi", isPopular: true, tier: "Capital Region" },
  { id: "city-noida", name: "Noida", stateId: "st-dl", districtId: "dist-noida", state: "Delhi NCR", district: "Gautam Buddha Nagar (Noida)", isPopular: true, tier: "City" },
  { id: "city-gurugram", name: "Gurugram", stateId: "st-dl", districtId: "dist-gurugram", state: "Delhi NCR", district: "Gurugram", isPopular: true, tier: "Cyber City" }
];

export function getCustomLocations() {
  return loadJSON(CUSTOM_LOCATIONS_FILE, {
    customStates: [],
    customDistricts: [],
    customCities: []
  });
}

export function saveCustomLocations(data) {
  saveJSON(CUSTOM_LOCATIONS_FILE, data);
}

export function getAllStates() {
  const custom = getCustomLocations();
  return [...INITIAL_STATES, ...(custom.customStates || [])];
}

export function getAllDistricts(stateId) {
  const custom = getCustomLocations();
  const all = [...INITIAL_DISTRICTS, ...(custom.customDistricts || [])];
  if (!stateId) return all;
  return all.filter((d) => d.stateId === stateId);
}

export function getAllCities(districtId, stateId) {
  const custom = getCustomLocations();
  const all = [...INITIAL_CITIES, ...(custom.customCities || [])];
  if (districtId) {
    return all.filter((c) => c.districtId === districtId);
  }
  if (stateId) {
    return all.filter((c) => c.stateId === stateId);
  }
  return all;
}
