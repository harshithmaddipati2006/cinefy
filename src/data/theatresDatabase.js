// ============================================================================
// CineFy - Comprehensive Realistic Indian Cinema Theatres Database
// Supporting all 170+ cities across all States and Union Territories of India
// Real-world cinema names with NO "CineFy" prefix
// ============================================================================

import { REAL_WORLD_THEATRES, cleanTheatreName } from "./realWorldTheatresData.js";
export { cleanTheatreName };

export const THEATRE_TYPES = {
  SINGLE_SCREEN: "Standard Single-Screen Theatre",
  MODERN_MULTIPLEX: "Modern Multiplex",
  PREMIUM_MULTIPLEX: "Premium Multiplex",
  LUXURY_CINEMA: "Luxury Cinema",
  RECLINER_CINEMA: "Recliner Cinema",
  IMAX: "IMAX",
  IMAX_LASER: "IMAX Laser",
  FOUR_DX: "4DX",
  SCREEN_X: "ScreenX",
  DOLBY_ATMOS: "Dolby Atmos Auditorium",
  DOLBY_CINEMA: "Dolby Cinema-style Premium Auditorium",
  VIP_CINEMA: "VIP Cinema",
  BOUTIQUE_CINEMA: "Boutique Cinema",
  LARGE_FORMAT: "Large-format Auditorium",
  TRADITIONAL_REGIONAL: "Traditional Regional Cinema"
};

