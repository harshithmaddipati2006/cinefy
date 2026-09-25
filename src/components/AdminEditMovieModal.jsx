import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, Link as LinkIcon, UserCheck, Film, Sparkles, Check, Globe, Play, ExternalLink } from "lucide-react";

export default function AdminEditMovieModal({ movie, isOpen, onClose, onSave, saving }) {
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (movie) {
      // Build initial language trailers list from movie.trailers object or fallback
      let initialTrailers = [];
      if (movie.trailers && typeof movie.trailers === "object" && Object.keys(movie.trailers).length > 0) {
        initialTrailers = Object.entries(movie.trailers)
          .filter(([lang, url]) => Boolean(url))
          .map(([lang, url]) => ({ language: lang, url: String(url) }));
      } else if (movie.trailerUrl || movie.trailer) {
        initialTrailers = [{ language: movie.language || "Telugu", url: movie.trailerUrl || movie.trailer }];
      } else {
        initialTrailers = [{ language: movie.language || "Telugu", url: "" }];
      }

      setFormData({
        ...movie,
        languageTrailers: initialTrailers,
        languagesStr: Array.isArray(movie.languages) ? movie.languages.join(", ") : movie.languages || movie.language || "",
        genreStr: Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre || "",
        cast: Array.isArray(movie.cast) ? JSON.parse(JSON.stringify(movie.cast)) : [],
        crew: Array.isArray(movie.crew) ? JSON.parse(JSON.stringify(movie.crew)) : []
      });
    }
  }, [movie]);

  if (!isOpen || !formData) return null;

  const handleTrailerChange = (index, field, value) => {
    const newTrailers = [...(formData.languageTrailers || [])];
    newTrailers[index] = { ...newTrailers[index], [field]: value };
    setFormData({ ...formData, languageTrailers: newTrailers });
  };

  const handleAddTrailer = (suggestedLang = "") => {
    const existing = formData.languageTrailers || [];
    const lang = suggestedLang || (existing.length === 0 ? formData.language || "Telugu" : "Hindi");
    setFormData({
      ...formData,
      languageTrailers: [
        ...existing,
        { language: lang, url: "" }
      ]
    });
  };

  const handleRemoveTrailer = (index) => {
    const existing = formData.languageTrailers || [];
    setFormData({
      ...formData,
      languageTrailers: existing.filter((_, i) => i !== index)
    });
  };

  const handleCastChange = (index, field, value) => {
    const newCast = [...formData.cast];
    newCast[index] = { ...newCast[index], [field]: value };
    setFormData({ ...formData, cast: newCast });
  };

  const handleAddCast = () => {
    setFormData({
      ...formData,
      cast: [
        ...formData.cast,
        {
          name: "",
          role: "",
          image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
        }
      ]
    });
  };

  const handleRemoveCast = (index) => {
    setFormData({
      ...formData,
      cast: formData.cast.filter((_, i) => i !== index)
    });
  };

  const handleCrewChange = (index, field, value) => {
    const newCrew = [...formData.crew];
    newCrew[index] = { ...newCrew[index], [field]: value };
    setFormData({ ...formData, crew: newCrew });
  };

  const handleAddCrew = () => {
    setFormData({
      ...formData,
      crew: [
        ...formData.crew,
        {
          name: "",
          role: "Director",
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80"
        }
      ]
    });
  };

  const handleRemoveCrew = (index) => {
    setFormData({
      ...formData,
      crew: formData.crew.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Build clean trailers map
    const safeTrailers = {};
    (formData.languageTrailers || []).forEach((item) => {
      if (item && item.language && item.language.trim() && item.url && item.url.trim()) {
        safeTrailers[item.language.trim()] = item.url.trim();
      }
    });

    const primaryUrl =
      safeTrailers[formData.language] ||
      Object.values(safeTrailers)[0] ||
      formData.trailerUrl ||
      formData.trailer ||
      "";

    const updated = {
      ...formData,
      trailers: safeTrailers,
      trailer: primaryUrl,
      trailerUrl: primaryUrl,
      languages: formData.languagesStr.split(",").map((l) => l.trim()).filter(Boolean),
      genre: formData.genreStr.split(",").map((g) => g.trim()).filter(Boolean),
      rating: Number(formData.rating) || 9.0
    };
    onSave(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-950/60 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white font-heading flex items-center gap-2">
                <span>Edit Movie & Cast / Crew Metadata</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Updating: <strong className="text-cyan-400">{formData.title}</strong> (ID: {formData.id})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form id="edit-movie-form" onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Basic Movie Details */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800/80 pb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Core Movie Information</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Movie Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Primary Language *</label>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
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
                <label className="text-slate-300 font-bold block mb-1">All Available Audio Languages</label>
                <input
                  type="text"
                  value={formData.languagesStr}
                  onChange={(e) => setFormData({ ...formData, languagesStr: e.target.value })}
                  placeholder="Telugu, Hindi, Tamil, Kannada"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Genres (Comma separated)</label>
                <input
                  type="text"
                  value={formData.genreStr}
                  onChange={(e) => setFormData({ ...formData, genreStr: e.target.value })}
                  placeholder="Action, Thriller, Drama"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Duration</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="2h 45m"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Certification</label>
                <select
                  value={formData.certification}
                  onChange={(e) => setFormData({ ...formData, certification: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="U">U (Universal)</option>
                  <option value="U/A 13+">U/A 13+</option>
                  <option value="U/A 16+">U/A 16+</option>
                  <option value="A">A (Adult 18+)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Rating (1 to 10)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="10"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Release Date</label>
                <input
                  type="text"
                  value={formData.releaseDate || ""}
                  onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                  placeholder="e.g. 2026-10-02 or Sankranti 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="now_showing">Now Showing (In Theatres)</option>
                  <option value="coming_soon">Upcoming Release</option>
                </select>
              </div>
            </div>
          </div>

          {/* Visuals & Media */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800/80 pb-2">
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Poster, Backdrop & Trailer URLs</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Poster Link Address (URL) *</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    required
                    value={formData.poster}
                    onChange={(e) => setFormData({ ...formData, poster: e.target.value })}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  />
                  {formData.poster && (
                    <img
                      src={formData.poster}
                      alt="Poster Preview"
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 object-cover rounded-lg border border-slate-700 shrink-0"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Backdrop / Banner Link (URL)</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={formData.backdrop || ""}
                    onChange={(e) => setFormData({ ...formData, backdrop: e.target.value })}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  />
                  {formData.backdrop && (
                    <img
                      src={formData.backdrop}
                      alt="Backdrop Preview"
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 object-cover rounded-lg border border-slate-700 shrink-0"
                    />
                  )}
                </div>
              </div>

              {/* Language-Specific Trailers Configuration */}
              <div className="sm:col-span-2 space-y-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                  <div>
                    <label className="text-slate-200 font-bold flex items-center gap-1.5 text-xs">
                      <Globe className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Official Theatrical Trailers by Language ({formData.languageTrailers?.length || 0})</span>
                    </label>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Only the trailer languages configured here will be available for users to select & watch.
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleAddTrailer()}
                      className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-slate-950 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Language Trailer</span>
                    </button>
                  </div>
                </div>

                {/* Quick Add Language Badges */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 font-semibold mr-1">Quick Add:</span>
                  {["Telugu", "Hindi", "Tamil", "Kannada", "Malayalam", "English"].map((lang) => {
                    const alreadyAdded = formData.languageTrailers?.some(
                      (t) => t.language?.toLowerCase() === lang.toLowerCase()
                    );
                    return (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => handleAddTrailer(lang)}
                        disabled={alreadyAdded}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition flex items-center gap-1 cursor-pointer ${
                          alreadyAdded
                            ? "bg-slate-800/50 text-slate-500 border-slate-800 cursor-not-allowed"
                            : "bg-slate-900 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500 hover:text-slate-950"
                        }`}
                      >
                        <Plus className="w-2.5 h-2.5" />
                        <span>{lang}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Trailer entries list */}
                <div className="space-y-2.5 pt-1">
                  {(formData.languageTrailers || []).map((trailerItem, tIdx) => (
                    <div
                      key={tIdx}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center gap-2.5"
                    >
                      <div className="w-full sm:w-36 shrink-0">
                        <label className="text-[10px] text-slate-400 font-bold block mb-0.5">Language</label>
                        <select
                          value={trailerItem.language}
                          onChange={(e) => handleTrailerChange(tIdx, "language", e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-cyan-400 text-xs font-bold focus:outline-none focus:border-cyan-500"
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
                        <label className="text-[10px] text-slate-400 font-bold block mb-0.5">
                          YouTube / Embed URL ({trailerItem.language})
                        </label>
                        <input
                          type="url"
                          placeholder="https://www.youtube.com/embed/... or https://youtu.be/..."
                          value={trailerItem.url}
                          onChange={(e) => handleTrailerChange(tIdx, "url", e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                        />
                      </div>

                      <div className="flex items-center gap-1.5 self-end sm:self-center mt-1 sm:mt-4 shrink-0">
                        {trailerItem.url && (
                          <a
                            href={trailerItem.url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs flex items-center gap-1 px-2 font-semibold transition"
                            title="Preview Video URL"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Test</span>
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveTrailer(tIdx)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition cursor-pointer"
                          title="Remove Language Trailer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {(!formData.languageTrailers || formData.languageTrailers.length === 0) && (
                    <div className="text-center py-4 bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
                      <p className="text-slate-400 text-xs">No trailer links configured for this movie yet.</p>
                      <button
                        type="button"
                        onClick={() => handleAddTrailer(formData.language || "Telugu")}
                        className="mt-2 text-xs font-bold text-cyan-400 hover:underline inline-flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add {formData.language || "Telugu"} Trailer Link
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="text-slate-300 font-bold block mb-1">Movie Synopsis / Storyline</label>
                <textarea
                  rows={2}
                  value={formData.synopsis || ""}
                  onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Cast Members Editor */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Cast Members & Real Actors ({formData.cast.length})</span>
              </h4>
              <button
                type="button"
                onClick={handleAddCast}
                className="px-3 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Actor</span>
              </button>
            </div>

            <div className="space-y-3">
              {formData.cast.map((actor, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/90 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <img
                    src={actor.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400"}
                    alt={actor.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1 w-full">
                    <div>
                      <label className="text-[10px] text-slate-400 font-semibold block mb-0.5">Actor Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Akhil Akkineni"
                        value={actor.name}
                        onChange={(e) => handleCastChange(idx, "name", e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-semibold block mb-0.5">Character / Role</label>
                      <input
                        type="text"
                        placeholder="e.g. Lead Protagonist"
                        value={actor.role}
                        onChange={(e) => handleCastChange(idx, "role", e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-semibold block mb-0.5">Actor Real Photo URL</label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={actor.image}
                        onChange={(e) => handleCastChange(idx, "image", e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveCast(idx)}
                    className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-300 hover:text-slate-950 transition-all self-end sm:self-center cursor-pointer shrink-0"
                    title="Remove Actor"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {formData.cast.length === 0 && (
                <div className="p-4 rounded-xl bg-slate-950/50 border border-dashed border-slate-800 text-center text-slate-500 text-xs">
                  No cast members added. Click "+ Add Actor" above.
                </div>
              )}
            </div>
          </div>

          {/* Crew Members Editor */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Crew Members & Directors ({formData.crew.length})</span>
              </h4>
              <button
                type="button"
                onClick={handleAddCrew}
                className="px-3 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500 text-purple-300 hover:text-slate-950 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Crew Member</span>
              </button>
            </div>

            <div className="space-y-3">
              {formData.crew.map((member, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/90 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <img
                    src={member.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"}
                    alt={member.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1 w-full">
                    <div>
                      <label className="text-[10px] text-slate-400 font-semibold block mb-0.5">Crew Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Murali Kishore Abburi"
                        value={member.name}
                        onChange={(e) => handleCrewChange(idx, "name", e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-semibold block mb-0.5">Crew Role</label>
                      <input
                        type="text"
                        placeholder="e.g. Director, Music Director, Producer"
                        value={member.role}
                        onChange={(e) => handleCrewChange(idx, "role", e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-semibold block mb-0.5">Crew Real Photo URL</label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={member.image}
                        onChange={(e) => handleCrewChange(idx, "image", e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveCrew(idx)}
                    className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-300 hover:text-slate-950 transition-all self-end sm:self-center cursor-pointer shrink-0"
                    title="Remove Crew Member"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {formData.crew.length === 0 && (
                <div className="p-4 rounded-xl bg-slate-950/50 border border-dashed border-slate-800 text-center text-slate-500 text-xs">
                  No crew members added. Click "+ Add Crew Member" above.
                </div>
              )}
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800 bg-slate-950/60 sticky bottom-0">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-movie-form"
            disabled={saving}
            className="cyan-button px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            <span>{saving ? "Saving Changes..." : "Save Movie Updates"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
