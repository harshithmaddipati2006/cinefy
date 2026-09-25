/**
 * Backend Realtime Movie Release Engine
 * Deterministically checks movie release dates against the current date (or reference date).
 * Automatically transitions movies from "coming_soon" to "now_showing" on or after their release date.
 */

const FESTIVE_DATES = {
  "sankranti 2026": "2026-01-14",
  "pongal 2026": "2026-01-14",
  "ugadi 2026": "2026-03-20",
  "eid 2026": "2026-03-21",
  "summer 2026": "2026-05-01",
  "independence day 2026": "2026-08-15",
  "ganesh chaturthi 2026": "2026-09-14",
  "dusserah 2026": "2026-10-20",
  "dasara 2026": "2026-10-20",
  "diwali 2026": "2026-11-08",
  "deepavali 2026": "2026-11-08",
  "christmas 2026": "2026-12-25",
  "sankranti 2027": "2027-01-14",
  "summer 2027": "2027-05-01",
  "diwali 2027": "2027-10-29",
  "christmas 2027": "2027-12-25"
};

export function parseReleaseDate(dateStr) {
  if (!dateStr) return null;
  if (dateStr instanceof Date) return isNaN(dateStr.getTime()) ? null : dateStr;

  const rawStr = String(dateStr).trim();
  const lowerStr = rawStr.toLowerCase();

  // 1. Check known festival mappings
  if (FESTIVE_DATES[lowerStr]) {
    const d = new Date(FESTIVE_DATES[lowerStr]);
    if (!isNaN(d.getTime())) return d;
  }

  // 2. Direct ISO parse (YYYY-MM-DD)
  const isoMatch = rawStr.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (isoMatch) {
    const year = parseInt(isoMatch[1], 10);
    const month = parseInt(isoMatch[2], 10) - 1;
    const day = parseInt(isoMatch[3], 10);
    const d = new Date(year, month, day, 0, 0, 0, 0);
    if (!isNaN(d.getTime())) return d;
  }

  // 3. Month YYYY e.g. "May 2027"
  const monthYearMatch = rawStr.match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (monthYearMatch) {
    const parsed = new Date(`${monthYearMatch[1]} 1, ${monthYearMatch[2]}`);
    if (!isNaN(parsed.getTime())) return parsed;
  }

  // 4. Standard Date.parse()
  const parsed = new Date(rawStr);
  if (!isNaN(parsed.getTime())) {
    return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate(), 0, 0, 0, 0);
  }

  return null;
}

export function formatReleaseDisplayDate(dateStr) {
  const d = parseReleaseDate(dateStr);
  if (!d) return dateStr || "Coming Soon";
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

export function getMovieReleaseStatus(movie, referenceDate = new Date()) {
  const refDate = referenceDate instanceof Date ? referenceDate : new Date(referenceDate);
  const todayMidnight = new Date(refDate.getFullYear(), refDate.getMonth(), refDate.getDate(), 0, 0, 0, 0).getTime();

  const releaseDateObj = parseReleaseDate(movie.releaseDate);

  if (!releaseDateObj) {
    const status = movie.status || "now_showing";
    return {
      status,
      isReleased: status === "now_showing",
      isReleasedToday: false,
      daysUntilRelease: null,
      daysSinceRelease: null,
      releaseStatusLabel: status === "now_showing" ? "Now Showing" : "Coming Soon",
      badgeType: status === "now_showing" ? "now_showing" : "coming_soon",
      releaseDateObj: null
    };
  }

  const releaseMidnight = releaseDateObj.getTime();
  const diffDays = Math.round((releaseMidnight - todayMidnight) / (24 * 60 * 60 * 1000));

  if (diffDays <= 0) {
    // Released (Today or in the past) -> NOW SHOWING!
    const isToday = diffDays === 0;
    const daysAgo = Math.abs(diffDays);

    let releaseStatusLabel = "In Theatres Now";
    let badgeType = "now_showing";

    if (isToday) {
      releaseStatusLabel = "Premiering Today!";
      badgeType = "released_today";
    } else if (daysAgo <= 7) {
      releaseStatusLabel = `Released ${daysAgo === 1 ? "Yesterday" : `${daysAgo} days ago`}`;
      badgeType = "new_release";
    }

    return {
      status: "now_showing",
      isReleased: true,
      isReleasedToday: isToday,
      daysUntilRelease: 0,
      daysSinceRelease: daysAgo,
      releaseStatusLabel,
      badgeType,
      releaseDateObj
    };
  } else {
    // In Future -> UPCOMING / COMING SOON!
    let releaseStatusLabel = `Releasing in ${diffDays} days`;
    let badgeType = "coming_soon";

    if (diffDays === 1) {
      releaseStatusLabel = "Releasing Tomorrow!";
      badgeType = "releasing_tomorrow";
    } else if (diffDays <= 7) {
      releaseStatusLabel = `Releasing this week (${diffDays}d left)`;
      badgeType = "this_week";
    }

    return {
      status: "coming_soon",
      isReleased: false,
      isReleasedToday: false,
      daysUntilRelease: diffDays,
      daysSinceRelease: null,
      releaseStatusLabel,
      badgeType,
      releaseDateObj
    };
  }
}

export function enrichMovieWithRealtimeRelease(movie, referenceDate = new Date()) {
  if (!movie) return movie;
  const releaseInfo = getMovieReleaseStatus(movie, referenceDate);

  return {
    ...movie,
    status: releaseInfo.status,
    isReleased: releaseInfo.isReleased,
    isReleasedToday: releaseInfo.isReleasedToday,
    daysUntilRelease: releaseInfo.daysUntilRelease,
    daysSinceRelease: releaseInfo.daysSinceRelease,
    releaseStatusLabel: releaseInfo.releaseStatusLabel,
    releaseBadgeType: releaseInfo.badgeType,
    displayReleaseDate: formatReleaseDisplayDate(movie.releaseDate)
  };
}

export function processMoviesWithRealtimeRelease(movies = [], referenceDate = new Date()) {
  const enriched = movies.map((m) => enrichMovieWithRealtimeRelease(m, referenceDate));

  const nowShowing = enriched
    .filter((m) => m.status === "now_showing")
    .sort((a, b) => {
      if (a.isReleasedToday && !b.isReleasedToday) return -1;
      if (!a.isReleasedToday && b.isReleasedToday) return 1;
      const dateA = parseReleaseDate(a.releaseDate)?.getTime() || 0;
      const dateB = parseReleaseDate(b.releaseDate)?.getTime() || 0;
      if (dateB !== dateA) return dateB - dateA;
      return (Number(b.rating) || 0) - (Number(a.rating) || 0);
    });

  const comingSoon = enriched
    .filter((m) => m.status === "coming_soon")
    .sort((a, b) => {
      const dateA = parseReleaseDate(a.releaseDate)?.getTime() || Number.MAX_SAFE_INTEGER;
      const dateB = parseReleaseDate(b.releaseDate)?.getTime() || Number.MAX_SAFE_INTEGER;
      return dateA - dateB;
    });

  return {
    allMovies: enriched,
    nowShowing,
    comingSoon,
    todayReleases: nowShowing.filter((m) => m.isReleasedToday),
    tomorrowReleases: comingSoon.filter((m) => m.daysUntilRelease === 1)
  };
}