// Authentic localities mapped per city for realistic Indian theatre addresses
export const CITY_LOCALITIES = {
  // Andhra Pradesh
  "Tenali": ["Station Road", "Bose Road", "Morrispet", "Ganganamma Temple St", "Chenchupet", "Nazarpet"],
  "Guntur": ["Brodipet", "Arundelpet", "Lakshmipuram", "Kothapet", "Collector Office Road", "Amaravathi Road"],
  "Vijayawada": ["Benz Circle", "Governorpet", "MG Road", "One Town", "Bhavanipuram", "Labbipet", "Patamata"],
  "Visakhapatnam": ["Jagadamba Junction", "Dwaraka Nagar", "MVP Colony", "Gajuwaka", "Madhurawada", "Siripuram"],
  "Tirupati": ["Old Tiruchanoor Road", "TP Area", "Korlagunta", "AIR Bypass Road", "Bhavani Nagar"],
  "Rajahmundry": ["Danavaipeta", "Kotipalli Bus Stand", "Main Road", "Aryapuram", "Syala Junction"],
  "Kakinada": ["Cinema Road", "Main Road", "Sarpavaram", "Bhanugudi Junction", "Ramanayyapeta"],
  "Nellore": ["Trunk Road", "Vedayapalem", "Gandhi Nagar", "Podalakur Road", "Ramji Nagar"],
  "Kurnool": ["Park Road", "Birla Gate", "Nandyal Checkpost", "Mourya Inn Area", "C.Camp"],
  "Kadapa": ["Seven Roads Junction", "RIMS Road", "Nagarajupeta", "Yerramukkapalli", "Madras Road"],
  "Anantapur": ["Subhash Road", "Clock Tower Road", "Saptagiri Circle", "Tadipatry Bus Stand", "Rudrampeta"],
  "Eluru": ["Powerpet", "RR Pet", "Sanivarapupeta", "Fire Station Area", "GNT Road"],
  "Ongole": ["Kurnool Road", "Trunk Road", "Lawyerpet", "Santhapeta", "Guntur Road"],
  "Vizianagaram": ["MG Road", "Cantonment", "Mayuri Junction", "Railway Station Road", "Balaji Nagar"],
  "Srikakulam": ["Palakonda Road", "Day & Night Junction", "Seven Road", "PN Colony", "Collectorate Road"],
  "Machilipatnam": ["Konneru Center", "Frenchpet", "Rustumbada", "Chilakalapudi", "Station Road"],
  "Bhimavaram": ["J.P. Road", "Sunday Market", "Somavaram", "BVRM Town", "Housing Board Colony"],
  "Proddatur": ["Korrapadu Road", "Gandhi Road", "Cinema Street", "Bollavaram", "YMR Colony"],
  "Nandyal": ["Sanjeeva Nagar", "Railway Station Road", "Atmakur Bus Stand", "NGO Colony", "Srinivasa Nagar"],
  "Chittoor": ["High Street", "MSR Road", "Bazaar Street", "Murakambattu", "Collectorate Area"],
  "Hindupur": ["Penukonda Road", "Mukkidipeta", "Main Bazaar", "Railway Station Area", "Kotnur"],
  "Tadepalligudem": ["K.N. Road", "Subba Rao Peta", "Main Bazaar", "Station Road", "Sesha Mahal Area"],
  "Gudivada": ["Nehru Chowk", "Ganga Mahal Road", "Eluru Road", "Satyanarayanapuram", "Station Road"],
  "Narasaraopet": ["Station Road", "Palnadu Bus Stand Area", "Arundelpet", "Bazar Road", "Prakash Nagar"],
  "Mangalagiri": ["Tenali Road", "Guntur Bypass", "Main Bazaar", "Old Bus Stand", "Kalyana Mandapam Area"],
  "Amalapuram": ["Black Bridge Road", "Clock Tower Junction", "High School Road", "Reddy Street"],
  "Palakollu": ["Railway Station Road", "Kshira Ramalingeswara Temple Area", "Main Bazaar", "Brooke Bond Area"],
  "Dharmavaram": ["Station Road", "Silk Cloth Market Road", "Kala Jyothi Area", "Maruthi Nagar"],
  "Tanuku": ["R.P. Road", "Velpur Road", "Settipeta", "Sajjapuram", "Railway Feeder Road"],
  "Chirala": ["Kothapet", "GBC Road", "Clock Tower", "Muntha Vari Center", "Perala"],
  "Kavali": ["Trunk Road", "Railway Station Area", "Vengalarao Nagar", "RTC Complex Area"],
  "Bapatla": ["College Road", "Railway Station Road", "East Bapatla", "GBC Road", "Market Center"],
  "Markapur": ["Station Road", "Taraka Rama Nagar", "Clock Tower Center", "Old Town"],
  "Ponnur": ["Station Road", "Nidubrolu", "Main Bazaar", "Guntur Road", "RTC Bus Stand Area"],

  // Telangana
  "Hyderabad": ["Panjagutta", "Gachibowli", "Banjara Hills", "Kukatpally", "Hitec City", "Secunderabad", "NTR Marg", "Madhapur", "Jubilee Hills", "Dilsukhnagar"],
  "Secunderabad": ["RP Road", "Clock Tower", "Sainikpuri", "Marredpally", "Tarnaka", "Trimulgherry"],
  "Warangal": ["Nakkalagutta", "Hanamkonda", "Kazipet", "Pochamma Maidan", "Mandi Bazaar", "Hunter Road"],
  "Nizamabad": ["Khaleelwadi", "Bodhan Road", "Railway Station Area", "Phulong", "Armoor Road"],
  "Karimnagar": ["Collectorate Road", "Mukarrampura", "Kashmirgadda", "Mankammathota", "Geetha Bhavan"],
  "Khammam": ["Wyra Road", "Gandhi Chowk", "Mamillagudem", "Mustafa Nagar", "Rotary Nagar"],
  "Ramagundam": ["NTPC Area", "Godavarikhani Main Road", "Fertilizer City", "8 Incline Colony"],
  "Mahbubnagar": ["Raichur Road", "Clock Tower", "Mettugadda", "One Town", "Yenugonda"],
  "Nalgonda": ["Clock Tower Center", "Hyderabad Road", "Prakasam Bazaar", "Devarakonda Road"],
  "Adilabad": ["Cinema Road", "Bhavani Nagar", "Collectorate Complex", "Kailash Nagar"],
  "Suryapet": ["Khammam Road", "Hyderabad Bypass", "Kudakuda Road", "MG Road"],
  "Siddipet": ["Medak Road", "Old Bus Stand Area", "Mustabad Road", "Bharat Nagar"],
  "Miryalaguda": ["Sagar Road", "Railway Station Area", "Hanumanpet", "Ashok Nagar"],
  "Mancherial": ["Bellampalli Road", "IB Chowk", "Ganga Reddy Colony", "Station Road"],
  "Jagtial": ["Tower Circle", "Karimnagar Road", "Puranipet", "Vani Nagar"],
  "Nirmal": ["Mancherial Road", "Shanti Nagar", "Nataraj Nagar", "Collectorate Road"],
  "Kothagudem": ["MG Road", "Babu Camp", "Writer Basti", "Rudrampur"],
  "Kamareddy": ["Nizamabad Road", "Station Area", "Devunipally", "Housing Board"],
  "Bodhan": ["Rakaspeth", "Shakar Nagar", "Bus Stand Area", "Navi Galli"],
  "Sangareddy": ["Pothireddypally", "Collectorate Area", "Tara Degree College Road", "By-Pass"],

  // Karnataka
  "Bengaluru": ["Koramangala", "Whitefield", "Indiranagar", "Malleshwaram", "Rajajinagar", "Jayanagar", "MG Road", "Electronic City", "Bannerghatta Road"],
  "Mysuru": ["Jayalakshmipuram", "Saraswathipuram", "Devaraja Mohalla", "KRS Road", "Gokulam", "Bannimantap"],
  "Mangaluru": ["Hampankatta", "KSRTC Road", "Kadri", "Bejai", "Falnir", "Pandeshwar"],
  "Hubballi-Dharwad": ["Gokul Road", "Koppikar Road", "Vidyanagar", "PB Road", "CBT Area"],
  "Belagavi": ["College Road", "Camp Area", "Tilakwadi", "Khanapur Road", "Bogarves"],
  "Davanagere": ["MCC B Block", "PB Road", "Mandipet", "Durgambika Temple Area", "Hadadi Road"],
  "Ballari": ["Car Street", "Cantonment", "Infantry Road", "Anantapur Road", "Parvathi Nagar"],
  "Kalaburagi": ["Super Market", "Sedam Road", "Station Road", "Maktampura", "Aiwan-e-Shahi"],
  "Shivamogga": ["Nehru Road", "Durgigudi", "B.H. Road", "Vinoba Nagar", "Gopala"],
  "Tumakuru": ["BH Road", "SS Puram", "Ashok Nagar", "Batawadi", "Kunigal Road"],
  "Udupi": ["Maruthi Veethika", "Kalsanka", "Manipal Road", "Service Bus Stand Area", "Santhekatte"],
  "Bidar": ["Udgir Road", "Gumpa", "Old City", "Mailoor", "Naubad"],
  "Hosapete": ["Station Road", "Dam Road", "Patel Nagar", "College Road"],
  "Gadag": ["Pala Badami Road", "Station Road", "Mulagund Naka", "Betageri"],
  "Hassan": ["BM Road", "RC Road", "Shankarmutt", "Hassan Extension"],
  "Raichur": ["Station Road", "Lingsugur Road", "Tagore Nagar", "Ambedkar Circle"],
  "Chikkamagaluru": ["MG Road", "IG Road", "Kalyana Nagar", "Ramanahalli"],
  "Mandya": ["VV Road", "Bandigowda Layout", "Subhash Nagar", "Pes College Road"],
  "Chitradurga": ["BD Road", "Holalkere Road", "Medehalli Road", "Kelagote"],

  // Tamil Nadu
  "Chennai": ["Anna Nagar", "T. Nagar", "Royapettah", "Velachery", "Vadapalani", "Nungambakkam", "OMR", "Porur", "ECR", "Alwarpet"],
  "Coimbatore": ["RS Puram", "Gandhipuram", "Peelamedu", "Avinashi Road", "Saibaba Colony", "Race Course"],
  "Madurai": ["KK Nagar", "Anna Nagar", "Simmakkal", "Town Hall Road", "Vilangudi", "Goripalayam"],
  "Tiruchirappalli": ["Cantonment", "Thillai Nagar", "Main Guard Gate", "Srirangam", "K.K. Nagar"],
  "Salem": ["Fairlands", "Five Roads", "Meyyanur", "Cherry Road", "Alagapuram"],
  "Tirunelveli": ["Palayamkottai", "Vannarpettai", "Junction Area", "High Ground", "Tirunelveli Town"],
  "Tiruppur": ["Avinashi Road", "Kumaran Road", "Dharapuram Road", "Kangeyam Road", "Palladam Road"],
  "Vellore": ["Katpadi", "Bagayam", "Gandhi Nagar", "Officers Line", "Sathuvachari"],
  "Erode": ["Perundurai Road", "Brough Road", "Sathy Road", "Surampatti", "Moolapalayam"],
  "Thoothukudi": ["WGC Road", "Palayamkottai Road", "Millerpuram", "Cruz Puram", "Bryant Nagar"],
  "Thanjavur": ["Medical College Road", "South Rampart", "Gandhiji Road", "New Bus Stand Area"],
  "Dindigul": ["Palani Road", "Trichy Road", "Nagal Nagar", "Salai Road", "Batlagundu Road"],
  "Kanchipuram": ["Gandhi Road", "Kamarajar Street", "Nellukara Street", "Ennaikaran", "Orikkai"],
  "Nagercoil": ["Cape Road", "Court Road", "Vadasery", "Kottar", "KP Road"],
  "Cuddalore": ["Lawrence Road", "Imperial Road", "Thirupapuliyur", "Chidambaram Road"],
  "Kumbakonam": ["TSR Big Street", "John Selvaraj Nagar", "Kamarajar Road", "Nageswaran North St"],
  "Hosur": ["Denkanikottai Road", "Bangalore Road", "Rayakottai Road", "Bagalur Road"],
  "Karur": ["Kovai Road", "Jawahar Bazaar", "Vengamedu", "Thanthonimalai"],
  "Neyveli": ["Block 18", "Main Bazaar Area", "Mandarakuppam", "Gandhi Stadium Area"],

  // Kerala
  "Kochi": ["Edappally (Lulu Mall)", "MG Road", "Marine Drive", "Kakkanad", "Panampilly Nagar", "Vyttila", "Palarivattom"],
  "Thiruvananthapuram": ["MG Road", "Kazhakkoottam (Technopark)", "Pattom", "Kowdiar", "Thampanoor", "East Fort"],
  "Kozhikode": ["Mavoor Road", "Focus Mall Area", "Hilite City", "Beach Road", "Palayam"],
  "Thrissur": ["Swaraj Round", "MG Road", "East Fort", "Punkunnam", "Ayyanthole"],
  "Kollam": ["RP Mall Area", "Chinnakada", "Beach Road", "Kadappakada", "Asramam"],
  "Alappuzha": ["Boat Jetty Road", "Mullakkal", "VCSB Road", "Iron Bridge Area", "Kalarcode"],
  "Kannur": ["Fort Road", "Thana", "Caltex Junction", "South Bazaar", "Payyambalam"],
  "Palakkad": ["TB Road", "Stadium Bypass", "GB Road", "Fort Maidan Area", "Robinson Road"],
  "Kottayam": ["Kanjikuzhy", "Baker Junction", "Collectorate Area", "Nagampadam", "TB Road"],
  "Malappuram": ["Down Hill", "Up Hill", "Kottakkal Road", "Munduparamba", "Civil Station Area"],
  "Manjeri": ["Court Road", "Pandikkad Road", "Kacherippadi", "Nellipparamba"],
  "Thalassery": ["Logan's Road", "AVK Nair Road", "Guzili Street", "Kallayi Area"],
  "Kasaragod": ["Bank Road", "MG Road", "Vidyanagar", "Karanthakkad", "Nullipady"],
  "Pathanamthitta": ["College Road", "Aban Junction", "Ring Road", "St. Peters Junction"],

  // Maharashtra
  "Mumbai": ["Lower Parel", "Bandra Kurla Complex (BKC)", "Andheri West", "Nariman Point", "Juhu", "Malad West", "Kurla (Phoenix)", "Goregaon"],
  "Pune": ["Koregaon Park", "Viman Nagar (Phoenix)", "Shivajinagar", "Kothrud", "Aundh", "Hinjawadi", "Wakad", "Camp"],
  "Nagpur": ["Sitabuldi", "Dharampeth", "Empress Mall Area", "Wardha Road", "Civil Lines", "Manish Nagar"],
  "Thane": ["Viviana Mall", "Korum Mall", "Ghopbunder Road", "Panchpakhadi", "Teen Hath Naka"],
  "Nashik": ["College Road", "City Center Mall Area", "Gangapur Road", "MG Road", "Indira Nagar"],
  "Kalyan-Dombivli": ["Khadakpada", "Shivaji Chowk", "MIDC Dombivli", "Manpada Road"],
  "Vasai-Virar": ["Vasai West", "Virar West", "Evershine City", "Bolinj", "Manickpur"],
  "Aurangabad (Chhatrapati Sambhajinagar)": ["Prozone Mall Area", "Jalna Road", "Cannaught Place", "CIDCO", "Kranti Chowk"],
  "Navi Mumbai": ["Seawoods Grand Central", "Vashi", "Kharghar", "Nerul", "Belapur"],
  "Solapur": ["Hotgi Road", "Saat Rasta", "Old Pune Naka", "Murarji Peth", "Lashkar"],
  "Mira-Bhayandar": ["Mira Road East", "Beverly Park", "Bhayandar West", "Maxus Mall Area"],
  "Bhiwandi": ["Kalyan Naka", "Dhamankar Naka", "Anjur Phata", "Shanti Nagar"],
  "Amravati": ["Badnera Road", "Rajapeth", "Panchavati Square", "Gadge Nagar"],
  "Nanded": ["Vazirabad", "VIP Road", "Workshop Corner", "Station Road"],
  "Kolhapur": ["Tarabai Park", "DYP Mall Area", "Rajarampuri", "Station Road", "Rankala"],
  "Akola": ["Civil Lines", "Gorakshan Road", "Open Theatre Area", "Tower Chowk"],
  "Latur": ["Ausa Road", "Gandhi Chowk", "Barshi Road", "Mitramandal Colony"],
  "Dhule": ["Agra Road", "Deopur", "Old Agra Road", "Parola Road"],
  "Ahmednagar": ["Savedi", "Station Road", "Market Yard", "Delhi Gate"],
  "Chandrapur": ["Gandhi Chowk", "Civil Lines", "Mul Road", "Bazar Ward"],
  "Parbhani": ["Station Road", "Subhash Road", "Shivaji Nagar", "Basmat Road"],
  "Jalgaon": ["Court Road", "Navi Peth", "MIDC Area", "Ring Road"],
  "Satara": ["Rajwada", "Powai Naka", "Radhika Road", "Sadar Bazar"],

  // Gujarat
  "Ahmedabad": ["SG Highway", "Vastrapur", "CG Road", "Prahlad Nagar", "Navrangpura", "Maninagar", "Bopal"],
  "Surat": ["VR Mall (Dumas Road)", "Adajan", "Piplod", "Ghod Dod Road", "Varachha", "Vesu"],
  "Vadodara": ["Alkapuri", "Inorbit Mall Area", "Fatehgunj", "Old Padra Road", "Gotri", "Sayajigunj"],
  "Rajkot": ["Kalawad Road", "Yagnik Road", "Crystal Mall Area", "150 Feet Ring Road", "Race Course"],
  "Bhavnagar": ["Waghawadi Road", "Kalanala", "Ghogha Circle", "Subhashnagar"],
  "Jamnagar": ["Victoria Bridge Area", "Digjam Circle", "Patel Colony", "Indira Marg"],
  "Gandhinagar": ["Sector 11", "Infocity", "Kudasan", "Sector 21", "Sargasan"],
  "Junagadh": ["Zanzarda Road", "Kalwa Chowk", "Moti Baug", "College Road"],
  "Gandhidham": ["Tagore Road", "DC-5 Area", "Oslo Circle", "Sector 8"],
  "Anand": ["Vidyanagar Road", "Amul Dairy Road", "Grid Road", "Nana Bazaar"],
  "Navsari": ["Lunsikui", "Station Road", "Sayaji Road", "Vijalpore"],
  "Morbi": ["Sanala Road", "Shakti Plot", "Lati Plot", "Ravapar Road"],
  "Nadiad": ["College Road", "Station Road", "Santram Road", "Petlad Road"],
  "Surendranagar": ["80 Feet Road", "Wadhwan Road", "Tower Road", "Joravarnagar"],
  "Bharuch": ["Station Road", "Link Road", "Zadeshwar Road", "Shaktinath"],
  "Porbandar": ["MG Road", "Chhaya", "Jubilee Area", "SV Road"],
  "Mehsana": ["Radhanpur Road", "Highway Road", "Modhera Road", "TB Road"],
  "Bhuj": ["Station Road", "Mirzapar Road", "Jubilee Ground Area", "Hospital Road"],
  "Vapi": ["GIDC Char Rasta", "Daman Road", "Gunjan Area", "Koparli Road"],
  "Valsad": ["Tithal Road", "Dharampur Road", "Station Road", "Halar"],

  // Delhi NCR & North India
  "Delhi NCR": ["Connaught Place", "Saket (Select Citywalk)", "Vasant Kunj", "Nehru Place", "Lajpat Nagar", "Karol Bagh", "Dwarka", "Janakpuri"],
  "New Delhi": ["Connaught Place", "Chanakyapuri", "Barakhamba Road", "Khan Market", "Paharganj"],
  "Noida": ["Sector 18 (DLF Mall)", "Sector 38A", "Logix Mall Sector 32", "Sector 62", "Sector 137"],
  "Greater Noida": ["Pari Chowk", "Knowledge Park", "Venice Mall Area", "Alpha 1", "Gaur City"],
  "Gurugram": ["Cyber Hub", "Ambience Mall", "MG Road", "Golf Course Road", "Sector 29", "Sohna Road"],
  "Faridabad": ["Crown Interiorz Mall", "Sector 15", "Mathura Road", "NIT Faridabad", "Sector 12"],
  "Ghaziabad": ["Shipra Mall Indirapuram", "RDC Raj Nagar", "Kaushambi", "Vaishali", "Mohan Nagar"],
  "Lucknow": ["Hazratganj", "Gomti Nagar (Phoenix Palassio)", "Alambagh", "Indira Nagar", "Mahanagar"],
  "Kanpur": ["Mall Road", "Swaroop Nagar", "Z Square Mall Area", "Civil Lines", "Govind Nagar"],
  "Varanasi": ["IP Mall Sigra", "Cantonment", "Bhelupur", "Lanka", "Godowlia"],
  "Agra": ["Sanjay Place", "Tajganj", "Fatehabad Road", "Civil Lines", "Kamla Nagar"],
  "Prayagraj (Allahabad)": ["Civil Lines", "George Town", "Katra", "Chowk", "Kareli"],
  "Meerut": ["Abu Lane", "PVS Mall Area", "Garh Road", "Shastri Nagar", "Roorkee Road"],
  "Bareilly": ["Civil Lines", "Phoenix United Mall Area", "Rampur Garden", "DD Puram"],
  "Aligarh": ["Civil Lines", "Ramghat Road", "Marris Road", "Center Point"],
  "Moradabad": ["Civil Lines", "Wave Mall Area", "Kanth Road", "Delhi Road"],
  "Saharanpur": ["Court Road", "Delhi Road", "Chilkana Road", "Mission Compound"],
  "Gorakhpur": ["Golghar", "City Mall Area", "Civil Lines", "Taramandal"],
  "Ayodhya": ["Naya Ghat", "Faizabad Road", "Civil Lines", "Ram Janmabhoomi Marg Area"],
  "Jhansi": ["Elite Crossing", "Civil Lines", "Sadar Bazar", "Kanpur Road"],
  "Mathura": ["Krishna Nagar", "Civil Lines", "Dampier Nagar", "Highway Road"],

  // Rajasthan
  "Jaipur": ["World Trade Park (Malviya Nagar)", "C-Scheme", "Tonk Road", "Vaishali Nagar", "Raja Park", "Mansarovar"],
  "Jodhpur": ["Sardarpura", "Circuit House Road", "Paota", "Ratanada", "Shastri Nagar"],
  "Kota": ["Gumanpura", "Kotri Road", "Vigyan Nagar", "City Mall Area", "Talwandi"],
  "Bikaner": ["Station Road", "Kote Gate", "Sadul Ganj", "Rani Bazar", "JNV Colony"],
  "Ajmer": ["Panchsheel Nagar", "Civil Lines", "Kutchery Road", "Vaishali Nagar", "Ana Sagar Area"],
  "Udaipur": ["Celebration Mall Area", "Sukhadia Circle", "Fateh Sagar", "Town Hall Road", "Bhuwana"],
  "Bhilwara": ["City Centre", "Bhopal Ganj", "Subhash Nagar", "Pur Road"],
  "Alwar": ["Manu Marg", "Company Bagh", "Scheme 2", "Delhi Road"],
  "Bharatpur": ["Circular Road", "Anah Gate", "Kumher Gate", "Mathura Road"],
  "Sikar": ["Station Road", "Bajaj Road", "Fatehpur Road", "Piprali Road"],

  // Punjab, Haryana, Chandigarh, HP, J&K, UK
  "Chandigarh": ["Sector 17", "Elante Mall (Industrial Area)", "Sector 35", "Sector 22", "Sector 8"],
  "Ludhiana": ["MBD Neopolis Mall", "Ferozepur Road", "Sarabha Nagar", "Mall Road", "Model Town"],
  "Amritsar": ["Mall of Amritsar", "Ranjit Avenue", "Lawrence Road", "Trillium Mall Area", "GT Road"],
  "Jalandhar": ["Model Town", "Curo High Street", "BMC Chowk", "GT Road", "Ladowali Road"],
  "Patiala": ["Omaxe Mall Area", "Leela Bhawan", "Bhupindra Road", "The Mall"],
  "Bathinda": ["Mittal Mall Area", "Civil Lines", "Goniana Road", "Mall Road"],
  "Mohali": ["CP67 Mall (Sector 67)", "Phase 3B2", "Phase 7", "Sector 70"],
  "Panchkula": ["Sector 5", "Sector 8", "Sector 20", "Sector 11"],
  "Panipat": ["GT Road", "Model Town", "Sector 11-12", "Huda Ground Area"],
  "Ambala": ["Ambala Cantt", "Cloth Market Area", "Model Town", "Prem Nagar"],
  "Karnal": ["Kunjpura Road", "Model Town", "Sector 12", "Mall Road"],
  "Rohtak": ["Model Town", "Delhi Road", "Sector 14", "Civil Lines"],
  "Hisar": ["Red Square Market", "Delhi Road", "Urban Estate II", "Model Town"],
  "Sonipat": ["Subhash Chowk", "Sector 14", "Atlas Road", "Murthal Road"],
  "Dehradun": ["Rajpur Road (Pacific Mall)", "Astley Hall", "Chakrata Road", "Clock Tower Area", "Ballupur"],
  "Haridwar": ["Ranipur More", "BHEL Township", "Jwalapur", "Har Ki Pauri Area"],
  "Rishikesh": ["Dehradun Road", "Triveni Ghat Area", "Tapovan", "Muni Ki Reti"],
  "Roorkee": ["Civil Lines", "IIT Roorkee Area", "Delhi Road", "Nehru Nagar"],
  "Haldwani": ["Nainital Road", "Kaladhungi Road", "Tikonia", "Mukhani"],
  "Shimla": ["The Mall", "Lakkar Bazaar", "Sanjauli", "Chotta Shimla"],
  "Dharamshala": ["Kotwali Bazaar", "McLeod Ganj", "Civil Lines", "Dari"],
  "Mandi": ["Indira Market", "Victoria Bridge Area", "Bhiuli", "Samkhetar"],
  "Solan": ["Mall Road", "Chambaghat", "Kumarhatti Road", "Kotlanala"],
  "Srinagar": ["Shivpora (INOX Cinema)", "Lal Chowk", "Rajbagh", "Karan Nagar", "Dal Lake Boulevard"],
  "Jammu": ["Wave Mall (Channi Himmat)", "Bahu Plaza", "Gandhi Nagar", "Residency Road", "Talab Tillo"],

  // Madhya Pradesh & Chhattisgarh
  "Indore": ["Treasure Island (MG Road)", "Phoenix Citadel", "Vijay Nagar", "C21 Mall Area", "Palasia", "Bhawarkua"],
  "Bhopal": ["DB City Mall (Arera Hills)", "MP Nagar", "New Market", "Kolar Road", "Hoshangabad Road"],
  "Jabalpur": ["South Avenue Mall", "Wright Town", "Civil Lines", "Napier Town", "Gorakhpur"],
  "Gwalior": ["City Center", "Lashkar", "Morar", "DB Mall Area", "Phoolbagh"],
  "Ujjain": ["Freeganj", "Mahakal Marg", "Dewas Road", "Nana Kheda", "Tower Chowk"],
  "Sagar": ["Civil Lines", "Katra", "Gopal Ganj", "Makronia"],
  "Dewas": ["AB Road", "Civil Lines", "Bhopal Road", "Mandi Area"],
  "Satna": ["Rewa Road", "Circuit House Area", "Panna Road", "Station Road"],
  "Ratlam": ["Station Road", "Do Batti", "Sailana Road", "Kothari Market"],
  "Rewa": ["College Road", "Civil Lines", "Samadhan Kendra Area", "Kothi Compound"],
  "Raipur": ["Magneto Mall (GE Road)", "City Centre Mall", "Pandri", "Telibandha", "Shankar Nagar"],
  "Bhilai": ["Surya Treasure Island Mall", "Civic Center", "Sector 6", "Nehru Nagar", "Power House Area"],
  "Bilaspur": ["Rama Magneto Mall", "Vyapar Vihar", "Link Road", "Rajendra Nagar"],
  "Korba": ["Transport Nagar", "NTPC Township", "Kosabadi", "Niharika"],
  "Durg": ["Station Road", "Ganj Para", "Padmanabhpur", "Indira Market"],

  // West Bengal, Odisha, Bihar, Jharkhand
  "Kolkata": ["South City Mall", "Quest Mall (Park Circus)", "Mani Square (EM Bypass)", "Salt Lake Sector V", "Park Street", "Howrah AC Market", "New Town", "Behala"],
  "Howrah": ["Avani Riverside Mall", "Howrah Station Area", "Shibpur", "Salkia", "Bally"],
  "Siliguri": ["Cosmos Mall (Sevoke Road)", "City Centre Siliguri (Uttorayon)", "Hill Cart Road", "Bidhan Market"],
  "Durgapur": ["Junction Mall", "City Centre", "Benachity", "Bidhannagar"],
  "Asansol": ["Galaxy Mall", "Burnpur Road", "Court Road", "Hutton Road"],
  "Kharagpur": ["IIT Kharagpur Area", "Golbazar", "Chhota Tengra", "Malancha"],
  "Bardhaman": ["Curzon Gate Area", "Badamtala", "GT Road", "Police Line"],
  "Bhubaneswar": ["Esplanade One (Rasulgarh)", "Saheed Nagar", "Patia", "Janpath", "Nayapalli", "Khandagiri"],
  "Cuttack": ["Badambadi", "Buxi Bazaar", "College Square", "Cantonment Road"],
  "Rourkela": ["Forum Galleria Mall", "Civil Township", "Panposh Road", "Sector 19"],
  "Berhampur": ["Old Bus Stand Area", "Gandhi Nagar", "Engineering School Road", "Bada Bazaar"],
  "Sambalpur": ["VSS Marg", "Fatak", "Ainthapali", "Budharaja"],
  "Puri": ["VIP Road", "Grand Road", "Sea Beach Area", "Swargadwar"],
  "Patna": ["P&M Mall (Patliputra)", "City Centre Mall (Lodipur)", "Fraser Road", "Boring Road", "Kankarbagh", "Bailey Road"],
  "Gaya": ["AP Colony", "Rampur", "GB Road", "Civil Lines", "Station Road"],
  "Bhagalpur": ["Khalifabag", "Tilkamanjhi", "Patal Babu Road", "Zero Mile"],
  "Muzaffarpur": ["Club Road", "Mithanpura", "Motijheel", "Akharghat"],
  "Darbhanga": ["Laheriasarai", "Tower Chowk", "VIP Road", "Donar"],
  "Purnia": ["Line Bazar", "Bhatta Bazar", "Polytechnic Chowk", "Gulabbagh"],
  "Ranchi": ["Nucleus Mall (Circular Road)", "Mall Decor Area", "Main Road", "Harmu Road", "Doranda", "Hinoo"],
  "Jamshedpur": ["P&M Hi-Tech City Mall (Bistupur)", "Sakchi", "Kadma", "Sonari", "Telco"],
  "Dhanbad": ["Ozone Galleria Mall (Saraidhela)", "Bank More", "Hirapur", "Bartand"],
  "Bokaro": ["City Centre Sector 4", "Sector 1", "Chas", "Co-operative Colony"],
  "Deoghar": ["Tower Chowk", "Castairs Town", "Bilasi Town", "Jasidih Road"],

  // North-East & Goa
  "Guwahati": ["City Centre Mall (GS Road)", "Roodraksh Mall (Bhangagarh)", "Paltan Bazaar", "Zoo Road", "Uzan Bazaar", "Jalukbari"],
  "Silchar": ["Goldighi Mall Area", "Park Road", "Hospital Road", "Tarapur"],
  "Dibrugarh": ["Jalan Nagar", "HS Road", "Thana Chariali", "Mancotta Road"],
  "Jorhat": ["Gar-Ali", "KB Road", "Barbheta", "AT Road"],
  "Nagaon": ["Haibargaon", "AT Road", "Daccapatty", "Khutikatia"],
  "Agartala": ["City Centre Area", "Akhaura Road", "Banamalipur", "Melarmath"],
  "Shillong": ["Police Bazar", "Laitumkhrah", "Labans", "Dhanketi"],
  "Imphal": ["Paona Bazar", "Thangal Bazar", "Kangla Area", "RIMS Road"],
  "Aizawl": ["Zarkawt", "Chanmari", "Bawngkawn", "Khatla"],
  "Dimapur": ["Nyamo Lotha Road", "Circular Road", "City Tower Area", "Purana Bazar"],
  "Kohima": ["Main Town", "PR Hill", "High School Junction", "Razhu Point"],
  "Gangtok": ["MG Marg", "Deorali", "Tadong", "Development Area"],
  "Itanagar": ["Ganga Market", "Bank Tinali", "Zero Point", "E-Sector"],
  "Panaji": ["Inox Multiplex (Campal)", "MG Road", "Patto Plaza", "Miramar Beach Road", "Fontainhas"],
  "Margao": ["Osia Mall Area", "Fatorda", "Pajifond", "Comba", "Aquem"],
  "Vasco da Gama": ["Swatantra Path", "FL Gomes Road", "Mangor Hill", "Baina"]
};

