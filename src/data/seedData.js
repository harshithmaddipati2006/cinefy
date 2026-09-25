// Seed data for CineFy - Real movies, theatres, food, offers, events & concerts

export const PIN_TO_PIN_INDIAN_CITIES = [
  // Andhra Pradesh
  { name: "Tenali", state: "Andhra Pradesh" },
  { name: "Guntur", state: "Andhra Pradesh" },
  { name: "Vijayawada", state: "Andhra Pradesh" },
  { name: "Visakhapatnam", state: "Andhra Pradesh" },
  { name: "Tirupati", state: "Andhra Pradesh" },
  { name: "Rajahmundry", state: "Andhra Pradesh" },
  { name: "Kakinada", state: "Andhra Pradesh" },
  { name: "Nellore", state: "Andhra Pradesh" },
  { name: "Kurnool", state: "Andhra Pradesh" },
  { name: "Kadapa", state: "Andhra Pradesh" },
  { name: "Anantapur", state: "Andhra Pradesh" },
  { name: "Eluru", state: "Andhra Pradesh" },
  { name: "Ongole", state: "Andhra Pradesh" },
  { name: "Vizianagaram", state: "Andhra Pradesh" },
  { name: "Srikakulam", state: "Andhra Pradesh" },
  { name: "Machilipatnam", state: "Andhra Pradesh" },
  { name: "Bhimavaram", state: "Andhra Pradesh" },
  { name: "Proddatur", state: "Andhra Pradesh" },
  { name: "Nandyal", state: "Andhra Pradesh" },
  { name: "Chittoor", state: "Andhra Pradesh" },
  { name: "Hindupur", state: "Andhra Pradesh" },
  { name: "Tadepalligudem", state: "Andhra Pradesh" },
  { name: "Gudivada", state: "Andhra Pradesh" },
  { name: "Narasaraopet", state: "Andhra Pradesh" },
  { name: "Mangalagiri", state: "Andhra Pradesh" },
  { name: "Amalapuram", state: "Andhra Pradesh" },
  { name: "Palakollu", state: "Andhra Pradesh" },
  { name: "Dharmavaram", state: "Andhra Pradesh" },
  { name: "Tanuku", state: "Andhra Pradesh" },
  { name: "Chirala", state: "Andhra Pradesh" },
  { name: "Kavali", state: "Andhra Pradesh" },
  { name: "Bapatla", state: "Andhra Pradesh" },
  { name: "Markapur", state: "Andhra Pradesh" },
  { name: "Ponnur", state: "Andhra Pradesh" },

  // Telangana
  { name: "Hyderabad", state: "Telangana" },
  { name: "Secunderabad", state: "Telangana" },
  { name: "Warangal", state: "Telangana" },
  { name: "Nizamabad", state: "Telangana" },
  { name: "Karimnagar", state: "Telangana" },
  { name: "Khammam", state: "Telangana" },
  { name: "Ramagundam", state: "Telangana" },
  { name: "Mahbubnagar", state: "Telangana" },
  { name: "Nalgonda", state: "Telangana" },
  { name: "Adilabad", state: "Telangana" },
  { name: "Suryapet", state: "Telangana" },
  { name: "Siddipet", state: "Telangana" },
  { name: "Miryalaguda", state: "Telangana" },
  { name: "Mancherial", state: "Telangana" },
  { name: "Jagtial", state: "Telangana" },
  { name: "Nirmal", state: "Telangana" },
  { name: "Kothagudem", state: "Telangana" },
  { name: "Kamareddy", state: "Telangana" },
  { name: "Bodhan", state: "Telangana" },
  { name: "Sangareddy", state: "Telangana" },

  // Karnataka
  { name: "Bengaluru", state: "Karnataka" },
  { name: "Mysuru", state: "Karnataka" },
  { name: "Mangaluru", state: "Karnataka" },
  { name: "Hubballi-Dharwad", state: "Karnataka" },
  { name: "Belagavi", state: "Karnataka" },
  { name: "Davanagere", state: "Karnataka" },
  { name: "Ballari", state: "Karnataka" },
  { name: "Kalaburagi", state: "Karnataka" },
  { name: "Shivamogga", state: "Karnataka" },
  { name: "Tumakuru", state: "Karnataka" },
  { name: "Udupi", state: "Karnataka" },
  { name: "Bidar", state: "Karnataka" },
  { name: "Hosapete", state: "Karnataka" },
  { name: "Gadag", state: "Karnataka" },
  { name: "Hassan", state: "Karnataka" },
  { name: "Raichur", state: "Karnataka" },
  { name: "Chikkamagaluru", state: "Karnataka" },
  { name: "Mandya", state: "Karnataka" },
  { name: "Chitradurga", state: "Karnataka" },

  // Tamil Nadu
  { name: "Chennai", state: "Tamil Nadu" },
  { name: "Coimbatore", state: "Tamil Nadu" },
  { name: "Madurai", state: "Tamil Nadu" },
  { name: "Tiruchirappalli", state: "Tamil Nadu" },
  { name: "Salem", state: "Tamil Nadu" },
  { name: "Tirunelveli", state: "Tamil Nadu" },
  { name: "Tiruppur", state: "Tamil Nadu" },
  { name: "Vellore", state: "Tamil Nadu" },
  { name: "Erode", state: "Tamil Nadu" },
  { name: "Thoothukudi", state: "Tamil Nadu" },
  { name: "Thanjavur", state: "Tamil Nadu" },
  { name: "Dindigul", state: "Tamil Nadu" },
  { name: "Kanchipuram", state: "Tamil Nadu" },
  { name: "Nagercoil", state: "Tamil Nadu" },
  { name: "Cuddalore", state: "Tamil Nadu" },
  { name: "Kumbakonam", state: "Tamil Nadu" },
  { name: "Hosur", state: "Tamil Nadu" },
  { name: "Karur", state: "Tamil Nadu" },
  { name: "Neyveli", state: "Tamil Nadu" },

  // Kerala
  { name: "Kochi", state: "Kerala" },
  { name: "Thiruvananthapuram", state: "Kerala" },
  { name: "Kozhikode", state: "Kerala" },
  { name: "Thrissur", state: "Kerala" },
  { name: "Kollam", state: "Kerala" },
  { name: "Alappuzha", state: "Kerala" },
  { name: "Kannur", state: "Kerala" },
  { name: "Palakkad", state: "Kerala" },
  { name: "Kottayam", state: "Kerala" },
  { name: "Malappuram", state: "Kerala" },
  { name: "Manjeri", state: "Kerala" },
  { name: "Thalassery", state: "Kerala" },
  { name: "Kasaragod", state: "Kerala" },
  { name: "Pathanamthitta", state: "Kerala" },

  // Maharashtra
  { name: "Mumbai", state: "Maharashtra" },
  { name: "Pune", state: "Maharashtra" },
  { name: "Nagpur", state: "Maharashtra" },
  { name: "Thane", state: "Maharashtra" },
  { name: "Nashik", state: "Maharashtra" },
  { name: "Kalyan-Dombivli", state: "Maharashtra" },
  { name: "Vasai-Virar", state: "Maharashtra" },
  { name: "Aurangabad (Chhatrapati Sambhajinagar)", state: "Maharashtra" },
  { name: "Navi Mumbai", state: "Maharashtra" },
  { name: "Solapur", state: "Maharashtra" },
  { name: "Mira-Bhayandar", state: "Maharashtra" },
  { name: "Bhiwandi", state: "Maharashtra" },
  { name: "Amravati", state: "Maharashtra" },
  { name: "Nanded", state: "Maharashtra" },
  { name: "Kolhapur", state: "Maharashtra" },
  { name: "Akola", state: "Maharashtra" },
  { name: "Latur", state: "Maharashtra" },
  { name: "Dhule", state: "Maharashtra" },
  { name: "Ahmednagar", state: "Maharashtra" },
  { name: "Chandrapur", state: "Maharashtra" },
  { name: "Parbhani", state: "Maharashtra" },
  { name: "Jalgaon", state: "Maharashtra" },
  { name: "Satara", state: "Maharashtra" },

  // Gujarat
  { name: "Ahmedabad", state: "Gujarat" },
  { name: "Surat", state: "Gujarat" },
  { name: "Vadodara", state: "Gujarat" },
  { name: "Rajkot", state: "Gujarat" },
  { name: "Bhavnagar", state: "Gujarat" },
  { name: "Jamnagar", state: "Gujarat" },
  { name: "Gandhinagar", state: "Gujarat" },
  { name: "Junagadh", state: "Gujarat" },
  { name: "Gandhidham", state: "Gujarat" },
  { name: "Anand", state: "Gujarat" },
  { name: "Navsari", state: "Gujarat" },
  { name: "Morbi", state: "Gujarat" },
  { name: "Nadiad", state: "Gujarat" },
  { name: "Surendranagar", state: "Gujarat" },
  { name: "Bharuch", state: "Gujarat" },
  { name: "Porbandar", state: "Gujarat" },
  { name: "Mehsana", state: "Gujarat" },
  { name: "Bhuj", state: "Gujarat" },
  { name: "Vapi", state: "Gujarat" },
  { name: "Valsad", state: "Gujarat" },

  // Delhi NCR & North India
  { name: "Delhi NCR", state: "Delhi" },
  { name: "New Delhi", state: "Delhi" },
  { name: "Noida", state: "Uttar Pradesh" },
  { name: "Greater Noida", state: "Uttar Pradesh" },
  { name: "Gurugram", state: "Haryana" },
  { name: "Faridabad", state: "Haryana" },
  { name: "Ghaziabad", state: "Uttar Pradesh" },
  { name: "Lucknow", state: "Uttar Pradesh" },
  { name: "Kanpur", state: "Uttar Pradesh" },
  { name: "Varanasi", state: "Uttar Pradesh" },
  { name: "Agra", state: "Uttar Pradesh" },
  { name: "Prayagraj (Allahabad)", state: "Uttar Pradesh" },
  { name: "Meerut", state: "Uttar Pradesh" },
  { name: "Bareilly", state: "Uttar Pradesh" },
  { name: "Aligarh", state: "Uttar Pradesh" },
  { name: "Moradabad", state: "Uttar Pradesh" },
  { name: "Saharanpur", state: "Uttar Pradesh" },
  { name: "Gorakhpur", state: "Uttar Pradesh" },
  { name: "Ayodhya", state: "Uttar Pradesh" },
  { name: "Jhansi", state: "Uttar Pradesh" },
  { name: "Mathura", state: "Uttar Pradesh" },

  // Rajasthan
  { name: "Jaipur", state: "Rajasthan" },
  { name: "Jodhpur", state: "Rajasthan" },
  { name: "Kota", state: "Rajasthan" },
  { name: "Bikaner", state: "Rajasthan" },
  { name: "Ajmer", state: "Rajasthan" },
  { name: "Udaipur", state: "Rajasthan" },
  { name: "Bhilwara", state: "Rajasthan" },
  { name: "Alwar", state: "Rajasthan" },
  { name: "Bharatpur", state: "Rajasthan" },
  { name: "Sikar", state: "Rajasthan" },

  // Punjab, Haryana, Chandigarh, HP, J&K, UK
  { name: "Chandigarh", state: "Chandigarh" },
  { name: "Ludhiana", state: "Punjab" },
  { name: "Amritsar", state: "Punjab" },
  { name: "Jalandhar", state: "Punjab" },
  { name: "Patiala", state: "Punjab" },
  { name: "Bathinda", state: "Punjab" },
  { name: "Mohali", state: "Punjab" },
  { name: "Panchkula", state: "Haryana" },
  { name: "Panipat", state: "Haryana" },
  { name: "Ambala", state: "Haryana" },
  { name: "Karnal", state: "Haryana" },
  { name: "Rohtak", state: "Haryana" },
  { name: "Hisar", state: "Haryana" },
  { name: "Sonipat", state: "Haryana" },
  { name: "Dehradun", state: "Uttarakhand" },
  { name: "Haridwar", state: "Uttarakhand" },
  { name: "Rishikesh", state: "Uttarakhand" },
  { name: "Roorkee", state: "Uttarakhand" },
  { name: "Haldwani", state: "Uttarakhand" },
  { name: "Shimla", state: "Himachal Pradesh" },
  { name: "Dharamshala", state: "Himachal Pradesh" },
  { name: "Mandi", state: "Himachal Pradesh" },
  { name: "Solan", state: "Himachal Pradesh" },
  { name: "Srinagar", state: "Jammu & Kashmir" },
  { name: "Jammu", state: "Jammu & Kashmir" },

  // Madhya Pradesh & Chhattisgarh
  { name: "Indore", state: "Madhya Pradesh" },
  { name: "Bhopal", state: "Madhya Pradesh" },
  { name: "Jabalpur", state: "Madhya Pradesh" },
  { name: "Gwalior", state: "Madhya Pradesh" },
  { name: "Ujjain", state: "Madhya Pradesh" },
  { name: "Sagar", state: "Madhya Pradesh" },
  { name: "Dewas", state: "Madhya Pradesh" },
  { name: "Satna", state: "Madhya Pradesh" },
  { name: "Ratlam", state: "Madhya Pradesh" },
  { name: "Rewa", state: "Madhya Pradesh" },
  { name: "Raipur", state: "Chhattisgarh" },
  { name: "Bhilai", state: "Chhattisgarh" },
  { name: "Bilaspur", state: "Chhattisgarh" },
  { name: "Korba", state: "Chhattisgarh" },
  { name: "Durg", state: "Chhattisgarh" },

  // West Bengal, Odisha, Bihar, Jharkhand
  { name: "Kolkata", state: "West Bengal" },
  { name: "Howrah", state: "West Bengal" },
  { name: "Siliguri", state: "West Bengal" },
  { name: "Durgapur", state: "West Bengal" },
  { name: "Asansol", state: "West Bengal" },
  { name: "Kharagpur", state: "West Bengal" },
  { name: "Bardhaman", state: "West Bengal" },
  { name: "Bhubaneswar", state: "Odisha" },
  { name: "Cuttack", state: "Odisha" },
  { name: "Rourkela", state: "Odisha" },
  { name: "Berhampur", state: "Odisha" },
  { name: "Sambalpur", state: "Odisha" },
  { name: "Puri", state: "Odisha" },
  { name: "Patna", state: "Bihar" },
  { name: "Gaya", state: "Bihar" },
  { name: "Bhagalpur", state: "Bihar" },
  { name: "Muzaffarpur", state: "Bihar" },
  { name: "Darbhanga", state: "Bihar" },
  { name: "Purnia", state: "Bihar" },
  { name: "Ranchi", state: "Jharkhand" },
  { name: "Jamshedpur", state: "Jharkhand" },
  { name: "Dhanbad", state: "Jharkhand" },
  { name: "Bokaro", state: "Jharkhand" },
  { name: "Deoghar", state: "Jharkhand" },

  // North-East & Goa
  { name: "Guwahati", state: "Assam" },
  { name: "Silchar", state: "Assam" },
  { name: "Dibrugarh", state: "Assam" },
  { name: "Jorhat", state: "Assam" },
  { name: "Nagaon", state: "Assam" },
  { name: "Agartala", state: "Tripura" },
  { name: "Shillong", state: "Meghalaya" },
  { name: "Imphal", state: "Manipur" },
  { name: "Aizawl", state: "Mizoram" },
  { name: "Dimapur", state: "Nagaland" },
  { name: "Kohima", state: "Nagaland" },
  { name: "Gangtok", state: "Sikkim" },
  { name: "Itanagar", state: "Arunachal Pradesh" },
  { name: "Panaji", state: "Goa" },
  { name: "Margao", state: "Goa" },
  { name: "Vasco da Gama", state: "Goa" }
];

// Unique sorted list of all Indian cities
export const CITIES = Array.from(
  new Set(PIN_TO_PIN_INDIAN_CITIES.map((c) => c.name))
).sort((a, b) => a.localeCompare(b));

export const LANGUAGES = [
  "Hindi", "Telugu", "Tamil", "Kannada", "Malayalam", "English"
];

