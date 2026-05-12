import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, Instagram, Twitter, Facebook, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-24 pb-12">
      <div className="container mx-auto px-6 grid md:grid-cols-4 gap-16 mb-20">
        <div className="col-span-1 md:col-span-1">
          <Link to="/" className="flex items-center gap-2 text-2xl font-black tracking-tighter text-white mb-8 group">
            <Dumbbell className="fill-indigo-600 text-indigo-600 group-hover:scale-110 transition-transform" />
            <span>FITBIT</span>
          </Link>
          <p className="text-sm leading-relaxed mb-10 text-slate-500">
            Providing premium gym facilities and expert personal training for over 10 years. Transform your body and mind with our elite community.
          </p>
          <div className="flex gap-5">
            <a href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-indigo-600 hover:border-indigo-600 hover:text-white transition-all">
              <Instagram size={20} />
            </a>
            <a href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-indigo-600 hover:border-indigo-600 hover:text-white transition-all">
              <Twitter size={20} />
            </a>
            <a href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-indigo-600 hover:border-indigo-600 hover:text-white transition-all">
              <Facebook size={20} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-xs">Quick Links</h4>
          <ul className="space-y-4 text-sm font-medium">
            <li><Link to="/plans" className="hover:text-indigo-400 transition-colors">Membership Plans</Link></li>
            <li><Link to="/trainers" className="hover:text-indigo-400 transition-colors">Personal Trainers</Link></li>
            <li><Link to="/contact" className="hover:text-indigo-400 transition-colors">Contact Support</Link></li>
            <li><Link to="/login" className="hover:text-indigo-400 transition-colors">Login / Register</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-xs">Contact Info</h4>
          <ul className="space-y-6 text-sm font-medium">
            <li className="flex gap-4">
              <MapPin size={20} className="text-indigo-600 shrink-0" />
              <span className="leading-tight">123 Fitness Ave, Sandton, South Africa</span>
            </li>
            <li className="flex gap-4">
              <Phone size={20} className="text-indigo-600 shrink-0" />
              <span>+27 12 345 6789</span>
            </li>
            <li className="flex gap-4">
              <Mail size={20} className="text-indigo-600 shrink-0" />
              <span>support@fitbitgym.co.za</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-xs">Working Hours</h4>
          <ul className="space-y-4 text-sm font-medium">
            <li className="flex justify-between items-center pb-4 border-b border-white/5">
              <span>Mon - Fri</span>
              <span className="text-white px-3 py-1 bg-white/5 rounded-full text-xs">05:00 - 22:00</span>
            </li>
            <li className="flex justify-between items-center pb-4 border-b border-white/5">
              <span>Saturday</span>
              <span className="text-white px-3 py-1 bg-white/5 rounded-full text-xs">07:00 - 20:00</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Sunday</span>
              <span className="text-white px-3 py-1 bg-white/5 rounded-full text-xs">08:00 - 18:00</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto px-6 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-slate-600 uppercase tracking-[0.2em] font-bold">
        <p>© {new Date().getFullYear()} FITBIT GYM MANAGEMENT. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