// Metropolitan mega cities definition
const METRO_CITIES = new Set([
  "Mumbai", "Bengaluru", "Hyderabad", "Chennai", "Delhi NCR", "New Delhi", "Kolkata", "Ahmedabad", "Pune"
]);

// Major Regional Hubs definition
const MAJOR_REGIONAL_CITIES = new Set([
  "Vijayawada", "Visakhapatnam", "Guntur", "Tirupati", "Rajahmundry", "Kakinada", "Nellore", "Kurnool",
  "Warangal", "Nizamabad", "Karimnagar", "Mysuru", "Mangaluru", "Hubballi-Dharwad", "Belagavi",
  "Coimbatore", "Madurai", "Salem", "Tiruchirappalli", "Kochi", "Thiruvananthapuram", "Kozhikode", "Thrissur",
  "Nagpur", "Nashik", "Aurangabad (Chhatrapati Sambhajinagar)", "Thane", "Navi Mumbai", "Kolhapur",
  "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar",
  "Lucknow", "Kanpur", "Varanasi", "Agra", "Prayagraj (Allahabad)", "Meerut", "Noida", "Greater Noida", "Gurugram", "Ghaziabad", "Faridabad",
  "Jaipur", "Jodhpur", "Kota", "Udaipur", "Bikaner", "Chandigarh", "Ludhiana", "Amritsar", "Jalandhar", "Dehradun",
  "Indore", "Bhopal", "Jabalpur", "Gwalior", "Raipur", "Bhilai",
  "Bhubaneswar", "Cuttack", "Rourkela", "Patna", "Gaya", "Ranchi", "Jamshedpur", "Dhanbad", "Guwahati", "Panaji"
]);

