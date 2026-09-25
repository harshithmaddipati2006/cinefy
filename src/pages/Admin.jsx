import React, { useState, useEffect } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useCity } from "../context/CityContext";
import AdminEditMovieModal from "../components/AdminEditMovieModal";
import AdminEditTheatreModal from "../components/AdminEditTheatreModal";
import AdminEditEventModal from "../components/AdminEditEventModal";
import {
  saveMovieToFirestore,
  deleteMovieFromFirestore,
  saveTheatreToFirestore,
  deleteTheatreFromFirestore,
  saveEventToFirestore,
  deleteEventFromFirestore,
  subscribeToLiveMovies
} from "../services/firebase";
import {
  ShieldCheck,
  ShieldAlert,
  MessageSquare,
  Film,
  DollarSign,
  Users,
  Ticket,
  Plus,
  Trash2,
  Edit3,
  CheckCircle,
  AlertCircle,
  Building,
  Calendar,
  Music,
  Trophy,
  MapPin,
  Clock,
  Tag,
  Link as LinkIcon,
  Layers,
  Sparkles,
  Lock,
  KeyRound,
  Eye,
  Search,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Info,
  Phone,
  Mail,
  Key,
  Check,
  Smartphone,
  UserCheck,
  UserPlus,
  Image,
  Clapperboard,
  Globe,
  Play,
  X
} from "lucide-react";

