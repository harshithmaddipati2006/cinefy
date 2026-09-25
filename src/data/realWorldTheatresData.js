// ============================================================================
// Real-World Indian Cinema Theatres Database for CineFy
// Real cinemas from authentic Indian cities across all states
// STRICT MANDATE: NO "CineFy" prefix in any theatre name!
// Every screen MUST have capacity >= 120 seats.
// ============================================================================

export function cleanTheatreName(name) {
  if (!name) return "";
  return String(name)
    .replace(/^cinefy\s*[-–:]*\s*/i, "")
    .replace(/^cinefy\s+/i, "")
    .trim();
}

export const REAL_WORLD_THEATRES = {
  // --- ANDHRA PRADESH ---
  "Tenali": [
    { name: "V Celluloids Plateno 4K, Ithanagar", address: "Ganganamma Peta, Prakasam Road, Ithanagar, Tenali", locality: "Ithanagar", rating: 4.8 },
    { name: "Asha Cinemas 4K Dolby Atmos, Balajirao Pet", address: "Railway Station Road, Balajirao Pet, Tenali", locality: "Balajirao Pet", rating: 4.7 },
    { name: "SV Cinemas Priya Sri Priya Complex, Morrispet", address: "Giri Road, Morrispet, Near Railway Station, Tenali", locality: "Morrispet", rating: 4.6 },
    { name: "Pemmasani Cinema Hall 4K, Bose Road", address: "Bose Road, Ramalingeswara Pet, Tenali", locality: "Bose Road", rating: 4.5 },
    { name: "Swaraj Deluxe 4K Dolby Atmos, Market Road", address: "Market Road, Near Bose Road, Tenali", locality: "Market Road", rating: 4.6 },
    { name: "Sangameswara Cinema Hall, Balaji Rao Peta", address: "Balaji Rao Peta, Near Railway Station, Tenali", locality: "Balaji Rao Peta", rating: 4.4 },
    { name: "Alankar Cinema Hall 4K, Main Road", address: "Main Road, Near Bus Stand, Tenali", locality: "Main Road", rating: 4.5 }
  ],
  "Guntur": [
    { name: "Cinepolis Hollywood, Brodipet", address: "4th Line, Brodipet, Guntur", locality: "Brodipet", rating: 4.6 },
    { name: "Harihar Mahal 4K Dolby Atmos, Arundelpet", address: "Old Club Road, Arundelpet, Guntur", locality: "Arundelpet", rating: 4.5 },
    { name: "V Epics 3D 4K, Naaz Multiplex", address: "Naaz Centre, Station Road, Guntur", locality: "Naaz Centre", rating: 4.7 },
    { name: "Krishna Mahal 4K, Kothapet", address: "Kothapet Main Road, Guntur", locality: "Kothapet", rating: 4.4 }
  ],
  "Vijayawada": [
    { name: "Capital Cinemas, Trendset Mall, Benz Circle", address: "Trendset Mall, MG Road, Benz Circle, Vijayawada", locality: "Benz Circle", rating: 4.8 },
    { name: "INOX LEPL Icon, Patamata", address: "LEPL Icon Mall, Opposite Water Tank, Patamata, Vijayawada", locality: "Patamata", rating: 4.7 },
    { name: "PVR Ripples Mall, MG Road", address: "Ripples Mall, MG Road, Labbipet, Vijayawada", locality: "Labbipet", rating: 4.7 },
    { name: "Sailaja Theatre 4K Dolby Atmos, Governorpet", address: "Prakasam Road, Governorpet, Vijayawada", locality: "Governorpet", rating: 4.5 },
    { name: "Annapurna Theatre 4K, Gandhi Nagar", address: "Gandhi Nagar Main Road, Vijayawada", locality: "Gandhi Nagar", rating: 4.4 }
  ],
  "Visakhapatnam": [
    { name: "Jagadamba Theatre 70mm, Jagadamba Junction", address: "Jagadamba Junction, Visakhapatnam", locality: "Jagadamba Junction", rating: 4.8 },
    { name: "INOX CMR Central, Maddilapalem", address: "CMR Central, New Resapuvanipalem, Maddilapalem, Visakhapatnam", locality: "Maddilapalem", rating: 4.7 },
    { name: "Sangam Sarat 4K Laser, Dwaraka Nagar", address: "Dwaraka Nagar Main Road, Visakhapatnam", locality: "Dwaraka Nagar", rating: 4.7 },
    { name: "Melody Cinema 4K Laser, Jagadamba Centre", address: "Near Jagadamba Junction, Visakhapatnam", locality: "Jagadamba Centre", rating: 4.6 },
    { name: "V-Max Cinemas, Siripuram", address: "Siripuram Towers, Siripuram, Visakhapatnam", locality: "Siripuram", rating: 4.6 }
  ],
  "Tirupati": [
    { name: "PVR VVS Mall, Old Tiruchanoor Road", address: "VVS Mall, Old Tiruchanoor Road, Tirupati", locality: "Old Tiruchanoor Road", rating: 4.7 },
    { name: "Pratap Theatres Complex, TP Area", address: "Near Railway Station, TP Area, Tirupati", locality: "TP Area", rating: 4.6 },
    { name: "Jayasyam Theatre 4K, Korlagunta", address: "Korlagunta Main Road, Tirupati", locality: "Korlagunta", rating: 4.5 },
    { name: "PGS Cinemas, AIR Bypass Road", address: "AIR Bypass Road, Tirupati", locality: "AIR Bypass Road", rating: 4.5 }
  ],
  "Rajahmundry": [
    { name: "Surya Palace 4K Laser, Danavaipeta", address: "Danavaipeta, Rajahmundry", locality: "Danavaipeta", rating: 4.7 },
    { name: "Geetha Apsara Multiplex, Main Road", address: "Main Road, Rajahmundry", locality: "Main Road", rating: 4.6 },
    { name: "Syamala Cinema 4K, Kotipalli", address: "Kotipalli Bus Stand Area, Rajahmundry", locality: "Kotipalli", rating: 4.5 }
  ],
  "Kakinada": [
    { name: "Devi Multiplex, Cinema Road", address: "Cinema Road, Kakinada", locality: "Cinema Road", rating: 4.7 },
    { name: "C&C Cinemas, Bhanugudi Junction", address: "Bhanugudi Junction, Kakinada", locality: "Bhanugudi Junction", rating: 4.6 },
    { name: "Anand Complex, Main Road", address: "Main Road, Kakinada", locality: "Main Road", rating: 4.5 }
  ],
  "Nellore": [
    { name: "S2 Cinemas, Trunk Road", address: "Trunk Road, Nellore", locality: "Trunk Road", rating: 4.7 },
    { name: "Nartaki 4K Dolby Atmos, Vedayapalem", address: "Vedayapalem, Nellore", locality: "Vedayapalem", rating: 4.6 },
    { name: "Archana Complex, Gandhi Nagar", address: "Gandhi Nagar, Nellore", locality: "Gandhi Nagar", rating: 4.5 }
  ],
  "Kurnool": [
    { name: "INOX Jyothi Mall, Park Road", address: "Jyothi Mall, Park Road, Kurnool", locality: "Park Road", rating: 4.7 },
    { name: "Anand Complex, Birla Gate", address: "Birla Gate, Kurnool", locality: "Birla Gate", rating: 4.5 },
    { name: "SVR Complex, Nandyal Checkpost", address: "Nandyal Checkpost, Kurnool", locality: "Nandyal Checkpost", rating: 4.5 }
  ],
  "Kadapa": [
    { name: "Ravi Theatres, Seven Roads Junction", address: "Seven Roads Junction, Kadapa", locality: "Seven Roads", rating: 4.6 },
    { name: "Ameer Complex, RIMS Road", address: "RIMS Road, Kadapa", locality: "RIMS Road", rating: 4.5 }
  ],
  "Anantapur": [
    { name: "Shanthi Theatre, Subhash Road", address: "Subhash Road, Anantapur", locality: "Subhash Road", rating: 4.5 },
    { name: "Triveni Complex, Clock Tower Road", address: "Clock Tower Road, Anantapur", locality: "Clock Tower Road", rating: 4.5 }
  ],
  "Eluru": [
    { name: "Ambica Deluxe, Powerpet", address: "Powerpet, Eluru", locality: "Powerpet", rating: 4.6 },
    { name: "Venkatramana Theatre, RR Pet", address: "RR Pet, Eluru", locality: "RR Pet", rating: 4.5 }
  ],
  "Ongole": [
    { name: "Gorantla Multiplex, Kurnool Road", address: "Kurnool Road, Ongole", locality: "Kurnool Road", rating: 4.6 },
    { name: "BVS Complex, Trunk Road", address: "Trunk Road, Ongole", locality: "Trunk Road", rating: 4.5 }
  ],
  "Vizianagaram": [
    { name: "Mayuri Cinema 4K, MG Road", address: "MG Road, Vizianagaram", locality: "MG Road", rating: 4.6 },
    { name: "Ranjani Complex, Mayuri Junction", address: "Mayuri Junction, Vizianagaram", locality: "Mayuri Junction", rating: 4.5 }
  ],
  "Srikakulam": [
    { name: "Saraswathi Theatre, Palakonda Road", address: "Palakonda Road, Srikakulam", locality: "Palakonda Road", rating: 4.5 },
    { name: "Surya Complex, Day & Night Junction", address: "Day & Night Junction, Srikakulam", locality: "Day & Night Junction", rating: 4.5 }
  ],
  "Machilipatnam": [
    { name: "Siri Krishna Complex, Konneru Center", address: "Konneru Center, Machilipatnam", locality: "Konneru Center", rating: 4.5 },
    { name: "Radhika Theatre, Frenchpet", address: "Frenchpet, Machilipatnam", locality: "Frenchpet", rating: 4.4 }
  ],
  "Bhimavaram": [
    { name: "Padmasri Theatres Complex, J.P. Road", address: "J.P. Road, Bhimavaram", locality: "J.P. Road", rating: 4.6 },
    { name: "Vijaya Theatre, Sunday Market", address: "Sunday Market, Bhimavaram", locality: "Sunday Market", rating: 4.5 }
  ],
  "Proddatur": [
    { name: "Siva Deluxe, Korrapadu Road", address: "Korrapadu Road, Proddatur", locality: "Korrapadu Road", rating: 4.5 },
    { name: "SLV Cinemas, Gandhi Road", address: "Gandhi Road, Proddatur", locality: "Gandhi Road", rating: 4.4 }
  ],
  "Nandyal": [
    { name: "Sree Rama Complex, Sanjeeva Nagar", address: "Sanjeeva Nagar, Nandyal", locality: "Sanjeeva Nagar", rating: 4.5 },
    { name: "Pratap Theatre, Railway Station Road", address: "Railway Station Road, Nandyal", locality: "Station Road", rating: 4.4 }
  ],
  "Chittoor": [
    { name: "MSR Multiplex, High Street", address: "High Street, Chittoor", locality: "High Street", rating: 4.6 },
    { name: "Gurunath Cinema, Bazaar Street", address: "Bazaar Street, Chittoor", locality: "Bazaar Street", rating: 4.4 }
  ],
  "Hindupur": [
    { name: "Lakshmi Theatre, Penukonda Road", address: "Penukonda Road, Hindupur", locality: "Penukonda Road", rating: 4.5 },
    { name: "Sree Venkateswara Deluxe, Mukkidipeta", address: "Mukkidipeta, Hindupur", locality: "Mukkidipeta", rating: 4.4 }
  ],
  "Tadepalligudem": [
    { name: "Sesha Mahal 4K, K.N. Road", address: "K.N. Road, Tadepalligudem", locality: "K.N. Road", rating: 4.5 },
    { name: "Sai Krishna Complex, Station Road", address: "Station Road, Tadepalligudem", locality: "Station Road", rating: 4.4 }
  ],
  "Gudivada": [
    { name: "Ganga Mahal, Nehru Chowk", address: "Nehru Chowk, Gudivada", locality: "Nehru Chowk", rating: 4.5 },
    { name: "Bhaskar Deluxe, Eluru Road", address: "Eluru Road, Gudivada", locality: "Eluru Road", rating: 4.4 }
  ],
  "Narasaraopet": [
    { name: "Venkataramana Cinema, Station Road", address: "Station Road, Narasaraopet", locality: "Station Road", rating: 4.5 },
    { name: "Srinivasa Complex, Palnadu Bus Stand Area", address: "Near Palnadu Bus Stand, Narasaraopet", locality: "Palnadu Road", rating: 4.4 }
  ],
  "Mangalagiri": [
    { name: "Venkateswara Theatre, Tenali Road", address: "Tenali Road, Mangalagiri", locality: "Tenali Road", rating: 4.5 },
    { name: "Nataraj Cinema, Main Bazaar", address: "Main Bazaar, Mangalagiri", locality: "Main Bazaar", rating: 4.4 }
  ],
  "Amalapuram": [
    { name: "Sri Venkateswara 4K, Black Bridge Road", address: "Black Bridge Road, Amalapuram", locality: "Black Bridge Road", rating: 4.5 },
    { name: "Jagadamba Theatre, Clock Tower Junction", address: "Clock Tower Junction, Amalapuram", locality: "Clock Tower", rating: 4.4 }
  ],
  "Palakollu": [
    { name: "Sri Ram Cinema, Railway Station Road", address: "Railway Station Road, Palakollu", locality: "Station Road", rating: 4.5 },
    { name: "Sree Lakshmi Theatre, Main Bazaar", address: "Main Bazaar, Palakollu", locality: "Main Bazaar", rating: 4.4 }
  ],
  "Dharmavaram": [
    { name: "Kala Jyothi Theatre, Station Road", address: "Station Road, Dharmavaram", locality: "Station Road", rating: 4.5 },
    { name: "Sri Rama Deluxe, Silk Market Road", address: "Silk Market Road, Dharmavaram", locality: "Silk Market", rating: 4.4 }
  ],
  "Tanuku": [
    { name: "Gopala Krishna 4K, R.P. Road", address: "R.P. Road, Tanuku", locality: "R.P. Road", rating: 4.5 },
    { name: "Sree Lakshmi Complex, Velpur Road", address: "Velpur Road, Tanuku", locality: "Velpur Road", rating: 4.4 }
  ],
  "Chirala": [
    { name: "Bhavani Theatres, GBC Road", address: "GBC Road, Chirala", locality: "GBC Road", rating: 4.5 },
    { name: "Sree Rama Cinema, Clock Tower", address: "Clock Tower, Chirala", locality: "Clock Tower", rating: 4.4 }
  ],
  "Kavali": [
    { name: "Venkataramana Theatre, Trunk Road", address: "Trunk Road, Kavali", locality: "Trunk Road", rating: 4.5 },
    { name: "Krishna Deluxe, Railway Station Area", address: "Railway Station Area, Kavali", locality: "Station Area", rating: 4.4 }
  ],
  "Bapatla": [
    { name: "Krishna Theatre, College Road", address: "College Road, Bapatla", locality: "College Road", rating: 4.5 },
    { name: "Nataraj 4K, GBC Road", address: "GBC Road, Bapatla", locality: "GBC Road", rating: 4.4 }
  ],
  "Markapur": [
    { name: "Sreenivasa Theatre, Station Road", address: "Station Road, Markapur", locality: "Station Road", rating: 4.5 },
    { name: "Tirumala Cinema, Clock Tower", address: "Clock Tower, Markapur", locality: "Clock Tower", rating: 4.4 }
  ],
  "Ponnur": [
    { name: "Sree Rama Talkies, Station Road", address: "Station Road, Ponnur", locality: "Station Road", rating: 4.5 },
    { name: "Nataraj Complex, Nidubrolu", address: "Nidubrolu, Ponnur", locality: "Nidubrolu", rating: 4.4 }
  ],

  // --- TELANGANA ---
  "Hyderabad": [
    { name: "PVR Next Galleria, Panjagutta", address: "Irrum Manzil Metro Station, Panjagutta, Hyderabad", locality: "Panjagutta", rating: 4.8 },
    { name: "AMB Cinemas, Gachibowli", address: "Sarath City Capital Mall, Gachibowli, Hyderabad", locality: "Gachibowli", rating: 4.9 },
    { name: "Prasads Multiplex & Large Screen, NTR Marg", address: "NTR Gardens, Necklace Road, Khairatabad, Hyderabad", locality: "NTR Marg", rating: 4.8 },
    { name: "Asian Vijayalakshmi 4K, LB Nagar", address: "Kothapet, LB Nagar, Hyderabad", locality: "LB Nagar", rating: 4.6 },
    { name: "Sudarshan 35mm 4K, RTC X Roads", address: "RTC X Roads, Chikkadpally, Hyderabad", locality: "RTC X Roads", rating: 4.7 },
    { name: "Miraj Shalini Shivani 4K, Dilsukhnagar", address: "Main Road, Dilsukhnagar, Hyderabad", locality: "Dilsukhnagar", rating: 4.5 }
  ],
  "Secunderabad": [
    { name: "Tivoli Cinemas, Trimulgherry", address: "Trimulgherry, Secunderabad", locality: "Trimulgherry", rating: 4.6 },
    { name: "PVR SMR Vinay Iconia, Sainikpuri", address: "Sainikpuri, Secunderabad", locality: "Sainikpuri", rating: 4.7 },
    { name: "Prashanth Cinema, RP Road", address: "RP Road, Secunderabad", locality: "RP Road", rating: 4.4 }
  ],
  "Warangal": [
    { name: "Asian Sridevi Mall, Hanamkonda", address: "Main Road, Hanamkonda, Warangal", locality: "Hanamkonda", rating: 4.7 },
    { name: "Radhika Theatre, Kazipet", address: "Station Road, Kazipet, Warangal", locality: "Kazipet", rating: 4.5 },
    { name: "Ram-Laxman Complex, Nakkalagutta", address: "Nakkalagutta, Hanamkonda, Warangal", locality: "Nakkalagutta", rating: 4.6 }
  ],
  "Nizamabad": [
    { name: "Asian Mukta A2 Cinemas, Khaleelwadi", address: "Khaleelwadi, Nizamabad", locality: "Khaleelwadi", rating: 4.6 },
    { name: "Natraj Cinema, Bodhan Road", address: "Bodhan Road, Nizamabad", locality: "Bodhan Road", rating: 4.4 }
  ],
  "Karimnagar": [
    { name: "Pratima Multiplex, Collectorate Road", address: "Collectorate Road, Karimnagar", locality: "Collectorate Road", rating: 4.6 },
    { name: "Asian Srinivasa Complex, Mukarrampura", address: "Mukarrampura, Karimnagar", locality: "Mukarrampura", rating: 4.5 }
  ],
  "Khammam": [
    { name: "Srinivasa Complex, Wyra Road", address: "Wyra Road, Khammam", locality: "Wyra Road", rating: 4.6 },
    { name: "Aditya Cinemas, Mamillagudem", address: "Mamillagudem, Khammam", locality: "Mamillagudem", rating: 4.5 }
  ],
  "Ramagundam": [
    { name: "Geetha Theatre, NTPC Area", address: "NTPC Area, Ramagundam", locality: "NTPC Area", rating: 4.5 },
    { name: "Annapurna Cinema, Godavarikhani", address: "Godavarikhani Main Road, Ramagundam", locality: "Godavarikhani", rating: 4.4 }
  ],
  "Mahbubnagar": [
    { name: "Venkateshwara Complex, Raichur Road", address: "Raichur Road, Mahbubnagar", locality: "Raichur Road", rating: 4.5 },
    { name: "Natraj Cinema, Clock Tower", address: "Clock Tower, Mahbubnagar", locality: "Clock Tower", rating: 4.4 }
  ],
  "Nalgonda": [
    { name: "Natraj Theatre, Hyderabad Road", address: "Hyderabad Road, Nalgonda", locality: "Hyderabad Road", rating: 4.5 },
    { name: "Venkateshwara Complex, Clock Tower Center", address: "Clock Tower Center, Nalgonda", locality: "Clock Tower Center", rating: 4.4 }
  ],
  "Adilabad": [
    { name: "Priya Cinema, Cinema Road", address: "Cinema Road, Adilabad", locality: "Cinema Road", rating: 4.5 },
    { name: "Natraj Theatre, Kailash Nagar", address: "Kailash Nagar, Adilabad", locality: "Kailash Nagar", rating: 4.4 }
  ],
  "Suryapet": [
    { name: "SV Cinemas, Khammam Road", address: "Khammam Road, Suryapet", locality: "Khammam Road", rating: 4.5 },
    { name: "Srinivasa Deluxe, Hyderabad Bypass", address: "Hyderabad Bypass, Suryapet", locality: "Hyderabad Bypass", rating: 4.4 }
  ],
  "Siddipet": [
    { name: "Asian Jyothi Cinema, Medak Road", address: "Medak Road, Siddipet", locality: "Medak Road", rating: 4.6 },
    { name: "Balaji Theatre, Old Bus Stand Area", address: "Old Bus Stand Area, Siddipet", locality: "Old Bus Stand", rating: 4.4 }
  ],
  "Miryalaguda": [
    { name: "Sri Balaji Cinema, Sagar Road", address: "Sagar Road, Miryalaguda", locality: "Sagar Road", rating: 4.5 },
    { name: "Venkateshwara Theatre, Hanumanpet", address: "Hanumanpet, Miryalaguda", locality: "Hanumanpet", rating: 4.4 }
  ],
  "Mancherial": [
    { name: "Asian Radhika Multiplex, Bellampalli Road", address: "Bellampalli Road, Mancherial", locality: "Bellampalli Road", rating: 4.6 },
    { name: "Padmashree Theatre, Station Road", address: "Station Road, Mancherial", locality: "Station Road", rating: 4.4 }
  ],
  "Jagtial": [
    { name: "Asian Vani Multiplex, Tower Circle", address: "Tower Circle, Jagtial", locality: "Tower Circle", rating: 4.5 },
    { name: "Nataraj Theatre, Karimnagar Road", address: "Karimnagar Road, Jagtial", locality: "Karimnagar Road", rating: 4.4 }
  ],
  "Nirmal": [
    { name: "Priya Cinema, Mancherial Road", address: "Mancherial Road, Nirmal", locality: "Mancherial Road", rating: 4.5 },
    { name: "Venkateshwara Theatre, Shanti Nagar", address: "Shanti Nagar, Nirmal", locality: "Shanti Nagar", rating: 4.4 }
  ],
  "Kothagudem": [
    { name: "Sri Venkateshwara Cinema, MG Road", address: "MG Road, Kothagudem", locality: "MG Road", rating: 4.5 },
    { name: "Anand Theatre, Babu Camp", address: "Babu Camp, Kothagudem", locality: "Babu Camp", rating: 4.4 }
  ],
  "Kamareddy": [
    { name: "Priya Deluxe, Nizamabad Road", address: "Nizamabad Road, Kamareddy", locality: "Nizamabad Road", rating: 4.5 },
    { name: "Lakshmi Theatre, Station Area", address: "Station Area, Kamareddy", locality: "Station Area", rating: 4.4 }
  ],
  "Bodhan": [
    { name: "Natraj Cinema, Rakaspeth", address: "Rakaspeth, Bodhan", locality: "Rakaspeth", rating: 4.4 },
    { name: "Bharat Theatre, Shakar Nagar", address: "Shakar Nagar, Bodhan", locality: "Shakar Nagar", rating: 4.4 }
  ],
  "Sangareddy": [
    { name: "Asian Rukmini Complex, Pothireddypally", address: "Pothireddypally, Sangareddy", locality: "Pothireddypally", rating: 4.6 },
    { name: "Balaji Theatre, Collectorate Area", address: "Collectorate Area, Sangareddy", locality: "Collectorate Area", rating: 4.4 }
  ],

  // --- KARNATAKA ---
  "Bengaluru": [
    { name: "PVR Forum Mall, Koramangala", address: "Hosur Road, Koramangala, Bengaluru", locality: "Koramangala", rating: 4.8 },
    { name: "INOX Garuda Mall, Magrath Road", address: "Garuda Mall, Magrath Road, Ashok Nagar, Bengaluru", locality: "Magrath Road", rating: 4.7 },
    { name: "Urvashi Cinema 4K 3D, Lalbagh Road", address: "47, Siddaiah Road, Sudhama Nagar, Bengaluru", locality: "Lalbagh Road", rating: 4.7 },
    { name: "PVR Orion Mall, Rajajinagar", address: "Brigade Gateway, 26/1 Dr. Rajkumar Road, Rajajinagar, Bengaluru", locality: "Rajajinagar", rating: 4.8 },
    { name: "Cinepolis Royal Meenakshi Mall, Bannerghatta", address: "Bannerghatta Road, Hulimavu, Bengaluru", locality: "Bannerghatta Road", rating: 4.6 }
  ],
  "Mysuru": [
    { name: "DRC Cinemas, BM Habitat Mall", address: "BM Habitat Mall, Jayalakshmipuram, Mysuru", locality: "Jayalakshmipuram", rating: 4.8 },
    { name: "INOX Mall of Mysore, MG Road", address: "Mall of Mysore, MG Road, Mysuru", locality: "MG Road", rating: 4.7 },
    { name: "Woodlands Theatre, Devaraja Mohalla", address: "Devaraja Mohalla, Mysuru", locality: "Devaraja Mohalla", rating: 4.5 }
  ],
  "Mangaluru": [
    { name: "PVR Forum Fiza Mall, Pandeshwar", address: "Forum Fiza Mall, Pandeshwar, Mangaluru", locality: "Pandeshwar", rating: 4.7 },
    { name: "Cinepolis City Centre Mall, KSRTC Road", address: "City Centre Mall, KS Rao Road, Mangaluru", locality: "KS Rao Road", rating: 4.6 },
    { name: "Bharat Cinemas, Bharath Mall, Bejai", address: "Bharath Mall, Bejai, Mangaluru", locality: "Bejai", rating: 4.6 }
  ],
  "Hubballi-Dharwad": [
    { name: "Cinepolis Urban Oasis Mall, Gokul Road", address: "Urban Oasis Mall, Gokul Road, Hubballi", locality: "Gokul Road", rating: 4.7 },
    { name: "Padma Theatre, Koppikar Road", address: "Koppikar Road, Hubballi", locality: "Koppikar Road", rating: 4.5 }
  ],
  "Belagavi": [
    { name: "INOX Chandan Cinema, College Road", address: "College Road, Belagavi", locality: "College Road", rating: 4.6 },
    { name: "Carnival Cinemas, Tilakwadi", address: "Tilakwadi, Belagavi", locality: "Tilakwadi", rating: 4.5 }
  ],
  "Davanagere": [
    { name: "Movie Time Cinemas, PB Road", address: "PB Road, Davanagere", locality: "PB Road", rating: 4.6 },
    { name: "Geethanjali Theatre, Mandipet", address: "Mandipet, Davanagere", locality: "Mandipet", rating: 4.4 }
  ],
  "Ballari": [
    { name: "Shiva Cinema Hall, Car Street", address: "Car Street, Ballari", locality: "Car Street", rating: 4.5 },
    { name: "Radhika Theatre, Infantry Road", address: "Infantry Road, Ballari", locality: "Infantry Road", rating: 4.5 }
  ],
  "Kalaburagi": [
    { name: "INOX Orchid Mall, Super Market", address: "Orchid Mall, Super Market, Kalaburagi", locality: "Super Market", rating: 4.6 },
    { name: "Miraj Cinemas, Sedam Road", address: "Sedam Road, Kalaburagi", locality: "Sedam Road", rating: 4.5 }
  ],
  "Shivamogga": [
    { name: "Mallikarjuna Cinema, B.H. Road", address: "B.H. Road, Shivamogga", locality: "B.H. Road", rating: 4.5 },
    { name: "HPC Multiplex, Durgigudi", address: "Durgigudi, Shivamogga", locality: "Durgigudi", rating: 4.5 }
  ],
  "Tumakuru": [
    { name: "Maruthi Cinema, BH Road", address: "BH Road, Tumakuru", locality: "BH Road", rating: 4.5 },
    { name: "Siddaganga Theatre, SS Puram", address: "SS Puram, Tumakuru", locality: "SS Puram", rating: 4.4 }
  ],
  "Udupi": [
    { name: "Bharat Cinemas, Maruthi Veethika", address: "Maruthi Veethika, Udupi", locality: "Maruthi Veethika", rating: 4.6 },
    { name: "Alankar Deluxe, Kalsanka", address: "Kalsanka, Udupi", locality: "Kalsanka", rating: 4.4 }
  ],
  "Bidar": [
    { name: "Sapna Cinema, Udgir Road", address: "Udgir Road, Bidar", locality: "Udgir Road", rating: 4.5 },
    { name: "Balaji Theatre, Old City", address: "Old City, Bidar", locality: "Old City", rating: 4.4 }
  ],
  "Hosapete": [
    { name: "Miraj Cinemas, Dam Road", address: "Dam Road, Hosapete", locality: "Dam Road", rating: 4.6 },
    { name: "SLV Complex, Station Road", address: "Station Road, Hosapete", locality: "Station Road", rating: 4.4 }
  ],
  "Gadag": [
    { name: "Mahalaxmi Cinema, Pala Badami Road", address: "Pala Badami Road, Gadag", locality: "Pala Badami Road", rating: 4.5 },
    { name: "Venkateshwara Theatre, Station Road", address: "Station Road, Gadag", locality: "Station Road", rating: 4.4 }
  ],
  "Hassan": [
    { name: "Picture Palace, BM Road", address: "BM Road, Hassan", locality: "BM Road", rating: 4.5 },
    { name: "Sahyadri Theatre, RC Road", address: "RC Road, Hassan", locality: "RC Road", rating: 4.4 }
  ],
  "Raichur": [
    { name: "Santosh Cinema, Station Road", address: "Station Road, Raichur", locality: "Station Road", rating: 4.5 },
    { name: "Padma Theatre, Lingsugur Road", address: "Lingsugur Road, Raichur", locality: "Lingsugur Road", rating: 4.4 }
  ],
  "Chikkamagaluru": [
    { name: "Milan Cinema, KM Road", address: "KM Road, Chikkamagaluru", locality: "KM Road", rating: 4.5 },
    { name: "Gurukripa Theatre, Indira Gandhi Road", address: "Indira Gandhi Road, Chikkamagaluru", locality: "IG Road", rating: 4.4 }
  ],
  "Mandya": [
    { name: "Sanjaya Cinema, VV Road", address: "VV Road, Mandya", locality: "VV Road", rating: 4.5 },
    { name: "Guru Theatre, Mysore-Bangalore Road", address: "Mysore-Bangalore Road, Mandya", locality: "Main Road", rating: 4.4 }
  ],
  "Chitradurga": [
    { name: "Prasanna Theatre, Holalkere Road", address: "Holalkere Road, Chitradurga", locality: "Holalkere Road", rating: 4.5 },
    { name: "Shanti Cinema, BD Road", address: "BD Road, Chitradurga", locality: "BD Road", rating: 4.4 }
  ],

  // --- TAMIL NADU ---
  "Chennai": [
    { name: "Sathyam Luxe Cinemas (SPI), Royapettah", address: "Express Avenue Mall, Royapettah, Chennai", locality: "Royapettah", rating: 4.9 },
    { name: "PVR VR Mall, Anna Nagar", address: "100 Feet Road, Anna Nagar West, Chennai", locality: "Anna Nagar", rating: 4.8 },
    { name: "Rohini Silver Screens, Koyambedu", address: "107, Poonamallee High Road, Koyambedu, Chennai", locality: "Koyambedu", rating: 4.7 },
    { name: "AGS Cinemas, T. Nagar", address: "Coronation Road, T. Nagar, Chennai", locality: "T. Nagar", rating: 4.7 },
    { name: "Kamala Cinemas, Vadapalani", address: "Arcot Road, Vadapalani, Chennai", locality: "Vadapalani", rating: 4.6 }
  ],
  "Coimbatore": [
    { name: "Broadway Cinemas, Avinashi Road", address: "Avinashi Road, Peelamedu, Coimbatore", locality: "Avinashi Road", rating: 4.8 },
    { name: "KG Cinemas, Race Course", address: "Bunglow Road, Race Course, Coimbatore", locality: "Race Course", rating: 4.7 },
    { name: "INOX Prozone Mall, Saravanampatti", address: "Prozone Mall, Sathy Road, Saravanampatti, Coimbatore", locality: "Saravanampatti", rating: 4.7 }
  ],
  "Madurai": [
    { name: "INOX Vishaal de Mal, Gokhale Road", address: "Vishaal de Mal, Gokhale Road, Madurai", locality: "Gokhale Road", rating: 4.7 },
    { name: "Cinepris Multiplex, Mattuthavani", address: "Mattuthavani, Madurai", locality: "Mattuthavani", rating: 4.6 },
    { name: "Thangam Theatre, West Perumal Maistry Street", address: "West Perumal Maistry Street, Madurai", locality: "Town Hall Road", rating: 4.5 }
  ],
  "Tiruchirappalli": [
    { name: "LA Cinemas, Maris Complex", address: "Maris Complex, Cantonment, Tiruchirappalli", locality: "Cantonment", rating: 4.7 },
    { name: "Morais City Cinemas, Pudukkottai Road", address: "Pudukkottai Road, Tiruchirappalli", locality: "Pudukkottai Road", rating: 4.6 }
  ],
  "Salem": [
    { name: "ARRS Multiplex, Meyyanur", address: "Meyyanur Bypass Road, Salem", locality: "Meyyanur", rating: 4.7 },
    { name: "Kailash Prakash Theatre, Fairlands", address: "Fairlands, Salem", locality: "Fairlands", rating: 4.6 }
  ],
  "Tirunelveli": [
    { name: "Ram Muthuram Cinemas, Vannarpettai", address: "Vannarpettai, Tirunelveli", locality: "Vannarpettai", rating: 4.7 },
    { name: "Perinba Vilas, Junction", address: "Railway Junction, Tirunelveli", locality: "Junction Area", rating: 4.5 }
  ],
  "Tiruppur": [
    { name: "Sri Sakthi Cinemas, Kangeyam Road", address: "Kangeyam Road, Tiruppur", locality: "Kangeyam Road", rating: 4.6 },
    { name: "Diamond Theatre, Municipal Office Road", address: "Municipal Office Road, Tiruppur", locality: "Town Hall Road", rating: 4.4 }
  ],
  "Vellore": [
    { name: "Galaxy Cinemas, Katpadi Road", address: "Katpadi Road, Vellore", locality: "Katpadi", rating: 4.6 },
    { name: "Thirumalai Complex, Arcot Road", address: "Arcot Road, Vellore", locality: "Arcot Road", rating: 4.5 }
  ],
  "Erode": [
    { name: "Maharaja Multiplex, Perundurai Road", address: "Perundurai Road, Erode", locality: "Perundurai Road", rating: 4.6 },
    { name: "Abirami Cinemas, Sathy Road", address: "Sathy Road, Erode", locality: "Sathy Road", rating: 4.5 }
  ],
  "Thoothukudi": [
    { name: "Balakrishna Theatres, Palayamkottai Road", address: "Palayamkottai Road, Thoothukudi", locality: "Palayamkottai Road", rating: 4.5 },
    { name: "Shanmuga Cinemas, Great Cotton Road", address: "Great Cotton Road, Thoothukudi", locality: "WGC Road", rating: 4.5 }
  ],
  "Thanjavur": [
    { name: "GV Complex, Medical College Road", address: "Medical College Road, Thanjavur", locality: "Medical College Road", rating: 4.6 },
    { name: "Jupiter Theatres, South Main Street", address: "South Main Street, Thanjavur", locality: "South Rampart", rating: 4.4 }
  ],
  "Dindigul": [
    { name: "Rajiv Multiplex, Palani Road", address: "Palani Road, Dindigul", locality: "Palani Road", rating: 4.5 },
    { name: "NVGB Theatre, Salai Road", address: "Salai Road, Dindigul", locality: "Salai Road", rating: 4.4 }
  ],
  "Kanchipuram": [
    { name: "Babu Cinema, Gandhi Road", address: "Gandhi Road, Kanchipuram", locality: "Gandhi Road", rating: 4.5 },
    { name: "Annai Theatres, Hospital Road", address: "Hospital Road, Kanchipuram", locality: "Hospital Road", rating: 4.4 }
  ],
  "Nagercoil": [
    { name: "Pioneer Cinemas, Cape Road", address: "Cape Road, Nagercoil", locality: "Cape Road", rating: 4.6 },
    { name: "Chakravathy Cinema, Court Road", address: "Court Road, Nagercoil", locality: "Court Road", rating: 4.5 }
  ],
  "Cuddalore": [
    { name: "New Cinema, Imperial Road", address: "Imperial Road, Cuddalore", locality: "Imperial Road", rating: 4.5 },
    { name: "Anandha Theatres, Lawrence Road", address: "Lawrence Road, Cuddalore", locality: "Lawrence Road", rating: 4.4 }
  ],
  "Kumbakonam": [
    { name: "Vasu Theatres, TSR Big Street", address: "TSR Big Street, Kumbakonam", locality: "TSR Big Street", rating: 4.5 },
    { name: "Vijaya Cinemas, John Selvaraj Nagar", address: "John Selvaraj Nagar, Kumbakonam", locality: "John Selvaraj Nagar", rating: 4.5 }
  ],
  "Hosur": [
    { name: "Raghavendra Cinemas, Bagalur Road", address: "Bagalur Road, Hosur", locality: "Bagalur Road", rating: 4.6 },
    { name: "Sri Balaji Multiplex, Denkanikotta Road", address: "Denkanikotta Road, Hosur", locality: "Denkanikotta Road", rating: 4.5 }
  ],
  "Karur": [
    { name: "Aascar Theatres, Kovai Road", address: "Kovai Road, Karur", locality: "Kovai Road", rating: 4.6 },
    { name: "Ellora Cinema, Jawahar Bazaar", address: "Jawahar Bazaar, Karur", locality: "Jawahar Bazaar", rating: 4.4 }
  ],
  "Neyveli": [
    { name: "Jubilee Theatre, Block 18", address: "Block 18, Neyveli Township", locality: "Block 18", rating: 4.5 },
    { name: "NLC Cinema, Main Bazaar Area", address: "Main Bazaar Area, Neyveli", locality: "Main Bazaar", rating: 4.4 }
  ],

  // --- KERALA ---
  "Kochi": [
    { name: "PVR Lulu Mall, Edappally", address: "Lulu International Shopping Mall, Edappally, Kochi", locality: "Edappally", rating: 4.8 },
    { name: "Cinepolis, Centre Square Mall, MG Road", address: "Centre Square Mall, MG Road, Shenoys, Kochi", locality: "MG Road", rating: 4.7 },
    { name: "Shenoys Theatre 4K Laser, MG Road", address: "Mahatma Gandhi Rd, Shenoys, Ernakulam, Kochi", locality: "MG Road", rating: 4.9 },
    { name: "Padma Cinema, Ernakulam", address: "Mahatma Gandhi Rd, Padma Junction, Kochi", locality: "MG Road", rating: 4.6 }
  ],
  "Thiruvananthapuram": [
    { name: "Aries Plex SL Cinemas, Thampanoor", address: "Thampanoor, Thiruvananthapuram", locality: "Thampanoor", rating: 4.9 },
    { name: "PVR Lulu Mall, Kochuveli", address: "Lulu Mall, Akkulam Bridge, Kochuveli, Thiruvananthapuram", locality: "Kochuveli", rating: 4.8 },
    { name: "New Theatre, Station Road", address: "Railway Station Road, Thampanoor, Thiruvananthapuram", locality: "Thampanoor", rating: 4.6 }
  ],
  "Kozhikode": [
    { name: "PVR HiLITE Mall, Palazhi", address: "HiLITE Mall, Palazhi, Kozhikode", locality: "Hilite City", rating: 4.8 },
    { name: "Crown Cinemas, Francis Road", address: "Francis Road, Kozhikode", locality: "Beach Road", rating: 4.6 },
    { name: "Apsara Theatre, Mavoor Road", address: "Mavoor Road, Kozhikode", locality: "Mavoor Road", rating: 4.6 }
  ],
  "Thrissur": [
    { name: "Ragam Theatre, Kuruppam Road", address: "Kuruppam Road, Thrissur", locality: "Swaraj Round", rating: 4.7 },
    { name: "INOX Sobha City Mall, Puzhakkal", address: "Sobha City Mall, Puzhakkal, Thrissur", locality: "Puzhakkal", rating: 4.7 },
    { name: "Girija Theatre, Round South", address: "Round South, Thrissur", locality: "Round South", rating: 4.5 }
  ],
  "Kollam": [
    { name: "Revathy Cinemax, Chinnakada", address: "Chinnakada, Kollam", locality: "Chinnakada", rating: 4.6 },
    { name: "Dhanya Remya Theatre, Kadappakada", address: "Kadappakada, Kollam", locality: "Kadappakada", rating: 4.5 }
  ],
  "Kannur": [
    { name: "Savitha Film City, Fort Road", address: "Fort Road, Kannur", locality: "Fort Road", rating: 4.6 },
    { name: "Liberty Cinema, Thalassery Road", address: "Thana, Kannur", locality: "Thana", rating: 4.5 }
  ],
  "Alappuzha": [
    { name: "Pankaj Theatre, Mullakkal", address: "Mullakkal, Alappuzha", locality: "Mullakkal", rating: 4.5 },
    { name: "Raaban Cinema, CCSB Road", address: "CCSB Road, Alappuzha", locality: "VCSB Road", rating: 4.4 }
  ],
  "Palakkad": [
    { name: "Priya Theatre, Robinson Road", address: "Robinson Road, Palakkad", locality: "Robinson Road", rating: 4.6 },
    { name: "Aroma Cinema, Fort Maidan", address: "Fort Maidan Area, Palakkad", locality: "Fort Maidan", rating: 4.4 }
  ],
  "Kottayam": [
    { name: "Abhilash Theatre, Kanjikuzhy", address: "Kanjikuzhy, Kottayam", locality: "Kanjikuzhy", rating: 4.6 },
    { name: "Anand Theatres, TB Road", address: "TB Road, Kottayam", locality: "TB Road", rating: 4.5 }
  ],
  "Malappuram": [
    { name: "Priya Cinemas, Manjeri Road", address: "Manjeri Road, Malappuram", locality: "Down Hill", rating: 4.5 },
    { name: "Anugraha Theatre, Bypass Road", address: "Bypass Road, Malappuram", locality: "Up Hill", rating: 4.4 }
  ],
  "Manjeri": [
    { name: "Kairali Sree Cinema, Court Road", address: "Court Road, Manjeri", locality: "Court Road", rating: 4.5 },
    { name: "Devaki Cinema, Pandikkad Road", address: "Pandikkad Road, Manjeri", locality: "Pandikkad Road", rating: 4.4 }
  ],
  "Thalassery": [
    { name: "Liberty Complex, Logan's Road", address: "Logan's Road, Thalassery", locality: "Logan's Road", rating: 4.6 },
    { name: "Chitravani Cinema, AVK Nair Road", address: "AVK Nair Road, Thalassery", locality: "AVK Nair Road", rating: 4.4 }
  ],
  "Kasaragod": [
    { name: "MovieMax, Bank Road", address: "Bank Road, Kasaragod", locality: "Bank Road", rating: 4.5 },
    { name: "Krishna Cinema, Vidyanagar", address: "Vidyanagar, Kasaragod", locality: "Vidyanagar", rating: 4.4 }
  ],
  "Pathanamthitta": [
    { name: "Trinity Complex, College Road", address: "College Road, Pathanamthitta", locality: "College Road", rating: 4.5 },
    { name: "Aban Cinema, Ring Road", address: "Ring Road, Pathanamthitta", locality: "Ring Road", rating: 4.4 }
  ],

  // --- MAHARASHTRA ---
  "Mumbai": [
    { name: "INOX Laserplex, Nariman Point", address: "CR2 Mall, Nariman Point, Mumbai", locality: "Nariman Point", rating: 4.8 },
    { name: "PVR ICON, Phoenix Palladium, Lower Parel", address: "462, Senapati Bapat Marg, Lower Parel, Mumbai", locality: "Lower Parel", rating: 4.9 },
    { name: "Maison INOX, Jio World Plaza, BKC", address: "G Block, Bandra Kurla Complex, Bandra East, Mumbai", locality: "Bandra Kurla Complex (BKC)", rating: 4.9 },
    { name: "Gaiety Galaxy (G7 Multiplex), Bandra West", address: "SV Road, Bandra West, Mumbai", locality: "Bandra West", rating: 4.6 },
    { name: "Maratha Mandir, Mumbai Central", address: "Dr AR Nair Rd, Mumbai Central, Mumbai", locality: "Mumbai Central", rating: 4.7 }
  ],
  "Pune": [
    { name: "PVR Icon, Phoenix Marketcity, Viman Nagar", address: "Nagar Road, Viman Nagar, Pune", locality: "Viman Nagar", rating: 4.8 },
    { name: "INOX Westend Mall, Aundh", address: "Mahadji Shinde Road, Aundh, Pune", locality: "Aundh", rating: 4.7 },
    { name: "City PRIDE, Kothrud", address: "Paud Road, Kothrud, Pune", locality: "Kothrud", rating: 4.6 },
    { name: "Cinepolis, Seasons Mall, Magarpatta", address: "Seasons Mall, Magarpatta City, Hadapsar, Pune", locality: "Magarpatta", rating: 4.7 }
  ],
  "Nagpur": [
    { name: "Cinepolis, VR Mall, Medical Square", address: "VR Mall, Untkhana Road, Medical Square, Nagpur", locality: "Medical Square", rating: 4.7 },
    { name: "PVR Empress Mall, Gandhisagar Lake", address: "Empress Mall, Gandhisagar Lake, Nagpur", locality: "Empress Mall Area", rating: 4.6 },
    { name: "Smruti Cinema, Sadar", address: "Mount Road, Sadar, Nagpur", locality: "Civil Lines", rating: 4.5 }
  ],
  "Thane": [
    { name: "Cinepolis, Viviana Mall, Eastern Express Highway", address: "Viviana Mall, Eastern Express Highway, Thane West", locality: "Viviana Mall", rating: 4.8 },
    { name: "INOX Korum Mall, Eastern Express Highway", address: "Korum Mall, Mangal Pandey Road, Thane West", locality: "Korum Mall", rating: 4.7 }
  ],
  "Nashik": [
    { name: "INOX City Centre Mall, Lawate Nagar", address: "City Centre Mall, Lawate Nagar, Nashik", locality: "City Center Mall Area", rating: 4.7 },
    { name: "Cinemax, College Road", address: "College Road, Nashik", locality: "College Road", rating: 4.5 }
  ],
  "Kalyan-Dombivli": [
    { name: "SM5 Multiplex, Kalyan West", address: "Khadakpada, Kalyan West", locality: "Khadakpada", rating: 4.6 },
    { name: "Tilak Cinema, Dombivli East", address: "MIDC Dombivli East", locality: "MIDC Dombivli", rating: 4.4 }
  ],
  "Vasai-Virar": [
    { name: "Carnival Cinemas, Dreams Mall, Vasai", address: "Dreams Mall, Vasai West", locality: "Vasai West", rating: 4.5 },
    { name: "K Movie Star Multiplex, Virar West", address: "Bolinj, Virar West", locality: "Virar West", rating: 4.5 }
  ],
  "Aurangabad (Chhatrapati Sambhajinagar)": [
    { name: "PVR Prozone Mall, Chikalthana", address: "Prozone Mall, Chikalthana, Aurangabad", locality: "Prozone Mall Area", rating: 4.7 },
    { name: "INOX Tapadia City Centre, Nirala Bazar", address: "Tapadia City Centre, Nirala Bazar, Aurangabad", locality: "Jalna Road", rating: 4.6 }
  ],
  "Navi Mumbai": [
    { name: "Cinepolis Seawoods Grand Central, Seawoods", address: "Grand Central Mall, Seawoods, Navi Mumbai", locality: "Seawoods Grand Central", rating: 4.8 },
    { name: "INOX Raghuleela Mall, Vashi", address: "Raghuleela Mall, Opposite Vashi Railway Station, Vashi", locality: "Vashi", rating: 4.6 }
  ],
  "Solapur": [
    { name: "E-Square Solapur, Old Pune Naka", address: "Old Pune Naka, Solapur", locality: "Old Pune Naka", rating: 4.6 },
    { name: "Bhagwat Cinema, Navi Peth", address: "Navi Peth, Solapur", locality: "Murarji Peth", rating: 4.4 }
  ],
  "Mira-Bhayandar": [
    { name: "Maxus Cinemas, Bhayandar West", address: "Maxus Mall, 150 Feet Road, Bhayandar West", locality: "Maxus Mall Area", rating: 4.6 },
    { name: "Rassaz Multiplex, Mira Road East", address: "Beverly Park, Mira Road East", locality: "Mira Road East", rating: 4.5 }
  ],
  "Bhiwandi": [
    { name: "Ratan Cinema, Kalyan Naka", address: "Kalyan Naka, Bhiwandi", locality: "Kalyan Naka", rating: 4.4 },
    { name: "Sagar Talkies, Dhamankar Naka", address: "Dhamankar Naka, Bhiwandi", locality: "Dhamankar Naka", rating: 4.4 }
  ],
  "Amravati": [
    { name: "Priya Cinema, Jaistambh Chowk", address: "Jaistambh Chowk, Amravati", locality: "Rajapeth", rating: 4.5 },
    { name: "Chitra Talkies, Cotton Market Road", address: "Cotton Market Road, Amravati", locality: "Badnera Road", rating: 4.4 }
  ],
  "Nanded": [
    { name: "PVR Habib Mall, Station Road", address: "Habib Mall, Station Road, Nanded", locality: "Station Road", rating: 4.6 },
    { name: "Anuradha Theatre, Workshop Road", address: "Workshop Corner, Nanded", locality: "Workshop Corner", rating: 4.4 }
  ],
  "Kolhapur": [
    { name: "PVR DYP City Mall, Old Pune-Bangalore Road", address: "DYP City Mall, Old Pune-Bangalore Highway, Kolhapur", locality: "DYP Mall Area", rating: 4.7 },
    { name: "Padma Talkies, Bhausinghji Road", address: "Bhausinghji Road, Kolhapur", locality: "Rajarampuri", rating: 4.4 }
  ],
  "Akola": [
    { name: "Vasant Cinema, Open Theatre Area", address: "Open Theatre Area, Akola", locality: "Civil Lines", rating: 4.5 },
    { name: "Miraj Cinemas, Civil Lines", address: "Civil Lines, Akola", locality: "Tower Chowk", rating: 4.5 }
  ],
  "Latur": [
    { name: "PVR Mittal Mall, Ausa Road", address: "Mittal Mall, Ausa Road, Latur", locality: "Ausa Road", rating: 4.6 },
    { name: "Big Cinemas, Barshi Road", address: "Barshi Road, Latur", locality: "Barshi Road", rating: 4.4 }
  ],
  "Dhule": [
    { name: "Jyoti Cinema, Agra Road", address: "Agra Road, Dhule", locality: "Agra Road", rating: 4.4 },
    { name: "Rajkamal Theatre, Deopur", address: "Deopur, Dhule", locality: "Deopur", rating: 4.4 }
  ],
  "Ahmednagar": [
    { name: "Asha Talkies, Savedi", address: "Savedi, Ahmednagar", locality: "Savedi", rating: 4.5 },
    { name: "Chitra Cinema, Station Road", address: "Station Road, Ahmednagar", locality: "Station Road", rating: 4.4 }
  ],
  "Chandrapur": [
    { name: "Sangam Cinema, Gandhi Chowk", address: "Gandhi Chowk, Chandrapur", locality: "Gandhi Chowk", rating: 4.5 },
    { name: "Royal Talkies, Bazar Ward", address: "Bazar Ward, Chandrapur", locality: "Civil Lines", rating: 4.4 }
  ],
  "Parbhani": [
    { name: "Anuradha Cinema, Station Road", address: "Station Road, Parbhani", locality: "Station Road", rating: 4.4 },
    { name: "Natraj Cinema, Shivaji Nagar", address: "Shivaji Nagar, Parbhani", locality: "Shivaji Nagar", rating: 4.4 }
  ],
  "Jalgaon": [
    { name: "INOX Utsav Mall, Ring Road", address: "Utsav Mall, Ring Road, Jalgaon", locality: "Ring Road", rating: 4.6 },
    { name: "Ashok Cinema, Court Road", address: "Court Road, Jalgaon", locality: "Court Road", rating: 4.4 }
  ],
  "Satara": [
    { name: "Rajwada Cinema, Powai Naka", address: "Powai Naka, Satara", locality: "Powai Naka", rating: 4.5 },
    { name: "Radhika Talkies, Radhika Road", address: "Radhika Road, Satara", locality: "Radhika Road", rating: 4.4 }
  ],

  // --- GUJARAT ---
  "Ahmedabad": [
    { name: "PVR Acropolis Mall, Thaltej", address: "Acropolis Mall, SG Highway, Thaltej, Ahmedabad", locality: "SG Highway", rating: 4.8 },
    { name: "Cinepolis, Alpha One Mall, Vastrapur", address: "Alpha One Mall, Vastrapur Lake, Ahmedabad", locality: "Vastrapur", rating: 4.8 },
    { name: "INOX Himalaya Mall, Drive In Road", address: "Himalaya Mall, Drive In Road, Memnagar, Ahmedabad", locality: "CG Road", rating: 4.7 },
    { name: "Rajhans Cinemas, Nikol", address: "Nikol Gam Road, Nikol, Ahmedabad", locality: "Maninagar", rating: 4.6 }
  ],
  "Surat": [
    { name: "Rajhans Cinemas, Pal", address: "Rajhans Montessa, Pal-Adajan Road, Surat", locality: "Adajan", rating: 4.8 },
    { name: "INOX VR Surat, Dumas Road", address: "VR Surat, Magdalla, Dumas Road, Surat", locality: "VR Mall (Dumas Road)", rating: 4.8 },
    { name: "Cinepolis, Imperial Square, Adajan", address: "Imperial Square, Adajan Hazira Road, Surat", locality: "Piplod", rating: 4.7 }
  ],
  "Vadodara": [
    { name: "INOX Inorbit Mall, Gorwa Road", address: "Inorbit Mall, Alembic Road, Gorwa, Vadodara", locality: "Inorbit Mall Area", rating: 4.7 },
    { name: "PVR Eva Mall, Manjalpur", address: "Eva Mall, Manjalpur, Vadodara", locality: "Alkapuri", rating: 4.7 },
    { name: "Cinemarc Multiplex, Race Course", address: "Race Course Circle, Vadodara", locality: "Old Padra Road", rating: 4.5 }
  ],
  "Rajkot": [
    { name: "INOX Reliance Mega Mall, 150 Feet Ring Road", address: "Reliance Mega Mall, 150 Feet Ring Road, Rajkot", locality: "150 Feet Ring Road", rating: 4.7 },
    { name: "Cosmoplex Cinema, Mota Mava", address: "Kalawad Road, Mota Mava, Rajkot", locality: "Kalawad Road", rating: 4.6 }
  ],
  "Bhavnagar": [
    { name: "Himalaya Cinema, Victoria Park Road", address: "Victoria Park Road, Bhavnagar", locality: "Waghawadi Road", rating: 4.6 },
    { name: "Top3 Cinema, Ghogha Circle", address: "Ghogha Circle, Bhavnagar", locality: "Ghogha Circle", rating: 4.5 }
  ],
  "Jamnagar": [
    { name: "INOX Crystal Mall, Khambhalia Highway", address: "Crystal Mall, Khambhalia Highway, Jamnagar", locality: "Victoria Bridge Area", rating: 4.6 },
    { name: "Mehul Cinema, Jamnagar", address: "Indira Marg, Jamnagar", locality: "Indira Marg", rating: 4.4 }
  ],
  "Gandhinagar": [
    { name: "Cinemax, Sector 11", address: "Sector 11, Gandhinagar", locality: "Sector 11", rating: 4.6 },
    { name: "City Pulse Multiplex, Gandhinagar", address: "Kudasan, Gandhinagar", locality: "Kudasan", rating: 4.5 }
  ],
  "Junagadh": [
    { name: "Platinum Cinema, Zanzarda Road", address: "Zanzarda Road, Junagadh", locality: "Zanzarda Road", rating: 4.5 },
    { name: "Galaxy Cinema, College Road", address: "College Road, Junagadh", locality: "College Road", rating: 4.4 }
  ],
  "Gandhidham": [
    { name: "Miraj Cinemas, Tagore Road", address: "Tagore Road, Gandhidham", locality: "Tagore Road", rating: 4.6 },
    { name: "Rajhans Cinemas, Oslo Circle", address: "Oslo Circle, Gandhidham", locality: "Oslo Circle", rating: 4.5 }
  ],
  "Anand": [
    { name: "INOX Maruti Solaris Mall, Grid Road", address: "Maruti Solaris Mall, Grid Road, Anand", locality: "Grid Road", rating: 4.6 },
    { name: "City Pulse, Vidyanagar Road", address: "Vidyanagar Road, Anand", locality: "Vidyanagar Road", rating: 4.5 }
  ],
  "Navsari": [
    { name: "Rajhans Cinemas, Lunsikui", address: "Lunsikui, Navsari", locality: "Lunsikui", rating: 4.6 },
    { name: "Royal Cinema, Station Road", address: "Station Road, Navsari", locality: "Station Road", rating: 4.4 }
  ],
  "Morbi": [
    { name: "Galaxy Cinema, Sanala Road", address: "Sanala Road, Morbi", locality: "Sanala Road", rating: 4.5 },
    { name: "Shivam Multiplex, Ravapar Road", address: "Ravapar Road, Morbi", locality: "Ravapar Road", rating: 4.4 }
  ],
  "Nadiad": [
    { name: "INOX Vaishno Devi Mall, College Road", address: "Vaishno Devi Mall, College Road, Nadiad", locality: "College Road", rating: 4.6 },
    { name: "Alka Talkies, Station Road", address: "Station Road, Nadiad", locality: "Station Road", rating: 4.4 }
  ],
  "Surendranagar": [
    { name: "Trimurti Cinema, 80 Feet Road", address: "80 Feet Road, Surendranagar", locality: "80 Feet Road", rating: 4.5 },
    { name: "City Cinema, Wadhwan Road", address: "Wadhwan Road, Surendranagar", locality: "Wadhwan Road", rating: 4.4 }
  ],
  "Bharuch": [
    { name: "INOX Shalimar Mall, Link Road", address: "Shalimar Mall, Link Road, Bharuch", locality: "Link Road", rating: 4.6 },
    { name: "City Center Cinemas, Zadeshwar Road", address: "Zadeshwar Road, Bharuch", locality: "Zadeshwar Road", rating: 4.4 }
  ],
  "Porbandar": [
    { name: "Natraj Cinema, MG Road", address: "MG Road, Porbandar", locality: "MG Road", rating: 4.4 },
    { name: "Rajkamal Theatre, SV Road", address: "SV Road, Porbandar", locality: "SV Road", rating: 4.4 }
  ],
  "Mehsana": [
    { name: "Wide Angle Cinemas, Radhanpur Road", address: "Radhanpur Road, Mehsana", locality: "Radhanpur Road", rating: 4.6 },
    { name: "Raj Cinema, Modhera Road", address: "Modhera Road, Mehsana", locality: "Modhera Road", rating: 4.4 }
  ],
  "Bhuj": [
    { name: "Miraj Cinemas, Station Road", address: "Station Road, Bhuj", locality: "Station Road", rating: 4.6 },
    { name: "City Center Cinema, Hospital Road", address: "Hospital Road, Bhuj", locality: "Hospital Road", rating: 4.4 }
  ],
  "Vapi": [
    { name: "Carnival Cinemas, GIDC Char Rasta", address: "GIDC Char Rasta, Vapi", locality: "GIDC Char Rasta", rating: 4.5 },
    { name: "Empress Mall Cinemas, Daman Road", address: "Daman Road, Vapi", locality: "Daman Road", rating: 4.5 }
  ],
  "Valsad": [
    { name: "Madhuvan Multiplex, Tithal Road", address: "Tithal Road, Valsad", locality: "Tithal Road", rating: 4.5 },
    { name: "Royal Cinema, Station Road", address: "Station Road, Valsad", locality: "Station Road", rating: 4.4 }
  ],

  // --- DELHI NCR & NORTH INDIA ---
  "Delhi NCR": [
    { name: "PVR Director's Cut, Ambience Mall, Vasant Kunj", address: "Ambience Mall, Vasant Kunj, New Delhi", locality: "Vasant Kunj", rating: 4.9 },
    { name: "INOX Select CITYWALK, Saket", address: "District Centre, Saket, New Delhi", locality: "Saket (Select Citywalk)", rating: 4.8 },
    { name: "PVR Plaza, Connaught Place", address: "Block H, Connaught Place, New Delhi", locality: "Connaught Place", rating: 4.7 },
    { name: "Delite Cinema, Asaf Ali Road", address: "Asaf Ali Road, Delhi Gate, New Delhi", locality: "Nehru Place", rating: 4.7 },
    { name: "Cinepolis, DLF Avenue, Saket", address: "DLF Avenue, Saket, New Delhi", locality: "Saket (Select Citywalk)", rating: 4.8 }
  ],
  "New Delhi": [
    { name: "PVR Rivoli, Regal Building, Connaught Place", address: "Regal Building, Connaught Place, New Delhi", locality: "Connaught Place", rating: 4.7 },
    { name: "PVR ECX, Chanakyapuri", address: "Sangam Courtyard, RK Puram, Chanakyapuri, New Delhi", locality: "Chanakyapuri", rating: 4.8 },
    { name: "Liberty Cinema, Karol Bagh", address: "19-B, Rohtak Rd, Karol Bagh, New Delhi", locality: "Karol Bagh", rating: 4.6 }
  ],
  "Noida": [
    { name: "Wave Cinemas, DLF Mall of India, Sector 18", address: "Sector 18, Noida", locality: "Sector 18 (DLF Mall)", rating: 4.8 },
    { name: "PVR Superplex, Logix City Centre, Sector 32", address: "Logix City Centre, Sector 32, Noida", locality: "Logix Mall Sector 32", rating: 4.8 },
    { name: "Cinepolis, The Grand Venice Mall", address: "Grand Venice Mall, Greater Noida Expressway, Noida", locality: "Sector 62", rating: 4.7 }
  ],
  "Greater Noida": [
    { name: "MovieMax, Gaur City Mall, Greater Noida West", address: "Gaur City Mall, Greater Noida West", locality: "Gaur City", rating: 4.7 },
    { name: "INOX MSX Mall, Site 4", address: "MSX Mall, Site 4, Greater Noida", locality: "Pari Chowk", rating: 4.6 }
  ],
  "Gurugram": [
    { name: "PVR Ambience Mall, NH-8", address: "Ambience Mall, NH-8, Gurugram", locality: "Ambience Mall", rating: 4.9 },
    { name: "INOX Ardee Mall, Sector 52", address: "Ardee Mall, Sector 52, Gurugram", locality: "Cyber Hub", rating: 4.7 },
    { name: "Cinepolis, Airia Mall, Sector 68", address: "Airia Mall, Sector 68, Gurugram", locality: "Sohna Road", rating: 4.7 }
  ],
  "Faridabad": [
    { name: "INOX Crown Interiorz Mall, Mathura Road", address: "Crown Interiorz Mall, Mathura Road, Faridabad", locality: "Crown Interiorz Mall", rating: 4.7 },
    { name: "PVR Silver City, Sector 12", address: "Silver City Mall, Sector 12, Faridabad", locality: "Sector 12", rating: 4.6 }
  ],
  "Ghaziabad": [
    { name: "MovieMax, Pacific Mall, Sahibabad", address: "Pacific Mall, Anand Vihar Border, Sahibabad, Ghaziabad", locality: "Kaushambi", rating: 4.7 },
    { name: "Wave Cinemas, Kaushambi", address: "Wave Mall, Kaushambi, Ghaziabad", locality: "Kaushambi", rating: 4.6 }
  ],
  "Lucknow": [
    { name: "PVR Phoenix United, Alambagh", address: "Phoenix United Mall, Alambagh, Lucknow", locality: "Alambagh", rating: 4.8 },
    { name: "INOX Palassio, Amar Shaheed Path", address: "Phoenix Palassio, Sector 7, Gomti Nagar Extension, Lucknow", locality: "Gomti Nagar (Phoenix Palassio)", rating: 4.9 },
    { name: "Cinepolis, One Awadh Center, Gomti Nagar", address: "One Awadh Center, Vibhuti Khand, Gomti Nagar, Lucknow", locality: "Gomti Nagar (Phoenix Palassio)", rating: 4.7 },
    { name: "Wave Cinemas, Vibhuti Khand", address: "Wave Mall, TC 54 Vibhuti Khand, Lucknow", locality: "Hazratganj", rating: 4.6 }
  ],
  "Kanpur": [
    { name: "INOX Z Square Mall, Bada Chauraha", address: "Z Square Mall, MG Marg, Bada Chauraha, Kanpur", locality: "Z Square Mall Area", rating: 4.8 },
    { name: "Rave 3, Rawatpur", address: "Parbati Bagla Road, Rawatpur, Kanpur", locality: "Civil Lines", rating: 4.6 },
    { name: "Rave Moti, Kakadeo", address: "Gutaiya, Kakadeo, Kanpur", locality: "Mall Road", rating: 4.6 }
  ],
  "Varanasi": [
    { name: "IP Sigra Cinemas, Sigra", address: "IP Mall, Sigra, Varanasi", locality: "IP Mall Sigra", rating: 4.7 },
    { name: "PVR JHV Mall, Cantonment", address: "JHV Mall, The Mall, Cantonment, Varanasi", locality: "Cantonment", rating: 4.7 },
    { name: "IP Vijaya Mall, Bhelupur", address: "IP Vijaya Mall, Bhelupur, Varanasi", locality: "Bhelupur", rating: 4.5 }
  ],
  "Agra": [
    { name: "Wave Cinemas, Sanjay Place", address: "Sanjay Place, Agra", locality: "Sanjay Place", rating: 4.7 },
    { name: "Sarv Multiplex, Fatehabad Road", address: "Fatehabad Road, Agra", locality: "Fatehabad Road", rating: 4.6 }
  ],
  "Prayagraj (Allahabad)": [
    { name: "PVR Vinayak City Centre, Civil Lines", address: "Vinayak City Centre, MG Marg, Civil Lines, Prayagraj", locality: "Civil Lines", rating: 4.7 },
    { name: "Palace Cinema, Civil Lines", address: "Civil Lines, Prayagraj", locality: "Civil Lines", rating: 4.5 }
  ],
  "Meerut": [
    { name: "Wave Cinemas, Shopprix Mall, Delhi Road", address: "Shopprix Mall, Delhi Road, Meerut", locality: "Garh Road", rating: 4.6 },
    { name: "PVR Melange Mall, Pallavpuram", address: "Melange Mall, Delhi-Dehradun Bypass, Meerut", locality: "Roorkee Road", rating: 4.6 }
  ],
  "Bareilly": [
    { name: "PVR Phoenix United, Pilibhit Bypass", address: "Phoenix United Mall, Pilibhit Bypass Road, Bareilly", locality: "Phoenix United Mall Area", rating: 4.7 },
    { name: "Prasad Cinema, Civil Lines", address: "Civil Lines, Bareilly", locality: "Civil Lines", rating: 4.4 }
  ],
  "Aligarh": [
    { name: "Great Value Mall Cinemas, Ramghat Road", address: "Great Value Mall, Ramghat Road, Aligarh", locality: "Ramghat Road", rating: 4.6 },
    { name: "Vadra Cinema, Centre Point", address: "Centre Point, Aligarh", locality: "Center Point", rating: 4.4 }
  ],
  "Moradabad": [
    { name: "Wave Cinemas, Ram Ganga Vihar", address: "Wave Mall, Ram Ganga Vihar, Moradabad", locality: "Wave Mall Area", rating: 4.6 },
    { name: "PVR Moradabad, Delhi Road", address: "Delhi Road, Moradabad", locality: "Delhi Road", rating: 4.5 }
  ],
  "Saharanpur": [
    { name: "Chitra Cinema, Court Road", address: "Court Road, Saharanpur", locality: "Court Road", rating: 4.5 },
    { name: "Shakumbhari Cinemas, Delhi Road", address: "Delhi Road, Saharanpur", locality: "Delhi Road", rating: 4.4 }
  ],
  "Gorakhpur": [
    { name: "AD Mall Cinemas, Golghar", address: "AD Mall, Golghar, Gorakhpur", locality: "Golghar", rating: 4.6 },
    { name: "City Mall Multiplex, Park Road", address: "City Mall, Park Road, Gorakhpur", locality: "City Mall Area", rating: 4.5 }
  ],
  "Ayodhya": [
    { name: "Pushpraj Cinema, Civil Lines", address: "Civil Lines, Ayodhya-Faizabad", locality: "Civil Lines", rating: 4.5 },
    { name: "Devi Chitramandir, Rekabganj", address: "Rekabganj Road, Ayodhya-Faizabad", locality: "Faizabad Road", rating: 4.4 }
  ],
  "Jhansi": [
    { name: "Natraj Cinema, Elite Crossing", address: "Elite Crossing, Civil Lines, Jhansi", locality: "Elite Crossing", rating: 4.5 },
    { name: "Khilona Cinema, Civil Lines", address: "Civil Lines, Jhansi", locality: "Civil Lines", rating: 4.4 }
  ],
  "Mathura": [
    { name: "Gold Cinema, Highway Plaza, Krishna Nagar", address: "Highway Plaza, Delhi-Agra Highway, Krishna Nagar, Mathura", locality: "Krishna Nagar", rating: 4.6 },
    { name: "Brijwasi Cinema, Dampier Nagar", address: "Dampier Nagar, Mathura", locality: "Dampier Nagar", rating: 4.4 }
  ],

  // --- RAJASTHAN ---
  "Jaipur": [
    { name: "Raj Mandir Cinema, Bhagwan Das Road", address: "Bhagwan Das Road, C-Scheme, Jaipur", locality: "C-Scheme", rating: 4.9 },
    { name: "INOX Crystal Palm, Sardar Patel Marg", address: "Crystal Palm Mall, Sardar Patel Marg, C-Scheme, Jaipur", locality: "C-Scheme", rating: 4.7 },
    { name: "Cinepolis, World Trade Park, Malviya Nagar", address: "World Trade Park, JLN Marg, Malviya Nagar, Jaipur", locality: "World Trade Park (Malviya Nagar)", rating: 4.8 },
    { name: "Entertainment Paradise (EP), JLN Marg", address: "JLN Marg, Durgapura, Jaipur", locality: "Tonk Road", rating: 4.7 }
  ],
  "Jodhpur": [
    { name: "INOX Blue City Mall, Residency Road", address: "Blue City Mall, Residency Road, Jodhpur", locality: "Circuit House Road", rating: 4.7 },
    { name: "Nasrani Cinema, Chopasni Road", address: "Chopasni Road, Jodhpur", locality: "Sardarpura", rating: 4.5 }
  ],
  "Kota": [
    { name: "INOX City Mall, Jhalawar Road", address: "City Mall, Jhalawar Road, Kota", locality: "City Mall Area", rating: 4.7 },
    { name: "PVR Cinemall, Station Road", address: "Cinemall, Station Road, Kota", locality: "Gumanpura", rating: 4.5 }
  ],
  "Bikaner": [
    { name: "Suraj Cinema, Rani Bazar", address: "Rani Bazar, Bikaner", locality: "Rani Bazar", rating: 4.5 },
    { name: "Prakash Cinema, KEM Road", address: "KEM Road, Bikaner", locality: "Station Road", rating: 4.4 }
  ],
  "Ajmer": [
    { name: "INOX Mittal Mega Mall, Prithviraj Marg", address: "Mittal Mega Mall, Prithviraj Marg, Ajmer", locality: "Panchsheel Nagar", rating: 4.6 },
    { name: "Maya Mandir Cinema, Station Road", address: "Station Road, Ajmer", locality: "Civil Lines", rating: 4.4 }
  ],
  "Udaipur": [
    { name: "INOX Lake City Mall, University Road", address: "Lake City Mall, University Road, Udaipur", locality: "Celebration Mall Area", rating: 4.7 },
    { name: "PVR Celebration Mall, Bhuwana", address: "Celebration Mall, Bhuwana, Udaipur", locality: "Bhuwana", rating: 4.8 }
  ],
  "Bhilwara": [
    { name: "INOX City Centre, Subhash Nagar", address: "Subhash Nagar, Bhilwara", locality: "Subhash Nagar", rating: 4.6 },
    { name: "Pratap Talkies, Bhopal Ganj", address: "Bhopal Ganj, Bhilwara", locality: "Bhopal Ganj", rating: 4.4 }
  ],
  "Alwar": [
    { name: "Movie Time, Manu Marg", address: "Manu Marg, Alwar", locality: "Manu Marg", rating: 4.5 },
    { name: "Capital Mall Cinemas, Delhi Road", address: "Delhi Road, Alwar", locality: "Delhi Road", rating: 4.5 }
  ],
  "Bharatpur": [
    { name: "Apsara Cinema, Circular Road", address: "Circular Road, Bharatpur", locality: "Circular Road", rating: 4.5 },
    { name: "Ganga Mandir Talkies, Kumher Gate", address: "Kumher Gate, Bharatpur", locality: "Kumher Gate", rating: 4.4 }
  ],
  "Sikar": [
    { name: "Goyal Cinema, Station Road", address: "Station Road, Sikar", locality: "Station Road", rating: 4.5 },
    { name: "Radhika Multiplex, Piprali Road", address: "Piprali Road, Sikar", locality: "Piprali Road", rating: 4.4 }
  ],

  // --- PUNJAB, HARYANA, CHANDIGARH, HP, J&K, UK ---
  "Chandigarh": [
    { name: "PVR Elante Mall, Industrial Area Phase 1", address: "Elante Mall, Industrial Area Phase 1, Chandigarh", locality: "Elante Mall (Industrial Area)", rating: 4.8 },
    { name: "Cinepolis, Bestech Square Mall, Mohali", address: "Bestech Square Mall, Sector 66, Mohali", locality: "Sector 35", rating: 4.7 },
    { name: "Neelam Cinema, Sector 17", address: "Sector 17, Chandigarh", locality: "Sector 17", rating: 4.6 }
  ],
  "Ludhiana": [
    { name: "PVR Pavilion Mall, Civil Lines", address: "Pavilion Mall, Old Session Court, Civil Lines, Ludhiana", locality: "Civil Lines", rating: 4.7 },
    { name: "Cinepolis, MBD Neopolis Mall, Ferozepur Road", address: "MBD Neopolis Mall, Ferozepur Road, Ludhiana", locality: "Ferozepur Road", rating: 4.8 }
  ],
  "Amritsar": [
    { name: "INOX Trilium Mall, Circular Road", address: "Trilium Mall, Circular Road, Amritsar", locality: "Trillium Mall Area", rating: 4.8 },
    { name: "Cinepolis, Mall of Amritsar, GT Road", address: "Mall of Amritsar, GT Road, Amritsar", locality: "Mall of Amritsar", rating: 4.7 }
  ],
  "Jalandhar": [
    { name: "PVR Curo High Street, 66 Feet Road", address: "Curo High Street, 66 Feet Road, Jalandhar", locality: "Curo High Street", rating: 4.7 },
    { name: "INOX BMC Chowk, GT Road", address: "BMC Chowk, GT Road, Jalandhar", locality: "BMC Chowk", rating: 4.6 }
  ],
  "Patiala": [
    { name: "PVR Omaxe Mall, Mall Road", address: "Omaxe Mall, Mall Road, Patiala", locality: "Omaxe Mall Area", rating: 4.7 },
    { name: "Phul Cinema, The Mall", address: "The Mall, Patiala", locality: "The Mall", rating: 4.4 }
  ],
  "Bathinda": [
    { name: "Mittal City Mall PVR, Goniana Road", address: "Mittal City Mall, Goniana Road, Bathinda", locality: "Mittal Mall Area", rating: 4.6 },
    { name: "City Center Cinema, Civil Lines", address: "Civil Lines, Bathinda", locality: "Civil Lines", rating: 4.4 }
  ],
  "Mohali": [
    { name: "PVR CP67 Mall, Sector 67", address: "CP67 Mall, International Airport Road, Sector 67, Mohali", locality: "CP67 Mall (Sector 67)", rating: 4.8 },
    { name: "Cinepolis Bestech Square, Sector 66", address: "Sector 66, Mohali", locality: "Phase 3B2", rating: 4.7 }
  ],
  "Panchkula": [
    { name: "PVR Shalimar Mega Mall, Sector 5", address: "Shalimar Mega Mall, Sector 5, Panchkula", locality: "Sector 5", rating: 4.6 },
    { name: "Inox City Centre, Sector 14", address: "Sector 14, Panchkula", locality: "Sector 8", rating: 4.6 }
  ],
  "Panipat": [
    { name: "PVR Mittal Mega Mall, Sector 25", address: "Mittal Mega Mall, Sector 25, Panipat", locality: "GT Road", rating: 4.6 },
    { name: "Movie Time, Grand Trunk Road", address: "GT Road, Panipat", locality: "Model Town", rating: 4.5 }
  ],
  "Ambala": [
    { name: "INOX Galaxy Mall, Ambala Cantt", address: "Galaxy Mall, Ambala Cantt", locality: "Ambala Cantt", rating: 4.6 },
    { name: "Chaman Cinema, Prem Nagar", address: "Prem Nagar, Ambala", locality: "Prem Nagar", rating: 4.4 }
  ],
  "Karnal": [
    { name: "Movie Time, Super Mall, Sector 12", address: "Super Mall, Sector 12, Karnal", locality: "Sector 12", rating: 4.6 },
    { name: "Balaji Cinema, Kunjpura Road", address: "Kunjpura Road, Karnal", locality: "Kunjpura Road", rating: 4.4 }
  ],
  "Rohtak": [
    { name: "Sheetal Cinema, Delhi Road", address: "Delhi Road, Rohtak", locality: "Delhi Road", rating: 4.5 },
    { name: "Merion Cinema, Model Town", address: "Model Town, Rohtak", locality: "Model Town", rating: 4.4 }
  ],
  "Hisar": [
    { name: "Sun City Multiplex, Delhi Road", address: "Delhi Road, Hisar", locality: "Delhi Road", rating: 4.6 },
    { name: "Big Cinemas, Urban Estate II", address: "Urban Estate II, Hisar", locality: "Urban Estate II", rating: 4.4 }
  ],
  "Sonipat": [
    { name: "Movie Time, Subhash Chowk", address: "Subhash Chowk, Sonipat", locality: "Subhash Chowk", rating: 4.5 },
    { name: "PVR Jindal City Centre, Sector 14", address: "Sector 14, Sonipat", locality: "Sector 14", rating: 4.6 }
  ],
  "Dehradun": [
    { name: "PVR Pacific Mall, Rajpur Road", address: "Pacific Mall, Rajpur Road, Jakhan, Dehradun", locality: "Rajpur Road (Pacific Mall)", rating: 4.8 },
    { name: "Silver City Multiplex, Rajpur Road", address: "Rajpur Road, Dehradun", locality: "Astley Hall", rating: 4.6 },
    { name: "Centrio Mall PVR, Hathibarkala", address: "Centrio Mall, Rabindranath Tagore Marg, Hathibarkala, Dehradun", locality: "Clock Tower Area", rating: 4.8 }
  ],
  "Haridwar": [
    { name: "Wave Cinemas, Pentagon Mall, SIDCUL", address: "Pentagon Mall, SIDCUL, Haridwar", locality: "BHEL Township", rating: 4.6 },
    { name: "Chitra Cinema, Railway Road", address: "Railway Road, Haridwar", locality: "Jwalapur", rating: 4.4 }
  ],
  "Rishikesh": [
    { name: "Rama Palace Cinema, Dehradun Road", address: "Dehradun Road, Rishikesh", locality: "Dehradun Road", rating: 4.5 }
  ],
  "Roorkee": [
    { name: "Grand RR Cinemas, Civil Lines", address: "Civil Lines, Roorkee", locality: "Civil Lines", rating: 4.5 },
    { name: "Prakash Cinema, Delhi Road", address: "Delhi Road, Roorkee", locality: "Delhi Road", rating: 4.4 }
  ],
  "Haldwani": [
    { name: "PVR Walkway Mall, Nainital Road", address: "Walkway Mall, Nainital Road, Haldwani", locality: "Nainital Road", rating: 4.7 },
    { name: "Shail Cinema, Tikonia", address: "Tikonia, Haldwani", locality: "Tikonia", rating: 4.4 }
  ],
  "Shimla": [
    { name: "Shahi Theatre, The Mall", address: "The Mall, Shimla", locality: "The Mall", rating: 4.6 },
    { name: "Ritz Cinema, The Ridge", address: "The Ridge, Shimla", locality: "The Mall", rating: 4.5 }
  ],
  "Dharamshala": [
    { name: "Maximus Mall Cinemas, Civil Lines", address: "Maximus Mall, Civil Lines, Dharamshala", locality: "Civil Lines", rating: 4.6 }
  ],
  "Mandi": [
    { name: "Indira Cinema, Victoria Bridge Area", address: "Victoria Bridge Area, Mandi", locality: "Victoria Bridge Area", rating: 4.4 }
  ],
  "Solan": [
    { name: "Solan Cinema, Mall Road", address: "Mall Road, Solan", locality: "Mall Road", rating: 4.4 }
  ],
  "Srinagar": [
    { name: "INOX Shivpora, Badami Bagh Cantonment", address: "Shivpora, Badami Bagh Cantonment, Srinagar", locality: "Shivpora (INOX Cinema)", rating: 4.8 },
    { name: "Broadway Cinema, Lal Chowk", address: "Lal Chowk, Srinagar", locality: "Lal Chowk", rating: 4.5 }
  ],
  "Jammu": [
    { name: "Wave Cinemas, Channi Himmat", address: "Wave Mall, Bye-Pass Road, Channi Himmat, Jammu", locality: "Wave Mall (Channi Himmat)", rating: 4.7 },
    { name: "KC PVR Cinemas, Bakshi Nagar", address: "Bakshi Nagar, Jammu", locality: "Bahu Plaza", rating: 4.6 },
    { name: "Apsara Theatre, Gandhinagar", address: "Gandhinagar, Jammu", locality: "Gandhi Nagar", rating: 4.5 }
  ],

  // --- MADHYA PRADESH & CHHATTISGARH ---
  "Indore": [
    { name: "INOX C21 Mall, AB Road", address: "C21 Mall, AB Road, Scheme 54, Indore", locality: "C21 Mall Area", rating: 4.8 },
    { name: "PVR Treasure Island, MG Road", address: "Treasure Island Mall, MG Road, Indore", locality: "Treasure Island (MG Road)", rating: 4.8 },
    { name: "Cinepolis, Mangal City Mall, Vijay Nagar", address: "Mangal City Mall, Vijay Nagar, Indore", locality: "Vijay Nagar", rating: 4.7 }
  ],
  "Bhopal": [
    { name: "Cinepolis, DB City Mall, MP Nagar", address: "DB City Mall, Hoshangabad Road, MP Nagar, Bhopal", locality: "DB City Mall (Arera Hills)", rating: 4.8 },
    { name: "INOX Aashima Mall, Hoshangabad Road", address: "Aashima The Lake City Mall, Hoshangabad Road, Bhopal", locality: "Hoshangabad Road", rating: 4.7 },
    { name: "Bharat Cinema, Hamidia Road", address: "Hamidia Road, Bhopal", locality: "New Market", rating: 4.5 }
  ],
  "Jabalpur": [
    { name: "Movie Time, South Avenue Mall, Narmada Road", address: "South Avenue Mall, Narmada Road, Jabalpur", locality: "South Avenue Mall", rating: 4.7 },
    { name: "Samdariya Multiplex, Civic Center", address: "Samdariya Mall, Civic Center, Marhatal, Jabalpur", locality: "Civil Lines", rating: 4.6 }
  ],
  "Gwalior": [
    { name: "INOX DB City Mall, Race Course Road", address: "DB City Mall, Race Course Road, Gwalior", locality: "City Center", rating: 4.7 },
    { name: "PVR Deendayal City Mall, Lashkar", address: "Deendayal City Mall, Lashkar, Gwalior", locality: "Lashkar", rating: 4.6 }
  ],
  "Ujjain": [
    { name: "PVR Cosmos Mall, Nanakheda", address: "Cosmos Mall, Nanakheda, Ujjain", locality: "Nana Kheda", rating: 4.7 },
    { name: "Prakash Cinema, Freeganj", address: "Freeganj, Ujjain", locality: "Freeganj", rating: 4.4 }
  ],
  "Sagar": [
    { name: "Kirti Multiplex, Civil Lines", address: "Civil Lines, Sagar", locality: "Civil Lines", rating: 4.5 },
    { name: "Natraj Cinema, Katra", address: "Katra, Sagar", locality: "Katra", rating: 4.4 }
  ],
  "Dewas": [
    { name: "Abhinav Cinema, AB Road", address: "AB Road, Dewas", locality: "AB Road", rating: 4.5 }
  ],
  "Satna": [
    { name: "Carnival Cinemas, Rewa Road", address: "Rewa Road, Satna", locality: "Rewa Road", rating: 4.5 }
  ],
  "Ratlam": [
    { name: "Lokendra Cinema, Station Road", address: "Station Road, Ratlam", locality: "Station Road", rating: 4.4 }
  ],
  "Rewa": [
    { name: "PVR Samadhan Mall, College Road", address: "College Road, Rewa", locality: "College Road", rating: 4.6 }
  ],
  "Raipur": [
    { name: "PVR Magneto The Mall, Labhandi", address: "Magneto The Mall, GE Road, Labhandi, Raipur", locality: "Magneto Mall (GE Road)", rating: 4.8 },
    { name: "INOX City Mall 36, VIP Road", address: "City Mall 36, VIP Road, Telibandha, Raipur", locality: "Telibandha", rating: 4.7 },
    { name: "Colors Mall Multiplex, Pachpedi Naka", address: "Colors Mall, Pachpedi Naka, Raipur", locality: "Pandri", rating: 4.6 }
  ],
  "Bhilai": [
    { name: "PVR Surya Treasure Island Mall, Junwani Road", address: "Surya Treasure Island Mall, Junwani Road, Bhilai", locality: "Surya Treasure Island Mall", rating: 4.7 },
    { name: "Chandra Cinema, Power House", address: "Power House Area, Bhilai", locality: "Power House Area", rating: 4.4 }
  ],
  "Bilaspur": [
    { name: "Rama Magneto Mall PVR, Shrikant Verma Marg", address: "Rama Magneto Mall, Shrikant Verma Marg, Bilaspur", locality: "Rama Magneto Mall", rating: 4.7 },
    { name: "36 City Mall INOX, Mangla Chowk", address: "36 City Mall, Mangla Chowk, Bilaspur", locality: "Link Road", rating: 4.6 }
  ],
  "Korba": [
    { name: "Palm Mall Cinemas, Transport Nagar", address: "Palm Mall, Transport Nagar, Korba", locality: "Transport Nagar", rating: 4.5 }
  ],
  "Durg": [
    { name: "Apsara Cinema, Station Road", address: "Station Road, Durg", locality: "Station Road", rating: 4.4 }
  ],

  // --- WEST BENGAL, ODISHA, BIHAR, JHARKHAND ---
  "Kolkata": [
    { name: "PVR Mani Square Mall, EM Bypass", address: "Mani Square Mall, 164/1 Maniktala Main Road, EM Bypass, Kolkata", locality: "Mani Square (EM Bypass)", rating: 4.8 },
    { name: "INOX Forum Mall, Elgin Road", address: "Forum Mall, 10/3 Elgin Road, Kolkata", locality: "Quest Mall (Park Circus)", rating: 4.8 },
    { name: "Priya Cinema 4K Atmos, Deshapriya Park", address: "95, Rash Behari Ave, Deshapriya Park, Kolkata", locality: "South City Mall", rating: 4.7 },
    { name: "INOX South City Mall, Prince Anwar Shah Road", address: "South City Mall, Prince Anwar Shah Road, Kolkata", locality: "South City Mall", rating: 4.9 },
    { name: "Cinepolis, Acropolis Mall, Kasba", address: "Acropolis Mall, 1858 Rajdanga Main Road, Kasba, Kolkata", locality: "Salt Lake Sector V", rating: 4.7 }
  ],
  "Howrah": [
    { name: "INOX Forum Rangoli Mall, Belur", address: "Forum Rangoli Mall, Girish Ghosh Road, Belur, Howrah", locality: "Bally", rating: 4.7 },
    { name: "Miraj Cinemas, Shalimar", address: "Shalimar, Howrah", locality: "Shibpur", rating: 4.5 },
    { name: "PVR Avani Riverside Mall, Shibpur", address: "Avani Riverside Mall, Jagat Banerjee Ghat Road, Shibpur, Howrah", locality: "Avani Riverside Mall", rating: 4.7 }
  ],
  "Siliguri": [
    { name: "INOX City Centre, Matigara", address: "City Centre, Uttorayon, Matigara, Siliguri", locality: "City Centre Siliguri (Uttorayon)", rating: 4.7 },
    { name: "PVR Vega Circle Mall, Sevoke Road", address: "Vega Circle Mall, Sevoke Road, Siliguri", locality: "Cosmos Mall (Sevoke Road)", rating: 4.8 }
  ],
  "Durgapur": [
    { name: "Carnival Cinemas, Fortune Plaza", address: "Fortune Plaza, City Centre, Durgapur", locality: "City Centre", rating: 4.6 },
    { name: "Bioscope, Junction Mall, City Centre", address: "Junction Mall, City Centre, Durgapur", locality: "Junction Mall", rating: 4.7 }
  ],
  "Asansol": [
    { name: "INOX Sentrum Mall, Shristi Nagar", address: "Sentrum Mall, Shristi Nagar, Asansol", locality: "Court Road", rating: 4.7 },
    { name: "Carnival Cinemas, Galaxy Mall, Burnpur Road", address: "Galaxy Mall, Burnpur Road, Asansol", locality: "Galaxy Mall", rating: 4.6 }
  ],
  "Kharagpur": [
    { name: "Aurora Cinema, Golbazar", address: "Golbazar, Kharagpur", locality: "Golbazar", rating: 4.4 },
    { name: "Bombay Cinema, Malancha", address: "Malancha, Kharagpur", locality: "Malancha", rating: 4.4 }
  ],
  "Bardhaman": [
    { name: "Burdwan Cinema, Curzon Gate Area", address: "Curzon Gate Area, Bardhaman", locality: "Curzon Gate Area", rating: 4.5 },
    { name: "Nataraj Cinema, GT Road", address: "GT Road, Bardhaman", locality: "GT Road", rating: 4.4 }
  ],
  "Bhubaneswar": [
    { name: "INOX Bhawani Mall, Saheed Nagar", address: "Bhawani Mall, Saheed Nagar, Bhubaneswar", locality: "Saheed Nagar", rating: 4.7 },
    { name: "Cinepolis, Esplanade One Mall, Rasulgarh", address: "Esplanade One, Rasulgarh, Bhubaneswar", locality: "Esplanade One (Rasulgarh)", rating: 4.9 },
    { name: "Maharaja Picture Palace, Acharya Vihar", address: "Acharya Vihar, Bhubaneswar", locality: "Nayapalli", rating: 4.6 },
    { name: "Keshari Talkies, Kharvel Nagar", address: "Kharvel Nagar, Janpath, Bhubaneswar", locality: "Janpath", rating: 4.5 }
  ],
  "Cuttack": [
    { name: "INOX SGBL Square One Mall, Bajrakabati Road", address: "SGBL Square One Mall, Bajrakabati Road, Cuttack", locality: "Badambadi", rating: 4.7 },
    { name: "Grand Cinema, Badambadi", address: "Badambadi, Cuttack", locality: "Badambadi", rating: 4.5 }
  ],
  "Rourkela": [
    { name: "PVR Forum Galleria Mall, Civil Township", address: "Forum Galleria Mall, Civil Township, Rourkela", locality: "Civil Township", rating: 4.7 },
    { name: "Uma Cinema, Bisra Road", address: "Bisra Road, Rourkela", locality: "Panposh Road", rating: 4.4 }
  ],
  "Berhampur": [
    { name: "Rukmini Cinema, Giri Market", address: "Giri Market, Berhampur", locality: "Old Bus Stand Area", rating: 4.5 },
    { name: "Penta Cinema, Tata Benz Square", address: "Tata Benz Square, Berhampur", locality: "Gandhi Nagar", rating: 4.5 }
  ],
  "Sambalpur": [
    { name: "Ashoka Cinema, VSS Marg", address: "VSS Marg, Sambalpur", locality: "VSS Marg", rating: 4.5 },
    { name: "Gaiety Talkies, Fatak", address: "Fatak, Sambalpur", locality: "Fatak", rating: 4.4 }
  ],
  "Puri": [
    { name: "Laxmi Talkies, Grand Road", address: "Grand Road, Puri", locality: "Grand Road", rating: 4.5 },
    { name: "Jagannath Cinema, Badadanda", address: "Badadanda, Puri", locality: "Sea Beach Area", rating: 4.4 }
  ],
  "Patna": [
    { name: "Cinepolis, P&M Mall, Patliputra Colony", address: "P&M Mall, Patliputra Kurji Road, Patna", locality: "P&M Mall (Patliputra)", rating: 4.8 },
    { name: "Mona Cinema, Gandhi Maidan", address: "East Gandhi Maidan, Patna", locality: "Fraser Road", rating: 4.6 },
    { name: "Regent Cinema, Govind Mitra Road", address: "East Gandhi Maidan, Govind Mitra Road, Patna", locality: "Bailey Road", rating: 4.6 }
  ],
  "Gaya": [
    { name: "Paradise Cinema, GB Road", address: "GB Road, Gaya", locality: "GB Road", rating: 4.5 },
    { name: "Carnival Cinemas, AP Colony", address: "AP Colony, Gaya", locality: "AP Colony", rating: 4.5 }
  ],
  "Bhagalpur": [
    { name: "Deep Prabha Cinema, MG Road", address: "MG Road, Bhagalpur", locality: "Khalifabag", rating: 4.5 },
    { name: "Janta Cinema, Station Road", address: "Station Road, Bhagalpur", locality: "Patal Babu Road", rating: 4.4 }
  ],
  "Muzaffarpur": [
    { name: "Cinekrish Multiplex, Club Road", address: "Club Road, Mithanpura, Muzaffarpur", locality: "Club Road", rating: 4.6 },
    { name: "Shyam Cinema, Station Road", address: "Station Road, Muzaffarpur", locality: "Motijheel", rating: 4.4 }
  ],
  "Darbhanga": [
    { name: "Light House Cinema, Tower Chowk", address: "Tower Chowk, Darbhanga", locality: "Tower Chowk", rating: 4.4 },
    { name: "Sagar Multiplex, Laheriasarai", address: "Laheriasarai, Darbhanga", locality: "Laheriasarai", rating: 4.5 }
  ],
  "Purnia": [
    { name: "Rupbani Cinema, Line Bazar", address: "Line Bazar, Purnia", locality: "Line Bazar", rating: 4.4 },
    { name: "City Pride, Bhatta Bazar", address: "Bhatta Bazar, Purnia", locality: "Bhatta Bazar", rating: 4.5 }
  ],
  "Ranchi": [
    { name: "PVR Nucleus Mall, Circular Road", address: "Nucleus Mall, Circular Road, Lalpur, Ranchi", locality: "Nucleus Mall (Circular Road)", rating: 4.8 },
    { name: "Plaza Cinema, Old HB Road", address: "Old HB Road, Lalpur, Ranchi", locality: "Main Road", rating: 4.6 },
    { name: "Sujata Cinema, Main Road", address: "Main Road, Ranchi", locality: "Main Road", rating: 4.5 }
  ],
  "Jamshedpur": [
    { name: "Cinepolis, P&M Hi-Tech City Centre Mall, Bistupur", address: "P&M Hi-Tech City Centre Mall, Bistupur, Jamshedpur", locality: "P&M Hi-Tech City Mall (Bistupur)", rating: 4.8 },
    { name: "Eylex Cinemas, Mango", address: "Pardih, Mango, Jamshedpur", locality: "Sakchi", rating: 4.6 }
  ],
  "Dhanbad": [
    { name: "INOX Ozone Galleria Mall, Saraidhela", address: "Ozone Galleria Mall, Saraidhela, Dhanbad", locality: "Ozone Galleria Mall (Saraidhela)", rating: 4.7 },
    { name: "Ray Cinema, Bank More", address: "Bank More, Dhanbad", locality: "Bank More", rating: 4.4 }
  ],
  "Bokaro": [
    { name: "PVR Bokaro Mall, Sector 3", address: "Bokaro Mall, Sector 3, Bokaro Steel City", locality: "City Centre Sector 4", rating: 4.7 },
    { name: "Kala Mandir Cinema, City Centre", address: "City Centre, Sector 4, Bokaro Steel City", locality: "City Centre Sector 4", rating: 4.4 }
  ],
  "Deoghar": [
    { name: "Shiva Talkies, Tower Chowk", address: "Tower Chowk, Deoghar", locality: "Tower Chowk", rating: 4.4 }
  ],

  // --- NORTH-EAST & GOA ---
  "Guwahati": [
    { name: "PVR City Centre Mall, GS Road", address: "City Centre Mall, GS Road, Christian Basti, Guwahati", locality: "City Centre Mall (GS Road)", rating: 4.8 },
    { name: "INOX Aurus Mall, Dispur", address: "Aurus Mall, GS Road, Dispur, Guwahati", locality: "Roodraksh Mall (Bhangagarh)", rating: 4.7 },
    { name: "Cinepolis, Central Mall, Christian Basti", address: "Central Mall, GS Road, Christian Basti, Guwahati", locality: "City Centre Mall (GS Road)", rating: 4.7 },
    { name: "Anuradha Cineplex, Bamunimaidan", address: "Bamunimaidan, Guwahati", locality: "Zoo Road", rating: 4.8 }
  ],
  "Silchar": [
    { name: "Gold Digital Cinema, Premtola", address: "Premtola, Silchar", locality: "Goldighi Mall Area", rating: 4.5 },
    { name: "Orient Cinema, Central Road", address: "Central Road, Silchar", locality: "Park Road", rating: 4.4 }
  ],
  "Dibrugarh": [
    { name: "Aurora Cinema, Mancotta Road", address: "Mancotta Road, Dibrugarh", locality: "Mancotta Road", rating: 4.5 },
    { name: "Talkie Cinema, Thana Chariali", address: "Thana Chariali, Dibrugarh", locality: "Thana Chariali", rating: 4.4 }
  ],
  "Jorhat": [
    { name: "Eylex Cinemas, Gar-Ali", address: "Gar-Ali, Jorhat", locality: "Gar-Ali", rating: 4.5 }
  ],
  "Nagaon": [
    { name: "Jayashree Cinema, Haibargaon", address: "Haibargaon, Nagaon", locality: "Haibargaon", rating: 4.4 }
  ],
  "Agartala": [
    { name: "Rupasi Cinema, Akhaura Road", address: "Akhaura Road, Agartala", locality: "Akhaura Road", rating: 4.5 },
    { name: "Balaka Cinema, Melarmath", address: "Melarmath, Agartala", locality: "Melarmath", rating: 4.4 }
  ],
  "Shillong": [
    { name: "Bijou Cinema, Police Bazar", address: "Police Bazar, Shillong", locality: "Police Bazar", rating: 4.6 },
    { name: "Anjalee Cinema, Keating Road", address: "Keating Road, Shillong", locality: "Police Bazar", rating: 4.5 }
  ],
  "Imphal": [
    { name: "Friends Talkies, Paona Bazar", address: "Paona Bazar, Imphal", locality: "Paona Bazar", rating: 4.4 },
    { name: "Pratap Talkies, Thangal Bazar", address: "Thangal Bazar, Imphal", locality: "Thangal Bazar", rating: 4.4 }
  ],
  "Aizawl": [
    { name: "Aizawl City Cinemas, Zarkawt", address: "Zarkawt Main Road, Aizawl", locality: "Zarkawt", rating: 4.5 }
  ],
  "Dimapur": [
    { name: "Carnival Cinemas, Nyamo Lotha Road", address: "Nyamo Lotha Road, Dimapur", locality: "Nyamo Lotha Road", rating: 4.5 }
  ],
  "Kohima": [
    { name: "Dream Cinema, PR Hill", address: "PR Hill, Kohima", locality: "PR Hill", rating: 4.4 }
  ],
  "Gangtok": [
    { name: "Vajra Cinema, Development Area", address: "Development Area, Gangtok", locality: "Development Area", rating: 4.6 },
    { name: "Denzong Cinema, MG Marg", address: "MG Marg, Gangtok", locality: "MG Marg", rating: 4.5 }
  ],
  "Itanagar": [
    { name: "Ganga Cinema, Ganga Market", address: "Ganga Market, Itanagar", locality: "Ganga Market", rating: 4.4 }
  ],
  "Panaji": [
    { name: "INOX Panjim, Old GMC Heritage Complex, Campal", address: "Old GMC Heritage Complex, Campal, Panaji", locality: "Inox Multiplex (Campal)", rating: 4.8 },
    { name: "Samrat Cinema, MG Road", address: "MG Road, Panaji", locality: "MG Road", rating: 4.5 }
  ],
  "Margao": [
    { name: "INOX Osia Mall, Pajifond", address: "Osia Mall, Pajifond, Margao", locality: "Osia Mall Area", rating: 4.7 },
    { name: "Cine Vishant, Aquem", address: "Aquem, Margao", locality: "Aquem", rating: 4.5 }
  ],
  "Vasco da Gama": [
    { name: "1930 Vasco Cinemas, Swatantra Path", address: "Swatantra Path, Vasco da Gama", locality: "Swatantra Path", rating: 4.6 },
    { name: "Shivam Cinema, FL Gomes Road", address: "FL Gomes Road, Vasco da Gama", locality: "FL Gomes Road", rating: 4.4 }
  ]
};
