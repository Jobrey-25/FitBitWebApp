import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Users, Trophy, Calendar, Dumbbell, ShieldCheck, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=2000" 
            alt="Gym Background" 
            className="w-full h-full object-cover opacity-50 contrast-125 brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/40 to-slate-950"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-black uppercase tracking-widest mb-8 backdrop-blur-md"
          >
            <Zap size={14} fill="currentColor" />
            Voted #1 Private Club 2026
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-7xl md:text-9xl font-black text-white mb-6 tracking-tighter leading-[0.9]"
          >
            PEAK<br/>
            <span className="text-indigo-500">PERFORMANCE.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-slate-400 mb-12 max-w-xl mx-auto font-medium leading-relaxed"
          >
            The ultimate gym ecosystem for serious athletes. Precision equipment, elite coaching, and seamless digital management.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/register" className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-600/30 flex items-center justify-center gap-3 group">
              Get Started <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/plans" className="px-12 py-5 bg-white/5 text-white backdrop-blur-xl border border-white/10 rounded-2xl font-black hover:bg-white/10 transition-all">
              View Memberships
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Active Members', value: '5K+' },
            { label: 'Pro Trainers', value: '50+' },
            { label: 'Stations', value: '200+' },
            { label: 'Uptime', value: '24/7' },
          ].map((stat, i) => (
            <div key={i} className="text-left md:text-center border-l-2 border-indigo-500/10 pl-6 md:pl-0 md:border-l-0">
              <div className="text-4xl font-black text-slate-900 mb-1">{stat.value}</div>
              <div className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mb-24">
            <h2 className="text-sm font-black text-indigo-600 uppercase tracking-[0.2em] mb-4">The FitBit Standard</h2>
            <h3 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">ENGINEERED FOR PROGRESS.</h3>
            <p className="text-slate-500 text-lg font-medium">We've removed every friction point between you and your next PR.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Dumbbell className="text-white" />,
                title: "Precision Iron",
                desc: "Every weight, bench, and machine calibrated for optimal mechanical advantage.",
                color: "bg-indigo-600"
              },
              {
                icon: <ShieldCheck className="text-white" />,
                title: "Digital Vault",
                desc: "Securely track your progress, payments, and documents in one sleek portal.",
                color: "bg-slate-900"
              },
              {
                icon: <Zap className="text-white" />,
                title: "Instant Access",
                desc: "No keycards. No queues. Use your digital ID for instant gym and locker access.",
                color: "bg-indigo-500"
              }
            ].map((feature, i) => (
              <div key={i} className="p-12 rounded-[3rem] bg-white border border-slate-100 hover:shadow-2xl hover:shadow-slate-200 transition-all group">
                <div className={cn("w-16 h-16 rounded-[1.25rem] flex items-center justify-center mb-10 group-hover:-translate-y-2 transition-transform shadow-lg", feature.color)}>
                  {React.cloneElement(feature.icon as React.ReactElement, { size: 30 })}
                </div>
                <h3 className="text-2xl font-black mb-4 text-slate-900">{feature.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 container mx-auto px-6">
        <div className="bg-blue-600 rounded-[3rem] p-12 md:p-20 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
          
          <h2 className="text-4xl md:text-6xl font-black mb-8 relative z-10">JOIN THE ELITE TODAY</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-xl mx-auto relative z-10">Sign up in seconds and get instant access to our membership plans and trainer bookings.</p>
          <Link to="/register" className="px-12 py-5 bg-white text-blue-600 rounded-2xl font-black hover:bg-slate-100 transition-all inline-flex items-center gap-3 relative z-10">
            JOIN NOW <ArrowRight size={24} />
          </Link>
        </div>
      </section>
    </div>
  );
}