// Deterministic Pseudo-Random Generator for consistent data across renders & server calls
function createSeededRandom(seedString) {
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  return function() {
    hash = (hash * 9301 + 49297) % 233280;
    return Math.abs(hash / 233280);
  };
}

/**
 * Generate authentic Indian theatres for ANY supported city
 * Adapts ecosystem based on city size (Metro, Regional Hub, or Cinema Town)
 */
export function generateTheatresForCity(cityName) {
  const cleanCity = String(cityName || "Tenali").trim();
  const citySlug = cleanCity.toLowerCase().replace(/[^a-z0-9]/g, "-");
  const localities = CITY_LOCALITIES[cleanCity] || ["Main Road", "Station Road", "Cinema Street", "Market Area"];
  const rand = createSeededRandom(`city-theatres-${cleanCity}`);

  const isMetro = METRO_CITIES.has(cleanCity);
  const isRegionalHub = MAJOR_REGIONAL_CITIES.has(cleanCity);

  const realTheatres = REAL_WORLD_THEATRES[cleanCity];
  if (realTheatres && realTheatres.length > 0) {
    return realTheatres.map((rt, idx) => {
      const cleanName = cleanTheatreName(rt.name);
      const isMultiplex = rt.name.toLowerCase().includes("multiplex") || 
                          rt.name.toLowerCase().includes("cinemas") || 
                          rt.name.toLowerCase().includes("pvr") || 
                          rt.name.toLowerCase().includes("inox") || 
                          rt.name.toLowerCase().includes("cinepolis") ||
                          rt.name.toLowerCase().includes("mall");
      
      const screens = [];
      if (isMultiplex) {
        screens.push({
          id: `scr-${citySlug}-${idx + 1}-1`,
          name: "Screen 1 - 4K Dolby Atmos",
          type: "Dolby Atmos 4K",
          soundType: "Dolby Atmos 64-Channel",
          capacity: 180,
          seatLayoutType: "DOLBY_ATMOS_SUPERPLEX",
          badge: "4K Laser Atmos"
        });
        screens.push({
          id: `scr-${citySlug}-${idx + 1}-2`,
          name: "Screen 2 - VIP Recliner Suite",
          type: "VIP Recliner",
          soundType: "Dolby Digital 7.1",
          capacity: 140,
          seatLayoutType: "LUXURY_RECLINER_VIP",
          badge: "VIP Recliner"
        });
      } else {
        screens.push({
          id: `scr-${citySlug}-${idx + 1}-1`,
          name: "Main Auditorium - 4K Laser Atmos",
          type: "Dolby Atmos 4K",
          soundType: "Dolby Atmos 64-Channel High Impact",
          capacity: 220,
          seatLayoutType: "TRADITIONAL_SINGLE_SCREEN",
          badge: "Grand Screen & Balcony"
        });
      }

      return {
        id: `th-${citySlug}-real-${idx + 1}`,
        name: cleanName,
        city: cleanCity,
        state: isMetro ? "Metro Hub" : "Regional Cinema Hub",
        locality: rt.locality || (localities[idx % localities.length] || "Main Center"),
        address: rt.address || `${rt.locality || "Main Center"}, ${cleanCity}`,
        distance: `${(0.8 + (idx * 0.9)).toFixed(1)} km from Center`,
        rating: rt.rating || 4.6,
        theatreType: isMultiplex ? THEATRE_TYPES.MODERN_MULTIPLEX : THEATRE_TYPES.TRADITIONAL_REGIONAL,
        screensCount: screens.length,
        screens,
        facilities: [
          "RGB 4K Laser Projection",
          "Dolby Atmos Surround",
          "Pushback Cushioned Seating",
          "Canteen Snack Bar",
          "Spacious Parking",
          "Wheelchair Accessible"
        ],
        cinemaTechnology: "4K RGB Laser High Frame Rate Projection with Dolby Immersive Audio",
        parkingInfo: "Dedicated two-wheeler and four-wheeler parking spaces",
        accessibility: "Step-free ramped entrance to auditorium, dedicated wheelchair positions in Row A",
        isRealWorld: true
      };
    });
  }

  const theatres = [];

  if (isMetro) {
    // -------------------------------------------------------------
    // METRO CITY ECOSYSTEM: 4 flagship theatres with IMAX Laser, 4DX, VIP & Atmos
    // -------------------------------------------------------------
    
    // 1. Flagship Mega Multiplex (IMAX Laser & P[XL])
    theatres.push({
      id: `th-${citySlug}-flagship-imax`,
      name: `Grand Superplex & IMAX, ${localities[0] || 'Downtown'}`,
      city: cleanCity,
      state: "Metro Hub",
      locality: localities[0] || "Downtown",
      address: `Nexus Galleria Mall, ${localities[0] || 'Central'}, ${cleanCity}`,
      distance: "1.2 km from Center",
      rating: 4.9,
      theatreType: THEATRE_TYPES.IMAX_LASER,
      screensCount: 5,
      screens: [
        {
          id: `scr-${citySlug}-imax-101`,
          name: "Screen 1 - IMAX Laser 4K",
          type: "IMAX Laser",
          soundType: "IMAX 12.1 Dual Laser Surround",
          capacity: 200,
          seatLayoutType: "IMAX_LASER",
          badge: "Grand IMAX Dome"
        },
        {
          id: `scr-${citySlug}-imax-102`,
          name: "Screen 2 - Dolby Atmos 4K Laser",
          type: "Dolby Atmos",
          soundType: "Dolby Atmos 64-Channel Audio",
          capacity: 160,
          seatLayoutType: "DOLBY_ATMOS_SUPERPLEX",
          badge: "Dolby Atmos 4K"
        },
        {
          id: `scr-${citySlug}-imax-103`,
          name: "Screen 3 - P[XL] Giant Screen",
          type: "P[XL] Large Format",
          soundType: "P[XL] Immersive 7.1",
          capacity: 180,
          seatLayoutType: "LARGE_FORMAT",
          badge: "P[XL] Giant Format"
        }
      ],
      facilities: ["IMAX Dual Laser 4K", "Dolby Atmos 128-Channel", "P[XL] Giant Screen", "VIP Recliner Balcony", "Gourmet Live Food Lounge", "Valet Parking with EV Charging", "Wheelchair Accessible Elevators"],
      cinemaTechnology: "Barco 4K RGB Dual Laser Projectors, IMAX Custom Acoustic Tuning, 64-Speaker Ceiling Matrix",
      parkingInfo: "4-Level Basement Parking with Reserved Disabled & EV Fast Charging Bays",
      accessibility: "Fully Step-Free Access, Direct Elevator to Auditorium Row A, Companion Seating with Braille Signage",
      isDemo: false
    });

    // 2. Ultra-Luxury VIP Recliner & 4DX Motion Theatre
    theatres.push({
      id: `th-${citySlug}-luxe-4dx`,
      name: `INSIGNIA Luxury Suites & 4DX, ${localities[1] || 'Uptown'}`,
      city: cleanCity,
      state: "Metro Hub",
      locality: localities[1] || "Uptown",
      address: `Phoenix Palladium Mall, ${localities[1] || 'Uptown'}, ${cleanCity}`,
      distance: "2.8 km from Center",
      rating: 4.8,
      theatreType: THEATRE_TYPES.LUXURY_CINEMA,
      screensCount: 4,
      screens: [
        {
          id: `scr-${citySlug}-luxe-201`,
          name: "Screen 1 - 4DX 3D Motion Pods",
          type: "4DX",
          soundType: "4DX Dynamic Audio & Motion FX",
          capacity: 160,
          seatLayoutType: "FOUR_DX",
          badge: "4DX Motion & Weather FX"
        },
        {
          id: `scr-${citySlug}-luxe-202`,
          name: "Screen 2 - INSIGNIA Royal Recliner Suite",
          type: "Luxury Recliner",
          soundType: "Bose Studio Master 7.1",
          capacity: 140,
          seatLayoutType: "LUXURY_RECLINER_VIP",
          badge: "INSIGNIA Recliner Suite"
        }
      ],
      facilities: ["4DX Motion Dynamics (Wind, Rain, Fog, Scent)", "Motorized Plush Recliners", "Private In-Seat Butler Service", "Gourmet Chef Kitchen", "Valet Parking", "Acoustic Wall Panels"],
      cinemaTechnology: "CJ 4DPLEX Motion Pods, 4K High Dynamic Range Laser Projection",
      parkingInfo: "Dedicated Luxury Valet Lounge & Priority Car Drop-off",
      accessibility: "Step-free ramped entrance to Recliner suites, dedicated wheelchair pods",
      isDemo: false
    });

    // 3. Dolby Cinema ScreenX Multiplex
    theatres.push({
      id: `th-${citySlug}-screenx-atmos`,
      name: `ScreenX & Dolby Atmos Superplex, ${localities[2] || 'West Bay'}`,
      city: cleanCity,
      state: "Metro Hub",
      locality: localities[2] || "West Bay",
      address: `City Centre Super Mall, ${localities[2] || 'West Bay'}, ${cleanCity}`,
      distance: "3.9 km from Center",
      rating: 4.7,
      theatreType: THEATRE_TYPES.SCREEN_X,
      screensCount: 4,
      screens: [
        {
          id: `scr-${citySlug}-scrx-301`,
          name: "Screen 1 - ScreenX 270° Panoramic",
          type: "ScreenX",
          soundType: "Dolby Atmos 7.1 Panoramic",
          capacity: 160,
          seatLayoutType: "SCREEN_X",
          badge: "270° Panoramic View"
        },
        {
          id: `scr-${citySlug}-scrx-302`,
          name: "Screen 2 - Atmos Master 4K",
          type: "Dolby Atmos",
          soundType: "Dolby Atmos 360 Surround",
          capacity: 180,
          seatLayoutType: "DOLBY_ATMOS_SUPERPLEX",
          badge: "Dolby Atmos 4K"
        }
      ],
      facilities: ["ScreenX Multi-Projection Side Walls", "Dolby Atmos 360", "Pushback Cushioned Seating", "Food Court Access", "Spacious Multi-Lane Parking"],
      cinemaTechnology: "3-Screen Multi-Wall Projection Matrix, Dolby Sound Master Processor",
      parkingInfo: "Multi-level underground parking with direct elevator access",
      accessibility: "Wheelchair positions with companion seating and accessible restrooms",
      isDemo: false
    });

    // 4. Iconic Heritage Regional Super Cinema
    theatres.push({
      id: `th-${citySlug}-heritage-super`,
      name: `Royal Super Screen (4K RGB Laser), ${localities[3] || 'Central Area'}`,
      city: cleanCity,
      state: "Metro Hub",
      locality: localities[3] || "Central Area",
      address: `Heritage Cinema Boulevard, Near Clock Tower, ${localities[3] || 'Central'}, ${cleanCity}`,
      distance: "4.5 km from Center",
      rating: 4.6,
      theatreType: THEATRE_TYPES.DOLBY_ATMOS,
      screensCount: 2,
      screens: [
        {
          id: `scr-${citySlug}-herit-401`,
          name: "Main Auditorium - Super Laser Atmos",
          type: "Dolby Atmos",
          soundType: "Dolby Atmos 64-Channel Studio",
          capacity: 200,
          seatLayoutType: "DOLBY_ATMOS_SUPERPLEX",
          badge: "Mega Super Screen"
        }
      ],
      facilities: ["Christie 4K RGB Laser", "Dolby Atmos 7.1", "Balcony VIP Recliners", "Snack Canteen", "Two-Wheeler & Car Parking"],
      cinemaTechnology: "High-Gain Silver Screen with 4K RGB High Frame Rate Laser Projection",
      parkingInfo: "Spacious Open Parking Compound for Cars & Bikes",
      accessibility: "Accessible Ground-Level Ramp Entrance",
      isDemo: false
    });

  } else if (isRegionalHub) {
    // -------------------------------------------------------------
    // MAJOR REGIONAL HUB: 3 realistic multiplexes & premium auditoriums
    // -------------------------------------------------------------

    // 1. Prime City Multiplex (Dolby Atmos & Laser)
    theatres.push({
      id: `th-${citySlug}-prime-multiplex`,
      name: `Prime Multiplex (4K Laser), ${localities[0] || 'Main Road'}`,
      city: cleanCity,
      state: "Regional Hub",
      locality: localities[0] || "Main Road",
      address: `Central Commercial Complex, ${localities[0] || 'Main Road'}, ${cleanCity}`,
      distance: "1.0 km from Center",
      rating: 4.8,
      theatreType: THEATRE_TYPES.PREMIUM_MULTIPLEX,
      screensCount: 4,
      screens: [
        {
          id: `scr-${citySlug}-prm-101`,
          name: "Screen 1 - Dolby Atmos 4K RGB",
          type: "Dolby Atmos",
          soundType: "Dolby Atmos 64-Channel",
          capacity: 180,
          seatLayoutType: "DOLBY_ATMOS_SUPERPLEX",
          badge: "Dolby Atmos 4K Laser"
        },
        {
          id: `scr-${citySlug}-prm-102`,
          name: "Screen 2 - VIP Recliner Suite",
          type: "Recliner Cinema",
          soundType: "Dolby Digital 7.1 Surround",
          capacity: 140,
          seatLayoutType: "LUXURY_RECLINER_VIP",
          badge: "Royal Recliner Suite"
        }
      ],
      facilities: ["4K RGB Laser Projection", "Dolby Atmos 64-Channel", "Plush Recliner Balcony", "Cine Café", "Covered Car Parking", "Wheelchair Friendly"],
      cinemaTechnology: "Barco Series 4K RGB Laser Projectors with JBL Professional Cinema Sound",
      parkingInfo: "2-Floor Covered Parking with Dedicated Disabled Spots",
      accessibility: "Ramp access to all screen entrances, dedicated wheelchair bays",
      isDemo: false
    });

    // 2. City Center Cineplex (Executive & Couple Sofas)
    theatres.push({
      id: `th-${citySlug}-city-cineplex`,
      name: `City Cinema & Dolby 3D, ${localities[1] || 'Station Road'}`,
      city: cleanCity,
      state: "Regional Hub",
      locality: localities[1] || "Station Road",
      address: `Opposite Old Bus Stand, ${localities[1] || 'Station Road'}, ${cleanCity}`,
      distance: "2.4 km from Center",
      rating: 4.6,
      theatreType: THEATRE_TYPES.MODERN_MULTIPLEX,
      screensCount: 3,
      screens: [
        {
          id: `scr-${citySlug}-cty-201`,
          name: "Screen 1 - Master 3D Atmos",
          type: "Dolby Atmos",
          soundType: "Dolby Atmos 7.1",
          capacity: 160,
          seatLayoutType: "STANDARD_MULTIPLEX",
          badge: "Master 3D Atmos"
        },
        {
          id: `scr-${citySlug}-cty-202`,
          name: "Screen 2 - Digital 4K Laser",
          type: "Digital 4K",
          soundType: "DTS Digital Surround",
          capacity: 140,
          seatLayoutType: "STANDARD_MULTIPLEX",
          badge: "Digital 4K Screen"
        }
      ],
      facilities: ["Digital 3D RealD", "Pushback Executive Chairs", "Snack Express Counter", "Spacious Two-Wheeler & Car Parking"],
      cinemaTechnology: "Christie Digital Laser Cinema System with QSC Audio Amplification",
      parkingInfo: "On-site parking area for 150+ two-wheelers and 40 cars",
      accessibility: "Ground floor entry with accessible ticket counter",
      isDemo: false
    });

    // 3. Landmark Regional Grand Theatre (Balcony & Stall)
    theatres.push({
      id: `th-${citySlug}-grand-theatre`,
      name: `Sri Lakshmi Grand Cinema 4K, ${localities[2] || 'Clock Tower'}`,
      city: cleanCity,
      state: "Regional Hub",
      locality: localities[2] || "Clock Tower",
      address: `Cinema Road, Near ${localities[2] || 'Market Center'}, ${cleanCity}`,
      distance: "3.2 km from Center",
      rating: 4.5,
      theatreType: THEATRE_TYPES.TRADITIONAL_REGIONAL,
      screensCount: 2,
      screens: [
        {
          id: `scr-${citySlug}-grd-301`,
          name: "Main Auditorium - 4K Dolby Atmos",
          type: "Dolby Atmos",
          soundType: "Dolby Atmos 64-Channel High Impact",
          capacity: 200,
          seatLayoutType: "TRADITIONAL_SINGLE_SCREEN",
          badge: "Grand Balcony & Main Hall"
        }
      ],
      facilities: ["4K High-Gain Silver Screen", "Dolby Atmos Sound System", "Spacious Balcony Recliners", "Popcorn & Samosa Canteen", "Large Open Parking"],
      cinemaTechnology: "4K Laser High-Frame-Rate Projection, Pulz Professional Speakers",
      parkingInfo: "Large open parking lot with separate bike and car sections",
      accessibility: "Step-free ramp entry to lower stalls and accessible aisle seats",
      isDemo: false
    });

  } else {
    // -------------------------------------------------------------
    // TIER-2 / REGIONAL CINEMA TOWN (Tenali, Bhimavaram, Machilipatnam, etc.)
    // 2-3 realistic theatres: A modern multi-screen and traditional deluxe single screen
    // -------------------------------------------------------------

    // 1. City Multi-Screen Cinema
    theatres.push({
      id: `th-${citySlug}-city-multiplex`,
      name: `V-Max Multiplex (Dolby Atmos), ${localities[0] || 'Station Road'}`,
      city: cleanCity,
      state: "Regional Cinema Hub",
      locality: localities[0] || "Station Road",
      address: `Near Railway Station, ${localities[0] || 'Station Road'}, ${cleanCity}`,
      distance: "0.8 km from Center",
      rating: 4.7,
      theatreType: THEATRE_TYPES.MODERN_MULTIPLEX,
      screensCount: 3,
      screens: [
        {
          id: `scr-${citySlug}-vmx-101`,
          name: "Screen 1 - 4K Laser Dolby Atmos",
          type: "Dolby Atmos",
          soundType: "Dolby Atmos 7.1 Surround",
          capacity: 160,
          seatLayoutType: "DOLBY_ATMOS_SUPERPLEX",
          badge: "4K Laser Atmos Screen"
        },
        {
          id: `scr-${citySlug}-vmx-102`,
          name: "Screen 2 - Digital 2K RGB",
          type: "Digital 2K",
          soundType: "Dolby Digital 5.1",
          capacity: 120,
          seatLayoutType: "STANDARD_MULTIPLEX",
          badge: "Digital 2K Screen"
        }
      ],
      facilities: ["4K Laser Projection", "Dolby Atmos Sound", "Plush Pushback Chairs", "Air Conditioned Lounge", "Food & Beverage Counter", "Two-Wheeler & Car Parking"],
      cinemaTechnology: "Christie Digital Laser, Dolby Surround Processor",
      parkingInfo: "Covered two-wheeler parking and paved car parking yard",
      accessibility: "Step-free ramp entry and accessible row A aisle seats",
      isDemo: false
    });

    // 2. Traditional Deluxe Single-Screen Cinema
    theatres.push({
      id: `th-${citySlug}-deluxe-theatre`,
      name: `Sri Venkateswara Deluxe 4K, ${localities[1] || 'Bose Road'}`,
      city: cleanCity,
      state: "Regional Cinema Hub",
      locality: localities[1] || "Bose Road",
      address: `Main Bazaar Road, Near ${localities[1] || 'Temple Area'}, ${cleanCity}`,
      distance: "1.5 km from Center",
      rating: 4.5,
      theatreType: THEATRE_TYPES.TRADITIONAL_REGIONAL,
      screensCount: 1,
      screens: [
        {
          id: `scr-${citySlug}-dlx-201`,
          name: "Main Hall - 4K Dolby Atmos",
          type: "Dolby Atmos",
          soundType: "Dolby Atmos 7.1 High Power",
          capacity: 180,
          seatLayoutType: "TRADITIONAL_SINGLE_SCREEN",
          badge: "Balcony & First Class Arena"
        }
      ],
      facilities: ["High-Brightness Silver Screen", "Dolby Atmos Audio", "Upper Balcony Recliners", "First Class Pushback Seats", "Canteen Snack Bar", "Spacious Two-Wheeler Parking"],
      cinemaTechnology: "Barco 4K Laser Projection, JBL Professional Amplifiers",
      parkingInfo: "Dedicated open-air bike and car parking within theatre compound",
      accessibility: "Wide entry gate, accessible aisle seats on ground floor",
      isDemo: false
    });

    // 3. Heritage Regional Cinema
    theatres.push({
      id: `th-${citySlug}-heritage-cinema`,
      name: `Alankar 4K Laser, ${localities[2] || 'Morrispet'}`,
      city: cleanCity,
      state: "Regional Cinema Hub",
      locality: localities[2] || "Morrispet",
      address: `Cinema Road, ${localities[2] || 'Morrispet'}, ${cleanCity}`,
      distance: "2.1 km from Center",
      rating: 4.4,
      theatreType: THEATRE_TYPES.SINGLE_SCREEN,
      screensCount: 1,
      screens: [
        {
          id: `scr-${citySlug}-aln-301`,
          name: "Screen 1 - 4K RGB Laser",
          type: "4K Laser",
          soundType: "Dolby Digital 7.1",
          capacity: 150,
          seatLayoutType: "STANDARD_MULTIPLEX",
          badge: "4K RGB Laser Cinema"
        }
      ],
      facilities: ["4K RGB Laser", "Dolby Digital 7.1", "Cushioned Seats", "Snack Stand", "Bike Parking"],
      cinemaTechnology: "4K Digital Projection, High-Fidelity 7.1 Audio",
      parkingInfo: "Two-wheeler and vehicle parking lot",
      accessibility: "Accessible ground floor layout",
      isDemo: false
    });
  }

  return theatres;
}

export default {
  THEATRE_TYPES,
  CITY_LOCALITIES,
  generateTheatresForCity
};
