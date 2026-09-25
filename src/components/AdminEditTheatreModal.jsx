import React, { useState, useEffect } from "react";
import { X, Building, Plus, Trash2, Check, MapPin, Sparkles } from "lucide-react";

export default function AdminEditTheatreModal({ theatre, isOpen, onClose, onSave, saving, cities = [] }) {
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (theatre) {
      setFormData({
        ...theatre,
        facilitiesStr: Array.isArray(theatre.facilities)
          ? theatre.facilities.join(", ")
          : theatre.facilities || theatre.amenities || "",
        screens: Array.isArray(theatre.screens) ? JSON.parse(JSON.stringify(theatre.screens)) : []
      });
    }
  }, [theatre]);

  if (!isOpen || !formData) return null;

  const handleAddScreen = () => {
    const nextNum = (formData.screens?.length || 0) + 1;
    setFormData({
      ...formData,
      screens: [
        ...(formData.screens || []),
        {
          id: `scr-${Date.now()}-${nextNum}`,
          name: `Screen ${nextNum} - Dolby Atmos 4K`,
          type: "Dolby Atmos 4K",
          totalSeats: 150
        }
      ]
    });
  };

  const handleScreenChange = (index, field, value) => {
    const newScreens = [...formData.screens];
    newScreens[index] = { ...newScreens[index], [field]: value };
    setFormData({ ...formData, screens: newScreens });
  };

  const handleRemoveScreen = (index) => {
    setFormData({
      ...formData,
      screens: formData.screens.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = {
      ...formData,
      rating: Number(formData.rating) || 4.5,
      screensCount: Number(formData.screensCount) || formData.screens.length || 2,
      facilities: formData.facilitiesStr.split(",").map((f) => f.trim()).filter(Boolean)
    };
    onSave(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-950/60 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white font-heading">
                Edit Cinema Theatre Metadata
              </h3>
              <p className="text-[11px] text-slate-400">
                Updating: <strong className="text-cyan-400">{formData.name}</strong> (ID: {formData.id})
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
        <form id="edit-theatre-form" onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800/80 pb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Theatre Details & Location</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="text-slate-300 font-bold block mb-1">Theatre Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Hyderabad, Tenali, Bengaluru"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Locality / Area</label>
                <input
                  type="text"
                  value={formData.locality || ""}
                  onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                  placeholder="e.g. Panjagutta, Station Road"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Theatre Type / Format</label>
                <select
                  value={formData.theatreType || "Modern Multiplex"}
                  onChange={(e) => setFormData({ ...formData, theatreType: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
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
                <label className="text-slate-300 font-bold block mb-1">Rating (1 to 5)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <label className="text-slate-300 font-bold block mb-1">Full Address</label>
                <input
                  type="text"
                  value={formData.address || ""}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Complete street address, landmarks, etc."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <label className="text-slate-300 font-bold block mb-1">Facilities & Amenities (Comma separated)</label>
                <input
                  type="text"
                  value={formData.facilitiesStr}
                  onChange={(e) => setFormData({ ...formData, facilitiesStr: e.target.value })}
                  placeholder="Dolby Atmos, 4K RGB Laser, Recliner Seats, Gourmet Snack Bar, Valet Parking, Wheelchair Access"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Screens Manager */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5" />
                <span>Auditorium Screens ({formData.screens?.length || 0})</span>
              </h4>
              <button
                type="button"
                onClick={handleAddScreen}
                className="px-3 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Screen</span>
              </button>
            </div>

            <div className="space-y-3">
              {(formData.screens || []).map((screen, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/90 flex items-center gap-3">
                  <span className="w-7 h-7 rounded-xl bg-slate-800 text-cyan-400 font-bold flex items-center justify-center text-xs shrink-0">
                    {idx + 1}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
                    <div>
                      <label className="text-[10px] text-slate-400 font-semibold block mb-0.5">Screen Name</label>
                      <input
                        type="text"
                        value={screen.name}
                        onChange={(e) => handleScreenChange(idx, "name", e.target.value)}
                        placeholder="e.g. Screen 1 - IMAX Laser"
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-semibold block mb-0.5">Screen Format / Technology</label>
                      <select
                        value={screen.type || "Dolby Atmos"}
                        onChange={(e) => handleScreenChange(idx, "type", e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                      >
                        <option value="IMAX Laser">IMAX Laser</option>
                        <option value="4DX">4DX 3D Dynamic</option>
                        <option value="Dolby Atmos 4K">Dolby Atmos 4K Laser</option>
                        <option value="Dolby Atmos">Dolby Atmos</option>
                        <option value="INSIGNIA VIP">INSIGNIA VIP Recliner</option>
                        <option value="P[XL] Premium">P[XL] Premium Large Format</option>
                        <option value="RGB 4K Laser">RGB 4K Laser</option>
                      </select>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveScreen(idx)}
                    className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-300 hover:text-slate-950 transition-all cursor-pointer shrink-0"
                    title="Remove Screen"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {(!formData.screens || formData.screens.length === 0) && (
                <div className="p-4 rounded-xl bg-slate-950/50 border border-dashed border-slate-800 text-center text-slate-500 text-xs">
                  No custom screens configured yet. Click "+ Add Screen" above.
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
            form="edit-theatre-form"
            disabled={saving}
            className="cyan-button px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            <span>{saving ? "Saving Changes..." : "Save Theatre Updates"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
