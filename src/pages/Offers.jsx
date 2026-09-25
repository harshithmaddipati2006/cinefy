import React, { useState } from "react";
import { OFFERS } from "../data/seedData";
import { Tag, Copy, Check, Percent, CreditCard, Sparkles } from "lucide-react";

export default function Offers() {
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-20">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl p-8 bg-gradient-to-r from-cyan-950/80 via-slate-900 to-slate-950 border border-cyan-500/30 overflow-hidden shadow-2xl">
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-widest">
            <Tag className="w-4 h-4" />
            <span>Exclusive CineFy Deals & Cashback</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-heading">
            Promotions & Card Discount Offers
          </h1>
          <p className="text-slate-300 text-sm">
            Apply promo codes at checkout to get up to 50% instant discount on movie tickets and snacks.
          </p>
        </div>
      </div>

      {/* Grid of Offers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {OFFERS.map((offer, idx) => {
          const isCopied = copiedCode === offer.code;
          const offerKey = offer.id ? `offer-item-${offer.id}` : `offer-item-${offer.code}-${idx}`;
          return (
            <div
              id={`offer-card-${offer.code.toLowerCase()}`}
              key={offerKey}
              className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 flex flex-col justify-between space-y-6 hover:border-cyan-500/50 transition-all shadow-xl"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-slate-950 border border-cyan-500/40 text-cyan-400 text-xs font-bold">
                    {offer.discountPercent}% OFF
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white font-heading">{offer.title}</h3>
                  <p className="text-slate-300 text-xs mt-1 leading-relaxed">{offer.description}</p>
                </div>

                <div className="text-[11px] text-slate-500 space-y-1 font-medium bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                  <p>• Min Order: ₹{offer.minBookingAmount}</p>
                  <p>• Max Discount: ₹{offer.maxDiscount}</p>
                  <p>• Valid till: {offer.validTill}</p>
                </div>
              </div>

              {/* Coupon Code Copy Button */}
              <div className="pt-4 border-t border-dashed border-slate-800 flex items-center justify-between">
                <span className="font-mono text-sm font-black text-cyan-400 px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                  {offer.code}
                </span>

                <button
                  onClick={() => handleCopyCode(offer.code)}
                  className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                    isCopied
                      ? "bg-emerald-500 text-slate-950"
                      : "bg-slate-800 text-white hover:bg-cyan-500 hover:text-slate-950"
                  }`}
                >
                  {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{isCopied ? "Copied!" : "Copy Code"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
