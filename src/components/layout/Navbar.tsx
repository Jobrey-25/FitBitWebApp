import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { auth } from '../../lib/firebase';
import { cn } from '../../lib/utils';
import { Dumbbell, User, LogOut, LayoutDashboard, Calendar, Users, Phone, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export default function Navbar() {
  const { user, profile, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 text-2xl font-black tracking-tighter text-indigo-600">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
            <Dumbbell className="fill-white" size={24} />
          </div>
          <span>FITBIT</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-slate-500 font-semibold text-sm uppercase tracking-wider">
          <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <Link to="/plans" className="hover:text-indigo-600 transition-colors">Plans</Link>
          <Link to="/trainers" className="hover:text-indigo-600 transition-colors">Trainers</Link>
          <Link to="/contact" className="hover:text-indigo-600 transition-colors">Contact</Link>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              {isAdmin && (
                <Link to="/admin" className="p-2.5 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all flex items-center gap-2">
                  <ShieldCheck size={20} />
                  <span className="hidden sm:inline font-bold">Admin</span>
                </Link>
              )}
              <Link to="/dashboard" className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all flex items-center gap-2">
                <LayoutDashboard size={20} />
                <span className="hidden sm:inline font-bold">Dashboard</span>
              </Link>
              <Link to="/profile" className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden border-2 border-transparent hover:border-indigo-600 transition-all shadow-sm">
                {profile?.profilePicture ? (
                  <img src={profile.profilePicture} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <User size={20} />
                  </div>
                )}
              </Link>
              <button 
                onClick={handleLogout}
                className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-6 py-2.5 text-slate-600 font-bold hover:text-indigo-600 transition-colors">Sign In</Link>
              <Link to="/register" className="px-6 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
                Join Now
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
