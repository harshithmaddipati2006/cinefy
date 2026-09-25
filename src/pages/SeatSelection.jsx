import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  Accessibility,
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronLeft,
  Clock3,
  Crown,
  Heart,
  Info,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Tv,
  Volume2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Users,
  Popcorn,
  Plus,
  Minus,
  Lock,
  Radio
} from "lucide-react";

import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { getUniqueScreenConfig } from "../data/seatingLayouts";
import MovieSeatSelection from "../components/movie/MovieSeatSelection";
import BookMyShowSeatCountModal from "../components/movie/BookMyShowSeatCountModal";
import { Button as MovingBorderButton } from "../components/ui/moving-border";

const MAX_SEATS = 10;
const DEFAULT_LOCK_SECONDS = 10 * 60; // 10 Minutes standard seat hold

const formatTime = (seconds) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

const getErrorMessage = (error, fallback = "Something went wrong. Please try again.") =>
  error?.response?.data?.error ||
  error?.response?.data?.message ||
  error?.message ||
  fallback;

const isUnavailable = (seat) => {
  const s = String(seat?.status || "").toLowerCase();
  return s === "booked" || s === "blocked" || s === "unavailable" || s === "locked";
};

export default function SeatSelection() {
  const { showId: paramShowId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, requireAuth } = useAuth();

  const showId = paramShowId || searchParams.get("showId") || "sh-th-1-today";
  const queryMovieId = searchParams.get("movieId");
  const theatreNameParam = searchParams.get("theatreName");
  const showTime = searchParams.get("showTime") || "07:30 PM";
  const showDate = searchParams.get("showDate") || "Today";

  const [movie, setMovie] = useState(null);
  const [seatData, setSeatData] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [targetSeatCount, setTargetSeatCount] = useState(2);
  const [seatCountModalOpen, setSeatCountModalOpen] = useState(false);
  const [lockTimer, setLockTimer] = useState(DEFAULT_LOCK_SECONDS);
  const [lockActive, setLockActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [locking, setLocking] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [realtimeActive, setRealtimeActive] = useState(false);

  // Quick Snack selection state
  const [quickSnacks, setQuickSnacks] = useState([]);
  const [quickSnackQuantities, setQuickSnackQuantities] = useState({});
  const [snackDrawerOpen, setSnackDrawerOpen] = useState(false);

  const eventSourceRef = useRef(null);

  // Fetch seating layout & movie
  const fetchMovieAndSeats = useCallback(
    async ({ silent = false } = {}) => {
      if (!showId) {
        setErrorMessage("This booking link is incomplete. Please choose a showtime again.");
        setLoading(false);
        return;
      }

      try {
        if (silent) setRefreshing(true);
        else setLoading(true);

        setErrorMessage("");

        // Fetch seating layout from server
        const seatsResponse = await API.get(`/shows/${encodeURIComponent(showId)}/seats`);
        const sData = seatsResponse?.data ?? null;
        setSeatData(sData);

        // Fetch movie details
        const targetMovieId = queryMovieId || sData?.movieId || "mov-101";
        if (targetMovieId) {
          try {
            const movieResponse = await API.get(`/movies/${targetMovieId}`);
            if (movieResponse?.data?.movie) {
              setMovie(movieResponse.data.movie);
            }
          } catch (err) {
            console.warn("Could not fetch movie details:", err);
          }
        }

        // Fetch quick food items
        try {
          const foodRes = await API.get("/food");
          const items = foodRes.data?.items || foodRes.data?.foodItems || [];
          setQuickSnacks(items.slice(0, 4));
        } catch (e) {
          console.warn("Could not fetch snacks preview:", e);
        }
      } catch (error) {
        console.error("Seat selection loading error:", error);

        // Client-side fallback layout if network error occurs
        const fallbackConfig = getUniqueScreenConfig(showId, "th-fallback", "Screen 1", "Dolby Atmos");
        const fallbackSeatMap = (fallbackConfig.rows || []).map((r) => {
          let numAcc = 1;
          const seats = [];
          (fallbackConfig.sections || [4, 8, 4]).forEach((sWidth, sIdx) => {
            for (let i = 0; i < sWidth; i++) {
              const num = numAcc++;
              const seatId = `${r.row}${num}`;
              seats.push({
                id: seatId,
                row: r.row,
                number: num,
                type: r.type,
                price: r.price,
                sectionIndex: sIdx,
                isWheelchair: fallbackConfig.wheelchairSeats?.includes(seatId) || false,
                isCouple: fallbackConfig.coupleSeats?.includes(seatId) || false,
                status: "AVAILABLE",
              });
            }
          });
          return { row: r.row, type: r.type, price: r.price, seats };
        });

        setSeatData({
          showId,
          movieId: queryMovieId || "mov-101",
          theatreName: (theatreNameParam || "PVR Grand Multiplex").replace(/^cinefy\s+/i, ""),
          screenName: "Screen 1 - 4K Laser",
          screenType: "4K Laser",
          soundType: fallbackConfig.soundType || "Dolby Atmos",
          layoutBadge: fallbackConfig.layoutBadge || "Custom Layout",
          sections: fallbackConfig.sections || [4, 8, 4],
          aisleLabels: fallbackConfig.aisleLabels || ["Aisle West", "Aisle East"],
          wheelchairSeats: fallbackConfig.wheelchairSeats || [],
          coupleSeats: fallbackConfig.coupleSeats || [],
          seatMap: fallbackSeatMap,
        });

        setMovie((prevMovie) => {
          if (prevMovie) return prevMovie;
          return {
            id: queryMovieId || "mov-101",
            title: "Kalki 2898 AD",
            language: "Telugu / Hindi",
            genre: ["Action", "Sci-Fi"],
            duration: "3h 01m",
            certification: "U/A",
            poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=80",
          };
        });
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [queryMovieId, showId, theatreNameParam]
  );

  useEffect(() => {
    fetchMovieAndSeats();
  }, [fetchMovieAndSeats]);

  // Real-Time SSE Stream Integration
  useEffect(() => {
    if (!showId) return;

    let es = null;
    try {
      es = new EventSource(`/api/shows/${encodeURIComponent(showId)}/stream`);
      eventSourceRef.current = es;

      es.onopen = () => {
        setRealtimeActive(true);
      };

      es.onmessage = (e) => {
        try {
          const payload = JSON.parse(e.data);
          if (
            payload.type === "REALTIME_SEAT_SYNC" ||
            payload.type === "SEAT_UPDATE" ||
            payload.type === "SYNC"
          ) {
            const rawBooked = payload.bookedSeats || [];
            const rawLocked = payload.lockedSeats || [];

            const bookedSet = new Set(
              rawBooked.map((s) => (typeof s === "string" ? s : s?.id || s?.seatId))
            );
            const lockedSet = new Set(
              rawLocked.map((s) => (typeof s === "string" ? s : s?.seatId || s?.id))
            );

            setSeatData((prev) => {
              if (!prev || !prev.seatMap) return prev;
              const newSeatMap = prev.seatMap.map((rowObj) => ({
                ...rowObj,
                seats: (rowObj.seats || []).map((s) => {
                  if (bookedSet.has(s.id)) {
                    return { ...s, status: "BOOKED" };
                  }
                  if (lockedSet.has(s.id)) {
                    return { ...s, status: "LOCKED" };
                  }
                  return { ...s, status: "AVAILABLE" };
                }),
              }));
              return { ...prev, seatMap: newSeatMap };
            });

            // If any currently selected seat was locked or booked by someone else, remove it!
            setSelectedSeats((currSelected) => {
              const conflicted = currSelected.filter(
                (s) => bookedSet.has(s.id) || lockedSet.has(s.id)
              );
              if (conflicted.length > 0) {
                setErrorMessage(
                  `Seat ${conflicted.map((c) => c.id).join(", ")} was secured by another customer.`
                );
                return currSelected.filter(
                  (s) => !bookedSet.has(s.id) && !lockedSet.has(s.id)
                );
              }
              return currSelected;
            });
          }
        } catch (parseErr) {
          console.warn("SSE parse error:", parseErr);
        }
      };

      es.onerror = () => {
        setRealtimeActive(false);
      };
    } catch (sseErr) {
      console.warn("SSE connection error:", sseErr);
    }

    return () => {
      if (es) {
        es.close();
      }
    };
  }, [showId]);

  // Seat hold countdown timer
  useEffect(() => {
    if (!lockActive) return undefined;

    const intervalId = window.setInterval(() => {
      setLockTimer((previous) => {
        if (previous <= 1) {
          window.clearInterval(intervalId);
          setLockActive(false);
          setSelectedSeats([]);
          setErrorMessage(
            "Your 10-minute seat hold expired. Please select the seats again."
          );
          return 0;
        }
        return previous - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [lockActive]);

  const orderedSeatMap = useMemo(() => {
    return seatData?.seatMap || seatData?.rows || [];
  }, [seatData]);

  const sections = useMemo(
    () => (Array.isArray(seatData?.sections) && seatData.sections.length
      ? seatData.sections
      : [4, 8, 4]),
    [seatData]
  );

  const totalSeatPrice = useMemo(
    () =>
      selectedSeats.reduce(
        (total, seat) => total + Number(seat?.price || 0),
        0
      ),
    [selectedSeats]
  );

  const categoryStats = useMemo(() => {
    const counts = {};
    (orderedSeatMap || []).forEach((rowObj) => {
      (rowObj.seats || []).forEach((seat) => {
        const cat = seat.category || seat.type || rowObj.type || "REGULAR";
        if (!counts[cat]) {
          counts[cat] = { total: 0, available: 0, price: seat.price || rowObj.price || 180 };
        }
        counts[cat].total += 1;
        if (!isUnavailable(seat)) {
          counts[cat].available += 1;
        }
      });
    });
    return counts;
  }, [orderedSeatMap]);

  const handleConfirmSeatCount = (count) => {
    setTargetSeatCount(count);
    handleQuickSelect(count);
  };

  const theatreName =
    (seatData?.theatreName || theatreNameParam || "PVR Grand Multiplex").replace(/^cinefy\s+/i, "");
  const screenName = seatData?.screenName || "Screen 1";
  const screenType = seatData?.screenType || "4K Laser";
  const soundType = seatData?.soundType || "Dolby Atmos";
  const layoutBadge = seatData?.layoutBadge || "Custom Layout";

  const handleSeatClick = useCallback((seat) => {
    if (!seat || isUnavailable(seat)) return;

    setErrorMessage("");

    setSelectedSeats((current) => {
      const exists = current.some((item) => item.id === seat.id);

      if (exists) {
        return current.filter((item) => item.id !== seat.id);
      }

      if (current.length >= MAX_SEATS) {
        setErrorMessage(`You can select up to ${MAX_SEATS} seats per booking.`);
        return current;
      }

      return [...current, seat];
    });
  }, []);

  // Quick select helper: picks count available contiguous seats
  const handleQuickSelect = (count) => {
    if (!orderedSeatMap || orderedSeatMap.length === 0) return;
    setErrorMessage("");

    for (const rowObj of orderedSeatMap) {
      const availableInRow = (rowObj.seats || []).filter((s) => !isUnavailable(s));
      
      for (let i = 0; i <= availableInRow.length - count; i++) {
        const candidateSlice = availableInRow.slice(i, i + count);
        let isContiguous = true;
        for (let j = 1; j < candidateSlice.length; j++) {
          if (Number(candidateSlice[j].number) !== Number(candidateSlice[j - 1].number) + 1) {
            isContiguous = false;
            break;
          }
        }
        if (isContiguous && candidateSlice.length === count) {
          setSelectedSeats(candidateSlice);
          return;
        }
      }
    }

    const allAvailable = [];
    orderedSeatMap.forEach((r) => {
      (r.seats || []).forEach((s) => {
        if (!isUnavailable(s)) allAvailable.push(s);
      });
    });

    if (allAvailable.length >= count) {
      setSelectedSeats(allAvailable.slice(0, count));
    } else {
      setErrorMessage(`Only ${allAvailable.length} seats are available for this show.`);
    }
  };

  const handleUpdateQuickSnack = (id, delta) => {
    setQuickSnackQuantities((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const handleProceedToCheckout = async () => {
    if (!user) {
      requireAuth(
        () => {
          handleProceedToCheckout();
        },
        {
          title: "Sign or Register To Experience Movies",
          subtitle: `Sign in or register to lock your selected seats and complete booking for ${movie?.title || "your movie"}.`,
          movie: movie
        }
      );
      return;
    }

    if (!showId) {
      setErrorMessage("The show information is missing. Please choose the show again.");
      return;
    }

    if (selectedSeats.length === 0) {
      setErrorMessage("Please select at least 1 seat to continue.");
      return;
    }

    try {
      setLocking(true);
      setErrorMessage("");

      // Atomic Server Lock with 10-Minute Expiration
      try {
        const lockRes = await API.post("/shows/lock-seats", {
          showId,
          seatIds: selectedSeats.map((seat) => seat.id),
          userId: user.id || "usr-guest"
        });
        if (lockRes.data?.durationSeconds) {
          setLockTimer(lockRes.data.durationSeconds);
        }
      } catch (lockErr) {
        if (lockErr.response?.status === 409) {
          setErrorMessage("One or more selected seats were just taken. Please pick another seat.");
          await fetchMovieAndSeats({ silent: true });
          setLocking(false);
          return;
        }
      }

      setLockActive(true);

      // Package pre-selected snacks for Checkout
      const initialFoodOrders = Object.keys(quickSnackQuantities)
        .filter((id) => quickSnackQuantities[id] > 0)
        .map((id) => {
          const item = quickSnacks.find((f) => f.id === id);
          return {
            id,
            name: item?.name || "Cinema Snack",
            quantity: quickSnackQuantities[id],
            price: item?.price || 0,
            image: item?.image || "",
            category: item?.category || "Snacks",
            totalPrice: (item?.price || 0) * quickSnackQuantities[id]
          };
        });

      navigate("/checkout", {
        state: {
          movieTitle: movie?.title || "Movie",
          movieId: movie?.id || queryMovieId || "mov-101",
          theatreName,
          screenName,
          showId,
          showTime,
          showDate,
          selectedSeats,
          seatTotal: totalSeatPrice,
          initialFoodOrders
        },
      });
    } catch (error) {
      console.error("Seat locking error:", error);
      setErrorMessage(
        getErrorMessage(
          error,
          "Some selected seats are no longer available. The layout has been refreshed."
        )
      );

      setSelectedSeats([]);
      await fetchMovieAndSeats({ silent: true });
    } finally {
      setLocking(false);
    }
  };

  const handleRefresh = async () => {
    setSelectedSeats([]);
    await fetchMovieAndSeats({ silent: true });
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (!loading && !seatData && !movie) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center px-4">
        <section className="w-full rounded-3xl border border-rose-500/20 bg-slate-900/90 p-8 text-center shadow-2xl">
          <AlertTriangle className="mx-auto mb-4 h-10 w-10 text-rose-400" />
          <h1 className="text-xl font-black text-white">Unable to load seats</h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            {errorMessage || "Please return to the show selection and try again."}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-bold text-slate-200 hover:bg-slate-800"
            >
              Go Back
            </button>
            <button
              type="button"
              onClick={() => fetchMovieAndSeats()}
              className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-300"
            >
              Try Again
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#050811] to-[#020408] pb-44 text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      <div className="mx-auto max-w-7xl space-y-6 px-3 py-6 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <header className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-300 transition hover:border-cyan-400/50 hover:text-white"
            aria-label="Go back to show selection"
          >
            <ChevronLeft className="h-4 w-4 text-cyan-400" />
            <span>Back to Theatres</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300">
              <span className={`w-2 h-2 rounded-full ${realtimeActive ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>{realtimeActive ? "Real-time Live Sync Active" : "Live Seating"}</span>
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing || locking}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2 text-xs font-bold text-slate-300 hover:border-cyan-400 hover:text-cyan-400 transition"
              title="Refresh seat availability"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin text-cyan-400" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </header>

        {/* Movie / Show Summary Banner */}
        {movie && (
          <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-md">
            <div className="flex flex-col gap-4 p-4 sm:p-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4 min-w-0">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&auto=format&fit=crop&q=80";
                  }}
                  className="h-16 w-12 sm:h-20 sm:w-14 rounded-xl object-cover border border-slate-700 shrink-0 shadow-md"
                />
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md border border-cyan-500/40 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-cyan-400">
                      {screenType}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-cyan-400">
                      <Volume2 className="h-3 w-3" />
                      {soundType}
                    </span>
                  </div>

                  <h1 className="truncate text-lg sm:text-2xl font-black tracking-tight text-white font-heading">
                    {movie.title}
                  </h1>

                  <p className="truncate text-xs text-slate-300">
                    <strong className="text-cyan-400 font-bold">{theatreName}</strong>
                    <span className="mx-1.5 text-slate-600">•</span>
                    <span className="text-slate-200">{screenName}</span>
                    <span className="mx-1.5 text-slate-600">•</span>
                    <span className="text-emerald-400 font-bold">{showDate}</span> at <span className="text-white font-bold">{showTime}</span>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:self-center">
                <div className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs font-bold text-slate-300">
                  <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                  <span>{layoutBadge}</span>
                </div>

                {lockActive && (
                  <div className="inline-flex items-center gap-2 rounded-2xl border border-rose-500/40 bg-rose-500/10 px-3.5 py-1.5 text-xs font-black text-rose-300 animate-pulse">
                    <Clock3 className="h-4 w-4" />
                    <span>Seats Held: {formatTime(lockTimer)}</span>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-2xl border border-rose-500/40 bg-rose-950/40 p-4 text-xs sm:text-sm text-rose-200 shadow-lg"
          >
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
            <span className="leading-5 font-medium">{errorMessage}</span>
          </div>
        )}

        {/* Quick Seat Selector Chips */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-cyan-400" /> Quick Select:
            </span>
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleQuickSelect(num)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                  selectedSeats.length === num
                    ? "bg-cyan-400 text-slate-950 border-cyan-300 shadow-md font-black"
                    : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white"
                }`}
              >
                {num} {num === 1 ? "Seat" : "Seats"}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 ml-auto text-xs font-semibold text-slate-400">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>BookMyShow Flow</span>
            </span>
          </div>
        </div>

        {/* Cinema Seating Stage & Grid */}
        <section aria-label="Cinema seat selection" className="space-y-6">
          {loading ? (
            <div className="py-28 text-center text-slate-400">
              <Loader2 className="mx-auto h-10 w-10 animate-spin text-cyan-400" />
              <p className="mt-4 text-sm font-bold tracking-wide">
                Calibrating auditorium seating grid...
              </p>
            </div>
          ) : orderedSeatMap.length === 0 ? (
            <div className="mx-auto max-w-lg rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-center">
              <Info className="mx-auto h-9 w-9 text-cyan-400" />
              <h2 className="mt-4 font-black text-white">Seats are unavailable</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                This show does not currently have a seating layout. Refresh or choose another show.
              </p>
              <button
                type="button"
                onClick={handleRefresh}
                disabled={refreshing}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-black text-slate-950 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                Refresh Seats
              </button>
            </div>
          ) : (
            <MovieSeatSelection 
              seatMap={orderedSeatMap}
              sections={sections}
              maxSeats={MAX_SEATS}
              targetSeatCount={targetSeatCount}
              onOpenSeatCountModal={() => setSeatCountModalOpen(true)}
              screenName={screenName}
              screenType={screenType}
              soundType={soundType}
              isCurved={Boolean(seatData?.isCurved)}
              layoutBadge={seatData?.layoutBadge || "Custom Auditorium"}
              layoutSignature={seatData?.layoutSignature || ""}
              auditoriumDimensions={seatData?.auditoriumDimensions || null}
              walkwayBreaks={seatData?.walkwayBreaks || []}
              aisleLabels={seatData?.aisleLabels || ["West Gangway", "East Gangway"]}
              emergencyExits={seatData?.emergencyExits || ["Exit Left", "Exit Right"]}
              zoomScale={zoomLevel}
              selectedSeats={selectedSeats}
              onSeatClick={handleSeatClick}
              showFooter={false}
              showHeader={true}
            />
          )}
        </section>
      </div>

      {/* BookMyShow "How Many Seats?" Modal */}
      <BookMyShowSeatCountModal
        isOpen={seatCountModalOpen}
        onClose={() => setSeatCountModalOpen(false)}
        initialCount={targetSeatCount}
        onConfirm={handleConfirmSeatCount}
        categoryStats={categoryStats}
        theatreName={theatreName}
        movieTitle={movie?.title || "Movie"}
      />

      {/* Sticky Bottom Booking & Snacks Bar */}
      <aside className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-800 bg-[#050811]/95 shadow-2xl backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Selected ({selectedSeats.length}):</span>
              {selectedSeats.length > 0 ? (
                <div className="flex flex-wrap items-center gap-1.5">
                  {selectedSeats.map((seat) => (
                    <span
                      key={seat.id}
                      className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-black text-xs"
                    >
                      {seat.id}
                    </span>
                  ))}
                  <button
                    type="button"
                    onClick={() => setSelectedSeats([])}
                    className="text-[10px] text-rose-400 hover:underline ml-1 cursor-pointer font-bold"
                  >
                    Clear All
                  </button>
                </div>
              ) : (
                <span className="text-slate-400 italic">No seats selected</span>
              )}
            </div>
            
            <p className="mt-1 text-lg sm:text-2xl font-black text-white flex items-baseline gap-2">
              <span>₹{totalSeatPrice.toLocaleString("en-IN")}</span>
              <span className="text-xs font-normal text-slate-400">
                (excl. taxes & food)
              </span>
            </p>
          </div>

          <div className="flex w-full gap-2 sm:w-auto">
            <MovingBorderButton
              type="button"
              onClick={handleProceedToCheckout}
              disabled={selectedSeats.length === 0 || locking || loading}
              variant="cyan"
              borderRadius="1rem"
              containerClassName="h-12 w-full sm:w-auto sm:min-w-[280px]"
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {locking ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
                  <span>Locking Seats & Loading Snacks...</span>
                </>
              ) : (
                <>
                  <Popcorn className="h-4 w-4 text-slate-950" />
                  <span>Select Snacks & Checkout</span>
                  <ArrowRight className="h-4 w-4 text-slate-950" />
                </>
              )}
            </MovingBorderButton>
          </div>
        </div>
      </aside>
    </main>
  );
}
