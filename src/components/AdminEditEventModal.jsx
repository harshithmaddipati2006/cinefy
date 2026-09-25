import React, { useState, useEffect } from "react";
import { X, Trophy, Music, Calendar, Plus, Trash2, Check, Link as LinkIcon, Sparkles } from "lucide-react";

export default function AdminEditEventModal({ event, isOpen, onClose, onSave, saving }) {
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (event) {
      setFormData({
        ...event,
        image: event.image || event.poster || "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600"
      });
    }
  }, [event]);

  if (!isOpen || !formData) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = {
      ...formData,
      price: Number(formData.price) || 499
    };
    onSave(updated);
  };

  const isSports = formData.category === "Sports";
  const isConcert = formData.category === "Concerts";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-950/60 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
              {isSports ? <Trophy className="w-5 h-5" /> : isConcert ? <Music className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white font-heading">
                Edit {formData.category || "Event"} Metadata
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

        {/* Form Body */}
        <form id="edit-event-form" onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800/80 pb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Event & Venue Information</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="text-slate-300 font-bold block mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Events">Cultural / Comedy Event</option>
                  <option value="Concerts">Live Music Concert</option>
                  <option value="Sports">Stadium Sports Match</option>
                </select>
              </div>

              {isConcert && (
                <div className="sm:col-span-2">
                  <label className="text-slate-300 font-bold block mb-1">Featured Artist / Performer</label>
                  <input
                    type="text"
                    value={formData.artist || ""}
                    onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                    placeholder="e.g. A.R. Rahman, Anirudh, Diljit Dosanjh"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              )}

              {isSports && (
                <>
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">Sport Discipline</label>
                    <select
                      value={formData.sportType || "Cricket"}
                      onChange={(e) => setFormData({ ...formData, sportType: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="Cricket">Cricket</option>
                      <option value="Football">Football</option>
                      <option value="Badminton">Badminton</option>
                      <option value="Kabaddi">Pro Kabaddi</option>
                      <option value="Racing">Formula Racing</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-300 font-bold block mb-1">Team A vs Team B</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Team A"
                        value={formData.teamA || ""}
                        onChange={(e) => setFormData({ ...formData, teamA: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                      />
                      <input
                        type="text"
                        placeholder="Team B"
                        value={formData.teamB || ""}
                        onChange={(e) => setFormData({ ...formData, teamB: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="text-slate-300 font-bold block mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Stadium / Venue *</label>
                <input
                  type="text"
                  required
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Date</label>
                <input
                  type="text"
                  value={formData.date || ""}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  placeholder="e.g. 2026-09-15"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Time</label>
                <input
                  type="text"
                  value={formData.time || ""}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  placeholder="e.g. 07:30 PM"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Starting Price (₹)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <label className="text-slate-300 font-bold block mb-1 flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Poster / Banner Link URL *</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    required
                    value={formData.image || formData.poster || ""}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value, poster: e.target.value })}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  />
                  {(formData.image || formData.poster) && (
                    <img
                      src={formData.image || formData.poster}
                      alt="Banner Preview"
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 object-cover rounded-lg border border-slate-700 shrink-0"
                    />
                  )}
                </div>
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <label className="text-slate-300 font-bold block mb-1">Event Description</label>
                <textarea
                  rows={3}
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
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
            form="edit-event-form"
            disabled={saving}
            className="cyan-button px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            <span>{saving ? "Saving Changes..." : "Save Event Updates"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