export const GENRES = [
  "Action", "Drama", "Comedy", "Thriller", "Romance", "Adventure", "Sci-Fi", "Crime", "Fantasy", "Biography", "History", "War", "Mythological", "Horror", "Animation"
];

export const MOVIES = [
  {
    id: "mov-101",
    title: "IRUMUDI",
    language: "Telugu",
    languages: ["Telugu", "Tamil"],
    genre: ["Action", "Drama", "Thriller"],
    certification: "U/A-3+",
    duration: "180 min",
    rating: 8.8,
    votes: "142.5K",
    releaseDate: "2026-08-21",
    status: "now_showing",
    poster: "https://m.media-amazon.com/images/M/MV5BMjZlMDBhYzktYTY4OS00ZGU3LWEwNzQtOTBiY2M0MTVjMmIyXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    backdrop: "https://m.media-amazon.com/images/M/MV5BMjZlMDBhYzktYTY4OS00ZGU3LWEwNzQtOTBiY2M0MTVjMmIyXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    trailerUrl: "https://youtu.be/CSXhb2zhfLc?si=dbxmLhvFEzA13kIc",
    trailers: {
      Telugu: "https://youtu.be/CSXhb2zhfLc?si=dbxmLhvFEzA13kIc",
      Tamil: "https://youtu.be/EGqkhESMhJQ?si=e4rLnepuFFuOksEN"
    },
    synopsis: "Irumudi is a sacred, dual-compartment cloth bundle carried on the head by Sabarimala pilgrims, holding divine offerings (like a ghee-filled coconut) in the front and personal travel essentials in the back.",
    director: "Shiva Nirvana",
    cast: [
      { name: "Raviteja", role: "Trinadh Rama Kasu", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjWwQQ1BzO1EW6N-NZswTOenSgEPnftR-TT2DJkDDn4w&s=10" },
      { name: "Priya Bhavani Shankar", role: "Lead Heroine", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQ8CN5y5L8gXLEuvi0GTdNYSHn0X6ZkCXmAqdtlJe8dw&s=10" }
    ],
    crew: [
      { name: "Shiva Nirvana", role: "Director", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjWwQQ1BzO1EW6N-NZswTOenSgEPnftR-TT2DJkDDn4w&s=10" },
      { name: "G. V. Prakash Kumar", role: "Music Director", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSh02FjzzCjwmOU37V6ZokWCnDK62WTeZK3Lzxb8n2Gtg&s=10" }
    ]
  },
  {
    id: "mov-102",
    title: "Korean Kanakaraju",
    language: "Telugu",
    languages: ["Telugu"],
    genre: ["Comedy", "Action", "Drama", "Fantasy"],
    certification: "U/A",
    duration: "155 min",
    rating: 9.1,
    votes: "210.8K",
    releaseDate: "2026-08-07",
    status: "now_showing",
    poster: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/korean-kanakaraju-et00494465-1785993847.jpg",
    backdrop: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200&auto=format&fit=crop&q=80",
    trailerUrl: "https://www.youtube.com/embed/Y4d8kY-nRfE",
    trailers: {
      Telugu: "https://www.youtube.com/embed/Y4d8kY-nRfE",

    },
    synopsis: "A short-tempered youth from Andhra Pradesh gets possessed by the wandering spirit of a Korean gangster after accidentally ingesting his ashes. Together with his eccentric group of friends, he must navigate comedic chaos and travel all the way to South Korea to fulfill the ghost's unresolved wish.",
    director: "Merlapaka Gandhi",
    cast: [
      { name: "Varun Tej", role: "Kanakaraju", image: "https://i.pinimg.com/474x/86/3d/fe/863dfeed809607652366a0bb6d1c45b7.jpg" },
      { name: "Ritika Nayak", role: "Chaitra", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQEVwJBOM4YaanZ07D0WaA0AcB1cRK66E1l7RmHPoqEA&s" },
      { name: "Satya", role: "Friend", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Satya_%28actor%29.jpg/440px-Satya_%28actor%29.jpg" }
    ],
    crew: [
      { name: "Merlapaka Gandhi", role: "Director", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYtA0shYj-VZmLqofzZP-3NVL2tpEN52GrhLMkwc31mgb41ZT3tqcIdi0Wa0zC6kj57uZ0q50cdG_tWDwvkAJo4ArNTBFqPA-tuY9yD8Yx&s=10" },
      { name: "Thaman S", role: "Music Director", image: "https://static.toiimg.com/thumb/imgsize-23456,msid-122050893,width-600,resizemode-4/pg14-thaman1.jpg" }
    ]
  },
  {
    id: "mov-103",
    title: "Spider-Man: The Brand New Day",
    language: "English",
    languages: ["English", "Telugu", "Tamil", "Hindi", "Kannada", "Malayalam"],
    genre: ["Action", "Adventure", "Sci-Fi", "Fantasy"],
    certification: "U/A",
    duration: "152 min",
    rating: 8.9,
    votes: "185.2K",
    releaseDate: "2026-07-31",
    status: "now_showing",
    poster: "https://cdn.district.in/movies-assets/images/cinema/image-(29)-598ac6b0-6a24-11f1-8579-1756095b1930.jpg",
    backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80",
    trailerUrl: "https://www.youtube.com/embed/62bIsvRcPv0",
    trailers: {
      English: "https://www.youtube.com/embed/62bIsvRcPv0",
      Telugu: "https://youtu.be/x-9i31iPe2A?si=jOb_rEzCrYLlZAgA",
      Tamil: "https://youtu.be/uZAwsh-unZ8?si=RcKe-zvMpTyhGMQL",
      Hindi: "https://youtu.be/Fi1wAaQkJHU?si=yi0-RhbMXRjUcV0P",
      Kannada: "https://youtu.be/h9W06ROR2h0?si=MA0VaJlex7jk96yM",
      Malayalam: "https://youtu.be/PgbXZm3l8Hg?si=Sg479g0_z0aGJWnO"
    },
    synopsis: "Peter Parker navigates a fresh start in New York City after the world forgets his civilian identity, balancing college life and everyday struggles with formidable new multiverse threats and high-stakes criminal syndicates.",
    director: "Destin Daniel Cretton",
    cast: [
      { name: "Tom Holland", role: "Peter Parker / Spider-Man", image: "https://resizing.flixster.com/qiU8frqdLTxeqrghBSR-S3Au2lI=/fit-in/705x460/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/733885_v9_bc.jpg" },
      { name: "Zendaya", role: "MJ", image: "https://media.allure.com/photos/69b01d72fc8b6dd40c7e3f34/master/w_1600%2Cc_limit/zendaya%2520short%2520curly%2520bixie%2520paris.jpg" },
      { name: "Jacob Batalon", role: "Ned Leeds", image: "https://m.media-amazon.com/images/M/MV5BZjU5ZjQwMWEtOWM5OS00ODJmLThiZTMtODhkNTc2MWI3MWZjXkEyXkFqcGc@._V1_.jpg" }
    ],
    crew: [
      { name: "Destin Daniel Cretton", role: "Director", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsGBWdjStJ2Jn8XSNogIeQkkNCfeneZmoMvUHug4_PMQ&s=10" },
      { name: "Michael Giacchino", role: "Music Director", image: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Michael_Giacchino_Sep_2017.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original" }
    ]
  },
  {
    id: "mov-104",
    title: "DC",
    year: 2026,
    language: "Tamil",
    languages: ["Tamil", "Telugu"],
    country: "India",
    genre: ["Action", "Crime", "Thriller", "Drama"],
    certification: "A",
    duration: "155 min",
    rating: 9.3,
    votes: "142.6K",
    releaseDate: "2026-08-07",
    status: "now_showing",
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCwuCXdpVXXvvVzJILAYrpWwmnHH--0DBXKDtPLLYx0A&s",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80",
    trailerUrl: "https://www.youtube.com/embed/2kntxizQIFI",
    trailers: {
      Tamil: "https://www.youtube.com/embed/2kntxizQIFI",
      Telugu: "https://www.youtube.com/embed/J016rybm1o0"
    },
    synopsis: "Devadas, a fearless outlaw, joins forces with Chandra, a resilient woman seeking justice. Together, the two embark on a relentless, high-stakes battle of vengeance and survival against corrupt syndicate kingpins and rogue police forces, fueled by Anirudh Ravichander's explosive musical score.",
    director: "Arun Matheswaran",
    writer: "Arun Matheswaran",
    dialogueWriter: "Franklin Jacob",
    additionalScreenplay: "Arun Ranjan",
    producer: "Kalanithi Maran",
    production: "Sun Pictures",
    cinematography: "Mukesh G",
    editor: "Prasanna GK",
    music: "Anirudh Ravichander",
    cast: [
      {
        name: "Lokesh Kanagaraj",
        character: "Devadas",
        role: "Devadas",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqYZJdAAjzbjnXwWknpRHnjwnXqZfpRoHl92zEOA-kwor6yWIRtnTO_E4lRsXphDtdXB4MCN4rjv89k2GgQkyurHFOIFM10bRMwFuK0F6neA&s=10"
      },
      {
        name: "Wamiqa Gabbi",
        character: "Chandra",
        role: "Chandra",
        image: "https://upload.wikimedia.org/wikipedia/commons/e/e1/Wamiqa_Gabbi_snapped_outside_Maddock_office_%282%29_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original"
      },
      {
        name: "Sanjana Krishnamoorthy",
        character: "Parvathy",
        role: "Parvathy",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6p3-f7uGy82sQuf_AuGmOtKt3XNzlaeC49gEjGum6Ip_gViH_FkJYDhVUo4iXRKteSbaVSNod3v29AM33S6igvTzeXFIxQQ_190il77ru&s=10"
      }
    ],
    crew: [
      {
        name: "Arun Matheswaran",
        role: "Director",
        image: "https://pbs.twimg.com/media/GqV4u3Qa4AA8Ajd.jpg"
      },
      {
        name: "Anirudh Ravichander",
        role: "Music Director / Composer",
        image: "data:image/webp;base64,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"
      },
      {
        name: "Kalanithi Maran",
        role: "Producer (Sun Pictures)",
        image: "https://imageio.forbes.com/specials-images/imageserve/615b2ce02324216fa0fe0d6d/0x0.jpg?format=jpg&crop=894,895,x164,y91,safe&height=416&width=416&fit=bounds"
      },
    
    ]
  },
  {
    id: "mov-105",
    title: " Chennai LoveStory",
    language: "Telugu",
    languages: ["Telugu"],
    genre: ["Romance", "Drama", "Comedy"],
    certification: "U/A",
    duration: "178 min",
    rating: 8.4,
    votes: "115.0K",
    releaseDate: "July 24, 2026",
    status: "now_showing",
    poster: "https://m.media-amazon.com/images/M/MV5BYmNhOWU4ZmItNDNlYi00N2ZkLWFlZDEtM2RhNWI5NDgyYzQwXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80",
    trailerUrl: "https://www.youtube.com/embed/5cx7rvMvAWo",
    trailers: {
      Telugu: "https://youtu.be/nYYjR9diizE?si=HPW7wUnJHFLlkmDg",
     
    },
    synopsis: "follows Niveditha, whose life shatters when her fiancé abandons her on their wedding day. Struggling with deep emotional trauma, she meets Steven Shankar, an aspiring filmmaker. Their unexpected bond grows into a healing romance, though a dramatic mid-point twist tests their future.",
    director: "Ravi Namburi",
    cast: [
      { name: "Kiran Abbavaram", role: "Steven Shankar", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPYg7ELssPXGutPteyfYgtO62dfukkwT2BpTflAx208Q&s=10" },
      { name: "Sri Gouri Priya", role: "Nivedita / Nivi", image: "https://www.kollywoodzone.com/boxoffice/wp-content/uploads/2023/09/Heroine-Sri-Gouri-Priya-at-Chennai-Love-Story-Movie-Song-Launch-Photos-08.jpg" },
      { name: "Adith Arun", role: "Ajay", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyAeS3YUYSFXtp6jSbdwBPo-TnOMn7kkViU9QJBSaOGojrqyTXbEGtbRs&s=10" }
    ],
    crew: [
      { name: "Ravi Namburi", role: "Director", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80" },
      { name: "Mani Sharma", role: "Music Director", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Mani_Sharma.jpg/440px-Mani_Sharma.jpg" }
    ]
  },
  {
    id: "mov-106",
    title: "Dragon",
    language: "Telugu",
    languages: [ "Telugu", "Hindi", "Tamil", "Kannada", "Malayalam"],
    genre: ["Action", "Crime", "Thriller", "Drama"],
    certification: "U/A",
    duration: "190 min",
    rating: 9.3,
    releaseDate: "June 11, 2027",
    status: "coming_soon",
    poster: "https://preview.redd.it/new-poster-of-dragon-v0-ys7q7rvhea2h1.jpeg?width=1080&crop=smart&auto=webp&s=29c4333f1c1fcd6870c7f4dc2d1a80cf61f4405f",
    backdrop: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=80",
    trailerUrl: "https://www.youtube.com/embed/6u_66gI_Wyo",
    trailers: {
      Telugu: "https://www.youtube.com/embed/6u_66gI_Wyo",
      Hindi: "https://www.youtube.com/embed/6u_66gI_Wyo",
      Tamil: "https://www.youtube.com/embed/6u_66gI_Wyo",
      Kannada: "https://www.youtube.com/embed/6u_66gI_Wyo",
      Malayalam: "https://www.youtube.com/embed/6u_66gI_Wyo"
    },
    synopsis: "Set in the late 1960s, Dragon follows a brutal global war for control over the lucrative opium trade. Jr NTR stars as Luger, a ruthless and feared assassin-in-chief caught in the crossfire of powerful syndicates and law enforcement.",
    director: "Prashanth Neel",
    cast: [
      { name: "Jr NTR", role: "Luger", image: "https://en.wikipedia.org/wiki/Special:FilePath/Jr_NTR_promoting_RRR_in_Delhi.jpg?width=400" },
      { name: "Rukmini Vasanth", role: "Heroine", image: "https://en.wikipedia.org/wiki/Special:FilePath/Rukmini_Vasanth_in_2023.jpg?width=400" },
      { name: "Anil Kapoor", role: "Raghuveer Rathod", image: "https://en.wikipedia.org/wiki/Special:FilePath/Anil_Kapoor_promoting_Fighter.jpg?width=400" }
    ],
    crew: [
      { name: "Prashanth Neel", role: "Director", image: "https://en.wikipedia.org/wiki/Special:FilePath/Prashanth_Neel_at_Salaar_Event.jpg?width=400" },
      { name: "Ravi Basrur", role: "Music Director", image: "https://i.scdn.co/image/ab6761610000e5ebef0d801d386d15b5a2b37b06" }
    ]
  },

  {
    id: "mov-108",
    title: "The End of Oak Street",
    language: "English",
    languages: ["English", "Telugu", "Hindi", "Tamil"],
    genre: ["Sci-Fi", "Mystery", "Thriller", "Adventure"],
    certification: "U/A",
    duration: "135 min",
    rating: 9.2,
    votes: "450.6K",
    releaseDate: "August 14, 2026",
    status: "now_showing",
    poster: "https://upload.wikimedia.org/wikipedia/en/thumb/7/7e/The_End_of_Oak_Street_poster.jpg/250px-The_End_of_Oak_Street_poster.jpg?utm_source=en.wikipedia.org&utm_campaign=parser&utm_content=thumbnail",
    backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80",
    trailerUrl: "https://www.youtube.com/embed/uYPbbksJxIg",
    trailers: {
      English: "https://youtu.be/3oB9AxspVow?si=uBow7yNc6DPMey_O",
      Telugu: "https://youtu.be/g_alqWGkXU8?si=sMO23pG7K4f8n-pJ",
      Hindi: "https://youtu.be/SVL_2TNMJtQ?si=uS9PLu-68XQ5c2Bt",
      Tamil: "https://youtu.be/K-r_bvfPz_k?si=icfvMua2X-CoAleQ",
    },
    synopsis: "Set in the 1980s, a suburban neighborhood is abruptly separated from reality by an enigmatic cosmic anomaly. Denise and Greg Platt must navigate ancient prehistoric threats, save their family, and unravel the mystery at the end of Oak Street.",
    director: "David Robert Mitchell",
    cast: [
      { name: "Anne Hathaway", role: "Denise Platt", image: "https://en.wikipedia.org/wiki/Special:FilePath/Anne_Hathaway-68408_(cropped).jpg?width=400" },
      { name: "Ewan McGregor", role: "Greg Platt", image: "https://en.wikipedia.org/wiki/Special:FilePath/Ewan_McGregor_by_Gage_Skidmore_2.jpg?width=400" },
      { name: "Maisy Stella", role: "Audrey Platt", image: "https://en.wikipedia.org/wiki/Special:FilePath/Maisy_Stella_2018.jpg?width=400" },
      { name: "Christian Convery", role: "Brian Platt", image: "https://en.wikipedia.org/wiki/Special:FilePath/Christian_Convery_by_Gage_Skidmore.jpg?width=400" },
      { name: "P. J. Byrne", role: "Neighbor / Jim", image: "https://en.wikipedia.org/wiki/Special:FilePath/P._J._Byrne_by_Gage_Skidmore.jpg?width=400" }
    ],
    crew: [
      { name: "David Robert Mitchell", role: "Director & Writer", image: "https://en.wikipedia.org/wiki/Special:FilePath/David_Robert_Mitchell_at_Cannes_2018.jpg?width=400" },
      { name: "J. J. Abrams", role: "Producer", image: "https://en.wikipedia.org/wiki/Special:FilePath/J._J._Abrams_by_Gage_Skidmore_2.jpg?width=400" },
      { name: "Michael Giacchino", role: "Music Composer", image: "https://en.wikipedia.org/wiki/Special:FilePath/Michael_Giacchino_2017.jpg?width=400" }
    ]
  },
  // ================= UPCOMING / UNRELEASED BLOCKBUSTERS =================
  {
    id: "mov-tel-spirit",
    title: "Spirit",
    language: "Telugu",
    languages: ["Telugu", "Hindi", "Tamil", "Kannada", "Malayalam"],
    genre: ["Action", "Crime", "Thriller", "Drama"],
    certification: "A",
    duration: "185 min",
    rating: 9.6,
    releaseDate: "March 5, 2027",
    status: "coming_soon",
    poster: "https://m.media-amazon.com/images/M/MV5BNzMxMDdiYzAtNGM0Ni00ZWQxLWI0ZTUtMzdkMjBkMzExYWZmXkEyXkFqcGc@._V1_.jpg",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80",
    trailerUrl: "https://www.youtube.com/embed/i0j94mF3otA",
    trailers: {
      Telugu: "https://www.youtube.com/embed/i0j94mF3otA",
      Hindi: "https://www.youtube.com/embed/i0j94mF3otA",
      Tamil: "https://www.youtube.com/embed/i0j94mF3otA",
      Kannada: "https://www.youtube.com/embed/i0j94mF3otA",
      Malayalam: "https://www.youtube.com/embed/i0j94mF3otA"
    },
    synopsis: "An intense, high-octane cop action thriller following an uncompromising, fierce police officer who wages a solitary war against systemic corruption and underground crime syndicates.",
    director: "Sandeep Reddy Vanga",
    cast: [
      { name: "Prabhas", role: "IPS Officer / Spirit", image: "https://cf-images.assettype.com/outlookindia/2024-12-27/dbgs5pvj/1.jpg?w=801&auto=format%2Ccompress&fit=max&format=webp&dpr=1.0" },
      { name: "Triptii Dimri", role: "Female Lead", image: "https://miro.medium.com/1*NdLaR2x3vBoKEjQ-45qssg.jpeg" },
      { name: "Vivek Oberoi", role: "Antagonist", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYFhgN0vFXJQ8t3uQynFRjAdUn2WbCnd6OzKBrAFYmvy062PMm6cMhc9g&s=10" }
    ],
    crew: [
      { name: "Sandeep Reddy Vanga", role: "Director & Writer", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqjEnH7ELE3NcP5fmwhE8m09zaSEn0FaYqTiT9SdQaLdSozVGzo5Yf9WE&s=10" },
      { name: "Harshavardhan Rameshwar", role: "Music Director", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThFKJgQEHtdQO_uTvauXk6krKmsbjyREdiaVw9mHvz6NcQGQE7Q9A6XHht&s=10" },
      { name: "Bhushan Kumar", role: "Producer (T-Series)", image: "https://m.media-amazon.com/images/M/MV5BMjI1ODFhNDUtOTM4Mi00YTU5LWJkMzEtZTk2ZDEyYWRmMmUxXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" }
    ]
  },
  {
    id: "mov-tel-varanasi",
    title: "Varanasi (SSMB29)",
    language: "Telugu",
    languages: ["Telugu", "Hindi", "Tamil", "Kannada", "Malayalam", "English"],
    genre: ["Action", "Adventure", "Thriller", "Mythological"],
    certification: "U/A",
    duration: "195 min",
    rating: 9.8,
    releaseDate: "April 9, 2027",
    status: "coming_soon",
    poster: "https://m.media-amazon.com/images/M/MV5BOWIxZWYxNTItOTQ1MS00NGEzLWE0NzktZTRiMDFkMTU3YTlhXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80",
    trailerUrl: "https://www.youtube.com/embed/d9MyW72ELq0",
    trailers: {
      Telugu: "https://www.youtube.com/embed/d9MyW72ELq0",
      English: "https://www.youtube.com/embed/d9MyW72ELq0",
      Hindi: "https://www.youtube.com/embed/d9MyW72ELq0",
      Tamil: "https://www.youtube.com/embed/d9MyW72ELq0",
      Kannada: "https://www.youtube.com/embed/d9MyW72ELq0",
      Malayalam: "https://www.youtube.com/embed/d9MyW72ELq0"
    },
    synopsis: "An Indiana Jones-style globe-trotting jungle adventure and mythical quest rooted in Indian ancient history, spanning the sacred ghats of Varanasi across the world.",
    director: "S. S. Rajamouli",
    cast: [
      { name: "Mahesh Babu", role: "Adventurer / Explorer", image: "https://en.wikipedia.org/wiki/Special:FilePath/Mahesh_Babu_in_Spyder.jpg?width=400" },
      { name: "Prithviraj Sukumaran", role: "Rival Explorer", image: "https://en.wikipedia.org/wiki/Special:FilePath/Prithviraj_Sukumaran_at_Aadujeevitham_Press_Meet.jpg?width=400" },
      { name: "Priyanka Chopra", role: "Lead Partner", image: "https://en.wikipedia.org/wiki/Special:FilePath/Priyanka-chopra-gesf-2018-7565.jpg?width=400" }
    ],
    crew: [
      { name: "S. S. Rajamouli", role: "Director", image: "https://en.wikipedia.org/wiki/Special:FilePath/S._S._Rajamouli_at_RRR_promotions.jpg?width=400" },
      { name: "M. M. Keeravani", role: "Music Director", image: "https://en.wikipedia.org/wiki/Special:FilePath/M._M._Keeravani_at_Inji_Iduppazhagi_Audio_Launch_(cropped).jpg?width=400" },
      { name: "K. L. Narayana", role: "Producer", image: "https://en.wikipedia.org/wiki/Special:FilePath/K.L._Narayana.jpg?width=400" }
    ]
  },
  {
    id: "mov-tel-Paradise",
    title: "The Paradise",
    language: "Telugu",
    languages: ["Telugu", "Hindi", "Tamil", "Kannada", "Malayalam"],
    genre: ["Action", "Drama", "Period Drama", "Thriller"],
    certification: "U/A",
    duration: "165 min",
    rating: 9.4,
    releaseDate: "September 24, 2026",
    status: "coming_soon",
    poster: "https://cdn.district.in/movies-assets/images/cinema/The-Paradise_Poster-2c67d280-75d9-11f0-8df3-db01d1baa444.jpg",
    backdrop: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200&auto=format&fit=crop&q=80",
    trailerUrl: "https://www.youtube.com/embed/namFQ8wFdIA",
    trailers: {
      Telugu: "https://www.youtube.com/embed/namFQ8wFdIA",
      Hindi: "https://www.youtube.com/embed/namFQ8wFdIA",
      Tamil: "https://www.youtube.com/embed/namFQ8wFdIA",
      Kannada: "https://www.youtube.com/embed/namFQ8wFdIA",
      Malayalam: "https://www.youtube.com/embed/namFQ8wFdIA"
    },
    synopsis: "Follows a marginalized tribe fighting systemic oppression and discrimination to win their basic rights and citizenship under an unexpected leader.",
    director: "Srikanth Odela",
    cast: [
      { name: "Nani", role: "Jadal", image: "https://imgs.etvbharat.com/etvbharat/prod-images/30-04-2025/1200-675-24070560-17-24070560-1746027276608.jpg" },
      { name: "Kayadu Lohar", role: "Female Lead", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1c2nLDooZLN6_PPLowIrOpcaEj1ZEZwuHjg2QiabXoU3uv-O_-q5VCiY&s=10" },
      { name: "Mohan Babu", role: "Shikanja Maalik", image: "https://www.telugu360.com/wp-content/uploads/2017/10/Mohan-Babu-playing-both-hero-and-Villain-roles-in-Madan-direction.jpg" }
    ],
    crew: [
      { name: "Srikanth Odela", role: "Director", image: "https://content.tupaki.com/en/feeds/2024/08/25/493762-srikanth.gif" },
      { name: "Anirudh Ravichander", role: "Music Director", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3POfnYNdvmdeUypwfGgXd4psnmKCWupXTHviF3guzLMfSHZzBtM97Irw&s=10" },
      { name: "Sudhakar Cherukuri", role: "Producer (SLV Cinemas)", image: "https://cinetown.s3.ap-south-1.amazonaws.com/people/profile_img/1734709186.jpeg" }
    ]
  },
  {
    id: "mov-tel-fauji",
    title: "Fauji",
    language: "Telugu",
    languages: ["Telugu", "Hindi", "Tamil", "Kannada", "Malayalam"],
    genre: ["Action", "Period Drama", "Romance", "War"],
    certification: "U/A",
    duration: "175 min",
    rating: 9.3,
    releaseDate: "December 3, 2026",
    status: "coming_soon",
    poster: "https://m.media-amazon.com/images/M/MV5BY2M5ZmU0MTYtODRmNC00MDAzLWE2N2UtYTExMDYwYmZjNWJmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80",
    trailerUrl: "https://www.youtube.com/embed/6acRF8Jjq30",
    trailers: {
      Telugu: "https://www.youtube.com/embed/6acRF8Jjq30",
      Hindi: "https://www.youtube.com/embed/6acRF8Jjq30",
      Tamil: "https://www.youtube.com/embed/6acRF8Jjq30",
      Kannada: "https://www.youtube.com/embed/6acRF8Jjq30",
      Malayalam: "https://www.youtube.com/embed/6acRF8Jjq30"
    },
    synopsis: "A grand historical period romance and war action drama set in the 1940s pre-independence era, chronicling a soldier's unwavering courage and profound love.",
    director: "Hanu Raghavapudi",
    cast: [
      { name: "Prabhas", role: "British Indian Army Soldier", image: "https://en.wikipedia.org/wiki/Special:FilePath/Prabhas_promoting_Baahubali_in_June_2015.jpg?width=400" },
      { name: "Imanvi", role: "Lead Heroine", image: "https://pbs.twimg.com/media/HFyZmRyaMAA1MxL.jpg" },
      { name: "Mithun Chakraborty", role: "Senior Commander", image: "https://en.wikipedia.org/wiki/Special:FilePath/Mithun_Chakraborty_at_Star_Guild_Awards.jpg?width=400" }
    ],
    crew: [
      { name: "Hanu Raghavapudi", role: "Director", image: "https://en.wikipedia.org/wiki/Special:FilePath/Hanu_Raghavapudi_at_Sita_Ramam_press_meet.jpg?width=400" },
      { name: "Vishal Chandrasekhar", role: "Music Director", image: "https://en.wikipedia.org/wiki/Special:FilePath/Vishal_Chandrashekhar.jpg?width=400" },
      { name: "Naveen Yerneni", role: "Producer (Mythri Movie Makers)", image: "https://en.wikipedia.org/wiki/Special:FilePath/Naveen_Yerneni.jpg?width=400" }
    ]
  },
  {
    id: "mov-up-toxic",
    title: "Toxic: A Fairy Tale for Grown-ups",
    language: "Kannada",
    languages: ["Kannada", "Telugu", "Hindi", "Tamil", "Malayalam"],
    genre: ["Action", "Crime", "Thriller", "Drama"],
    certification: "A",
    duration: "180 min",
    rating: 9.8,
    releaseDate: "August 26, 2026",
    status: "coming_soon",
    poster: "https://static.toiimg.com/thumb/imgsize-15184,msid-105829950,width-1000,resizemode-4/105829950.jpg",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80",
    trailerUrl: "https://www.youtube.com/embed/ICBXwQUrpX0",
    trailers: {
      Kannada: "https://www.youtube.com/embed/ICBXwQUrpX0",
      Telugu: "https://www.youtube.com/embed/ICBXwQUrpX0",
      Hindi: "https://www.youtube.com/embed/ICBXwQUrpX0",
      Tamil: "https://www.youtube.com/embed/ICBXwQUrpX0",
      Malayalam: "https://www.youtube.com/embed/ICBXwQUrpX0"
    },
    synopsis: "Set against the backdrop of the international drug cartel and underworld nexus between 1950 and 1970, Toxic follows a charismatic anti-hero who rules through fear and dark mythos.",
    director: "Geetu Mohandas",
    cast: [
      { name: "Yash", role: "Raya / Lead Protagonist", image: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Yash_at_KGF_2_trailer_launch.jpg" },
      { name: "Kiara Advani", role: "Female Lead", image: "https://upload.wikimedia.org/wikipedia/commons/3/30/Kiara_Advani_attending_the_Green_Carpet_at_IIFA_2022.jpg" },
      { name: "Nayanthara", role: "Sister / Royal Matriarch", image: "https://upload.wikimedia.org/wikipedia/commons/9/91/Nayanthara_at_Jawan_event.jpg" }
    ],
    crew: [
      { name: "Geetu Mohandas", role: "Director", image: "https://upload.wikimedia.org/wikipedia/commons/d/da/Geetu_Mohandas.jpg" },
      { name: "Jeremy Stack", role: "Music Director", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH64c1uUvVfE3vJkU1N0b9Rj-i0Y5s6D7V8A&s" },
      { name: "Venkat K. Narayana", role: "Producer (KVN Productions)", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6s2c5oQ66M5_2eGk-7UuJ6Q_gA7W1y2x3zA&s" }
    ]
  },
  {
    id: "mov-up-ramayana",
    title: "Ramayana: Part 1",
    language: "Hindi",
    languages: ["Hindi", "Telugu", "Tamil", "Kannada", "Malayalam", "English"],
    genre: ["Mythological", "Action", "Drama", "Epic", "Fantasy"],
    certification: "U",
    duration: "210 min",
    rating: 9.9,
    releaseDate: "Diwali 2026",
    status: "coming_soon",
    poster: "https://m.media-amazon.com/images/M/MV5BMzljMTFkYTktMjQ0MC00NjFhLWFmOTEtOTMyZmVhNTBmYTMzXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    backdrop: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=80",
    trailerUrl: "https://www.youtube.com/embed/d9MyW72ELq0",
    trailers: {
      Hindi: "https://www.youtube.com/embed/d9MyW72ELq0",
      Telugu: "https://www.youtube.com/embed/d9MyW72ELq0",
      Tamil: "https://www.youtube.com/embed/d9MyW72ELq0",
      Kannada: "https://www.youtube.com/embed/d9MyW72ELq0",
      Malayalam: "https://www.youtube.com/embed/d9MyW72ELq0"
    },
    synopsis: "The magnum opus cinematic retelling of the ancient Indian epic Ramayana, tracing the divine birth, exile of Lord Rama with Sita and Lakshmana, and the clash with Lanka's king Raavan.",
    director: "Nitesh Tiwari",
    cast: [
      { name: "Ranbir Kapoor", role: "Lord Rama", image: "https://upload.wikimedia.org/wikipedia/commons/e/ec/Ranbir_Kapoor_promoting_Brahmastra.jpg" },
      { name: "Sai Pallavi", role: "Mata Sita", image: "https://upload.wikimedia.org/wikipedia/commons/3/36/Sai_Pallavi_at_Gargi_press_meet.jpg" },
      { name: "Yash", role: "Lankeshwar Raavan", image: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Yash_at_KGF_2_trailer_launch.jpg" },
      { name: "Sunny Deol", role: "Lord Hanuman", image: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Sunny_Deol_in_2023.jpg" }
    ],
    crew: [
      { name: "Nitesh Tiwari", role: "Director", image: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Nitesh_Tiwari_Dangal.jpg" },
      { name: "A. R. Rahman & Hans Zimmer", role: "Music Composers", image: "https://upload.wikimedia.org/wikipedia/commons/7/71/A._R._Rahman_at_NMACC.jpg" },
      { name: "Namit Malhotra", role: "Producer (DNEG / Prime Focus)", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR611y06HjJvB-jJ54Uf_G8k7R1t-ZtWp9z7g&s" }
    ]
  },
  {
    id: "mov-up-jailer2",
    title: "Jailer 2 (HUKUM)",
    language: "Tamil",
    languages: ["Tamil", "Telugu", "Hindi", "Kannada", "Malayalam"],
    genre: ["Action", "Crime", "Thriller", "Comedy"],
    certification: "U/A",
    duration: "170 min",
    rating: 9.7,
    releaseDate: "May 2027",
    status: "coming_soon",
    poster: "https://m.media-amazon.com/images/M/MV5BYmE0MTFjOTYtMWYxNC00YjFjLTlhNzYtMWQ5ZDEwNjRmYzE1XkEyXkFqcGc@._V1_.jpg",
    backdrop: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200&auto=format&fit=crop&q=80",
    trailerUrl: "https://www.youtube.com/embed/6u_66gI_Wyo",
    trailers: {
      Tamil: "https://www.youtube.com/embed/6u_66gI_Wyo",
      Telugu: "https://www.youtube.com/embed/6u_66gI_Wyo",
      Hindi: "https://www.youtube.com/embed/6u_66gI_Wyo",
      Kannada: "https://www.youtube.com/embed/6u_66gI_Wyo",
      Malayalam: "https://www.youtube.com/embed/6u_66gI_Wyo"
    },
    synopsis: "Tiger Muthuvel Pandian returns to dismantle an international cartel threatening national security, joining hands once again with fierce allies Narasimha and Mathew.",
    director: "Nelson Dilipkumar",
    cast: [
      { name: "Rajinikanth", role: "Tiger Muthuvel Pandian", image: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Rajinikanth_in_2023.jpg" },
      { name: "Mohanlal", role: "Mathew", image: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Mohanlal_at_Vanitha_Film_Awards.jpg" },
      { name: "Shiva Rajkumar", role: "Narasimha", image: "https://upload.wikimedia.org/wikipedia/commons/e/e9/Shiva_Rajkumar_at_Ghost_Press_Meet.jpg" }
    ],
    crew: [
      { name: "Nelson Dilipkumar", role: "Director", image: "https://upload.wikimedia.org/wikipedia/commons/7/77/Nelson_Dilipkumar_at_Jailer_press_meet.jpg" },
      { name: "Anirudh Ravichander", role: "Music Director", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3POfnYNdvmdeUypwfGgXd4psnmKCWupXTHviF3guzLMfSHZzBtM97Irw&s=10" },
      { name: "Kalanithi Maran", role: "Producer (Sun Pictures)", image: "https://imageio.forbes.com/specials-images/imageserve/615b2ce02324216fa0fe0d6d/0x0.jpg?format=jpg&crop=894,895,x164,y91,safe&height=416&width=416&fit=bounds" }
    ]
  }
];

export const THEATRES = [
  // --- HYDERABAD ---
  {
    id: "th-hyd-1",
    name: "PVR Next Galleria, Panjagutta",
    city: "Hyderabad",
    address: "Irrum Manzil Metro Station, Panjagutta, Hyderabad",
    distance: "280 km from Tenali, AP",
    rating: 4.6,
    facilities: ["Parking", "Food Court", "Dolby Atmos", "Recliner Seats", "Wheelchair Access", "IMAX"],
    screens: [
      { id: "scr-hyd-101", name: "Screen 1 - IMAX Laser", type: "IMAX Laser" },
      { id: "scr-hyd-102", name: "Screen 2 - Dolby Atmos 4K", type: "Dolby Atmos 4K" },
      { id: "scr-hyd-103", name: "Screen 3 - P[XL] Premium", type: "P[XL] Premium" }
    ]
  },
  {
    id: "th-hyd-2",
    name: "AMB Cinemas, Gachibowli",
    city: "Hyderabad",
    address: "Sarath City Capital Mall, Gachibowli, Hyderabad",
    distance: "288 km from Tenali, AP",
    rating: 4.9,
    facilities: ["Valet Parking", "Gourmet Lounge", "Dolby Atmos", "VIP Recliner", "Wheelchair Access"],
    screens: [
      { id: "scr-hyd-201", name: "Screen 1 - Superplex VIP", type: "Dolby Atmos" },
      { id: "scr-hyd-202", name: "Screen 2 - M-Screen", type: "4K Laser" }
    ]
  },
  {
    id: "th-hyd-3",
    name: "Prasads Multiplex & IMAX, NTR Marg",
    city: "Hyderabad",
    address: "NTR Gardens, Neckalace Road, Khairatabad, Hyderabad",
    distance: "282 km from Tenali, AP",
    rating: 4.8,
    facilities: ["Giant Screen", "4K Projection", "Food Court", "Game Zone", "Valet Parking"],
    screens: [
      { id: "scr-hyd-301", name: "Screen 1 - Prasads Large Screen", type: "IMAX 4K Laser" },
      { id: "scr-hyd-302", name: "Screen 2 - Dolby Atmos", type: "Dolby Atmos" }
    ]
  },
  {
    id: "th-hyd-4",
    name: "Asian Vijayalakshmi 4K, LB Nagar",
    city: "Hyderabad",
    address: "Kothapet, LB Nagar, Hyderabad",
    distance: "275 km from Tenali, AP",
    rating: 4.5,
    facilities: ["RGB Laser", "Dolby Atmos", "Snack Bar", "Parking"],
    screens: [
      { id: "scr-hyd-401", name: "Main Screen - 4K Dolby Atmos", type: "Dolby Atmos" }
    ]
  },

  // --- MUMBAI ---
  {
    id: "th-mum-1",
    name: "INOX Laserplex, Nariman Point",
    city: "Mumbai",
    address: "CR2 Mall, Nariman Point, Mumbai",
    distance: "870 km from Tenali, AP",
    rating: 4.7,
    facilities: ["Parking", "Gourmet Cafe", "IMAX", "Dolby Atmos", "INSIGNIA Recliners"],
    screens: [
      { id: "scr-mum-101", name: "Screen 1 - INSIGNIA VIP", type: "INSIGNIA VIP" },
      { id: "scr-mum-102", name: "Screen 2 - IMAX 3D", type: "IMAX 3D" }
    ]
  },
  {
    id: "th-mum-2",
    name: "PVR ICON, Phoenix Palladium, Lower Parel",
    city: "Mumbai",
    address: "462, Senapati Bapat Marg, Lower Parel, Mumbai",
    distance: "865 km from Tenali, AP",
    rating: 4.9,
    facilities: ["IMAX 4K Laser", "Play House", "Gold Class Lounge", "Valet Parking"],
    screens: [
      { id: "scr-mum-201", name: "Screen 1 - IMAX 4K Laser", type: "IMAX Laser" },
      { id: "scr-mum-202", name: "Screen 2 - PVR Playhouse", type: "Dolby Atmos" }
    ]
  },
  {
    id: "th-mum-3",
    name: "Maison INOX, Jio World Plaza, BKC",
    city: "Mumbai",
    address: "G Block, Bandra Kurla Complex, Bandra East, Mumbai",
    distance: "868 km from Tenali, AP",
    rating: 4.9,
    facilities: ["INSIGNIA Recliners", "Private Screening", "Fine Dining", "Valet Parking"],
    screens: [
      { id: "scr-mum-301", name: "Auditorium 1 - Luxe Suite", type: "INSIGNIA VIP" }
    ]
  },

  // --- BENGALURU ---
  {
    id: "th-blr-1",
    name: "PVR Forum Mall, Koramangala",
    city: "Bengaluru",
    address: "Hosur Road, Koramangala, Bengaluru",
    distance: "520 km from Tenali, AP",
    rating: 4.8,
    facilities: ["Parking", "IMAX", "Gold Class", "Food Court", "4DX"],
    screens: [
      { id: "scr-blr-101", name: "Screen 1 - 4DX 3D", type: "4DX" },
      { id: "scr-blr-102", name: "Screen 2 - Gold Class", type: "Dolby Atmos" }
    ]
  },
  {
    id: "th-blr-2",
    name: "INOX Garuda Mall, Magrath Road",
    city: "Bengaluru",
    address: "Garuda Mall, Magrath Road, Ashok Nagar, Bengaluru",
    distance: "515 km from Tenali, AP",
    rating: 4.7,
    facilities: ["INSIGNIA Lounge", "4K Projection", "Recliners", "Food Court"],
    screens: [
      { id: "scr-blr-201", name: "Screen 1 - INSIGNIA VIP", type: "INSIGNIA VIP" },
      { id: "scr-blr-202", name: "Screen 2 - MX4D 3D", type: "MX4D" }
    ]
  },
  {
    id: "th-blr-3",
    name: "Urvashi Cinema 4K 3D, Lalbagh Road",
    city: "Bengaluru",
    address: "47, Siddaiah Road, Sudhama Nagar, Bengaluru",
    distance: "518 km from Tenali, AP",
    rating: 4.6,
    facilities: ["4K Digital Laser", "Meyer Sound Dolby Atmos", "Parking", "Snack Bar"],
    screens: [
      { id: "scr-blr-301", name: "Main Hall - 4K Laser Atmos", type: "Dolby Atmos 4K" }
    ]
  },

  // --- DELHI NCR ---
  {
    id: "th-del-1",
    name: "PVR Director's Cut, Vasant Kunj",
    city: "Delhi NCR",
    address: "Ambience Mall, Nelson Mandela Marg, Vasant Kunj, New Delhi",
    distance: "1,620 km from Tenali, AP",
    rating: 4.9,
    facilities: ["Platinum Lounge", "Fine Dining", "Recliners", "Valet Parking"],
    screens: [
      { id: "scr-del-101", name: "Screen 1 - Luxury Platinum Suite", type: "Platinum VIP" },
      { id: "scr-del-102", name: "Screen 2 - IMAX 4K Laser", type: "IMAX Laser" }
    ]
  },
  {
    id: "th-del-2",
    name: "INOX Select CITYWALK, Saket",
    city: "Delhi NCR",
    address: "District Centre, Saket, New Delhi",
    distance: "1,615 km from Tenali, AP",
    rating: 4.8,
    facilities: ["IMAX 3D", "INSIGNIA", "Kiddles", "Gourmet Snacks"],
    screens: [
      { id: "scr-del-201", name: "Screen 1 - IMAX Laser", type: "IMAX Laser" },
      { id: "scr-del-202", name: "Screen 2 - INSIGNIA", type: "INSIGNIA VIP" }
    ]
  },
  {
    id: "th-del-3",
    name: "Wave Cinemas, DLF Mall of India, Noida",
    city: "Delhi NCR",
    address: "Sector 18, Noida, Uttar Pradesh",
    distance: "1,625 km from Tenali, AP",
    rating: 4.7,
    facilities: ["Platinum Lounge", "Dolby Atmos", "Recliners", "Food Mall"],
    screens: [
      { id: "scr-del-301", name: "Screen 1 - Platinum Lounge", type: "Dolby Atmos" }
    ]
  },

  // --- CHENNAI ---
  {
    id: "th-che-1",
    name: "Sathyam Luxe Cinemas (SPI), Royapettah",
    city: "Chennai",
    address: "Express Avenue Mall, Royapettah, Chennai",
    distance: "425 km from Tenali, AP",
    rating: 4.9,
    facilities: ["Dolby Atmos", "RDX Laser", "Sathyam Popcorn", "Valet Parking"],
    screens: [
      { id: "scr-che-101", name: "Screen 1 - Sathyam Main", type: "RDX Laser" },
      { id: "scr-che-102", name: "Screen 2 - Santham Atmos", type: "Dolby Atmos" }
    ]
  },
  {
    id: "th-che-2",
    name: "PVR VR Mall, Anna Nagar",
    city: "Chennai",
    address: "100 Feet Road, Anna Nagar West, Chennai",
    distance: "430 km from Tenali, AP",
    rating: 4.8,
    facilities: ["IMAX 4K Laser", "P[XL]", "Play House", "Food Court"],
    screens: [
      { id: "scr-che-201", name: "Screen 1 - IMAX Laser", type: "IMAX Laser" },
      { id: "scr-che-202", name: "Screen 2 - P[XL]", type: "P[XL] Premium" }
    ]
  },
  {
    id: "th-che-3",
    name: "Rohini Silver Screens, Koyambedu",
    city: "Chennai",
    address: "107, Poonamallee High Road, Koyambedu, Chennai",
    distance: "428 km from Tenali, AP",
    rating: 4.7,
    facilities: ["4K RGB Laser", "Dolby Atmos", "Mass Celebrations Zone", "Parking"],
    screens: [
      { id: "scr-che-301", name: "Screen 1 - Main Screen Atmos", type: "Dolby Atmos 4K" }
    ]
  },

  // --- GUNTUR ---
  {
    id: "th-gtr-1",
    name: "Cinepolis Hollywood, Brodipet",
    city: "Guntur",
    address: "4th Line, Brodipet, Guntur, Andhra Pradesh",
    distance: "28.5 km from Tenali, AP",
    rating: 4.6,
    facilities: ["Parking", "Food & Drinks", "4K Projection", "Dolby Atmos", "Recliner"],
    screens: [
      { id: "scr-gtr-101", name: "Screen 1 - Atmos Master", type: "Dolby Atmos" },
      { id: "scr-gtr-102", name: "Screen 2 - Digital 3D", type: "RealD 3D" }
    ]
  },
  {
    id: "th-gtr-2",
    name: "Harihar Mahal 4K Dolby Atmos, Arundelpet",
    city: "Guntur",
    address: "Old Club Road, Arundelpet, Guntur, Andhra Pradesh",
    distance: "29.2 km from Tenali, AP",
    rating: 4.5,
    facilities: ["RGB Laser 4K", "Dolby Atmos", "Pushback Seats", "Canteen"],
    screens: [
      { id: "scr-gtr-201", name: "Screen 1 - Harihar 4K Atmos", type: "Dolby Atmos" }
    ]
  },
  {
    id: "th-gtr-3",
    name: "V Epics 3D 4K, Naaz Multiplex",
    city: "Guntur",
    address: "Naaz Centre, Station Road, Guntur",
    distance: "30.8 km from Tenali, AP",
    rating: 4.7,
    facilities: ["Giant Screen", "Dolby Atmos 7.1", "Recliner Zone", "Parking"],
    screens: [
      { id: "scr-gtr-301", name: "Screen 1 - V Epics Giant", type: "4K Laser" }
    ]
  },

  // --- TENALI ---
  {
    id: "th-tnl-1",
    name: "V Celluloids Plateno 4K, Ithanagar",
    city: "Tenali",
    address: "Ganganamma Peta, Prakasam Road, Ithanagar, Tenali, Andhra Pradesh",
    distance: "1.2 km from Tenali Center",
    rating: 4.8,
    facilities: ["RGB 4K Laser", "Dolby Atmos", "Recliner Seats", "Food Court", "Parking", "Wheelchair Access"],
    screens: [
      { id: "scr-tnl-101", name: "Screen 1 - Plateno 4K Atmos", type: "Dolby Atmos 4K" },
      { id: "scr-tnl-102", name: "Screen 2 - V Laser 3D", type: "4K Laser 3D" }
    ]
  },
  {
    id: "th-tnl-2",
    name: "Asha Cinemas 4K Dolby Atmos, Balajirao Pet",
    city: "Tenali",
    address: "Railway Station Road, Balajirao Pet, Tenali, Andhra Pradesh",
    distance: "0.8 km from Tenali Center",
    rating: 4.7,
    facilities: ["4K Digital Projection", "Dolby Atmos", "Snack Bar", "Spacious Parking", "Pushback Seats"],
    screens: [
      { id: "scr-tnl-201", name: "Screen 1 - Asha 4K Atmos", type: "Dolby Atmos" }
    ]
  },
  {
    id: "th-tnl-3",
    name: "SV Cinemas Priya Sri Priya Complex, Morrispet",
    city: "Tenali",
    address: "Giri Road, Morrispet, Near Railway Station, Tenali, Andhra Pradesh",
    distance: "1.5 km from Tenali Center",
    rating: 4.6,
    facilities: ["Dual Screen Complex", "Dolby Digital 7.1", "Air Conditioned", "Snack Bar", "Bike Parking"],
    screens: [
      { id: "scr-tnl-301", name: "Screen 1 - Priya 4K", type: "4K Laser" },
      { id: "scr-tnl-302", name: "Screen 2 - Sri Priya 7.1", type: "Dolby 7.1" }
    ]
  },
  {
    id: "th-tnl-4",
    name: "Pemmasani Cinema Hall 4K, Bose Road",
    city: "Tenali",
    address: "Bose Road, Ramalingeswara Pet, Tenali, Andhra Pradesh",
    distance: "2.0 km from Tenali Center",
    rating: 4.5,
    facilities: ["Dolby Atmos", "4K RGB Laser", "Canteen", "Wheelchair Access", "AC Lounge"],
    screens: [
      { id: "scr-tnl-401", name: "Screen 1 - Pemmasani 4K", type: "Dolby Atmos 4K" }
    ]
  },
  {
    id: "th-tnl-5",
    name: "Swaraj Deluxe 4K Dolby Atmos, Market Road",
    city: "Tenali",
    address: "Market Road, Near Bose Road, Tenali, Andhra Pradesh",
    distance: "1.8 km from Tenali Center",
    rating: 4.6,
    facilities: ["4K RGB Projection", "Dolby Atmos", "Recliners", "Snack Bar", "Parking"],
    screens: [
      { id: "scr-tnl-501", name: "Main Screen - Swaraj 4K Atmos", type: "Dolby Atmos" }
    ]
  },
  {
    id: "th-tnl-6",
    name: "Sangameswara Cinema Hall, Balaji Rao Peta",
    city: "Tenali",
    address: "Balaji Rao Peta, Near Railway Station, Tenali, Andhra Pradesh",
    distance: "1.1 km from Tenali Center",
    rating: 4.4,
    facilities: ["Dolby Surround 7.1", "Pushback Seats", "Canteen", "Parking"],
    screens: [
      { id: "scr-tnl-601", name: "Screen 1 - Sangameswara 7.1", type: "Dolby 7.1" }
    ]
  },
  {
    id: "th-tnl-7",
    name: "Alankar Cinema Hall 4K, Main Road",
    city: "Tenali",
    address: "Main Road, Near Bus Stand, Tenali, Andhra Pradesh",
    distance: "1.4 km from Tenali Center",
    rating: 4.5,
    facilities: ["4K Laser", "Dolby Atmos", "Air Conditioned", "Parking"],
    screens: [
      { id: "scr-tnl-701", name: "Main Hall - Alankar 4K", type: "Dolby Atmos" }
    ]
  },

  // --- VIJAYAWADA ---
  {
    id: "th-vij-1",
    name: "Capital Cinemas, Trendset Mall",
    city: "Vijayawada",
    address: "MG Road, Benz Circle, Vijayawada",
    distance: "35.2 km from Tenali, AP",
    rating: 4.8,
    facilities: ["Parking", "Dolby Atmos", "Recliners", "Food Court"],
    screens: [
      { id: "scr-vij-101", name: "Screen 1 - 7.1 Atmos Max", type: "Dolby Atmos" },
      { id: "scr-vij-102", name: "Screen 2 - VIP Recliner", type: "4K Laser" }
    ]
  },
  {
    id: "th-vij-2",
    name: "INOX LEPL Icon, Patamata",
    city: "Vijayawada",
    address: "LEPL Icon Mall, Opposite Water Tank, Patamata, Vijayawada",
    distance: "36.0 km from Tenali, AP",
    rating: 4.7,
    facilities: ["INSIGNIA Lounge", "Dolby Digital", "Snack Bar", "Parking"],
    screens: [
      { id: "scr-vij-201", name: "Screen 1 - INOX INSIGNIA", type: "INSIGNIA VIP" }
    ]
  },
  {
    id: "th-vij-3",
    name: "Sailaja Theatre 4K Dolby Atmos, Governorpet",
    city: "Vijayawada",
    address: "Prakasam Road, Governorpet, Vijayawada",
    distance: "38.1 km from Tenali, AP",
    rating: 4.5,
    facilities: ["RGB 4K Laser", "Dolby Atmos", "Canteen", "Spacious Seating"],
    screens: [
      { id: "scr-vij-301", name: "Main Hall - Sailaja 4K Atmos", type: "Dolby Atmos 4K" }
    ]
  },

  // --- KOCHI ---
  {
    id: "th-koc-1",
    name: "PVR Lulu Mall, Edappally",
    city: "Kochi",
    address: "Lulu International Shopping Mall, Edappally, Kochi, Kerala",
    distance: "900 km from Tenali, AP",
    rating: 4.8,
    facilities: ["IMAX 4K Laser", "P[XL]", "Gold Class", "Food Court", "Parking"],
    screens: [
      { id: "scr-koc-101", name: "Screen 1 - IMAX Laser", type: "IMAX Laser" },
      { id: "scr-koc-102", name: "Screen 2 - P[XL] Auditorium", type: "P[XL] Premium" }
    ]
  },
  {
    id: "th-koc-2",
    name: "Cinepolis, Centre Square Mall, MG Road",
    city: "Kochi",
    address: "Centre Square Mall, MG Road, Shenoys, Kochi, Kerala",
    distance: "895 km from Tenali, AP",
    rating: 4.7,
    facilities: ["VIP Recliners", "RealD 3D", "Coffee Shop", "Parking"],
    screens: [
      { id: "scr-koc-201", name: "Screen 1 - VIP Suite", type: "VIP Recliner" },
      { id: "scr-koc-202", name: "Screen 2 - Dolby Atmos 3D", type: "RealD 3D" }
    ]
  },
  {
    id: "th-koc-3",
    name: "Shenoys Theatre 4K Laser, MG Road",
    city: "Kochi",
    address: "Mahatma Gandhi Rd, Shenoys, Ernakulam, Kochi, Kerala",
    distance: "898 km from Tenali, AP",
    rating: 4.9,
    facilities: ["4K RGB Laser Projection", "Dolby Atmos", "Heritage Cinema Lounge", "Valet Parking"],
    screens: [
      { id: "scr-koc-301", name: "Main Screen - Shenoys 4K Laser", type: "Dolby Atmos 4K" }
    ]
  },

  // --- PUNE ---
  {
    id: "th-pne-1",
    name: "PVR Icon, Phoenix Marketcity, Viman Nagar",
    city: "Pune",
    address: "Nagar Road, Viman Nagar, Pune, Maharashtra",
    distance: "785 km from Tenali, AP",
    rating: 4.8,
    facilities: ["IMAX 3D", "4DX", "Gold Class Lounge", "Food Court"],
    screens: [
      { id: "scr-pne-101", name: "Screen 1 - IMAX 3D", type: "IMAX 3D" },
      { id: "scr-pne-102", name: "Screen 2 - 4DX 3D", type: "4DX" }
    ]
  },
  {
    id: "th-pne-2",
    name: "INOX Westend Mall, Aundh",
    city: "Pune",
    address: "Mahadji Shinde Road, Harmony Society, Ward No. 8, Aundh, Pune",
    distance: "790 km from Tenali, AP",
    rating: 4.7,
    facilities: ["INSIGNIA Recliners", "Dolby Atmos", "Gourmet Cafe", "Parking"],
    screens: [
      { id: "scr-pne-201", name: "Screen 1 - INSIGNIA VIP", type: "INSIGNIA VIP" }
    ]
  },
  {
    id: "th-pne-3",
    name: "City PRIDE, Kothrud",
    city: "Pune",
    address: "Paud Road, Kothrud, Pune, Maharashtra",
    distance: "792 km from Tenali, AP",
    rating: 4.6,
    facilities: ["Dolby Atmos", "4K Projection", "Popular Snacks", "Parking"],
    screens: [
      { id: "scr-pne-301", name: "Screen 1 - City PRIDE 4K", type: "Dolby Atmos" }
    ]
  },

  // --- KOLKATA ---
  {
    id: "th-kol-1",
    name: "PVR Mani Square Mall, EM Bypass",
    city: "Kolkata",
    address: "164/1, Maniktala Main Road, EM Bypass, Kolkata",
    distance: "1,020 km from Tenali, AP",
    rating: 4.7,
    facilities: ["IMAX 3D", "Gold Class", "Recliners", "Food Court"],
    screens: [
      { id: "scr-kol-101", name: "Screen 1 - IMAX Laser", type: "IMAX Laser" },
      { id: "scr-kol-102", name: "Screen 2 - Dolby Atmos 4K", type: "Dolby Atmos" }
    ]
  },
  {
    id: "th-kol-2",
    name: "INOX Forum Mall, Elgin Road",
    city: "Kolkata",
    address: "10/3, Lala Lajpat Rai Sarani, Elgin, Kolkata",
    distance: "1,015 km from Tenali, AP",
    rating: 4.8,
    facilities: ["INSIGNIA VIP", "Dolby Atmos", "Valet Parking", "Gourmet Kitchen"],
    screens: [
      { id: "scr-kol-201", name: "Screen 1 - INSIGNIA VIP", type: "INSIGNIA VIP" }
    ]
  },
  {
    id: "th-kol-3",
    name: "Priya Cinema 4K Atmos, Deshapriya Park",
    city: "Kolkata",
    address: "95, Rash Behari Ave, Tamhane, Kolkata",
    distance: "1,018 km from Tenali, AP",
    rating: 4.6,
    facilities: ["4K RGB Laser", "Dolby Atmos", "Historic Cinema Lounge", "Snack Bar"],
    screens: [
      { id: "scr-kol-301", name: "Main Auditorium - Priya 4K Atmos", type: "Dolby Atmos 4K" }
    ]
  }
];

export const FOOD_ITEMS = [
  {
    id: "food-101",
    name: "Butter Popcorn (Large)",
    category: "Popcorn",
    price: 290,
    image: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=300&auto=format&fit=crop&q=80",
    description: "Classic golden hot salted popcorn rich with melted butter flavor."
  },
  {
    id: "food-102",
    name: "Caramel Cheese Duo Popcorn",
    category: "Popcorn",
    price: 340,
    image: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=300&auto=format&fit=crop&q=80",
    description: "Sweet caramelized crunchy corn mixed with tangy cheddar cheese popcorn."
  },
  {
    id: "food-103",
    name: "Cheesy Nachos Supreme",
    category: "Snacks",
    price: 260,
    image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=300&auto=format&fit=crop&q=80",
    description: "Crispy Mexican tortilla chips served with warm jalapeño cheese sauce & salsa."
  },
  {
    id: "food-104",
    name: "Classic Veg Burger",
    category: "Snacks",
    price: 210,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&auto=format&fit=crop&q=80",
    description: "Crispy herb potato patty, fresh lettuce, tomato, and mayo in toasted sesame bun."
  },
  {
    id: "food-105",
    name: "Cold Coffee Shake",
    category: "Beverages",
    price: 190,
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=300&auto=format&fit=crop&q=80",
    description: "Creamy whipped espresso blend with vanilla ice cream and chocolate drizzle."
  },
  {
    id: "food-106",
    name: "Blockbuster Combo (Popcorn + 2 Drinks)",
    category: "Combos",
    price: 480,
    image: "https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=300&auto=format&fit=crop&q=80",
    description: "1 Large Salted Popcorn + 2 Large Pepsi/Fanta beverages."
  }
];

export const OFFERS = [
  {
    id: "off-101",
    code: "CINEFY10",
    title: "10% Instant Discount",
    discountPercent: 10,
    maxDiscount: 150,
    minBookingAmount: 300,
    validTill: "31 Dec 2026",
    description: "Get 10% off up to ₹150 on your ticket booking."
  },
  {
    id: "off-102",
    code: "FIRSTBOOK",
    title: "Welcome Offer - 20% OFF",
    discountPercent: 20,
    maxDiscount: 250,
    minBookingAmount: 400,
    validTill: "31 Dec 2026",
    description: "Exclusive 20% flat discount on your very first CineFy transaction."
  },
  {
    id: "off-103",
    code: "BLOCKBUSTER",
    title: "Flat ₹100 Off on Food Combo",
    discountPercent: 15,
    maxDiscount: 200,
    minBookingAmount: 500,
    validTill: "31 Dec 2026",
    description: "Save on tickets when you add food & beverages to your order."
  },
  {
    id: "off-104",
    code: "HDFCSPECIAL",
    title: "HDFC Bank 25% Cashback",
    discountPercent: 25,
    maxDiscount: 350,
    minBookingAmount: 600,
    validTill: "31 Dec 2026",
    description: "Instant 25% savings on HDFC Bank Credit & Debit Cards."
  },
  {
    id: "off-105",
    code: "ICICICINEMA",
    title: "ICICI Buy 1 Get 1 Free",
    discountPercent: 50,
    maxDiscount: 300,
    minBookingAmount: 500,
    validTill: "31 Dec 2026",
    description: "Buy 1 ticket and get the second ticket free on ICICI Gemstone cards."
  },
  {
    id: "off-106",
    code: "UPIFEST",
    title: "Flat ₹75 UPI Instant Cashback",
    discountPercent: 12,
    maxDiscount: 120,
    minBookingAmount: 250,
    validTill: "31 Dec 2026",
    description: "Pay via Google Pay, PhonePe or Paytm UPI for guaranteed cashback."
  }
];

export const EVENTS = [
  // --- 11 INTERNATIONAL CRICKET FIXTURES (INDIA PLAYS ONLY 1 MATCH • DIVERSE GLOBAL CLASHES • NO LIVE MATCHES) ---
  {
    id: "evt-cric-01",
    title: "ICC Super Series: India vs Australia (T20I Final)",
    tournament: "ICC Men's T20 International Series 2026",
    matchType: "Grand Final • T20 International",
    category: "Sports",
    sportType: "Cricket",
    isLiveNow: false,
    liveStatusText: "⚡ TICKET SALES OPEN • Narendra Modi Stadium",
    liveScore: "07:30 PM IST Start",
    liveTarget: "High-Octane Grand Final",
    liveBatsmen: "Virat Kohli & Rohit Sharma",
    liveBowler: "Pat Cummins & Mitchell Starc",
    liveRecentBalls: ["-", "-", "-", "-", "-", "-"],
    weather: "27°C • Clear Night Sky • Fast Outfield",
    pitchReport: "Batting Paradise • Fast Outfield • 68m Square Boundaries",
    liveCrowdAttendance: "132,000 Capacity",
    availableTicketsCount: "3,400 Left",
    teamA: "India",
    teamACode: "IND",
    teamAFlag: "🇮🇳",
    teamALogo: "https://flagcdn.com/w160/in.png",
    teamB: "Australia",
    teamBCode: "AUS",
    teamBFlag: "🇦🇺",
    teamBLogo: "https://flagcdn.com/w160/au.png",
    city: "Ahmedabad",
    venue: "Narendra Modi Stadium, Motera",
    stadiumId: "amd-modi",
    distanceFromUser: "1,180 km from Tenali, AP",
    date: "2026-08-20",
    time: "07:30 PM",
    price: 2500,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Narendra_Modi_Stadium_Ahmedabad.jpg/1280px-Narendra_Modi_Stadium_Ahmedabad.jpg",
    description: "High-voltage International grand final clash at the world's largest cricket stadium featuring Rohit Sharma, Virat Kohli, and Pat Cummins under electric floodlights.",
    stadiumLayout: {
      name: "Narendra Modi Stadium",
      capacity: "132,000 Seats",
      stands: [
        { id: "std-1", name: "President's Gallery (VIP)", price: 5500, icon: "Crown" },
        { id: "std-2", name: "Adani Pavilion Tier 1", price: 3500, icon: "Shield" },
        { id: "std-3", name: "Reliance End Block A-D", price: 2500, icon: "Users" },
        { id: "std-4", name: "Jio End Block E-H", price: 2500, icon: "Users" },
        { id: "std-5", name: "Motera Royal Corporate Suites", price: 8500, icon: "Sparkles" }
      ]
    }
  },
  {
    id: "evt-cric-02",
    title: "ICC ODI Super Series: England vs South Africa",
    tournament: "ICC Men's International ODI Series 2026",
    matchType: "1st ODI International • 50 Overs",
    category: "Sports",
    sportType: "Cricket",
    isLiveNow: false,
    liveStatusText: "⚡ SEASIDE POWERHOUSE • Wankhede Churchgate",
    liveScore: "01:30 PM IST Start",
    liveTarget: "50 Overs Day/Night Clash",
    liveBatsmen: "Jos Buttler & Harry Brook",
    liveBowler: "Kagiso Rabada & Anrich Nortje",
    liveRecentBalls: ["-", "-", "-", "-", "-", "-"],
    weather: "29°C • Pleasant Sea Breeze • 72% Humidity",
    pitchReport: "Classic Wankhede Surface • Good Carry & Pace for Fast Bowlers",
    liveCrowdAttendance: "33,108 Capacity",
    availableTicketsCount: "1,200 Left",
    teamA: "England",
    teamACode: "ENG",
    teamAFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    teamALogo: "https://flagcdn.com/w160/gb-eng.png",
    teamB: "South Africa",
    teamBCode: "SA",
    teamBFlag: "🇿🇦",
    teamBLogo: "https://flagcdn.com/w160/za.png",
    city: "Mumbai",
    venue: "Wankhede Stadium, Churchgate",
    stadiumId: "mum-wankhede",
    distanceFromUser: "870 km from Tenali, AP",
    date: "2026-08-24",
    time: "01:30 PM",
    price: 1800,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Wankhede_Stadium_aerial_view.jpg/1280px-Wankhede_Stadium_aerial_view.jpg",
    description: "Iconic seaside atmosphere at Wankhede Stadium with sea breeze and massive international sixes across Sachin Tendulkar & Sunil Gavaskar stands.",
    stadiumLayout: {
      name: "Wankhede Stadium",
      capacity: "33,108 Seats",
      stands: [
        { id: "std-1", name: "Sachin Tendulkar Stand (East Rectangular)", price: 3200, icon: "Crown" },
        { id: "std-2", name: "Sunil Gavaskar Pavilion (West Stand)", price: 2600, icon: "Shield" },
        { id: "std-3", name: "Vijay Merchant Stand", price: 1800, icon: "Users" },
        { id: "std-4", name: "Garware Pavilion (North Tier)", price: 1800, icon: "Users" },
        { id: "std-5", name: "MCA Grand VIP Lounge", price: 6500, icon: "Sparkles" }
      ]
    }
  },
  {
    id: "evt-cric-03",
    title: "ICC Champions Clash: Pakistan vs New Zealand",
    tournament: "ICC Champions Trophy Super 8",
    matchType: "Super 8 International Clash",
    category: "Sports",
    sportType: "Cricket",
    isLiveNow: false,
    liveStatusText: "⚡ DECCAN SUPER CLASH • Uppal Stadium",
    liveScore: "07:30 PM IST Start",
    liveTarget: "High-Voltage Super 8 Match",
    liveBatsmen: "Babar Azam & Mohammad Rizwan",
    liveBowler: "Trent Boult & Tim Southee",
    liveRecentBalls: ["-", "-", "-", "-", "-", "-"],
    weather: "26°C • Clear Evening • 8 km/h Wind",
    pitchReport: "Dry Surface • Spin Gripping in 2nd Session • Uppal Track",
    liveCrowdAttendance: "55,000 Capacity",
    availableTicketsCount: "1,850 Left",
    teamA: "Pakistan",
    teamACode: "PAK",
    teamAFlag: "🇵🇰",
    teamALogo: "https://flagcdn.com/w160/pk.png",
    teamB: "New Zealand",
    teamBCode: "NZ",
    teamBFlag: "🇳🇿",
    teamBLogo: "https://flagcdn.com/w160/nz.png",
    city: "Hyderabad",
    venue: "Rajiv Gandhi International Cricket Stadium, Uppal",
    stadiumId: "hyd-uppal",
    distanceFromUser: "280 km from Tenali, AP",
    date: "2026-08-28",
    time: "07:30 PM",
    price: 2200,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Rajiv_Gandhi_International_Cricket_Stadium_Hyderabad.jpg/1280px-Rajiv_Gandhi_International_Cricket_Stadium_Hyderabad.jpg",
    description: "High-voltage clash unfolds at Uppal Stadium with 55,000 roaring fans and multi-tier cantilever pavilions.",
    stadiumLayout: {
      name: "Rajiv Gandhi International Cricket Stadium",
      capacity: "55,000 Seats",
      stands: [
        { id: "std-1", name: "North Pavilion 3-Tier Cantilever", price: 3500, icon: "Crown" },
        { id: "std-2", name: "South Deccan Pavilion", price: 2800, icon: "Shield" },
        { id: "std-3", name: "VVS Laxman East Stand", price: 2200, icon: "Users" },
        { id: "std-4", name: "HCA West Pavilion", price: 2200, icon: "Users" },
        { id: "std-5", name: "Hyderabad Sky Suites", price: 7500, icon: "Sparkles" }
      ]
    }
  },
  {
    id: "evt-cric-04",
    title: "International T20: Australia vs West Indies",
    tournament: "International T20 Super Series 2026",
    matchType: "2nd T20 International • Night Match",
    category: "Sports",
    sportType: "Cricket",
    isLiveNow: false,
    liveStatusText: "⚡ CHEPAUK THRILLER • Gates Open 04:30 PM",
    liveScore: "07:00 PM IST Start",
    liveTarget: "T20 International Battle",
    liveBatsmen: "Glenn Maxwell & Travis Head",
    liveBowler: "Andre Russell & Alzarri Joseph",
    liveRecentBalls: ["-", "-", "-", "-", "-", "-"],
    weather: "30°C • Coastal Breeze • High Energy",
    pitchReport: "Classic Chepauk Red Soil • Solid Turn & Bounce",
    liveCrowdAttendance: "38,000 Capacity",
    availableTicketsCount: "2,100 Left",
    teamA: "Australia",
    teamACode: "AUS",
    teamAFlag: "🇦🇺",
    teamALogo: "https://flagcdn.com/w160/au.png",
    teamB: "West Indies",
    teamBCode: "WI",
    teamBFlag: "🌴",
    teamBLogo: "https://upload.wikimedia.org/wikipedia/commons/1/10/Cricket_West_Indies_flag_2017.svg",
    city: "Chennai",
    venue: "MA Chidambaram Stadium (Chepauk)",
    stadiumId: "che-chepauk",
    distanceFromUser: "430 km from Tenali, AP",
    date: "2026-09-02",
    time: "07:00 PM",
    price: 1800,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/MA_Chidambaram_Stadium_Chepauk.jpg/1280px-MA_Chidambaram_Stadium_Chepauk.jpg",
    description: "Caribbean flair meets Aussie power at the classic Chepauk stadium with breezy split-stand architecture.",
    stadiumLayout: {
      name: "MA Chidambaram Stadium (Chepauk)",
      capacity: "38,000 Seats",
      stands: [
        { id: "std-1", name: "Anna Pavilion North Stand", price: 3800, icon: "Crown" },
        { id: "std-2", name: "Pattabiram Stand Lower (MAC)", price: 2800, icon: "Shield" },
        { id: "std-3", name: "KMK Stand & C/D Stand", price: 1800, icon: "Users" },
        { id: "std-4", name: "E/F & G/H Stand Upper", price: 1800, icon: "Users" },
        { id: "std-5", name: "Chepauk Super Club Box", price: 8000, icon: "Sparkles" }
      ]
    }
  },
  {
    id: "evt-cric-05",
    title: "World Test Championship: England vs New Zealand",
    tournament: "ICC World Test Championship 2025-2027",
    matchType: "Test Match • Day 1 to 5 (09:30 AM Daily)",
    category: "Sports",
    sportType: "Cricket",
    isLiveNow: false,
    liveStatusText: "⚡ 5-DAY TEST FIXTURE • Himalayan Backdrop",
    liveScore: "Day 1 Starts at 09:30 AM",
    liveTarget: "WTC Points on the Line",
    liveBatsmen: "Joe Root & Ben Stokes",
    liveBowler: "Matt Henry & Mitchell Santner",
    liveRecentBalls: ["-", "-", "-", "-", "-", "-"],
    weather: "19°C • Crisp Mountain Air • Sunny",
    pitchReport: "Green Seaming Pitch • Movement for Swing Bowlers under Pagodas",
    liveCrowdAttendance: "23,000 Capacity",
    availableTicketsCount: "1,850 Left",
    teamA: "England",
    teamACode: "ENG",
    teamAFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    teamALogo: "https://flagcdn.com/w160/gb-eng.png",
    teamB: "New Zealand",
    teamBCode: "NZ",
    teamBFlag: "🇳🇿",
    teamBLogo: "https://flagcdn.com/w160/nz.png",
    city: "Dharamshala",
    venue: "HPCA International Cricket Stadium",
    stadiumId: "hpca-dharamshala",
    distanceFromUser: "2,100 km from Tenali, AP",
    date: "2026-09-06",
    time: "09:30 AM",
    price: 950,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/HPCA_Stadium_Dharamshala.jpg/1280px-HPCA_Stadium_Dharamshala.jpg",
    description: "Pure test cricket magic played amidst Tibetan Pagoda architecture and 15,000-ft snow-capped Dhauladhar mountains.",
    stadiumLayout: {
      name: "HPCA International Cricket Stadium",
      capacity: "23,000 Seats",
      stands: [
        { id: "std-1", name: "Tibetan Pagoda VIP Pavilion", price: 2800, icon: "Crown" },
        { id: "std-2", name: "Dhauladhar Mountain View Stand", price: 1600, icon: "Shield" },
        { id: "std-3", name: "Pine Valley West Stand", price: 950, icon: "Users" },
        { id: "std-4", name: "Himalayas North Terrace", price: 950, icon: "Users" },
        { id: "std-5", name: "Alpine Luxury Sky Box", price: 5500, icon: "Sparkles" }
      ]
    }
  },
  {
    id: "evt-cric-06",
    title: "The Ashes T20 Special: Australia vs England",
    tournament: "The Ashes Global International T20",
    matchType: "T20 International Spectacular",
    category: "Sports",
    sportType: "Cricket",
    isLiveNow: false,
    liveStatusText: "⚡ HIGH-OCTANE RIVALRY • Chinnaswamy Solar Bowl",
    liveScore: "07:30 PM IST Start",
    liveTarget: "High-Scoring Encounter Expected",
    liveBatsmen: "Travis Head vs Jos Buttler",
    liveBowler: "Pat Cummins vs Jofra Archer",
    liveRecentBalls: ["-", "-", "-", "-", "-", "-"],
    weather: "23°C • Pleasant Bengaluru Weather",
    pitchReport: "Flat Deck • Short Square Boundaries (58m) • Six Fest",
    liveCrowdAttendance: "40,000 Full House",
    availableTicketsCount: "1,400 Left",
    teamA: "Australia",
    teamACode: "AUS",
    teamAFlag: "🇦🇺",
    teamALogo: "https://flagcdn.com/w160/au.png",
    teamB: "England",
    teamBCode: "ENG",
    teamBFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    teamBLogo: "https://flagcdn.com/w160/gb-eng.png",
    city: "Bengaluru",
    venue: "M. Chinnaswamy Stadium",
    stadiumId: "blr-chinnaswamy",
    distanceFromUser: "520 km from Tenali, AP",
    date: "2026-09-10",
    time: "07:30 PM",
    price: 1750,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/M._Chinnaswamy_Stadium%2C_Bengaluru.jpg/1280px-M._Chinnaswamy_Stadium%2C_Bengaluru.jpg",
    description: "Historic Ashes rivals go head-to-head under Chinnaswamy's iconic solar roof canopy with boundary ropes tested to the limit.",
    stadiumLayout: {
      name: "M. Chinnaswamy Stadium",
      capacity: "40,000 Seats",
      stands: [
        { id: "std-1", name: "Brijesh Patel Stand (P2 Pavilion)", price: 3500, icon: "Crown" },
        { id: "std-2", name: "KSCA Members Pavilion", price: 2400, icon: "Shield" },
        { id: "std-3", name: "BLA & Grandstand Lower", price: 1750, icon: "Users" },
        { id: "std-4", name: "West Grandstand Upper", price: 1750, icon: "Users" },
        { id: "std-5", name: "KSCA Executive Solar Gallery", price: 7500, icon: "Sparkles" }
      ]
    }
  },
  {
    id: "evt-cric-07",
    title: "ICC Super 8: West Indies vs South Africa",
    tournament: "ICC Men's T20 World Super Series",
    matchType: "Super 8 Night Clash",
    category: "Sports",
    sportType: "Cricket",
    isLiveNow: false,
    liveStatusText: "⚡ EDEN ROAR • 68,000 Fans Night Match",
    liveScore: "07:30 PM IST Start",
    liveTarget: "High-Voltage Super 8 Match",
    liveBatsmen: "Nicholas Pooran & Shimron Hetmyer",
    liveBowler: "Kagiso Rabada & Tabraiz Shamsi",
    liveRecentBalls: ["-", "-", "-", "-", "-", "-"],
    weather: "28°C • Energetic Kolkata Atmosphere",
    pitchReport: "True Bounce • Dew Factor in 2nd Innings",
    liveCrowdAttendance: "68,000 Capacity",
    availableTicketsCount: "3,100 Left",
    teamA: "West Indies",
    teamACode: "WI",
    teamAFlag: "🌴",
    teamALogo: "https://upload.wikimedia.org/wikipedia/commons/1/10/Cricket_West_Indies_flag_2017.svg",
    teamB: "South Africa",
    teamBCode: "SA",
    teamBFlag: "🇿🇦",
    teamBLogo: "https://flagcdn.com/w160/za.png",
    city: "Kolkata",
    venue: "Eden Gardens Stadium",
    stadiumId: "kol-eden",
    distanceFromUser: "1,020 km from Tenali, AP",
    date: "2026-09-14",
    time: "07:30 PM",
    price: 1400,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Eden_Gardens_under_floodlights_during_match.jpg/1280px-Eden_Gardens_under_floodlights_during_match.jpg",
    description: "The colossal Mecca of Cricket roars as Caribbean power-hitters take on the Proteas lethal bowling attack at Eden Gardens.",
    stadiumLayout: {
      name: "Eden Gardens Stadium",
      capacity: "68,000 Seats",
      stands: [
        { id: "std-1", name: "B.C. Roy Club House (VIP)", price: 3200, icon: "Crown" },
        { id: "std-2", name: "High Court End Stand", price: 2000, icon: "Shield" },
        { id: "std-3", name: "KMC End Block D-E", price: 1400, icon: "Users" },
        { id: "std-4", name: "Ranji & Pankaj Roy Stand", price: 1400, icon: "Users" },
        { id: "std-5", name: "Jagmohan Dalmiya VIP Lounge", price: 6500, icon: "Sparkles" }
      ]
    }
  },
  {
    id: "evt-cric-08",
    title: "Asia International Cup: Sri Lanka vs Pakistan",
    tournament: "Asia International Cup 2026",
    matchType: "ODI International • Day/Night",
    category: "Sports",
    sportType: "Cricket",
    isLiveNow: false,
    liveStatusText: "⚡ SUB-CONTINENTAL RIVALRY • Kotla Fortress",
    liveScore: "02:00 PM IST Start",
    liveTarget: "50 Overs Day/Night",
    liveBatsmen: "Kusal Mendis & Pathum Nissanka",
    liveBowler: "Shaheen Afridi & Haris Rauf",
    liveRecentBalls: ["-", "-", "-", "-", "-", "-"],
    weather: "31°C • Sunny Afternoon",
    pitchReport: "Re-laid Kotla Track • High Scoring in Powerplay",
    liveCrowdAttendance: "41,842 Capacity",
    availableTicketsCount: "2,200 Left",
    teamA: "Sri Lanka",
    teamACode: "SL",
    teamAFlag: "🇱🇰",
    teamALogo: "https://flagcdn.com/w160/lk.png",
    teamB: "Pakistan",
    teamBCode: "PAK",
    teamBFlag: "🇵🇰",
    teamBLogo: "https://flagcdn.com/w160/pk.png",
    city: "Delhi NCR",
    venue: "Arun Jaitley Stadium, Feroz Shah Kotla",
    stadiumId: "del-kotla",
    distanceFromUser: "1,620 km from Tenali, AP",
    date: "2026-09-18",
    time: "02:00 PM",
    price: 1500,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Arun_Jaitley_Stadium_Delhi.jpg/1280px-Arun_Jaitley_Stadium_Delhi.jpg",
    description: "Subcontinental rivalry at Delhi's historic Kotla fortress featuring the Virat Kohli & Bishan Singh Bedi grandstands.",
    stadiumLayout: {
      name: "Arun Jaitley Stadium",
      capacity: "41,842 Seats",
      stands: [
        { id: "std-1", name: "Virat Kohli Pavilion Stand", price: 3200, icon: "Crown" },
        { id: "std-2", name: "Bishan Singh Bedi Stand", price: 2200, icon: "Shield" },
        { id: "std-3", name: "Mohinder Amarnath Stand", price: 1500, icon: "Users" },
        { id: "std-4", name: "Gautam Gambhir Stand", price: 1500, icon: "Users" },
        { id: "std-5", name: "DDCA President's Suite", price: 6500, icon: "Sparkles" }
      ]
    }
  },
  {
    id: "evt-cric-09",
    title: "Bilateral Series: Afghanistan vs Bangladesh (3rd T20I)",
    tournament: "International Bilateral T20 Series",
    matchType: "3rd T20 International Decider",
    category: "Sports",
    sportType: "Cricket",
    isLiveNow: false,
    liveStatusText: "⚡ COASTAL CLASH • Vizag ACA-VDCA",
    liveScore: "07:00 PM IST Start",
    liveTarget: "T20 Series Finale",
    liveBatsmen: "Rahmanullah Gurbaz & Ibrahim Zadran",
    liveBowler: "Mustafizur Rahman & Shakib Al Hasan",
    liveRecentBalls: ["-", "-", "-", "-", "-", "-"],
    weather: "28°C • Coastal Breeze • 68% Humidity",
    pitchReport: "Eastern Ghats Bowl • True Pace & Good Carry",
    liveCrowdAttendance: "27,500 Capacity",
    availableTicketsCount: "1,500 Left",
    teamA: "Afghanistan",
    teamACode: "AFG",
    teamAFlag: "🇦🇫",
    teamALogo: "https://flagcdn.com/w160/af.png",
    teamB: "Bangladesh",
    teamBCode: "BAN",
    teamBFlag: "🇧🇩",
    teamBLogo: "https://flagcdn.com/w160/bd.png",
    city: "Visakhapatnam",
    venue: "Dr. Y.S.R. ACA-VDCA Stadium",
    stadiumId: "vizag-vdca",
    distanceFromUser: "350 km from Tenali, AP",
    date: "2026-09-22",
    time: "07:00 PM",
    price: 1200,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/ACA-VDCA_Cricket_Stadium_Vizag.jpg/1280px-ACA-VDCA_Cricket_Stadium_Vizag.jpg",
    description: "Exciting coastal T20 battle nestled amidst the Eastern Ghats hills with world-class spin wizardry on display.",
    stadiumLayout: {
      name: "Dr. Y.S.R. ACA-VDCA Stadium",
      capacity: "27,500 Seats",
      stands: [
        { id: "std-1", name: "Bay of Bengal North Pavilion", price: 2400, icon: "Crown" },
        { id: "std-2", name: "Eastern Ghats South Stand", price: 1800, icon: "Shield" },
        { id: "std-3", name: "Vizag Coastal East Gallery", price: 1200, icon: "Users" },
        { id: "std-4", name: "Simhachalam West Stand", price: 1200, icon: "Users" },
        { id: "std-5", name: "Coastal Luxury Lounge", price: 5000, icon: "Sparkles" }
      ]
    }
  },
  {
    id: "evt-cric-10",
    title: "Subcontinental Cup: Sri Lanka vs West Indies",
    tournament: "Subcontinental International Cup 2026",
    matchType: "ODI International Decider",
    category: "Sports",
    sportType: "Cricket",
    isLiveNow: false,
    liveStatusText: "⚡ NEAREST VENUE • 18 km from Tenali, AP",
    liveScore: "01:30 PM IST Start",
    liveTarget: "Series Decider at Amaravati",
    liveBatsmen: "Charith Asalanka & Wanindu Hasaranga",
    liveBowler: "Alzarri Joseph & Gudakesh Motie",
    liveRecentBalls: ["-", "-", "-", "-", "-", "-"],
    weather: "29°C • Pleasant Krishna River Breeze",
    pitchReport: "Modern White Marble Stadium • High Scoring ODI Pitch",
    liveCrowdAttendance: "34,000 Capacity",
    availableTicketsCount: "3,800 Left",
    teamA: "Sri Lanka",
    teamACode: "SL",
    teamAFlag: "🇱🇰",
    teamALogo: "https://flagcdn.com/w160/lk.png",
    teamB: "West Indies",
    teamBCode: "WI",
    teamBFlag: "🌴",
    teamBLogo: "https://upload.wikimedia.org/wikipedia/commons/1/10/Cricket_West_Indies_flag_2017.svg",
    city: "Mangalagiri",
    venue: "ACA International Cricket Stadium, Mangalagiri",
    stadiumId: "mangalagiri-aca",
    distanceFromUser: "18 km from Tenali, AP",
    date: "2026-09-26",
    time: "01:30 PM",
    price: 1400,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Dr._Y._S._Rajasekhara_Reddy_ACA-VDCA_Cricket_Stadium.jpg/1280px-Dr._Y._S._Rajasekhara_Reddy_ACA-VDCA_Cricket_Stadium.jpg",
    description: "Prism of White Marble and modern cantilever architecture right next to the Krishna River with international cricket stars.",
    stadiumLayout: {
      name: "ACA International Cricket Stadium, Mangalagiri",
      capacity: "34,000 Seats",
      stands: [
        { id: "std-1", name: "Amaravati White Marble Pavilion", price: 3000, icon: "Crown" },
        { id: "std-2", name: "Krishna River End Stand", price: 2000, icon: "Shield" },
        { id: "std-3", name: "Prakasam Grand Gallery", price: 1600, icon: "Users" },
        { id: "std-4", name: "Guntur West Pavilion", price: 1400, icon: "Users" },
        { id: "std-5", name: "ACA Presidential Gold Suite", price: 6000, icon: "Sparkles" }
      ]
    }
  },
  {
    id: "evt-cric-11",
    title: "ICC Men's World Cup Semi-Final: South Africa vs New Zealand",
    tournament: "ICC Men's World Cup 2026 Knockout",
    matchType: "World Cup Semi-Final • Knockout",
    category: "Sports",
    sportType: "Cricket",
    isLiveNow: false,
    liveStatusText: "⚡ WORLD CUP SEMI-FINAL • 50,000 Ekana Stadium",
    liveScore: "02:00 PM IST Start",
    liveTarget: "Winner to World Cup Final",
    liveBatsmen: "Heinrich Klaasen & Quinton de Kock",
    liveBowler: "Trent Boult & Lockie Ferguson",
    liveRecentBalls: ["-", "-", "-", "-", "-", "-"],
    weather: "27°C • Clear Skies",
    pitchReport: "Awadhi Arch Arena • Good Carry & Even Bounce",
    liveCrowdAttendance: "50,000 Capacity",
    availableTicketsCount: "2,400 Left",
    teamA: "South Africa",
    teamACode: "SA",
    teamAFlag: "🇿🇦",
    teamALogo: "https://flagcdn.com/w160/za.png",
    teamB: "New Zealand",
    teamBCode: "NZ",
    teamBFlag: "🇳🇿",
    teamBLogo: "https://flagcdn.com/w160/nz.png",
    city: "Lucknow",
    venue: "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium",
    stadiumId: "lko-ekana",
    distanceFromUser: "1,380 km from Tenali, AP",
    date: "2026-09-30",
    time: "02:00 PM",
    price: 2000,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Ekana_Cricket_Stadium_Lucknow.jpg/1280px-Ekana_Cricket_Stadium_Lucknow.jpg",
    description: "Epic World Cup Semi-Final knockout match under the grand Awadhi arches of Lucknow's 50,000-seater Ekana Stadium.",
    stadiumLayout: {
      name: "BRSABV Ekana Cricket Stadium",
      capacity: "50,000 Seats",
      stands: [
        { id: "std-1", name: "Nawabi North Pavilion", price: 3200, icon: "Crown" },
        { id: "std-2", name: "Gomti River South Stand", price: 2400, icon: "Shield" },
        { id: "std-3", name: "Awadh East Wing", price: 1800, icon: "Users" },
        { id: "std-4", name: "Rumi Gate West Wing", price: 1800, icon: "Users" },
        { id: "std-5", name: "Royal Nawabi Presidential Suite", price: 7500, icon: "Sparkles" }
      ]
    }
  },

  // --- REAL TOP-TIER MUSIC CONCERTS IN INDIA 2026 WITH AUTHENTIC SEATING & PASS TIERS ---
  {
    id: "evt-con-01",
    title: "Coldplay: Music of the Spheres World Tour 2026",
    artist: "Coldplay (Chris Martin, Jonny Buckland, Guy Berryman, Will Champion)",
    genre: "Pop / Arena Rock",
    category: "Concerts",
    city: "Mumbai",
    venue: "DY Patil Stadium, Navi Mumbai",
    distanceFromUser: "860 km from Tenali, AP",
    date: "2026-10-18",
    time: "06:00 PM",
    price: 3500,
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80",
    description: "The global phenomenon brings the legendary Music of the Spheres tour with jaw-dropping LED wristbands, kinetic dance floors, and fireworks.",
    seatingTiers: [
      { id: "tier-1", name: "Infinity Lounge (VIP Hospitality)", price: 18500, perks: "Free Gourmet Dinner, Backstage Pass, Best Elevated View", color: "#eab308" },
      { id: "tier-2", name: "Floor Standing Pit (Front of Stage)", price: 6500, perks: "Closest to Chris Martin & Main Stage B-Stage Walkway", color: "#ec4899" },
      { id: "tier-3", name: "Level 1 West Grandstand (Reserved)", price: 4500, perks: "Numbered Ergonomic Bucket Seats with Direct Stage View", color: "#3b82f6" },
      { id: "tier-4", name: "Level 2 East Grandstand (General)", price: 3500, perks: "Great Stadium Acoustic Coverage & Kinetic Atmosphere", color: "#10b981" }
    ]
  },
  {
    id: "evt-con-02",
    title: "Diljit Dosanjh: Dil-Luminati India Tour 2026",
    artist: "Diljit Dosanjh",
    genre: "Punjabi Pop / Bhangra / Global Fusion",
    category: "Concerts",
    city: "Delhi NCR",
    venue: "Jawaharlal Nehru Stadium (JLN Arena), Lodhi Road",
    distanceFromUser: "1,620 km from Tenali, AP",
    date: "2026-10-24",
    time: "06:30 PM",
    price: 2999,
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80",
    description: "India's global superstar Diljit Dosanjh performs his historic Dil-Luminati stadium spectacle featuring high-energy Bhangra and chartbusters like GOAT and Lover.",
    seatingTiers: [
      { id: "tier-1", name: "Dil-Luminati Fan Pit (Front Stage)", price: 12999, perks: "Exclusive Diljit Merchandise, Front Barrier Access, Fast-track Gate", color: "#eab308" },
      { id: "tier-2", name: "Gold Circle Standing", price: 5999, perks: "Close-up Stage Sightlines & Dedicated Beverage Bar", color: "#ec4899" },
      { id: "tier-3", name: "Silver Seated Grandstand", price: 3999, perks: "Comfortable Numbered Seating with Unobstructed Line of Sight", color: "#3b82f6" },
      { id: "tier-4", name: "Bronze General Arena", price: 2999, perks: "Full Arena Sound & Visual Screen Immersion", color: "#10b981" }
    ]
  },
  {
    id: "evt-con-03",
    title: "A.R. Rahman Live: 'Maa Tujhe Salaam' 30-Year Symphonic Celebration",
    artist: "A.R. Rahman & The Sunshine Orchestra",
    genre: "Bollywood / World Symphonic / Tamil Classics",
    category: "Concerts",
    city: "Chennai",
    venue: "YMCA Grounds, Nandanam",
    distanceFromUser: "420 km from Tenali, AP",
    date: "2026-11-08",
    time: "06:30 PM",
    price: 1999,
    image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&auto=format&fit=crop&q=80",
    description: "Oscar-winning maestro A.R. Rahman performs live with 100 orchestral musicians, legendary vocalists, and 3 decades of timeless melodies from Roja to Ponniyin Selvan.",
    seatingTiers: [
      { id: "tier-1", name: "Symphony Diamond Club (Rows A-E)", price: 15000, perks: "Front-Row Padded Sofa Seating, Meet & Greet Pass, Valet Parking", color: "#eab308" },
      { id: "tier-2", name: "Platinum Reserved Seating", price: 6500, perks: "Center Stage Numbered Cushion Chairs & Audiophile Sound Zones", color: "#ec4899" },
      { id: "tier-3", name: "Gold Seated Tribune", price: 3500, perks: "Elevated Tier Seating with Wide Panoramic Stage View", color: "#3b82f6" },
      { id: "tier-4", name: "Silver General Seating", price: 1999, perks: "Full Ground Surround Sound & Giant 4K LED Screen Feeds", color: "#10b981" }
    ]
  },
  {
    id: "evt-con-04",
    title: "Ed Sheeran: + - = ÷ x (Mathematics) Tour India",
    artist: "Ed Sheeran",
    genre: "Pop / Acoustic / Live Loop",
    category: "Concerts",
    city: "Mumbai",
    venue: "Mahalaxmi Racecourse Arena",
    distanceFromUser: "870 km from Tenali, AP",
    date: "2026-11-15",
    time: "07:00 PM",
    price: 3999,
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&auto=format&fit=crop&q=80",
    description: "Ed Sheeran returns to India with his mesmerizing 360-degree rotating stage, multi-track loop station wizardry, and global hits like Shape of You and Perfect.",
    seatingTiers: [
      { id: "tier-1", name: "360° Center Orbit VIP Pit", price: 14500, perks: "Direct 360-degree close proximity to rotating stage", color: "#eab308" },
      { id: "tier-2", name: "Mathematics Gold Floor (Standing)", price: 7500, perks: "Surround Stage Standing with Prime Energy", color: "#ec4899" },
      { id: "tier-3", name: "East Reserved Grandstand", price: 4999, perks: "Numbered Seating with Direct View of 360 Halo Screen", color: "#3b82f6" },
      { id: "tier-4", name: "West General Admission", price: 3999, perks: "Festive Open-Air Atmosphere with Food & Drink Zones", color: "#10b981" }
    ]
  },
  {
    id: "evt-con-05",
    title: "Arijit Singh Soulful Arena Live Tour",
    artist: "Arijit Singh",
    genre: "Bollywood Romantic / Acoustic Soul",
    category: "Concerts",
    city: "Hyderabad",
    venue: "GMR Arena, Shamshabad",
    distanceFromUser: "285 km from Tenali, AP",
    date: "2026-11-22",
    time: "06:30 PM",
    price: 2499,
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80",
    description: "The voice of a generation Arijit Singh delivers an emotional 3.5-hour live musical voyage in Hyderabad featuring iconic anthems from Kesariya to Tum Hi Ho.",
    seatingTiers: [
      { id: "tier-1", name: "Soul Club VIP Lounge", price: 11000, perks: "Dedicated Lounge Seating, Food Platter & Fast Lane Access", color: "#eab308" },
      { id: "tier-2", name: "Front Row Platinum Seated", price: 5500, perks: "Prime Padded Chairs in Center Sound Horizon", color: "#ec4899" },
      { id: "tier-3", name: "Gold Reserved Chairs", price: 3500, perks: "Elevated Clear-Line Viewing & Good Acoustics", color: "#3b82f6" },
      { id: "tier-4", name: "Silver General Entry", price: 2499, perks: "Open Lawn View with High-Definition Concert Wall", color: "#10b981" }
    ]
  },
  {
    id: "evt-con-06",
    title: "Sunburn Goa 2026: Asian Electronic Music Mega Festival",
    artist: "David Guetta, Martin Garrix, Charlotte de Witte & 80+ DJs",
    genre: "EDM / Techno / House / Trance",
    category: "Concerts",
    city: "Goa",
    venue: "Vagator Festival Arena, North Goa",
    distanceFromUser: "750 km from Tenali, AP",
    date: "2026-12-28",
    time: "03:00 PM Daily (3-Day Pass)",
    price: 4500,
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80",
    description: "Asia's biggest 3-day EDM festival on the golden sands of Vagator Beach with 6 massive laser stages, aerial fireworks, food flea markets, and camping.",
    seatingTiers: [
      { id: "tier-1", name: "VVIP Elevated Table Pass (3 Days)", price: 35000, perks: "Elevated Sky Deck, Premium Bottle Service & Valet", color: "#eab308" },
      { id: "tier-2", name: "VIP Festival Pass (3-Day Access)", price: 8999, perks: "VIP Entrance, VIP Stage Viewing Area & Private Bar", color: "#ec4899" },
      { id: "tier-3", name: "General Admission (3-Day Full Pass)", price: 5499, perks: "Access to all 6 Stages (Main Stage, Solaris, Cube)", color: "#3b82f6" },
      { id: "tier-4", name: "Single Day Early Bird Pass", price: 4500, perks: "1-Day Entry to Mainstage & Flea Zone", color: "#10b981" }
    ]
  },
  {
    id: "evt-con-07",
    title: "Karan Aujla: It Was All A Dream India Tour",
    artist: "Karan Aujla",
    genre: "Punjabi Hip-Hop / UK Drill / Urban",
    category: "Concerts",
    city: "Delhi NCR",
    venue: "Indira Gandhi Indoor Stadium, ITO",
    distanceFromUser: "1,620 km from Tenali, AP",
    date: "2026-12-05",
    time: "07:00 PM",
    price: 2499,
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80",
    description: "Chart-topping Punjabi phenomenon Karan Aujla brings his high-energy worldwide tour featuring global hits like Tauba Tauba, Softly, and Winning Speech.",
    seatingTiers: [
      { id: "tier-1", name: "It Was All A Dream VIP Fan Pit", price: 9999, perks: "Front Stage Pit, Signed Tour Laminate & Early Entry", color: "#eab308" },
      { id: "tier-2", name: "Gold Floor Standing", price: 4999, perks: "Energetic Dance Floor Area Close to Stage Thrust", color: "#ec4899" },
      { id: "tier-3", name: "Club Lower Tier (Numbered)", price: 3499, perks: "Tiered Arena Seating with Perfect Stage Line of Sight", color: "#3b82f6" },
      { id: "tier-4", name: "Upper Tier Seating", price: 2499, perks: "Clear Panoramic Audio-Visual Experience", color: "#10b981" }
    ]
  },
  {
    id: "evt-con-08",
    title: "Lollapalooza India 2026 Multi-Genre Music Festival",
    artist: "Green Day, Shawn Mendes, Glass Animals & 40+ Acts",
    genre: "Alternative Rock / Indie / Electronic / Hip-Hop",
    category: "Concerts",
    city: "Mumbai",
    venue: "Mahalaxmi Racecourse Grounds",
    distanceFromUser: "870 km from Tenali, AP",
    date: "2026-12-12",
    time: "01:00 PM (2-Day Pass)",
    price: 5999,
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&auto=format&fit=crop&q=80",
    description: "Global multi-genre festival extravaganza in Mumbai featuring 4 sprawling stages, gourmet food lanes, art installations, and international headliners.",
    seatingTiers: [
      { id: "tier-1", name: "Platinum Lounge (2-Day Unlimited)", price: 28000, perks: "Elevated AC Viewing Deck, Complimentary Drinks & Free Shuttles", color: "#eab308" },
      { id: "tier-2", name: "VIP Weekend Pass (2 Days)", price: 12500, perks: "Dedicated VIP Lanes, VIP Bar & Close-Up Viewing Areas", color: "#ec4899" },
      { id: "tier-3", name: "GA Weekend Pass (2 Days)", price: 5999, perks: "Access to all 4 Stages for Saturday and Sunday", color: "#3b82f6" }
    ]
  },
  {
    id: "evt-con-09",
    title: "Anirudh Ravichander: Hukum World Tour 2026",
    artist: "Anirudh Ravichander & Rockstar Band",
    genre: "Rockstar Tamil & Telugu Hits / EDM Fusion",
    category: "Concerts",
    city: "Hyderabad",
    venue: "Hitex Exhibition Center, Madhapur",
    distanceFromUser: "280 km from Tenali, AP",
    date: "2026-12-19",
    time: "06:30 PM",
    price: 1799,
    image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80",
    description: "The Rockstar of Indian Cinema Anirudh Ravichander sets the stage on fire with Hukum, Badass, Arabic Kuthu, and sensational live EDM remixes.",
    seatingTiers: [
      { id: "tier-1", name: "Hukum Rockstar Fan Pit", price: 8999, perks: "Right in Front of Rockstar Stage Runway", color: "#eab308" },
      { id: "tier-2", name: "Platinum Standing Zone", price: 4200, perks: "Surround Laser Experience & Sound Boom Zone", color: "#ec4899" },
      { id: "tier-3", name: "Gold Tier Reserved Seating", price: 2800, perks: "Comfortable Numbered Chairs with Elevated Angle", color: "#3b82f6" },
      { id: "tier-4", name: "Silver Arena Pass", price: 1799, perks: "General Lawn Festival Access", color: "#10b981" }
    ]
  },
  {
    id: "evt-con-10",
    title: "Sunburn Arena Ft. Alan Walker",
    artist: "Alan Walker",
    genre: "Electronic / Progressive House",
    category: "Concerts",
    city: "Hyderabad",
    venue: "GMR Arena, Shamshabad",
    distanceFromUser: "285 km from Tenali, AP",
    date: "2026-09-15",
    time: "06:30 PM",
    price: 1499,
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80",
    description: "Experience the world's biggest EDM spectacle with electronic music legend Alan Walker performing live with spectacular laser beams.",
    seatingTiers: [
      { id: "tier-1", name: "Walker VIP Pit", price: 5500, perks: "Closest to DJ Booth & Pyro Effects", color: "#eab308" },
      { id: "tier-2", name: "Fan Zone Standing", price: 2800, perks: "Central Dance Floor with Laser Immersion", color: "#ec4899" },
      { id: "tier-3", name: "General Arena", price: 1499, perks: "Festival Sound System & Food Zone", color: "#3b82f6" }
    ]
  },

  // --- REAL TOP-TIER INDIAN EVENTS, COMEDY, THEATER & EXPOS 2026 ---
  {
    id: "evt-show-01",
    title: "Comic Con India 2026: Pop Culture, Anime & Gaming Mega Expo",
    artist: "Comic Con India feat. International Comic Creators & Cosplay Champions",
    genre: "Pop Culture / Gaming / Cosplay / Comics",
    category: "Events",
    city: "Hyderabad",
    venue: "Hitex International Exhibition Centre, Hitec City",
    distanceFromUser: "280 km from Tenali, AP",
    date: "2026-10-10",
    time: "11:00 AM to 08:00 PM Daily",
    price: 899,
    image: "https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80",
    description: "India's greatest celebration of pop culture featuring global comic artists, gaming tournaments, massive anime merch pavilions, and Indian Cosplay Championships.",
    seatingTiers: [
      { id: "tier-1", name: "Superfan VIP Fast Pass (Weekend)", price: 2999, perks: "Priority Entry, Official Goodie Bag, Marvel/DC Merch & Celebrity Panel Front Rows", color: "#eab308" },
      { id: "tier-2", name: "Single Day Standard Pass", price: 899, perks: "Full Day Access to Cosplay Arena, Gaming Stalls & Artist Alley", color: "#3b82f6" }
    ]
  },
  {
    id: "evt-show-02",
    title: "Zakir Khan Live: 'Tathastu & Beyond' Standup Comedy Tour",
    artist: "Zakir Khan",
    genre: "Standup Comedy / Hindi Storytelling",
    category: "Events",
    city: "Mumbai",
    venue: "NCPA Tata Theatre, Nariman Point",
    distanceFromUser: "870 km from Tenali, AP",
    date: "2026-08-28",
    time: "08:00 PM",
    price: 999,
    image: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&auto=format&fit=crop&q=80",
    description: "An evening of non-stop laughter and heartwarming storytelling with India's favorite comedian 'Sakht Launda' Zakir Khan in an intimate theatre setting.",
    seatingTiers: [
      { id: "tier-1", name: "VIP Front Center (Rows A-D)", price: 2499, perks: "Best Close-up View of the Comedian & Meet Photo Option", color: "#eab308" },
      { id: "tier-2", name: "Premium Orchestra Stalls", price: 1499, perks: "Clear Acoustics in Main Auditorium Ground Tier", color: "#3b82f6" },
      { id: "tier-3", name: "Balcony Tier Seating", price: 999, perks: "Elevated View with Full Stage Visibility", color: "#10b981" }
    ]
  },
  {
    id: "evt-show-03",
    title: "Anubhav Singh Bassi: 'Kisi Ko Batana Mat' Standup Special",
    artist: "Anubhav Singh Bassi",
    genre: "Standup Comedy / Narrative Humour",
    category: "Events",
    city: "Delhi NCR",
    venue: "Sirifort Auditorium, Khel Gaon",
    distanceFromUser: "1,620 km from Tenali, AP",
    date: "2026-09-05",
    time: "07:30 PM",
    price: 1199,
    image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&auto=format&fit=crop&q=80",
    description: "Bassi's hilarious, nostalgic, and side-splitting brand new solo standup show recounting untold hostel adventures and courtroom escapades.",
    seatingTiers: [
      { id: "tier-1", name: "Platinum Stalls (Rows 1-5)", price: 2999, perks: "VIP Front Row Seating & Priority Entry", color: "#eab308" },
      { id: "tier-2", name: "Gold Middle Stalls", price: 1799, perks: "Comfortable Numbered Seats in Center", color: "#3b82f6" },
      { id: "tier-3", name: "Silver Balcony", price: 1199, perks: "Tiered Auditorium Seating with Crisp Audio", color: "#10b981" }
    ]
  },
  {
    id: "evt-show-04",
    title: "Mughal-e-Azam: The Grand Broadway Musical Spectacular",
    artist: "Directed by Feroz Abbas Khan • 70+ Dancers & Live Kathak",
    genre: "Theatrical Musical / Broadway / Royal Indian Classical",
    category: "Events",
    city: "Mumbai",
    venue: "The Grand Theatre, Nita Mukesh Ambani Cultural Centre (NMACC)",
    distanceFromUser: "870 km from Tenali, AP",
    date: "2026-09-12",
    time: "07:00 PM",
    price: 1500,
    image: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&auto=format&fit=crop&q=80",
    description: "India's greatest musical triumph with Manish Malhotra costumes, 500 bespoke costumes, and live singing in the acoustically perfect 2,000-seat NMACC Grand Theatre.",
    seatingTiers: [
      { id: "tier-1", name: "Royal Diamond Box", price: 8500, perks: "Private Box Seating, NMACC VIP Lounge & Gourmet Canape Service", color: "#eab308" },
      { id: "tier-2", name: "Orchestra Prime Stalls", price: 4500, perks: "Close Sightline to Intricate Kathak Footwork & Live Singers", color: "#ec4899" },
      { id: "tier-3", name: "Dress Circle Tier 1", price: 2800, perks: "Magnificent Full-Stage Overview of the Sheesh Mahal Sets", color: "#3b82f6" },
      { id: "tier-4", name: "Grand Balcony", price: 1500, perks: "Crystal-Clear Dolby Atmos Theatrical Sound Experience", color: "#10b981" }
    ]
  },
  {
    id: "evt-show-05",
    title: "Vir Das: 'Mind Fool' International World Comedy Tour",
    artist: "Vir Das",
    genre: "Standup Comedy / Global Satire",
    category: "Events",
    city: "Hyderabad",
    venue: "Shilpakala Vedika, Hitec City",
    distanceFromUser: "280 km from Tenali, AP",
    date: "2026-09-25",
    time: "07:30 PM",
    price: 1250,
    image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&auto=format&fit=crop&q=80",
    description: "International Emmy winner Vir Das brings his blockbuster 'Mind Fool' tour fresh from sold-out runs in New York, London, and Melbourne.",
    seatingTiers: [
      { id: "tier-1", name: "VIP Prime (Rows A-C)", price: 3200, perks: "Center Stage Front Row & Priority Entrance", color: "#eab308" },
      { id: "tier-2", name: "Executive Stalls", price: 1999, perks: "Great View & Comfortable Theatre Seating", color: "#3b82f6" },
      { id: "tier-3", name: "Balcony Tier", price: 1250, perks: "Good Elevation and Audio Clarity", color: "#10b981" }
    ]
  },
  {
    id: "evt-show-06",
    title: "India International Food, Craft Beer & Gourmet Carnival 2026",
    artist: "Celebrity Masterchefs & 60+ Gourmet Microbreweries",
    genre: "Food & Beverage / Live Music / Flea Carnival",
    category: "Events",
    city: "Pune",
    venue: "JW Marriott Lawns, Senapati Bapat Road",
    distanceFromUser: "780 km from Tenali, AP",
    date: "2026-10-03",
    time: "12:00 PM to 10:00 PM",
    price: 699,
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80",
    description: "A decadent weekend celebration featuring live culinary masterclasses by renowned masterchefs, 80 artisanal food stalls, craft beer tastings, and acoustic bands.",
    seatingTiers: [
      { id: "tier-1", name: "VIP Gourmet Pass (with 5 Tasting Tokens)", price: 1999, perks: "VIP Lounge Access, 5 Gourmet Food & Craft Beer Tasting Tokens", color: "#eab308" },
      { id: "tier-2", name: "General Carnival Entry", price: 699, perks: "Entry to Festival Lawns & Live Acoustic Concert Stage", color: "#3b82f6" }
    ]
  }
];
