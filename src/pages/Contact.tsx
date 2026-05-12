import React, { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { handleFirestoreError, OperationType } from '../lib/error-handler';

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'contact_messages'), {
        ...formData,
        createdAt: serverTimestamp()
      });
      alert("Message sent! Our team will get back to you soon.");
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'contact_messages');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-24">
      <div className="container mx-auto px-6 text-center lg:text-left">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
          
          {/* Info Side */}
          <div className="space-y-16">
            <div>
              <div className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                Liaison & Support
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-none">CONNECT WITH US</h1>
              <p className="text-slate-500 font-medium text-xl leading-relaxed max-w-xl mx-auto lg:mx-0">
                Have questions about our elite memberships or world-class master trainers? Our concierge team is ready to assist.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-x-12 gap-y-10">
              <div className="flex gap-6 items-start group">
                <div className="w-16 h-16 bg-white border border-slate-100 rounded-[1.5rem] flex items-center justify-center text-indigo-600 shadow-xl shadow-slate-200/50 shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                  <Phone size={28} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Concierge Line</h4>
                  <p className="text-xl font-black text-slate-900 tracking-tight">+27 12 345 6789</p>
                </div>
              </div>

              <div className="flex gap-6 items-start group">
                <div className="w-16 h-16 bg-white border border-slate-100 rounded-[1.5rem] flex items-center justify-center text-indigo-600 shadow-xl shadow-slate-200/50 shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                  <Mail size={28} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Master Support</h4>
                  <p className="text-xl font-black text-slate-900 tracking-tight">elite@fitbitgym.co.za</p>
                </div>
              </div>

              <div className="flex gap-6 items-start group sm:col-span-2">
                <div className="w-16 h-16 bg-white border border-slate-100 rounded-[1.5rem] flex items-center justify-center text-indigo-600 shadow-xl shadow-slate-200/50 shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                  <MapPin size={28} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Elite HQ</h4>
                  <p className="text-xl font-black text-slate-900 tracking-tight">123 Fitness Ave, Sandton, South Africa</p>
                </div>
              </div>
            </div>

            <div className="p-10 bg-slate-950 rounded-[3rem] text-white flex flex-col sm:flex-row items-center gap-8 shadow-2xl shadow-slate-900/20">
              <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center shrink-0 border border-white/5">
                <MessageCircle size={32} className="text-indigo-400" />
              </div>
              <p className="text-sm font-medium leading-relaxed opacity-80 text-center sm:text-left">Priority 24/7 technical and training support is available exclusively for Platinum members through the digital dashboard.</p>
            </div>
          </div>

          {/* Form Side */}
          <div className="bg-white p-10 md:p-14 rounded-[4rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.1)] border border-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
            <h3 className="text-3xl font-black text-slate-900 mb-10 tracking-tight uppercase">Send Dispatch</h3>
            <form onSubmit={handleSubmit} className="space-y-8 relative z-10 text-left">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Identity</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:outline-none font-bold text-slate-900 transition-all placeholder:text-slate-300"
                  placeholder="e.g. John Doe"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Digital Address</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:outline-none font-bold text-slate-900 transition-all placeholder:text-slate-300"
                  placeholder="e.g. john@elite.com"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Briefing</label>
                <textarea 
                  required
                  rows={5}
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:outline-none font-bold text-slate-900 transition-all resize-none placeholder:text-slate-300"
                  placeholder="Detail your transformation goals or inquiry..."
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-6 bg-indigo-600 text-white rounded-3xl font-black hover:bg-indigo-700 transition-all flex items-center justify-center gap-4 shadow-xl shadow-indigo-600/30 disabled:opacity-50 uppercase tracking-[0.2em] text-xs"
              >
                {loading ? 'Transmitting...' : <><Send size={20} /> Deploy Message</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
