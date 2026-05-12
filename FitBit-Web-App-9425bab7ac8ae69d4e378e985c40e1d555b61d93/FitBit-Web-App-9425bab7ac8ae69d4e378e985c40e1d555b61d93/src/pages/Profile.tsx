import React, { useState } from 'react';
import { db } from '../lib/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Upload, 
  Save, 
  IdCard, 
  Activity 
} from 'lucide-react';
import { handleFirestoreError, OperationType } from '../lib/error-handler';

export default function Profile() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    profilePicture: '',
    idDocument: '',
    medicalClearance: ''
  });

  React.useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || '',
        phoneNumber: profile.phoneNumber || '',
        profilePicture: profile.profilePicture || '',
        idDocument: profile.idDocument || '',
        medicalClearance: profile.medicalClearance || ''
      });
    }
  }, [profile]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        ...formData,
        updatedAt: serverTimestamp()
      });
      alert("Profile updated successfully!");
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-24">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-20">
          <div className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            Athlete Management
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-none uppercase">Athlete Data</h1>
          <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-2xl mx-auto">Maintain your performance credentials and professional documentation for master review.</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-16">
          {/* Avatar Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 flex flex-col items-center">
              <div className="w-40 h-40 rounded-[3rem] bg-white border-8 border-white shadow-2xl shadow-slate-200/60 overflow-hidden mb-8 group relative flex items-center justify-center">
                {formData.profilePicture ? (
                  <img src={formData.profilePicture} alt="Avatar" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-indigo-100 bg-slate-50">
                    <UserIcon size={64} strokeWidth={1} />
                  </div>
                )}
                <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px] cursor-pointer">
                  <div className="p-3 bg-white/20 rounded-2xl border border-white/30 text-white">
                    <Upload size={24} />
                  </div>
                </div>
              </div>
              <div className="text-center mb-8">
                <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-2">{profile?.fullName}</h3>
                <div className="inline-block px-3 py-1 bg-slate-200 text-slate-600 rounded-lg text-[9px] font-black uppercase tracking-[0.2em]">
                  {profile?.role || 'Initiate'}
                </div>
              </div>
              
              <div className="w-full bg-white p-8 rounded-[2.5rem] border border-white shadow-2xl shadow-slate-200/40 text-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-50 rounded-full -mr-8 -mt-8 opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <ShieldCheck className="text-emerald-500" size={28} />
                  </div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-slate-900">Verified Credentials</h4>
                  <p className="text-[10px] text-slate-400 font-bold leading-relaxed opacity-70 italic">End-to-end encryption active on all medical and personal data transfers.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-3">
            <form onSubmit={handleUpdate} className="grid md:grid-cols-2 gap-10">
              <div className="space-y-8 col-span-full">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Core Identity</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Display Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input 
                        type="text" 
                        required
                        value={formData.fullName}
                        onChange={e => setFormData({...formData, fullName: e.target.value})}
                        className="w-full pl-14 pr-6 py-5 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:outline-none font-bold text-slate-900 shadow-sm transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Digital Anchor (LOCKED)</label>
                    <div className="relative">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-200" size={18} />
                      <input 
                        type="email" 
                        disabled
                        value={profile?.email}
                        className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-300 cursor-not-allowed font-bold opacity-60"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Communication Channel</label>
                    <div className="relative">
                      <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input 
                        type="tel" 
                        value={formData.phoneNumber}
                        placeholder="+27..."
                        onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
                        className="w-full pl-14 pr-6 py-5 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:outline-none font-bold text-slate-900 shadow-sm transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Avatar Proxy URL</label>
                    <input 
                      type="url" 
                      placeholder="https://..."
                      value={formData.profilePicture}
                      onChange={e => setFormData({...formData, profilePicture: e.target.value})}
                      className="w-full px-6 py-5 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:outline-none font-bold text-slate-900 shadow-sm transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-8 col-span-full pt-10">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Documentation Vault</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-white p-8 rounded-[2.5rem] border border-white shadow-xl shadow-slate-200/40 group">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-1 flex items-center gap-2">
                       <IdCard size={14} className="text-indigo-600" /> Professional ID Proxy
                    </label>
                    <input 
                      type="url" 
                      value={formData.idDocument}
                      placeholder="Transmission Link (https://...)"
                      onChange={e => setFormData({...formData, idDocument: e.target.value})}
                      className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:outline-none font-bold text-slate-900 transition-all group-hover:bg-white"
                    />
                  </div>
                  <div className="bg-white p-8 rounded-[2.5rem] border border-white shadow-xl shadow-slate-200/40 group">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-1 flex items-center gap-2">
                      <Activity size={14} className="text-indigo-600" /> Biometric Clearance
                    </label>
                    <input 
                      type="url" 
                      value={formData.medicalClearance}
                      placeholder="Transmission Link (https://...)"
                      onChange={e => setFormData({...formData, medicalClearance: e.target.value})}
                      className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:outline-none font-bold text-slate-900 transition-all group-hover:bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-full pt-12">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full md:w-auto px-16 py-6 bg-indigo-600 text-white rounded-[2rem] font-black hover:bg-slate-950 transition-all shadow-2xl shadow-indigo-600/30 flex items-center justify-center gap-4 disabled:opacity-50 uppercase tracking-[0.2em] text-xs"
                >
                  {loading ? 'Transmitting...' : <><Save size={20} /> Synchronize Data</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
