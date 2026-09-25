import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { Search, X, Star, Calendar, MapPin, Film, Sparkles } from "lucide-react";

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ movies: [], events: [] });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setResults({ movies: [], events: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const [movRes, evtRes] = await Promise.all([
          API.get(`/movies?search=${encodeURIComponent(query)}`),
          API.get(`/events`)
        ]);
        const evtFiltered = (evtRes.data.events || []).filter(e => e.title.toLowerCase().includes(query.toLowerCase()));
        setResults({
          movies: movRes.data.movies || [],
          events: evtFiltered
        });
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-start justify-center pt-16 px-4">
      <div className="bg-slate-950 border border-slate-800 w-full max-w-2xl rounded-3xl p-6 shadow-2xl relative animate-in fade-in slide-in-from-top-4">
        
        {/* Header Search Input */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-4">
          <Search className="w-6 h-6 text-cyan-400" />
          <input
            type="text"
            autoFocus
            placeholder="Search movies, actors, directors, events or concerts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-white text-lg font-medium placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        {loading ? (
          <div className="py-12 text-center text-slate-400 text-sm">
            Searching CineFy database...
          </div>
        ) : query.trim() && results.movies.length === 0 && results.events.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm">
            No movies or events found matching "<strong className="text-white">{query}</strong>".
          </div>
        ) : (
          <div className="max-h-[60vh] overflow-y-auto space-y-6 pr-1">
            {/* Movies Section */}
            {results.movies.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-cyan-400" /> Movies ({results.movies.length})
                </h4>
                <div className="space-y-2.5">
                  {results.movies.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => {
                        onClose();
                        navigate(`/movie/${m.id}`);
                      }}
                      className="flex items-center gap-4 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900 cursor-pointer transition-all"
                    >
                      <img src={m.poster} alt={m.title} className="w-12 h-16 object-cover rounded-xl shadow" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h5 className="text-white font-bold text-base font-heading">{m.title}</h5>
                          {m.year && <span className="text-xs text-slate-400 font-normal">({m.year})</span>}
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-cyan-500/30">{m.language}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          {m.director ? `Dir: ${m.director}` : ''} {m.music ? `• Music: ${m.music}` : ''}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">{m.genre.join(", ")} • {m.duration}</p>
                      </div>
                      <div className="flex items-center gap-1 text-cyan-400 text-sm font-bold bg-cyan-500/10 px-2.5 py-1 rounded-xl">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{m.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Events Section */}
            {results.events.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-purple-400" /> Live Events ({results.events.length})
                </h4>
                <div className="space-y-2.5">
                  {results.events.map((e) => (
                    <div
                      key={e.id}
                      onClick={() => {
                        onClose();
                        navigate(`/events`);
                      }}
                      className="flex items-center gap-4 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-900 cursor-pointer transition-all"
                    >
                      <img src={e.image} alt={e.title} className="w-12 h-16 object-cover rounded-xl shadow" />
                      <div className="flex-1">
                        <h5 className="text-white font-bold text-base font-heading">{e.title}</h5>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                          <span>{e.category}</span> • <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-cyan-400" /> {e.venue}</span>
                        </p>
                      </div>
                      <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-3 py-1 rounded-xl">
                        ₹{e.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