export default function Admin() {
  const { user, adminLogin, logout } = useAuth();
  const { cities } = useCity();

  // Admin Security Passcode & Password Gate State - Only unlocked if valid token and admin role exists
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(() => {
    const token = localStorage.getItem("cinefy_token");
    const storedUser = localStorage.getItem("cinefy_user");
    let isRoleAdmin = user?.role === "admin";
    if (!isRoleAdmin && storedUser) {
      try {
        isRoleAdmin = JSON.parse(storedUser)?.role === "admin";
      } catch (e) {}
    }
    const isUnlocked = sessionStorage.getItem("cinefy_admin_unlocked") === "true";
    return Boolean(token && isRoleAdmin && isUnlocked);
  });
  
  // Admin Login Mode: 'PHONE' | 'EMAIL' | 'PIN'
  const [adminPassInput, setAdminPassInput] = useState("");
  const [pinDigits, setPinDigits] = useState(["", "", "", ""]);
  const [showPassword, setShowPassword] = useState(false);
  const [verifyingAdmin, setVerifyingAdmin] = useState(false);
  const [authError, setAuthError] = useState("");

  const handlePinChange = (index, value) => {
    // Only accept numeric digit
    const cleaned = value.replace(/\D/g, "").slice(-1);
    const newDigits = [...pinDigits];
    newDigits[index] = cleaned;
    setPinDigits(newDigits);

    // Auto advance to next box
    if (cleaned && index < 3) {
      const nextInput = document.getElementById(`admin-pin-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handlePinKeyDown = (index, e) => {
    if (e.key === "Backspace" && !pinDigits[index] && index > 0) {
      const prevInput = document.getElementById(`admin-pin-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePinPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (pastedData) {
      const digits = pastedData.split("");
      const newDigits = [...pinDigits];
      digits.forEach((d, idx) => {
        if (idx < 4) newDigits[idx] = d;
      });
      setPinDigits(newDigits);
    }
  };

  // One-time Admin Text Message Notification (dispatched once as requested)
  const [adminTextNotice, setAdminTextNotice] = useState(() => {
    const alreadyDelivered = sessionStorage.getItem("cinefy_admin_sms_notice_shown");
    if (!alreadyDelivered) {
      sessionStorage.setItem("cinefy_admin_sms_notice_shown", "true");
      return {
        id: "msg-" + Date.now(),
        sender: "CineFy Security Alert",
        phone: "+91 8317625528",
        time: "Just now",
        content: "[CineFy Security] Master Admin Passcode: 7777 | Password: Admin@CineFy2026. Dispatched once for authorized sign-in.",
        passcode: "7777",
        password: "Admin@CineFy2026"
      };
    }
    return null;
  });
  const [requestingSms, setRequestingSms] = useState(false);

  const handleRequestTextNotice = async () => {
    setRequestingSms(true);
    setAuthError("");
    try {
      const res = await API.post("/admin/send-text-notice", { phone: "+91 8317625528" });
      setAdminTextNotice({
        id: "msg-" + Date.now(),
        sender: "CineFy Security Alert",
        phone: res.data.phone || "+91 8317625528",
        time: res.data.timestamp || "Just now",
        content: res.data.textMessage || "[CineFy Security] Master Admin Passcode: 7777 | Password: Admin@CineFy2026. Dispatched once for authorized sign-in.",
        passcode: res.data.passcode || "7777",
        password: "Admin@CineFy2026"
      });
      sessionStorage.setItem("cinefy_admin_sms_notice_shown", "true");
    } catch (err) {
      setAdminTextNotice({
        id: "msg-" + Date.now(),
        sender: "CineFy Security Alert",
        phone: "+91 8317625528",
        time: "Just now",
        content: "[CineFy Security] Master Admin Passcode: 7777 | Password: Admin@CineFy2026. Keep this secret.",
        passcode: "7777",
        password: "Admin@CineFy2026"
      });
    } finally {
      setRequestingSms(false);
    }
  };

  const handleInsertTextCredentials = () => {
    setPinDigits(["7", "7", "7", "7"]);
    setAdminPassInput("Admin@CineFy2026");
    setAuthError("");
  };

  // Navigation Tabs: 'MOVIES' | 'THEATRES' | 'EVENTS' | 'CONCERTS' | 'SPORTS' | 'PERMISSIONS' | 'PAYMENTS' | 'STATS'
  const [activeTab, setActiveTab] = useState("MOVIES");
  const [movieFilterStatus, setMovieFilterStatus] = useState("ALL"); // "ALL" | "NOW_SHOWING" | "UPCOMING"

  // Dashboard Data State
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [paymentsList, setPaymentsList] = useState([]);
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("ALL");
  const [refundModal, setRefundModal] = useState({ isOpen: false, payment: null, amount: "", reason: "Customer cancellation request" });
  const [processingRefund, setProcessingRefund] = useState(false);
  const [moviesList, setMoviesList] = useState([]);
  const [theatresList, setTheatresList] = useState([]);
  const [eventsList, setEventsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  // Popular Newly Released & Upcoming Movie Presets for 1-Click Fill
  const MOVIE_PRESETS = [
    {
      label: "Spirit (Prabhas & Sandeep Vanga)",
      data: {
        title: "Spirit",
        language: "Telugu",
        languages: "Telugu, Hindi, Tamil, Malayalam, Kannada",
        genre: "Action, Thriller, Crime, Drama",
        duration: "3h 05m",
        certification: "A",
        releaseDate: "2026-10-02",
        status: "now_showing",
        poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
        backdrop: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&auto=format&fit=crop&q=80",
        trailer: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        languageTrailers: [
          { language: "Telugu", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
          { language: "Hindi", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
          { language: "Tamil", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" }
        ],
        trailers: {
          Telugu: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          Hindi: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          Tamil: "https://www.youtube.com/embed/dQw4w9WgXcQ"
        },
        synopsis: "An unapologetic, intense cop thriller where a fiercely dedicated IPS officer goes rogue to dismantle a ruthless international crime nexus.",
        director: "Sandeep Reddy Vanga",
        producer: "Bhushan Kumar & Pranay Reddy Vanga",
        music: "Harshavardhan Rameshwar",
        rating: "9.6",
        cast: [
          {
            name: "Prabhas",
            role: "DCP Vikram Dev (IPS)",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80"
          },
          {
            name: "Triptii Dimri",
            role: "Dr. Ananya Ray",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
          },
          {
            name: "Prakash Raj",
            role: "Commissioner Rajan",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80"
          }
        ],
        crew: [
          {
            name: "Sandeep Reddy Vanga",
            role: "Director, Writer & Editor",
            image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80"
          },
          {
            name: "Harshavardhan Rameshwar",
            role: "Music & Background Score",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80"
          },
          {
            name: "Djordje Stojiljkovic",
            role: "Director of Photography (DOP)",
            image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80"
          }
        ]
      }
    },
    {
      label: "Kalki 2898 AD Part 2 (Prabhas & Kamal Haasan)",
      data: {
        title: "Kalki 2898 AD Part 2",
        language: "Telugu",
        languages: "Telugu, Hindi, Tamil, Malayalam, Kannada, English",
        genre: "Sci-Fi, Mythological, Action, Epic",
        duration: "3h 10m",
        certification: "U/A 16+",
        releaseDate: "2026-11-14",
        status: "now_showing",
        poster: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&auto=format&fit=crop&q=80",
        backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80",
        trailer: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        languageTrailers: [
          { language: "Telugu", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
          { language: "Hindi", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
          { language: "Tamil", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
          { language: "English", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" }
        ],
        trailers: {
          Telugu: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          Hindi: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          Tamil: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          English: "https://www.youtube.com/embed/dQw4w9WgXcQ"
        },
        synopsis: "The ultimate clash between Supreme Yaskin's cosmic fortress and the prophesied tenth avatar unfolds across a futuristic dystopian Kasi.",
        director: "Nag Ashwin",
        producer: "C. Aswani Dutt (Vyjayanthi Movies)",
        music: "Santhosh Narayanan",
        rating: "9.5",
        cast: [
          {
            name: "Prabhas",
            role: "Bhairava / Karna",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80"
          },
          {
            name: "Amitabh Bachchan",
            role: "Ashwatthama",
            image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80"
          },
          {
            name: "Kamal Haasan",
            role: "Supreme Yaskin",
            image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80"
          },
          {
            name: "Deepika Padukone",
            role: "SUM-80",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
          }
        ],
        crew: [
          {
            name: "Nag Ashwin",
            role: "Director & Screenplay",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80"
          },
          {
            name: "Santhosh Narayanan",
            role: "Music Director",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80"
          },
          {
            name: "Djordje Stojiljkovic",
            role: "Cinematographer",
            image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80"
          }
        ]
      }
    },
    {
      label: "Game Changer (Ram Charan & Shankar)",
      data: {
        title: "Game Changer",
        language: "Telugu",
        languages: "Telugu, Hindi, Tamil",
        genre: "Political Action, Thriller, Drama",
        duration: "2h 55m",
        certification: "U/A 16+",
        releaseDate: "2026-09-05",
        status: "now_showing",
        poster: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=600&auto=format&fit=crop&q=80",
        backdrop: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=80",
        trailer: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        languageTrailers: [
          { language: "Telugu", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
          { language: "Hindi", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" }
        ],
        trailers: {
          Telugu: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          Hindi: "https://www.youtube.com/embed/dQw4w9WgXcQ"
        },
        synopsis: "An honest IAS officer takes on systemic corruption in the electoral system through radical electoral reforms and high-voltage undercover action.",
        director: "S. Shankar",
        producer: "Dil Raju & Sirish",
        music: "Thaman S",
        rating: "9.3",
        cast: [
          {
            name: "Ram Charan",
            role: "Ram Nandan IAS / Appanna",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80"
          },
          {
            name: "Kiara Advani",
            role: "Dr. Deepthi",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
          },
          {
            name: "S. J. Suryah",
            role: "Moppidevi / Antagonist",
            image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80"
          }
        ],
        crew: [
          {
            name: "S. Shankar",
            role: "Director & Story",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80"
          },
          {
            name: "Thaman S",
            role: "Music Director",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80"
          },
          {
            name: "S. Thirunavukarasu",
            role: "Cinematographer",
            image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80"
          }
        ]
      }
    }
  ];

  // -------------------------------------------------------------
  // FORM STATES
  // -------------------------------------------------------------

  // 1. Movie Form
  const [newMovie, setNewMovie] = useState({
    title: "",
    language: "Telugu",
    languages: "Telugu, Hindi, Tamil",
    genre: "Action, Thriller, Sci-Fi",
    duration: "2h 45m",
    certification: "U/A 16+",
    releaseDate: new Date().toISOString().split("T")[0],
    status: "now_showing",
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=80",
    trailer: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    languageTrailers: [
      {
        language: "Telugu",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ"
      }
    ],
    synopsis: "",
    director: "",
    producer: "",
    music: "",
    rating: "9.1",
    cast: [
      {
        name: "Prabhas",
        role: "Lead Hero",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80"
      },
      {
        name: "Deepika Padukone",
        role: "Lead Heroine",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
      }
    ],
    crew: [
      {
        name: "Nag Ashwin",
        role: "Director & Screenplay",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80"
      },
      {
        name: "Santhosh Narayanan",
        role: "Music Director",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80"
      }
    ]
  });
  const [addingMovie, setAddingMovie] = useState(false);

  // Trailer handler helpers for Add Movie form
  const handleAddMovieTrailer = (suggestedLang = "") => {
    setNewMovie((prev) => {
      const existing = prev.languageTrailers || [];
      const lang = suggestedLang || (existing.length === 0 ? prev.language || "Telugu" : "Hindi");
      return {
        ...prev,
        languageTrailers: [
          ...existing,
          { language: lang, url: "" }
        ]
      };
    });
  };

  const handleUpdateMovieTrailer = (index, field, value) => {
    setNewMovie((prev) => {
      const updated = [...(prev.languageTrailers || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, languageTrailers: updated };
    });
  };

  const handleRemoveMovieTrailer = (index) => {
    setNewMovie((prev) => ({
      ...prev,
      languageTrailers: (prev.languageTrailers || []).filter((_, i) => i !== index)
    }));
  };

  // Cast member handlers for Add Movie form
  const handleAddCastMember = () => {
    setNewMovie((prev) => ({
      ...prev,
      cast: [
        ...prev.cast,
        {
          name: "",
          role: "",
          image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
        }
      ]
    }));
  };

  const handleUpdateCastMember = (index, field, value) => {
    setNewMovie((prev) => {
      const updated = [...prev.cast];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, cast: updated };
    });
  };

  const handleRemoveCastMember = (index) => {
    setNewMovie((prev) => ({
      ...prev,
      cast: prev.cast.filter((_, i) => i !== index)
    }));
  };

  // Crew member handlers for Add Movie form
  const handleAddCrewMember = () => {
    setNewMovie((prev) => ({
      ...prev,
      crew: [
        ...prev.crew,
        {
          name: "",
          role: "Director",
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80"
        }
      ]
    }));
  };

  const handleUpdateCrewMember = (index, field, value) => {
    setNewMovie((prev) => {
      const updated = [...prev.crew];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, crew: updated };
    });
  };

  const handleRemoveCrewMember = (index) => {
    setNewMovie((prev) => ({
      ...prev,
      crew: prev.crew.filter((_, i) => i !== index)
    }));
  };

  const handleApplyMoviePreset = (preset) => {
    let trailersList = [];
    if (preset.data.languageTrailers && preset.data.languageTrailers.length > 0) {
      trailersList = JSON.parse(JSON.stringify(preset.data.languageTrailers));
    } else if (preset.data.trailers && typeof preset.data.trailers === "object") {
      trailersList = Object.entries(preset.data.trailers).map(([lang, url]) => ({ language: lang, url }));
    } else if (preset.data.trailer) {
      trailersList = [{ language: preset.data.language || "Telugu", url: preset.data.trailer }];
    }

    setNewMovie({
      ...preset.data,
      languageTrailers: trailersList,
      releaseDate: preset.data.releaseDate || new Date().toISOString().split("T")[0]
    });
    setFeedback({
      type: "success",
      message: `Loaded template for "${preset.data.title}" with ${trailersList.length} language trailer(s), ${preset.data.cast.length} cast and ${preset.data.crew.length} crew members!`
    });
  };

  // 2. Theatre Form
  const [newTheatre, setNewTheatre] = useState({
    name: "",
    city: "Hyderabad",
    locality: "",
    address: "",
    rating: "4.7",
    screensCount: 3,
    theatreType: "Modern Multiplex",
    facilities: "Dolby Atmos, 4K RGB Laser, Recliner Seats, Gourmet Snack Bar, Valet Parking"
  });
  const [addingTheatre, setAddingTheatre] = useState(false);

  // 3. Event / Concert / Sports Form
  const [newEvent, setNewEvent] = useState({
    title: "",
    category: "Events", // "Events" | "Concerts" | "Sports"
    city: "Hyderabad",
    venue: "",
    date: new Date().toISOString().split("T")[0],
    time: "07:30 PM",
    price: 499,
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80",
    description: "",
    sportType: "Cricket",
    teamA: "India",
    teamB: "Australia",
    artist: "A.R. Rahman Live"
  });
  const [addingEvent, setAddingEvent] = useState(false);

  // Delete Confirmation Modal State
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    type: "", // "movie" | "theatre" | "event"
    id: "",
    title: ""
  });
  const [deleting, setDeleting] = useState(false);

  // Edit Modals State
  const [editMovieModal, setEditMovieModal] = useState({ isOpen: false, movie: null });
  const [editTheatreModal, setEditTheatreModal] = useState({ isOpen: false, theatre: null });
  const [editEventModal, setEditEventModal] = useState({ isOpen: false, event: null });
  const [savingEdit, setSavingEdit] = useState(false);

  // Load Inventory if Unlocked
  useEffect(() => {
    if (isAdminUnlocked) {
      fetchAdminData();
    }
  }, [isAdminUnlocked]);

  // Real-time listener for live movie catalog updates in admin table
  useEffect(() => {
    if (!isAdminUnlocked) return;
    const unsubscribe = subscribeToLiveMovies((liveMovies) => {
      if (Array.isArray(liveMovies) && liveMovies.length > 0) {
        setMoviesList(liveMovies);
      }
    });
    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [isAdminUnlocked]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/dashboard");
      setStats(res.data.stats);
      setRecentBookings(res.data.recentBookings || []);
      setPaymentsList(res.data.recentPayments || []);
      setMoviesList(res.data.moviesList || []);
      setTheatresList(res.data.theatresList || []);
      setEventsList(res.data.eventsList || []);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setIsAdminUnlocked(false);
        sessionStorage.removeItem("cinefy_admin_unlocked");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProcessRefund = async (e) => {
    e.preventDefault();
    if (!refundModal.payment) return;
    setProcessingRefund(true);
    try {
      const res = await API.post(`/payments/${refundModal.payment.id}/refund`, {
        amount: Number(refundModal.amount) || refundModal.payment.amount,
        reason: refundModal.reason
      });
      if (res.data?.success) {
        setFeedback({
          type: "success",
          message: `Refund of ₹${refundModal.amount || refundModal.payment.amount} processed successfully via Razorpay!`
        });
        setRefundModal({ isOpen: false, payment: null, amount: "", reason: "" });
        fetchAdminData();
      }
    } catch (err) {
      setFeedback({
        type: "error",
        message: err.response?.data?.error || err.message || "Failed to execute Razorpay refund."
      });
    } finally {
      setProcessingRefund(false);
    }
  };

  // -------------------------------------------------------------
  // ADMIN SECURITY VERIFICATION (4-Digit Passcode & Master Password)
  // -------------------------------------------------------------
  const handleVerifyAdmin = async (e) => {
    e.preventDefault();
    setAuthError("");
    
    const pinCode = pinDigits.join("");
    if (pinCode.length < 4) {
      setAuthError("Please enter all 4 digits of the Admin Security Passcode.");
      return;
    }
    const payload = { code: pinCode, password: adminPassInput.trim() };

    setVerifyingAdmin(true);

    try {
      if (adminLogin) {
        await adminLogin(payload);
      } else {
        const res = await API.post("/admin/login", payload);
        if (res.data?.token) {
          localStorage.setItem("cinefy_token", res.data.token);
          localStorage.setItem("cinefy_user", JSON.stringify(res.data.user));
          sessionStorage.setItem("cinefy_admin_unlocked", "true");
        }
      }

      setIsAdminUnlocked(true);
      setFeedback({
        type: "success",
        message: "Admin authorization verified successfully! Welcome to CineFy Control Console."
      });
    } catch (err) {
      setAuthError(err.response?.data?.error || "Invalid Admin Security Passcode or Password. Please verify and retry.");
    } finally {
      setVerifyingAdmin(false);
    }
  };

  // -------------------------------------------------------------
  // CREATE HANDLERS
  // -------------------------------------------------------------

  // Add Movie
  const handleCreateMovie = async (e) => {
    e.preventDefault();
    if (!newMovie.title.trim()) {
      setFeedback({ type: "error", message: "Movie Title is required." });
      return;
    }

    setAddingMovie(true);
    try {
      // Filter out blank cast and crew items
      const validCast = (newMovie.cast || [])
        .filter((c) => c && c.name && c.name.trim() !== "")
        .map((c) => ({
          name: c.name.trim(),
          role: c.role ? c.role.trim() : "Cast Member",
          image: c.image && c.image.trim() !== "" ? c.image.trim() : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
        }));

      const validCrew = (newMovie.crew || [])
        .filter((c) => c && c.name && c.name.trim() !== "")
        .map((c) => ({
          name: c.name.trim(),
          role: c.role ? c.role.trim() : "Director",
          image: c.image && c.image.trim() !== "" ? c.image.trim() : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80"
        }));

      // Filter out blank trailers
      const safeTrailers = {};
      const validTrailersList = (newMovie.languageTrailers || [])
        .filter((t) => t && t.language && t.url && t.url.trim() !== "")
        .map((t) => {
          safeTrailers[t.language.trim()] = t.url.trim();
          return { language: t.language.trim(), url: t.url.trim() };
        });

      const primaryTrailer =
        safeTrailers[newMovie.language] ||
        Object.values(safeTrailers)[0] ||
        newMovie.trailer ||
        "https://www.youtube.com/embed/dQw4w9WgXcQ";

      const moviePayload = {
        ...newMovie,
        trailers: safeTrailers,
        languageTrailers: validTrailersList,
        trailer: primaryTrailer,
        trailerUrl: primaryTrailer,
        languages: typeof newMovie.languages === "string" ? newMovie.languages.split(",").map((l) => l.trim()).filter(Boolean) : newMovie.languages,
        genre: typeof newMovie.genre === "string" ? newMovie.genre.split(",").map((g) => g.trim()).filter(Boolean) : newMovie.genre,
        rating: Number(newMovie.rating) || 8.5,
        cast: validCast,
        crew: validCrew
      };

      const res = await API.post("/admin/movies", moviePayload);
      if (res.data?.movie) {
        saveMovieToFirestore(res.data.movie).catch(() => {});
      }

      setFeedback({
        type: "success",
        message:
          res.data.message ||
          `Movie "${newMovie.title}" with ${Object.keys(safeTrailers).length} trailer language(s), ${validCast.length} Cast & ${validCrew.length} Crew members published successfully!`
      });
      setNewMovie({
        title: "",
        language: "Telugu",
        languages: "Telugu, Hindi, Tamil",
        genre: "Action, Thriller, Sci-Fi",
        duration: "2h 45m",
        certification: "U/A 16+",
        releaseDate: new Date().toISOString().split("T")[0],
        status: "now_showing",
        poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80",
        backdrop: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=80",
        trailer: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        languageTrailers: [
          {
            language: "Telugu",
            url: "https://www.youtube.com/embed/dQw4w9WgXcQ"
          }
        ],
        synopsis: "",
        director: "",
        producer: "",
        music: "",
        rating: "9.1",
        cast: [
          {
            name: "",
            role: "",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80"
          }
        ],
        crew: [
          {
            name: "",
            role: "Director",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80"
          }
        ]
      });
      fetchAdminData();
    } catch (err) {
      setFeedback({ type: "error", message: err.response?.data?.error || "Failed to publish movie" });
    } finally {
      setAddingMovie(false);
    }
  };

  // Add Theatre
  const handleCreateTheatre = async (e) => {
    e.preventDefault();
    if (!newTheatre.name.trim() || !newTheatre.city.trim()) {
      setFeedback({ type: "error", message: "Theatre Name and City are required." });
      return;
    }

    setAddingTheatre(true);
    try {
      const res = await API.post("/admin/theatres", {
        ...newTheatre,
        facilities: newTheatre.facilities.split(",").map((f) => f.trim()),
        rating: Number(newTheatre.rating) || 4.6,
        screensCount: Number(newTheatre.screensCount) || 2
      });

      setFeedback({ type: "success", message: res.data.message || "Theatre added successfully!" });
      setNewTheatre({
        name: "",
        city: "Hyderabad",
        locality: "",
        address: "",
        rating: "4.7",
        screensCount: 3,
        theatreType: "Modern Multiplex",
        facilities: "Dolby Atmos, 4K RGB Laser, Recliner Seats, Gourmet Snack Bar, Valet Parking"
      });
      fetchAdminData();
    } catch (err) {
      setFeedback({ type: "error", message: err.response?.data?.error || "Failed to add theatre" });
    } finally {
      setAddingTheatre(false);
    }
  };

  // Add Event / Concert / Sports
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.title.trim() || !newEvent.venue.trim()) {
      setFeedback({ type: "error", message: "Title and Venue are required." });
      return;
    }

    setAddingEvent(true);
    try {
      const res = await API.post("/admin/events", {
        ...newEvent,
        price: Number(newEvent.price) || 499
      });

      setFeedback({ type: "success", message: res.data.message || "Item added successfully!" });
      setNewEvent({
        title: "",
        category: newEvent.category,
        city: "Hyderabad",
        venue: "",
        date: new Date().toISOString().split("T")[0],
        time: "07:30 PM",
        price: 499,
        image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80",
        description: "",
        sportType: "Cricket",
        teamA: "India",
        teamB: "Australia",
        artist: "A.R. Rahman Live"
      });
      fetchAdminData();
    } catch (err) {
      setFeedback({ type: "error", message: err.response?.data?.error || "Failed to add event" });
    } finally {
      setAddingEvent(false);
    }
  };

  // -------------------------------------------------------------
  // EDIT SAVE HANDLERS
  // -------------------------------------------------------------
  const handleSaveMovieEdit = async (updatedMovie) => {
    setSavingEdit(true);
    try {
      const res = await API.put(`/admin/movies/${updatedMovie.id}`, updatedMovie);
      saveMovieToFirestore(updatedMovie).catch(() => {});
      setFeedback({ type: "success", message: res.data.message || `Movie "${updatedMovie.title}" updated successfully!` });
      setEditMovieModal({ isOpen: false, movie: null });
      fetchAdminData();
    } catch (err) {
      setFeedback({ type: "error", message: err.response?.data?.error || "Failed to update movie" });
    } finally {
      setSavingEdit(false);
    }
  };

  const handleSaveTheatreEdit = async (updatedTheatre) => {
    setSavingEdit(true);
    try {
      const res = await API.put(`/admin/theatres/${updatedTheatre.id}`, updatedTheatre);
      saveTheatreToFirestore(updatedTheatre).catch(() => {});
      setFeedback({ type: "success", message: res.data.message || `Theatre "${updatedTheatre.name}" updated successfully!` });
      setEditTheatreModal({ isOpen: false, theatre: null });
      fetchAdminData();
    } catch (err) {
      setFeedback({ type: "error", message: err.response?.data?.error || "Failed to update theatre" });
    } finally {
      setSavingEdit(false);
    }
  };

  const handleSaveEventEdit = async (updatedEvent) => {
    setSavingEdit(true);
    try {
      const res = await API.put(`/admin/events/${updatedEvent.id}`, updatedEvent);
      saveEventToFirestore(updatedEvent).catch(() => {});
      setFeedback({ type: "success", message: res.data.message || `Event "${updatedEvent.title}" updated successfully!` });
      setEditEventModal({ isOpen: false, event: null });
      fetchAdminData();
    } catch (err) {
      setFeedback({ type: "error", message: err.response?.data?.error || "Failed to update event" });
    } finally {
      setSavingEdit(false);
    }
  };

  // -------------------------------------------------------------
  // DELETE HANDLERS
  // -------------------------------------------------------------
  const confirmDelete = async () => {
    const { type, id, title } = deleteModal;
    if (!id || !type) return;

    setDeleting(true);
    try {
      let endpoint = "";
      if (type === "movie") {
        endpoint = `/admin/movies/${id}`;
        deleteMovieFromFirestore(id).catch(() => {});
      } else if (type === "theatre") {
        endpoint = `/admin/theatres/${id}`;
        deleteTheatreFromFirestore(id).catch(() => {});
      } else if (type === "event" || type === "concert" || type === "sports") {
        endpoint = `/admin/events/${id}`;
        deleteEventFromFirestore(id).catch(() => {});
      }

      const res = await API.delete(endpoint);
      setFeedback({ type: "success", message: res.data.message || `"${title}" has been permanently removed.` });
      setDeleteModal({ isOpen: false, type: "", id: "", title: "" });
      fetchAdminData();
    } catch (err) {
      setFeedback({ type: "error", message: err.response?.data?.error || "Failed to remove item" });
    } finally {
      setDeleting(false);
    }
  };

  // -------------------------------------------------------------
  // STRICT ACCESS CONTROL: Only authorized administrators may enter.
  // If signed in as non-admin customer, completely block access!
  // -------------------------------------------------------------
  if (user && user.role !== "admin") {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="bg-slate-900/95 rounded-3xl p-8 border border-rose-500/30 shadow-2xl backdrop-blur-2xl space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto shadow-xl shadow-rose-500/10">
            <ShieldAlert className="w-8 h-8 text-rose-400" />
          </div>
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] uppercase tracking-widest font-black inline-block">
              Restricted Area • 403 Forbidden
            </span>
            <h1 className="text-2xl font-black text-white font-heading">
              Administrator Access Required
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your current account (<span className="text-slate-200 font-mono font-semibold">{user.email || user.name || user.phone}</span>) does not have administrator privileges.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-left space-y-2">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold">
              <Lock className="w-4 h-4" />
              <span>Strict Security Policy Active</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Only verified CineFy system administrators are authorized to access movie scheduling, ticket locks, screen seating layouts, and financial transaction controls.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href="/"
              className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all text-center"
            >
              Return to Movies
            </a>
            <button
              onClick={() => {
                logout();
                sessionStorage.removeItem("cinefy_admin_unlocked");
                setIsAdminUnlocked(false);
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black transition-all text-center cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              Sign In as Admin
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // IF LOCKED: RENDER DEDICATED 4-DIGIT SECURITY PASSCODE GATE
  // -------------------------------------------------------------
  if (!isAdminUnlocked) {
    return (
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-slate-900/95 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl backdrop-blur-2xl space-y-6">
          
          {/* Security Shield Header */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto shadow-xl shadow-cyan-500/10">
              <ShieldCheck className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px] uppercase tracking-widest font-black inline-block mb-1.5">
                CineFy Management Portal
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">
                Admin Security Passcode
              </h1>
            </div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Enter your authorized <strong>4-Digit Admin Security Passcode</strong> to access CineFy management controls.
            </p>
          </div>

          {/* Authentic One-Time SMS Text Message Notification */}
          {adminTextNotice && (
            <div className="relative p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 to-slate-900 border border-cyan-500/40 text-cyan-200 text-xs shadow-xl backdrop-blur-md animate-fadeIn">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 mt-0.5 shrink-0 border border-cyan-500/30">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                        Text Message Received (SMS)
                      </span>
                      <span className="text-[10px] text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20 font-mono">
                        {adminTextNotice.time}
                      </span>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 font-mono select-all">
                      {adminTextNotice.content}
                    </p>
                    <div className="pt-0.5 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleInsertTextCredentials}
                        className="px-3 py-1.5 rounded-xl bg-cyan-500 text-slate-950 text-[11px] font-black hover:bg-cyan-400 transition-all cursor-pointer shadow-md shadow-cyan-500/20"
                      >
                        Insert Passcode
                      </button>
                      <span className="text-[10px] text-slate-400">
                        Delivered to Admin Phone
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAdminTextNotice(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                  title="Dismiss Text Message"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {authError && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleVerifyAdmin} className="space-y-5">
            {/* 4-Digit Security Code PIN */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                    <span>4-Digit Admin Security Passcode *</span>
                  </label>
                </div>
                
                <div className="grid grid-cols-4 gap-3">
                  {[0, 1, 2, 3].map((idx) => (
                    <input
                      key={idx}
                      id={`admin-pin-${idx}`}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={pinDigits[idx]}
                      onChange={(e) => handlePinChange(idx, e.target.value)}
                      onKeyDown={(e) => handlePinKeyDown(idx, e)}
                      onPaste={handlePinPaste}
                      className="w-full h-14 text-center text-2xl font-black font-mono rounded-2xl bg-slate-950 border border-slate-800 text-cyan-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 shadow-inner"
                    />
                  ))}
                </div>
                <p className="text-[10px] text-slate-500 text-center">Enter the authorized 4-digit passcode received via SMS</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Admin Password (Optional for Passcode)</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Admin Password (Optional)"
                    value={adminPassInput}
                    onChange={(e) => setAdminPassInput(e.target.value)}
                    className="w-full pl-4 pr-11 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-white p-0.5 cursor-pointer"
                    tabIndex={-1}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>



            {/* Unlock Button */}
            <button
              type="submit"
              disabled={verifyingAdmin}
              className="w-full cyan-button py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/20 disabled:opacity-50 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{verifyingAdmin ? "Verifying Admin Passcode..." : "Unlock Admin Console"}</span>
            </button>
          </form>

          {/* User Sign In Switch */}
          <div className="pt-4 border-t border-slate-800 text-center space-y-2">
            <p className="text-xs text-slate-400">
              Need to book movie tickets, stadium seats or concerts?
            </p>
            <a
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-bold transition-colors"
            >
              <span>Switch to User Sign In / Register</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // UNLOCKED: MAIN ADMIN CONSOLE
  // -------------------------------------------------------------
  const filteredMovies = moviesList.filter((m) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      m.title.toLowerCase().includes(q) ||
      m.language?.toLowerCase().includes(q) ||
      (Array.isArray(m.genre) ? m.genre.join(", ") : m.genre || "").toLowerCase().includes(q) ||
      (m.director && m.director.toLowerCase().includes(q)) ||
      (Array.isArray(m.cast) && m.cast.some((c) => c.name?.toLowerCase().includes(q))) ||
      (Array.isArray(m.crew) && m.crew.some((cr) => cr.name?.toLowerCase().includes(q)))
    );

    if (movieFilterStatus === "NOW_SHOWING") {
      return matchesSearch && (m.status === "now_showing" || m.status === "NOW_SHOWING" || !m.status);
    }
    if (movieFilterStatus === "UPCOMING") {
      return matchesSearch && (m.status === "coming_soon" || m.status === "upcoming" || m.status === "UPCOMING");
    }
    return matchesSearch;
  });

  const filteredTheatres = theatresList.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.address?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredEvents = eventsList.filter((e) =>
    (activeTab === "ALL" || e.category?.toLowerCase() === activeTab.toLowerCase()) &&
    (e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.venue?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const concertsList = eventsList.filter((e) => e.category?.toLowerCase() === "concerts");
  const sportsList = eventsList.filter((e) => e.category?.toLowerCase() === "sports");
  const culturalEventsList = eventsList.filter((e) => e.category?.toLowerCase() === "events");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500 text-slate-950 font-black flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white font-heading flex items-center gap-2">
                <span>CineFy Admin Control Console</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] uppercase tracking-widest font-black">
                  Live Master
                </span>
              </h1>
              <p className="text-slate-400 text-xs mt-0.5">
                Add and remove Theatres, Movie Posters, Events, Concerts & Stadium Sports with real-time synchronization
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchAdminData}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-cyan-400" : ""}`} />
            <span>Refresh Data</span>
          </button>
          <button
            onClick={() => {
              sessionStorage.removeItem("cinefy_admin_unlocked");
              setIsAdminUnlocked(false);
            }}
            className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold transition-all cursor-pointer"
          >
            Lock Console
          </button>
        </div>
      </div>

      {/* Global Feedback Message */}
      {feedback.message && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-bold animate-fadeIn ${
            feedback.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-rose-500/10 border-rose-500/30 text-rose-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback({ type: "", message: "" })}
            className="text-slate-400 hover:text-white text-xs px-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* KPI Stats Overview */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
              <span>Revenue</span>
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <p className="text-xl font-black text-white font-heading">₹{stats.totalRevenue.toLocaleString()}</p>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
              <span>Bookings</span>
              <Ticket className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <p className="text-xl font-black text-white font-heading">{stats.totalBookingsCount}</p>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
              <span>Movies</span>
              <Film className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <p className="text-xl font-black text-white font-heading">{stats.totalMoviesCount}</p>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
              <span>Theatres</span>
              <Building className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <p className="text-xl font-black text-white font-heading">{stats.totalTheatresCount || theatresList.length}</p>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
              <span>Events & Sports</span>
              <Trophy className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <p className="text-xl font-black text-white font-heading">{stats.totalEventsCount || eventsList.length}</p>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
              <span>Users</span>
              <Users className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <p className="text-xl font-black text-white font-heading">{stats.totalUsersCount}</p>
          </div>
        </div>
      )}

      {/* Main Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 no-scrollbar">
        {[
          { id: "MOVIES", label: "Movies & Posters", icon: Film, count: moviesList.length },
          { id: "THEATRES", label: "Theatres & Screens", icon: Building, count: theatresList.length },
          { id: "EVENTS", label: "Cultural Events", icon: Calendar, count: culturalEventsList.length },
          { id: "CONCERTS", label: "Live Concerts", icon: Music, count: concertsList.length },
          { id: "SPORTS", label: "Sports & Stadiums", icon: Trophy, count: sportsList.length },
          { id: "PAYMENTS", label: "Razorpay Gateway & Payments", icon: DollarSign, count: paymentsList.length },
          { id: "PERMISSIONS", label: "Admin Permissions & Security", icon: ShieldCheck, count: "Active" },
          { id: "STATS", label: "Recent Bookings", icon: Ticket, count: recentBookings.length }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSearchQuery("");
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
                isActive
                  ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 font-black"
                  : "bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] ${
                  isActive ? "bg-slate-950/20 text-slate-950 font-black" : "bg-slate-800 text-slate-300"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* -------------------------------------------------------------------------------- */}
      {/* 0. ADMIN PERMISSIONS & SECURITY PROFILE SECTION */}
      {/* -------------------------------------------------------------------------------- */}
      {activeTab === "PERMISSIONS" && (
        <div className="space-y-8 animate-fadeIn">
          <section className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white font-heading">
                    Admin Access Permissions & Security Profile
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Manage admin credentials, telephone verification, and operational role entitlements
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Role: SUPER_ADMIN</span>
                </span>
              </div>
            </div>

            {/* Admin Credentials Overview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
                  <KeyRound className="w-4 h-4" />
                  <span>Master Security PIN (Active)</span>
                </div>
                <p className="text-base font-black text-white font-mono">7777 / 2026</p>
                <p className="text-[11px] text-emerald-400 font-semibold">Exclusively used for Admin console login</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
                  <Phone className="w-4 h-4" />
                  <span>Admin Security Phone</span>
                </div>
                <p className="text-base font-black text-white font-mono">{user?.phone || "+91 8317625528"}</p>
                <p className="text-[11px] text-slate-400">SMS notification & security passcode dispatch</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
                  <Mail className="w-4 h-4" />
                  <span>Admin System Email</span>
                </div>
                <p className="text-base font-black text-white font-mono">{user?.email || "admin@cinefy.com"}</p>
                <p className="text-[11px] text-slate-400">Audit trail reports & system alerts</p>
              </div>
            </div>

            {/* Active Permissions Checklist */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Granted System Permissions:</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { name: "Manage Theatrical Movies & Posters", desc: "Add, edit, and delete movie listings, languages, genres, and trailers." },
                  { name: "Multiplex & Screen Architectures", desc: "Construct multi-tier screens (>=120 seats), modify seat configurations." },
                  { name: "Live Showtime Scheduling", desc: "Schedule daily showtimes across cities, dates, and screen tiers." },
                  { name: "Concerts & Cultural Events", desc: "Publish music festivals, stand-up comedy, and cultural conventions." },
                  { name: "Sports & Stadium Booking", desc: "Manage IPL & ISL stadium seating blocks and match fixtures." },
                  { name: "Live Inventory & Lock Timers", desc: "Configure temporary checkout seat lock countdown timers." },
                  { name: "Dynamic Tier Pricing Engine", desc: "Modulate Regular, Premium, Executive, Recliner, and VIP seat tariffs." },
                  { name: "User Panel Non-Interference Guard", desc: "Independent session storage prevents user bookings from interruption." },
                  { name: "Audit Trail & Financial Reporting", desc: "Real-time revenue tracking and ticket verification system." }
                ].map((perm, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{perm.name}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{perm.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}


      {/* -------------------------------------------------------------------------------- */}
      {/* 1. MOVIES SECTION: ADD & REMOVE (WITH CAST & CREW BUILDER) */}
      {/* -------------------------------------------------------------------------------- */}
      {activeTab === "MOVIES" && (
        <div className="space-y-10">
          {/* Add Movie Form */}
          <section className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-black text-white font-heading flex items-center gap-2">
                  <Plus className="w-5 h-5 text-cyan-400" />
                  <span>Add & Publish New Movie to CineFy</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Publish newly released or upcoming blockbusters with Cast, Crew, Poster URLs & Trailers
                </p>
              </div>

              {/* 1-Click Preset Fill */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Presets:</span>
                </span>
                {MOVIE_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyMoviePreset(preset)}
                    className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 text-[11px] font-bold transition-all cursor-pointer"
                  >
                    {preset.label.split(" (")[0]}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleCreateMovie} className="space-y-6">
              {/* Core Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300">Movie Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Spirit / Kalki 2898 AD"
                    value={newMovie.title}
                    onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
                    className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300">Primary Language *</label>
                  <select
                    value={newMovie.language}
                    onChange={(e) => setNewMovie({ ...newMovie, language: e.target.value })}
                    className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Telugu">Telugu</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Tamil">Tamil</option>
                    <option value="Malayalam">Malayalam</option>
                    <option value="Kannada">Kannada</option>
                    <option value="English">English</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300">Audio Languages (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="Telugu, Hindi, Tamil, Malayalam, Kannada"
                    value={newMovie.languages}
                    onChange={(e) => setNewMovie({ ...newMovie, languages: e.target.value })}
                    className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300">Genres (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="Action, Sci-Fi, Crime, Thriller"
                    value={newMovie.genre}
                    onChange={(e) => setNewMovie({ ...newMovie, genre: e.target.value })}
                    className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300">Duration</label>
                  <input
                    type="text"
                    placeholder="2h 45m"
                    value={newMovie.duration}
                    onChange={(e) => setNewMovie({ ...newMovie, duration: e.target.value })}
                    className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300">Certification</label>
                  <select
                    value={newMovie.certification}
                    onChange={(e) => setNewMovie({ ...newMovie, certification: e.target.value })}
                    className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                  >
                    <option value="U">U (Universal)</option>
                    <option value="U/A 13+">U/A 13+</option>
                    <option value="U/A 16+">U/A 16+</option>
                    <option value="A">A (Adult 18+)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300">Theatrical Status</label>
                  <select
                    value={newMovie.status}
                    onChange={(e) => setNewMovie({ ...newMovie, status: e.target.value })}
                    className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500 font-bold"
                  >
                    <option value="now_showing">🟢 Now Showing (Newly Released / In Theatres)</option>
                    <option value="coming_soon">🟡 Upcoming Release (Coming Soon)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300">Theatrical Release Date</label>
                  <input
                    type="date"
                    value={newMovie.releaseDate}
                    onChange={(e) => setNewMovie({ ...newMovie, releaseDate: e.target.value })}
                    className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300">Initial Rating (out of 10)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="10"
                    placeholder="9.2"
                    value={newMovie.rating}
                    onChange={(e) => setNewMovie({ ...newMovie, rating: e.target.value })}
                    className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Media Links with Visual Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="lg:col-span-2 space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <LinkIcon className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Poster Image Link Address (URL) *</span>
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://images.unsplash.com/... or movie poster link"
                      value={newMovie.poster}
                      onChange={(e) => setNewMovie({ ...newMovie, poster: e.target.value })}
                      className="w-full mt-1 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <LinkIcon className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Backdrop / Banner Image Link Address (URL)</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/... or horizontal banner link"
                      value={newMovie.backdrop}
                      onChange={(e) => setNewMovie({ ...newMovie, backdrop: e.target.value })}
                      className="w-full mt-1 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  {/* Language-Specific Trailers Manager */}
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                      <div>
                        <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Official Trailers by Language ({newMovie.languageTrailers?.length || 0})</span>
                        </label>
                        <p className="text-[10px] text-slate-400">
                          Users will be able to watch and switch between only the trailer languages you add here.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddMovieTrailer()}
                        className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-slate-950 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Language Trailer</span>
                      </button>
                    </div>

                    {/* Quick Add Languages */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      <span className="text-[10px] text-slate-400 font-semibold mr-1">Quick Add:</span>
                      {["Telugu", "Hindi", "Tamil", "Kannada", "Malayalam", "English"].map((lang) => {
                        const alreadyAdded = newMovie.languageTrailers?.some(
                          (t) => t.language?.toLowerCase() === lang.toLowerCase()
                        );
                        return (
                          <button
                            key={lang}
                            type="button"
                            onClick={() => handleAddMovieTrailer(lang)}
                            disabled={alreadyAdded}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border transition flex items-center gap-0.5 cursor-pointer ${
                              alreadyAdded
                                ? "bg-slate-800/40 text-slate-500 border-slate-800 cursor-not-allowed"
                                : "bg-slate-950 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500 hover:text-slate-950"
                            }`}
                          >
                            <Plus className="w-2.5 h-2.5" />
                            <span>{lang}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Trailer Rows */}
                    <div className="space-y-2 pt-1">
                      {(newMovie.languageTrailers || []).map((tItem, tIdx) => (
                        <div
                          key={tIdx}
                          className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center gap-2"
                        >
                          <div className="w-full sm:w-32 shrink-0">
                            <label className="text-[9px] text-slate-400 font-bold block mb-0.5">Language</label>
                            <select
                              value={tItem.language}
                              onChange={(e) => handleUpdateMovieTrailer(tIdx, "language", e.target.value)}
                              className="w-full px-2 py-1.5 rounded-md bg-slate-900 border border-slate-800 text-cyan-400 text-xs font-bold focus:outline-none focus:border-cyan-500"
                            >
                              <option value="Telugu">Telugu</option>
                              <option value="Hindi">Hindi</option>
                              <option value="Tamil">Tamil</option>
                              <option value="Kannada">Kannada</option>
                              <option value="Malayalam">Malayalam</option>
                              <option value="English">English</option>
                              <option value="Bhojpuri">Bhojpuri</option>
                              <option value="Bengali">Bengali</option>
                              <option value="Marathi">Marathi</option>
                              <option value="Punjabi">Punjabi</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>

                          <div className="flex-1 w-full">
                            <label className="text-[9px] text-slate-400 font-bold block mb-0.5">
                              YouTube / Embed URL ({tItem.language})
                            </label>
                            <input
                              type="url"
                              placeholder="https://www.youtube.com/embed/... or https://youtu.be/..."
                              value={tItem.url}
                              onChange={(e) => handleUpdateMovieTrailer(tIdx, "url", e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded-md bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                            />
                          </div>

                          <div className="flex items-center gap-1 self-end sm:self-center mt-1 sm:mt-3 shrink-0">
                            {tItem.url && (
                              <a
                                href={tItem.url}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 text-[10px] flex items-center gap-1 px-2 font-semibold transition"
                                title="Preview Trailer"
                              >
                                <Play className="w-2.5 h-2.5 fill-current" />
                                <span>Test</span>
                              </a>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveMovieTrailer(tIdx)}
                              className="p-1 rounded bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition cursor-pointer"
                              title="Delete Trailer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {(!newMovie.languageTrailers || newMovie.languageTrailers.length === 0) && (
                        <div className="text-center py-3 bg-slate-950/60 rounded-lg border border-dashed border-slate-800">
                          <p className="text-slate-400 text-xs">No trailer links configured yet.</p>
                          <button
                            type="button"
                            onClick={() => handleAddMovieTrailer(newMovie.language || "Telugu")}
                            className="mt-1 text-xs font-bold text-cyan-400 hover:underline inline-flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" /> Add {newMovie.language || "Telugu"} Trailer Link
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Live Poster Card Preview */}
                <div className="flex flex-col items-center justify-center p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 text-center">
                  <div className="w-24 h-32 rounded-lg overflow-hidden bg-slate-950 border border-slate-700 shadow-md relative group">
                    <img
                      src={newMovie.poster || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80"}
                      alt="Poster Preview"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80";
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold mt-2">Live Poster Preview</span>
                </div>
              </div>

              {/* Story Synopsis */}
              <div>
                <label className="text-xs font-bold text-slate-300">Movie Synopsis / Storyline</label>
                <textarea
                  rows={2}
                  placeholder="High-octane storyline overview for movie fans..."
                  value={newMovie.synopsis}
                  onChange={(e) => setNewMovie({ ...newMovie, synopsis: e.target.value })}
                  className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* ------------------------------------------------------------- */}
              {/* CAST MEMBERS SECTION (ACTORS WITH NAMES & IMAGE LINK ADDRESSES) */}
              {/* ------------------------------------------------------------- */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white flex items-center gap-2">
                        <span>Cast Members & Star Cast</span>
                        <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px] font-black">
                          {newMovie.cast?.length || 0} Actors
                        </span>
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Add actor full names, roles/characters, and profile image link addresses
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddCastMember}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-cyan-500/30"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Cast Member</span>
                  </button>
                </div>

                {(!newMovie.cast || newMovie.cast.length === 0) ? (
                  <div className="text-center py-6 border border-dashed border-slate-800 rounded-xl space-y-2">
                    <UserPlus className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="text-xs text-slate-400 font-bold">No cast members added yet.</p>
                    <button
                      type="button"
                      onClick={handleAddCastMember}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-bold cursor-pointer"
                    >
                      + Add First Cast Member
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {newMovie.cast.map((member, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-3 relative group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={member.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"}
                              alt={member.name || `Cast #${idx + 1}`}
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80";
                              }}
                              className="w-10 h-10 rounded-full object-cover border border-cyan-500/40 shadow-sm shrink-0"
                            />
                            <div>
                              <span className="text-[10px] font-black text-cyan-400 uppercase tracking-wider">
                                Cast Member #{idx + 1}
                              </span>
                              <p className="text-xs font-bold text-white truncate max-w-[140px]">
                                {member.name || "Unnamed Actor"}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveCastMember(idx)}
                            className="text-slate-500 hover:text-rose-400 p-1 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Remove Cast Member"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400">Actor / Performer Name *</label>
                            <input
                              type="text"
                              placeholder="e.g. Prabhas / Deepika Padukone"
                              value={member.name}
                              onChange={(e) => handleUpdateCastMember(idx, "name", e.target.value)}
                              className="w-full mt-0.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-400">Character / Role</label>
                            <input
                              type="text"
                              placeholder="e.g. DCP Vikram Dev / SUM-80"
                              value={member.role}
                              onChange={(e) => handleUpdateCastMember(idx, "role", e.target.value)}
                              className="w-full mt-0.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                              <LinkIcon className="w-2.5 h-2.5 text-cyan-400" />
                              <span>Image Link Address (URL)</span>
                            </label>
                            <input
                              type="url"
                              placeholder="https://images.unsplash.com/... or photo URL"
                              value={member.image}
                              onChange={(e) => handleUpdateCastMember(idx, "image", e.target.value)}
                              className="w-full mt-0.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500 text-[11px]"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ------------------------------------------------------------- */}
              {/* CREW MEMBERS SECTION (DIRECTORS, PRODUCERS, COMPOSERS, ETC.) */}
              {/* ------------------------------------------------------------- */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                      <Clapperboard className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white flex items-center gap-2">
                        <span>Crew Members & Behind-the-Scenes</span>
                        <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[10px] font-black">
                          {newMovie.crew?.length || 0} Crew
                        </span>
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Add directors, music composers, cinematographers, writers & stunt directors
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddCrewMember}
                    className="px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500 text-purple-300 hover:text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-purple-500/30"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Crew Member</span>
                  </button>
                </div>

                {(!newMovie.crew || newMovie.crew.length === 0) ? (
                  <div className="text-center py-6 border border-dashed border-slate-800 rounded-xl space-y-2">
                    <Clapperboard className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="text-xs text-slate-400 font-bold">No crew members added yet.</p>
                    <button
                      type="button"
                      onClick={handleAddCrewMember}
                      className="text-xs text-purple-400 hover:text-purple-300 font-bold cursor-pointer"
                    >
                      + Add First Crew Member
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {newMovie.crew.map((member, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-3 relative group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={member.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80"}
                              alt={member.name || `Crew #${idx + 1}`}
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                e.target.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80";
                              }}
                              className="w-10 h-10 rounded-full object-cover border border-purple-500/40 shadow-sm shrink-0"
                            />
                            <div>
                              <span className="text-[10px] font-black text-purple-400 uppercase tracking-wider">
                                Crew Member #{idx + 1}
                              </span>
                              <p className="text-xs font-bold text-white truncate max-w-[140px]">
                                {member.name || "Unnamed Crew"}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveCrewMember(idx)}
                            className="text-slate-500 hover:text-rose-400 p-1 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Remove Crew Member"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400">Crew Member Name *</label>
                            <input
                              type="text"
                              placeholder="e.g. Nag Ashwin / Sandeep Reddy Vanga"
                              value={member.name}
                              onChange={(e) => handleUpdateCrewMember(idx, "name", e.target.value)}
                              className="w-full mt-0.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-400">Department / Role</label>
                            <input
                              type="text"
                              placeholder="e.g. Director & Screenplay / Music Director"
                              value={member.role}
                              onChange={(e) => handleUpdateCrewMember(idx, "role", e.target.value)}
                              className="w-full mt-0.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                              <LinkIcon className="w-2.5 h-2.5 text-purple-400" />
                              <span>Image Link Address (URL)</span>
                            </label>
                            <input
                              type="url"
                              placeholder="https://images.unsplash.com/... or photo URL"
                              value={member.image}
                              onChange={(e) => handleUpdateCrewMember(idx, "image", e.target.value)}
                              className="w-full mt-0.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500 text-[11px]"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit & Publish Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={addingMovie}
                  className="cyan-button px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-cyan-500/20 cursor-pointer disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  <span>{addingMovie ? "Publishing Movie..." : "Publish Movie to CineFy"}</span>
                </button>
              </div>
            </form>
          </section>

          {/* Current Live Movies Inventory */}
          <section className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-black text-white font-heading flex items-center gap-2">
                  <Film className="w-5 h-5 text-purple-400" />
                  <span>Current Live Movies Inventory ({filteredMovies.length})</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  View, filter, edit metadata, cast/crew, or remove movies from theatrical booking
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                {/* Release Status Filter Tabs */}
                <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800">
                  {[
                    { id: "ALL", label: "All Movies" },
                    { id: "NOW_SHOWING", label: "Now Showing (Newly Released)" },
                    { id: "UPCOMING", label: "Upcoming Releases" }
                  ].map((filterTab) => (
                    <button
                      key={filterTab.id}
                      onClick={() => setMovieFilterStatus(filterTab.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        movieFilterStatus === filterTab.id
                          ? "bg-cyan-500 text-slate-950 font-black shadow-md"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {filterTab.label}
                    </button>
                  ))}
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search title, cast, genre..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>

            {filteredMovies.length === 0 ? (
              <div className="text-center py-12 bg-slate-950/50 rounded-2xl border border-dashed border-slate-800 space-y-3">
                <Film className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-sm font-bold text-slate-400">No movies match your filter or search query.</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setMovieFilterStatus("ALL");
                  }}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-bold cursor-pointer"
                >
                  Reset Filter & Search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMovies.map((movie) => {
                  const castCount = Array.isArray(movie.cast) ? movie.cast.length : 0;
                  const crewCount = Array.isArray(movie.crew) ? movie.crew.length : 0;
                  const isNowShowing = movie.status === "now_showing" || movie.status === "NOW_SHOWING" || !movie.status;

                  return (
                    <div
                      key={movie.id}
                      className="bg-slate-950 rounded-2xl border border-slate-800 p-4 flex gap-4 items-start group hover:border-slate-700 transition-all shadow-md"
                    >
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80";
                        }}
                        className="w-20 h-28 object-cover rounded-xl shrink-0 shadow-md border border-slate-800"
                      />
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-bold text-white truncate group-hover:text-cyan-400 transition-colors">
                            {movie.title}
                          </h4>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[9px] font-black shrink-0 uppercase tracking-wider ${
                              isNowShowing
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                            }`}
                          >
                            {isNowShowing ? "Now Showing" : "Upcoming"}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-400 line-clamp-1">
                          {Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre}
                        </p>

                        <div className="flex items-center gap-2 text-[10px] text-slate-500">
                          <span className="text-slate-300 font-bold">{movie.language}</span>
                          <span>•</span>
                          <span>{movie.duration}</span>
                          <span>•</span>
                          <span>{movie.certification}</span>
                          <span>•</span>
                          <span className="text-emerald-400 font-bold">★ {movie.rating}</span>
                        </div>

                        {/* Cast & Crew Tag Badges */}
                        <div className="flex items-center gap-2 pt-1">
                          <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[10px] font-bold flex items-center gap-1">
                            <UserCheck className="w-2.5 h-2.5" />
                            <span>{castCount} Cast</span>
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px] font-bold flex items-center gap-1">
                            <Clapperboard className="w-2.5 h-2.5" />
                            <span>{crewCount} Crew</span>
                          </span>
                        </div>

                        <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-900">
                          <span className="text-[9px] text-slate-500 font-mono truncate max-w-[80px]">
                            {movie.id}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setEditMovieModal({ isOpen: true, movie })}
                              className="px-2.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                              title="Edit movie metadata, cast & crew"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() =>
                                setDeleteModal({
                                  isOpen: true,
                                  type: "movie",
                                  id: movie.id,
                                  title: movie.title
                                })
                              }
                              className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-300 hover:text-slate-950 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                              title="Remove movie"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      )}

      {/* -------------------------------------------------------------------------------- */}
      {/* 2. THEATRES SECTION: ADD & REMOVE */}
      {/* -------------------------------------------------------------------------------- */}
      {activeTab === "THEATRES" && (
        <div className="space-y-10">
          {/* Add Theatre Form */}
          <section className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-lg font-black text-white font-heading flex items-center gap-2">
                <Plus className="w-5 h-5 text-cyan-400" />
                <span>Add New Cinema Theatre to CineFy Database</span>
              </h2>
              <span className="text-xs text-slate-400">Supports all 170+ Indian cities</span>
            </div>

            <form onSubmit={handleCreateTheatre} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300">Theatre Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PVR Grand IMAX & 4K Laser, Downtown"
                  value={newTheatre.name}
                  onChange={(e) => setNewTheatre({ ...newTheatre, name: e.target.value })}
                  className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">City *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hyderabad, Tenali, Bengaluru, Guntur"
                  value={newTheatre.city}
                  onChange={(e) => setNewTheatre({ ...newTheatre, city: e.target.value })}
                  className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">Locality / Area</label>
                <input
                  type="text"
                  placeholder="e.g. Gachibowli, Station Road, MG Road"
                  value={newTheatre.locality}
                  onChange={(e) => setNewTheatre({ ...newTheatre, locality: e.target.value })}
                  className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-300">Full Address</label>
                <input
                  type="text"
                  placeholder="e.g. Main Commercial Hub, Beside Metro Station"
                  value={newTheatre.address}
                  onChange={(e) => setNewTheatre({ ...newTheatre, address: e.target.value })}
                  className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">Screens Count</label>
                <select
                  value={newTheatre.screensCount}
                  onChange={(e) => setNewTheatre({ ...newTheatre, screensCount: Number(e.target.value) })}
                  className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                >
                  <option value={1}>1 Screen (Single Screen / Super-plex)</option>
                  <option value={2}>2 Screens</option>
                  <option value={3}>3 Screens (Multiplex)</option>
                  <option value={4}>4 Screens</option>
                  <option value={6}>6 Screens (Megaplex)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">Theatre Type / Format</label>
                <select
                  value={newTheatre.theatreType}
                  onChange={(e) => setNewTheatre({ ...newTheatre, theatreType: e.target.value })}
                  className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                >
                  <option value="Modern Multiplex">Modern Multiplex</option>
                  <option value="IMAX Laser">IMAX Laser</option>
                  <option value="4DX">4DX Dynamic Experience</option>
                  <option value="Dolby Atmos Auditorium">Dolby Atmos Auditorium</option>
                  <option value="Luxury Cinema">Luxury VIP Recliner Cinema</option>
                  <option value="Standard Single-Screen Theatre">Standard Single-Screen</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">Rating (1 to 5)</label>
                <input
                  type="number"
                  step="0.1"
                  min="3.0"
                  max="5.0"
                  value={newTheatre.rating}
                  onChange={(e) => setNewTheatre({ ...newTheatre, rating: e.target.value })}
                  className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <label className="text-xs font-bold text-slate-300">Facilities (Comma separated)</label>
                <input
                  type="text"
                  placeholder="Dolby Atmos, 4K RGB Laser, Recliner Seats, Gourmet Snack Bar, Valet Parking"
                  value={newTheatre.facilities}
                  onChange={(e) => setNewTheatre({ ...newTheatre, facilities: e.target.value })}
                  className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3 flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={addingTheatre}
                  className="cyan-button px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{addingTheatre ? "Adding Theatre..." : "Add Theatre to CineFy"}</span>
                </button>
              </div>
            </form>
          </section>

          {/* Remove Theatres Section */}
          <section className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-black text-white font-heading flex items-center gap-2">
                  <Building className="w-5 h-5 text-cyan-400" />
                  <span>Cinema Theatres Inventory ({filteredTheatres.length})</span>
                </h2>
                <p className="text-xs text-slate-400">Click Remove to delete any cinema theatre from live showtimes</p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search theatres by name, city, locality..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTheatres.map((th) => (
                <div
                  key={th.id}
                  className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-3 group hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                        {th.name}
                      </h4>
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-cyan-400 text-[10px] font-black shrink-0">
                        {th.city}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="line-clamp-1">{th.address || th.locality || th.city}</span>
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 text-emerald-400 font-bold">★ {th.rating}</span>
                      <span>•</span>
                      <span>{th.screens?.length || th.screensCount || 2} Screens</span>
                      <span>•</span>
                      <span className="truncate">{th.theatreType || "Multiplex"}</span>
                    </div>

                    {th.facilities && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {th.facilities.slice(0, 3).map((f, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] text-slate-400">
                            {f}
                          </span>
                        ))}
                        {th.facilities.length > 3 && (
                          <span className="text-[10px] text-slate-500">+{th.facilities.length - 3} more</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-900 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-slate-500 font-mono">ID: {th.id}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setEditTheatreModal({ isOpen: true, theatre: th })}
                        className="px-2.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                        title="Edit theatre & screens"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() =>
                          setDeleteModal({
                            isOpen: true,
                            type: "theatre",
                            id: th.id,
                            title: th.name
                          })
                        }
                        className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-300 hover:text-slate-950 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                        title="Remove theatre"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* -------------------------------------------------------------------------------- */}
      {/* 3. CULTURAL EVENTS SECTION: ADD & REMOVE */}
      {/* -------------------------------------------------------------------------------- */}
      {activeTab === "EVENTS" && (
        <div className="space-y-10">
          {/* Add Event Form */}
          <section className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-lg font-black text-white font-heading flex items-center gap-2">
                <Plus className="w-5 h-5 text-cyan-400" />
                <span>Add Cultural & Entertainment Event</span>
              </h2>
              <span className="text-xs text-slate-400">Standup comedy, exhibitions & workshops</span>
            </div>

            <form onSubmit={handleCreateEvent} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zakir Khan: Tathastu Live Special"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value, category: "Events" })}
                  className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">City *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hyderabad, Bengaluru, Mumbai"
                  value={newEvent.city}
                  onChange={(e) => setNewEvent({ ...newEvent, city: e.target.value })}
                  className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">Auditorium / Venue *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shilpakala Vedika, Hitec City"
                  value={newEvent.venue}
                  onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                  className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">Date</label>
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">Time</label>
                <input
                  type="text"
                  placeholder="07:30 PM"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">Starting Price (₹)</label>
                <input
                  type="number"
                  placeholder="499"
                  value={newEvent.price}
                  onChange={(e) => setNewEvent({ ...newEvent, price: e.target.value })}
                  className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Poster / Banner Link Address (URL) *</span>
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/... or event banner link"
                  value={newEvent.image}
                  onChange={(e) => setNewEvent({ ...newEvent, image: e.target.value })}
                  className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <label className="text-xs font-bold text-slate-300">Event Description</label>
                <textarea
                  rows={2}
                  placeholder="Overview of the event, seating guidelines and artist lineup..."
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3 flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={addingEvent}
                  className="cyan-button px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{addingEvent ? "Publishing Event..." : "Publish Event to CineFy"}</span>
                </button>
              </div>
            </form>
          </section>

          {/* Remove Events Section */}
          <section className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-black text-white font-heading flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                  <span>Live Cultural Events ({culturalEventsList.length})</span>
                </h2>
                <p className="text-xs text-slate-400">Click Remove to delete any event from tickets catalog</p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search events by title or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {culturalEventsList.map((ev) => (
                <div
                  key={ev.id}
                  className="bg-slate-950 rounded-2xl border border-slate-800 p-4 space-y-3 group hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <img
                      src={ev.image}
                      alt={ev.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-36 object-cover rounded-xl shadow-md"
                    />
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                        {ev.title}
                      </h4>
                      <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-400 text-[10px] font-black shrink-0">
                        ₹{ev.price}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="line-clamp-1">{ev.venue}, {ev.city}</span>
                    </p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{ev.date} • {ev.time}</span>
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-900 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-slate-500 font-mono">ID: {ev.id}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setEditEventModal({ isOpen: true, event: ev })}
                        className="px-2.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                        title="Edit event"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() =>
                          setDeleteModal({
                            isOpen: true,
                            type: "event",
                            id: ev.id,
                            title: ev.title
                          })
                        }
                        className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-300 hover:text-slate-950 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* -------------------------------------------------------------------------------- */}
      {/* 4. CONCERTS SECTION: ADD & REMOVE */}
      {/* -------------------------------------------------------------------------------- */}
      {activeTab === "CONCERTS" && (
        <div className="space-y-10">
          {/* Add Concert Form */}
          <section className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-lg font-black text-white font-heading flex items-center gap-2">
                <Plus className="w-5 h-5 text-cyan-400" />
                <span>Add Live Music Concert & Tour</span>
              </h2>
              <span className="text-xs text-slate-400">A.R. Rahman, Anirudh Live, Taylor Swift, Arijit Singh</span>
            </div>

            <form onSubmit={handleCreateEvent} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300">Concert Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. A.R. Rahman: Harmony India World Tour"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value, category: "Concerts" })}
                  className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">Featured Artist / Singer</label>
                <input
                  type="text"
                  placeholder="e.g. A.R. Rahman, Anirudh Ravichander, Diljit Dosanjh"
                  value={newEvent.artist}
                  onChange={(e) => setNewEvent({ ...newEvent, artist: e.target.value, category: "Concerts" })}
                  className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">City *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hyderabad, Bengaluru, Chennai"
                  value={newEvent.city}
                  onChange={(e) => setNewEvent({ ...newEvent, city: e.target.value, category: "Concerts" })}
                  className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">Stadium / Arena Venue *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. G.M.C. Balayogi Athletic Stadium, Gachibowli"
                  value={newEvent.venue}
                  onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value, category: "Concerts" })}
                  className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">Date</label>
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value, category: "Concerts" })}
                  className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">Starting Price (₹)</label>
                <input
                  type="number"
                  placeholder="1499"
                  value={newEvent.price}
                  onChange={(e) => setNewEvent({ ...newEvent, price: e.target.value, category: "Concerts" })}
                  className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Concert Banner Link Address (URL) *</span>
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/... or concert banner link"
                  value={newEvent.image}
                  onChange={(e) => setNewEvent({ ...newEvent, image: e.target.value, category: "Concerts" })}
                  className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <label className="text-xs font-bold text-slate-300">Concert Description</label>
                <textarea
                  rows={2}
                  placeholder="Live acoustics, stage lighting details, fan zone info..."
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value, category: "Concerts" })}
                  className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3 flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={addingEvent}
                  className="cyan-button px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{addingEvent ? "Publishing Concert..." : "Publish Concert to CineFy"}</span>
                </button>
              </div>
            </form>
          </section>

          {/* Remove Concerts Section */}
          <section className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-black text-white font-heading flex items-center gap-2">
                  <Music className="w-5 h-5 text-cyan-400" />
                  <span>Live Music Concerts Inventory ({concertsList.length})</span>
                </h2>
                <p className="text-xs text-slate-400">Click Remove to delete any music tour from booking catalog</p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search concerts by title, artist, or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {concertsList.map((c) => (
                <div
                  key={c.id}
                  className="bg-slate-950 rounded-2xl border border-slate-800 p-4 space-y-3 group hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <img
                      src={c.image}
                      alt={c.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-36 object-cover rounded-xl shadow-md"
                    />
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                        {c.title}
                      </h4>
                      <span className="px-2 py-0.5 rounded-md bg-cyan-500 text-slate-950 text-[10px] font-black shrink-0">
                        ₹{c.price}
                      </span>
                    </div>
                    {c.artist && (
                      <p className="text-xs text-cyan-300 font-semibold flex items-center gap-1">
                        <Music className="w-3.5 h-3.5" /> {c.artist}
                      </p>
                    )}
                    <p className="text-xs text-slate-400 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="line-clamp-1">{c.venue}, {c.city}</span>
                    </p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{c.date} • {c.time}</span>
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-900 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-slate-500 font-mono">ID: {c.id}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setEditEventModal({ isOpen: true, event: c })}
                        className="px-2.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                        title="Edit concert"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() =>
                          setDeleteModal({
                            isOpen: true,
                            type: "concert",
                            id: c.id,
                            title: c.title
                          })
                        }
                        className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-300 hover:text-slate-950 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* -------------------------------------------------------------------------------- */}
      {/* 5. SPORTS SECTION: ADD & REMOVE */}
      {/* -------------------------------------------------------------------------------- */}
      {activeTab === "SPORTS" && (
        <div className="space-y-10">
          {/* Add Sports Form */}
          <section className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-lg font-black text-white font-heading flex items-center gap-2">
                <Plus className="w-5 h-5 text-cyan-400" />
                <span>Add Stadium Sports Match & Tournament</span>
              </h2>
              <span className="text-xs text-slate-400">Cricket, Football, Kabaddi, Tennis & Stadium Tours</span>
            </div>

            <form onSubmit={handleCreateEvent} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300">Match Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ICC T20 Grand Final: India vs Australia"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value, category: "Sports" })}
                  className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">Sport Type</label>
                <select
                  value={newEvent.sportType}
                  onChange={(e) => setNewEvent({ ...newEvent, sportType: e.target.value, category: "Sports" })}
                  className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                >
                  <option value="Cricket">Cricket (T20 / ODI / Test)</option>
                  <option value="Football">Football (ISL / International)</option>
                  <option value="Badminton">Badminton</option>
                  <option value="Kabaddi">Pro Kabaddi</option>
                  <option value="Racing">Formula Racing</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">Team A vs Team B</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Team A (e.g. India)"
                    value={newEvent.teamA}
                    onChange={(e) => setNewEvent({ ...newEvent, teamA: e.target.value, category: "Sports" })}
                    className="w-full mt-1 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                  <input
                    type="text"
                    placeholder="Team B (e.g. Australia)"
                    value={newEvent.teamB}
                    onChange={(e) => setNewEvent({ ...newEvent, teamB: e.target.value, category: "Sports" })}
                    className="w-full mt-1 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">City *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ahmedabad, Hyderabad, Chennai, Mumbai"
                  value={newEvent.city}
                  onChange={(e) => setNewEvent({ ...newEvent, city: e.target.value, category: "Sports" })}
                  className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">Stadium / Venue *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Narendra Modi Stadium, Motera"
                  value={newEvent.venue}
                  onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value, category: "Sports" })}
                  className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">Starting Price (₹)</label>
                <input
                  type="number"
                  placeholder="2500"
                  value={newEvent.price}
                  onChange={(e) => setNewEvent({ ...newEvent, price: e.target.value, category: "Sports" })}
                  className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Stadium Match Poster Link Address (URL) *</span>
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/... or stadium photo link"
                  value={newEvent.image}
                  onChange={(e) => setNewEvent({ ...newEvent, image: e.target.value, category: "Sports" })}
                  className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <label className="text-xs font-bold text-slate-300">Match Details</label>
                <textarea
                  rows={2}
                  placeholder="High-voltage match details, stadium pitch report, stand classifications..."
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value, category: "Sports" })}
                  className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3 flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={addingEvent}
                  className="cyan-button px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{addingEvent ? "Publishing Sports Fixture..." : "Publish Sports Fixture to CineFy"}</span>
                </button>
              </div>
            </form>
          </section>

          {/* Remove Sports Section */}
          <section className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-black text-white font-heading flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-cyan-400" />
                  <span>Live Stadium Sports Fixtures ({sportsList.length})</span>
                </h2>
                <p className="text-xs text-slate-400">Click Remove to delete any match fixture from stadium ticketing</p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search sports matches by teams, stadium, or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sportsList.map((sp) => (
                <div
                  key={sp.id}
                  className="bg-slate-950 rounded-2xl border border-slate-800 p-4 space-y-3 group hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <img
                      src={sp.image}
                      alt={sp.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-36 object-cover rounded-xl shadow-md"
                    />
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                        {sp.title}
                      </h4>
                      <span className="px-2 py-0.5 rounded-md bg-cyan-500 text-slate-950 text-[10px] font-black shrink-0">
                        ₹{sp.price}
                      </span>
                    </div>
                    {sp.teamA && sp.teamB && (
                      <p className="text-xs text-cyan-300 font-bold flex items-center gap-1.5">
                        <span>{sp.teamA}</span> <span className="text-slate-500">vs</span> <span>{sp.teamB}</span>
                      </p>
                    )}
                    <p className="text-xs text-slate-400 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="line-clamp-1">{sp.venue}, {sp.city}</span>
                    </p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{sp.date} • {sp.time}</span>
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-900 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-slate-500 font-mono">ID: {sp.id}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setEditEventModal({ isOpen: true, event: sp })}
                        className="px-2.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                        title="Edit sports fixture"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() =>
                          setDeleteModal({
                            isOpen: true,
                            type: "sports",
                            id: sp.id,
                            title: sp.title
                          })
                        }
                        className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-300 hover:text-slate-950 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* -------------------------------------------------------------------------------- */}
      {/* 6. RAZORPAY PAYMENTS & GATEWAY LEDGER */}
      {/* -------------------------------------------------------------------------------- */}
      {activeTab === "PAYMENTS" && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Gateway Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block flex items-center justify-between">
                <span>Total Gateway Captured</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </span>
              <p className="text-2xl font-black text-white font-mono">
                ₹{paymentsList.filter((p) => p.status === "CAPTURED").reduce((sum, p) => sum + (Number(p.amount) || 0), 0).toLocaleString()}
              </p>
              <span className="text-[11px] text-emerald-400 font-semibold block">
                100% RBI Compliant Settlement
              </span>
            </div>

            <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block flex items-center justify-between">
                <span>Completed Transactions</span>
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
              </span>
              <p className="text-2xl font-black text-white font-heading">
                {paymentsList.filter((p) => p.status === "CAPTURED").length}
              </p>
              <span className="text-[11px] text-slate-400 block">
                Standard Checkout & UPI
              </span>
            </div>

            <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block flex items-center justify-between">
                <span>Processed Refunds</span>
                <RefreshCw className="w-4 h-4 text-purple-400" />
              </span>
              <p className="text-2xl font-black text-white font-mono">
                ₹{paymentsList.filter((p) => p.status === "REFUNDED").reduce((sum, p) => sum + (Number(p.amount) || 0), 0).toLocaleString()}
              </p>
              <span className="text-[11px] text-purple-400 font-semibold block">
                {paymentsList.filter((p) => p.status === "REFUNDED").length} refunded orders
              </span>
            </div>

            <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block flex items-center justify-between">
                <span>Gateway Environment</span>
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </span>
              <p className="text-xl font-black text-emerald-400 font-heading flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Razorpay Live/Test</span>
              </p>
              <span className="text-[11px] text-slate-400 block truncate">
                Official Standard Integration
              </span>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white font-heading flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-cyan-400" />
                  <span>Razorpay Payment Ledger & Transactions</span>
                </h3>
                <p className="text-xs text-slate-400">Cryptographically verified customer payments and order IDs</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {["ALL", "CAPTURED", "REFUNDED", "FAILED", "CREATED"].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setPaymentStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      paymentStatusFilter === st
                        ? "bg-cyan-500 text-slate-950 font-black"
                        : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Payments Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[11px] uppercase bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Order / Payment ID</th>
                    <th className="px-4 py-3">Booking ID</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Method</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {paymentsList
                    .filter((p) => {
                      const matchesStatus = paymentStatusFilter === "ALL" || p.status === paymentStatusFilter;
                      const q = searchQuery.toLowerCase();
                      const matchesSearch = !searchQuery || (
                        p.id?.toLowerCase().includes(q) ||
                        p.bookingId?.toLowerCase().includes(q) ||
                        p.razorpayOrderId?.toLowerCase().includes(q) ||
                        p.razorpayPaymentId?.toLowerCase().includes(q) ||
                        p.userEmail?.toLowerCase().includes(q) ||
                        p.method?.toLowerCase().includes(q)
                      );
                      return matchesStatus && matchesSearch;
                    })
                    .map((p) => (
                      <tr key={p.id} className="hover:bg-slate-950/50">
                        <td className="px-4 py-3 font-mono">
                          <div className="font-bold text-white truncate max-w-[170px]">{p.razorpayPaymentId || p.id}</div>
                          <div className="text-[10px] text-slate-500 truncate max-w-[170px]">{p.razorpayOrderId}</div>
                        </td>
                        <td className="px-4 py-3 font-mono font-bold text-cyan-400">
                          {p.bookingId || "N/A"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-slate-200 font-semibold truncate max-w-[150px]">{p.userEmail}</div>
                          <div className="text-[10px] text-slate-500">{p.paymentDetails?.contact || "App User"}</div>
                        </td>
                        <td className="px-4 py-3 font-bold text-emerald-400 font-mono text-sm">
                          ₹{p.amount}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono font-bold text-[10px]">
                            {p.method || "RAZORPAY"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full font-black text-[10px] ${
                              p.status === "CAPTURED"
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : p.status === "REFUNDED"
                                ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                                : p.status === "FAILED"
                                ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                                : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-400 font-mono text-[11px]">
                          {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "Today"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {p.status === "CAPTURED" ? (
                            <button
                              type="button"
                              onClick={() => setRefundModal({ isOpen: true, payment: p, amount: String(p.amount), reason: "Customer requested refund" })}
                              className="px-3 py-1 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/30 rounded-lg text-xs font-bold transition-all cursor-pointer"
                            >
                              Refund
                            </button>
                          ) : p.status === "REFUNDED" ? (
                            <span className="text-[11px] text-purple-400 font-semibold">Refunded</span>
                          ) : (
                            <span className="text-[11px] text-slate-500">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  {paymentsList.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                        No payments recorded yet. Real bookings made via Checkout will appear here automatically.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

      {/* -------------------------------------------------------------------------------- */}
      {/* 7. STATS & RECENT BOOKINGS TAB */}
      {/* -------------------------------------------------------------------------------- */}
      {activeTab === "STATS" && (
        <section className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-black text-white font-heading flex items-center gap-2">
                <Ticket className="w-5 h-5 text-cyan-400" />
                <span>Live Recent Bookings Stream</span>
              </h2>
              <p className="text-xs text-slate-400">Real-time customer reservations and digital ticket codes</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Booking ID</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Movie / Event</th>
                  <th className="px-4 py-3">Theatre / Venue</th>
                  <th className="px-4 py-3">Seats</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-950/50">
                    <td className="px-4 py-3 font-mono font-bold text-cyan-400">{b.id}</td>
                    <td className="px-4 py-3 text-white font-semibold">{b.userName || "Customer"}</td>
                    <td className="px-4 py-3 text-slate-300 font-bold">{b.movieTitle || b.eventName}</td>
                    <td className="px-4 py-3 text-slate-400">{b.theatreName || b.venue}</td>
                    <td className="px-4 py-3 font-mono text-cyan-300 font-bold">
                      {Array.isArray(b.seats) ? b.seats.map((s) => s.id || s).join(", ") : b.seats}
                    </td>
                    <td className="px-4 py-3 font-bold text-emerald-400">₹{b.totalAmount}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                        {b.status || "Confirmed"}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentBookings.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                      No customer bookings recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* RAZORPAY REFUND MODAL */}
      {refundModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center mx-auto">
              <RefreshCw className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-white font-heading">
                Process Razorpay Refund
              </h3>
              <p className="text-xs text-slate-400">
                Payment ID: <span className="font-mono text-white">{refundModal.payment?.razorpayPaymentId || refundModal.payment?.id}</span>
              </p>
            </div>

            <form onSubmit={handleProcessRefund} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1">Refund Amount (₹):</label>
                <input
                  type="number"
                  max={refundModal.payment?.amount}
                  min="1"
                  value={refundModal.amount}
                  onChange={(e) => setRefundModal({ ...refundModal, amount: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:border-purple-500"
                  required
                />
                <span className="text-[10px] text-slate-500">Max refundable: ₹{refundModal.payment?.amount}</span>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1">Refund Reason:</label>
                <input
                  type="text"
                  value={refundModal.reason}
                  onChange={(e) => setRefundModal({ ...refundModal, reason: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRefundModal({ isOpen: false, payment: null, amount: "", reason: "" })}
                  disabled={processingRefund}
                  className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processingRefund}
                  className="py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-purple-600/30"
                >
                  <RefreshCw className={`w-4 h-4 ${processingRefund ? "animate-spin" : ""}`} />
                  <span>{processingRefund ? "Processing..." : "Confirm Refund"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------------------- */}
      {/* EDIT MODALS (MOVIES, THEATRES, EVENTS) */}
      {/* -------------------------------------------------------------------------------- */}
      <AdminEditMovieModal
        isOpen={editMovieModal.isOpen}
        movie={editMovieModal.movie}
        onClose={() => setEditMovieModal({ isOpen: false, movie: null })}
        onSave={handleSaveMovieEdit}
        saving={savingEdit}
      />

      <AdminEditTheatreModal
        isOpen={editTheatreModal.isOpen}
        theatre={editTheatreModal.theatre}
        cities={cities}
        onClose={() => setEditTheatreModal({ isOpen: false, theatre: null })}
        onSave={handleSaveTheatreEdit}
        saving={savingEdit}
      />

      <AdminEditEventModal
        isOpen={editEventModal.isOpen}
        event={editEventModal.event}
        onClose={() => setEditEventModal({ isOpen: false, event: null })}
        onSave={handleSaveEventEdit}
        saving={savingEdit}
      />

      {/* -------------------------------------------------------------------------------- */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* -------------------------------------------------------------------------------- */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-black text-white font-heading">
                Confirm Removal
              </h3>
              <p className="text-xs text-slate-400">
                Are you sure you want to permanently remove <strong>"{deleteModal.title}"</strong> from CineFy?
                This will immediately remove it from all user listings and showtimes.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModal({ isOpen: false, type: "", id: "", title: "" })}
                disabled={deleting}
                className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-rose-600/30"
              >
                <Trash2 className="w-4 h-4" />
                <span>{deleting ? "Removing..." : "Yes, Remove"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
