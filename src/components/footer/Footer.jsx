import React from "react";
import { Link } from "react-router-dom";
import { Film, Heart, Shield, HelpCircle, PhoneCall, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#03050a] border-t border-slate-900 text-slate-400 text-sm mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-cyan-500/20">
                <Film className="w-6 h-6 text-slate-950" />
              </div>
              <span className="text-2xl font-black tracking-wider text-white font-heading uppercase">
                CINE<span className="cyan-gradient-text">FY</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              CineFy is India's premium cinematic movie discovery and online ticket booking platform.
              Experience Dolby Atmos, IMAX, and 4DX seat bookings with instant digital QR tickets.
            </p>
            <div className="flex items-center space-x-4 pt-2 text-slate-400">
              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                <Shield className="w-4 h-4 text-emerald-400" />
                256-Bit SSL Encrypted Checkout
              </span>
            </div>
          </div>

          {/* Indian Movie Industries */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 font-heading">Indian Cinema</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/movies?language=Hindi" className="hover:text-cyan-400 transition-colors">Bollywood (Hindi)</Link></li>
              <li><Link to="/movies?language=Telugu" className="hover:text-cyan-400 transition-colors">Tollywood (Telugu)</Link></li>
              <li><Link to="/movies?language=Tamil" className="hover:text-cyan-400 transition-colors">Kollywood (Tamil)</Link></li>
              <li><Link to="/movies?language=Kannada" className="hover:text-cyan-400 transition-colors">Sandalwood (Kannada)</Link></li>
              <li><Link to="/movies?language=Malayalam" className="hover:text-cyan-400 transition-colors">Mollywood (Malayalam)</Link></li>
              <li><Link to="/movies?language=English" className="hover:text-cyan-400 transition-colors">Hollywood (English)</Link></li>
            </ul>
          </div>

          {/* Major Cities & Theatres */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 font-heading">Popular Hubs</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="text-slate-300 font-semibold">PVR & INOX Cinemas</span></li>
              <li><span className="text-slate-300 font-semibold">Cinepolis Multiplex</span></li>
              <li><span className="text-slate-300 font-semibold">AMB Superplex</span></li>
              <li><span className="text-slate-300 font-semibold">Asian Cinemas</span></li>
              <li><span className="text-slate-300 font-semibold">Miraj & Mukta A2</span></li>
            </ul>
          </div>

          {/* Customer Support & Admin Portal */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 font-heading">Support & Admin</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><HelpCircle className="w-4 h-4 text-cyan-400" /> <span>24x7 Ticket Support</span></li>
              <li className="flex items-center gap-2"><PhoneCall className="w-4 h-4 text-cyan-400" /> <span>1800-102-CINEFY</span></li>
              <li className="flex items-center gap-2"><Globe className="w-4 h-4 text-purple-400" /> <span>support@cinefy.com</span></li>
              <li className="pt-2">
                <Link to="/admin" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 hover:text-white hover:border-cyan-500/50 text-xs font-bold transition-all">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Operations Hub</span>
                </Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-900 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 CineFy Technologies Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Designed for cinematic excellence <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" /> by CineFy.
          </p>
        </div>
      </div>
    </footer>
  );
}
