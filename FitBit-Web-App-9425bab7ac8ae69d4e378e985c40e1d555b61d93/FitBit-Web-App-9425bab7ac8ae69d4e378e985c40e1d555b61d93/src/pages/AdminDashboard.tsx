import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, getDocs, updateDoc, doc, deleteDoc, onSnapshot, serverTimestamp, getDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  CreditCard, 
  Clock, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  UserCheck,
  LayoutDashboard,
  Calendar,
  MessageSquare,
  Mail,
  ShieldAlert,
  Lock,
  User,
  ArrowRight
} from 'lucide-react';
import { format, addMonths, addYears } from 'date-fns';
import { Membership, UserProfile, ContactMessage, PaymentRecord } from '../types';
import { handleFirestoreError, OperationType } from '../lib/error-handler';
import { cn } from '../lib/utils';

import { useAuth } from '../contexts/AuthContext';

export default function AdminDashboard() {
  const { isAdmin } = useAuth();
  const [isVerified, setIsVerified] = useState(false);
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [error, setError] = useState('');
  
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Real-time listeners for admin
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      setUsers(snap.docs.map(d => ({ ...d.data() } as UserProfile)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'users'));

    const unsubMemberships = onSnapshot(collection(db, 'memberships'), (snap) => {
      setMemberships(snap.docs.map(d => ({ id: d.id, ...d.data() } as Membership)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'memberships'));

    const unsubMessages = onSnapshot(collection(db, 'contact_messages'), (snap) => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() } as ContactMessage)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'contact_messages'));

    setLoading(false);
    return () => {
      unsubUsers();
      unsubMemberships();
      unsubMessages();
    };
  }, []);

  const handleApprove = async (mId: string, planType: string) => {
    try {
      const now = new Date();
      let endDate = addMonths(now, 1);
      if (planType === 'quarterly') endDate = addMonths(now, 3);
      if (planType === 'annual') endDate = addYears(now, 1);

      await updateDoc(doc(db, 'memberships', mId), {
        status: 'active',
        startDate: serverTimestamp(),
        endDate: endDate,
        updatedAt: serverTimestamp()
      });
      alert("Membership approved and activated!");
    } catch (error) {
       handleFirestoreError(error, OperationType.UPDATE, `memberships/${mId}`);
    }
  };

  const handleDecline = async (mId: string) => {
    if (!confirm("Decline this membership application? This will permanently remove the request.")) return;
    try {
      await deleteDoc(doc(db, 'memberships', mId));
      alert("Membership application declined and removed.");
    } catch (error) {
       handleFirestoreError(error, OperationType.DELETE, `memberships/${mId}`);
    }
  };

  const handleDeleteMember = async (userId: string) => {
    if (!confirm("CRITICAL: This will permanently erase this user and their membership. Continue?")) return;
    try {
      // Delete both membership and user profile
      await deleteDoc(doc(db, 'memberships', userId));
      await deleteDoc(doc(db, 'users', userId));
      alert("Member erased from system.");
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `users/${userId}`);
    }
  };

  const handleDeleteMessage = async (msgId: string) => {
     try {
      await deleteDoc(doc(db, 'contact_messages', msgId));
    } catch (error) {
       handleFirestoreError(error, OperationType.DELETE, `contact_messages/${msgId}`);
    }
  };

  const handleLogMessageRead = async (id: string) => {
    if (!confirm("Remove this message?")) return;
    try {
      await deleteDoc(doc(db, 'contact_messages', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `contact_messages/${id}`);
    }
  };

  const handleAdminVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const validUser = (import.meta as any).env.VITE_ADMIN_USERNAME || 'admin';
    const validPass = (import.meta as any).env.VITE_ADMIN_PASSWORD || 'admin123';
    
    if (adminUser === validUser && adminPass === validPass) {
      setIsVerified(true);
      setError('');
    } else {
      setError('Administrative Access Denied: Incorrect Credentials');
    }
  };

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px]" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px]" />

            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center mb-10 shadow-2xl shadow-indigo-500/30 -rotate-3">
                <ShieldAlert className="text-white" size={32} />
              </div>
              
              <h1 className="text-3xl font-black text-white mb-2 tracking-tighter uppercase">Gateway Alpha</h1>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-10">Restricted Command Center</p>
              
              <form onSubmit={handleAdminVerify} className="space-y-4">
                <div className="group relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
                  <input
                    type="text"
                    placeholder="Admin Identity"
                    value={adminUser}
                    onChange={(e) => setAdminUser(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4.5 pl-14 pr-5 text-white placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold tracking-tight"
                    required
                  />
                </div>

                <div className="group relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
                  <input
                    type="password"
                    placeholder="Security Passcode"
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4.5 pl-14 pr-5 text-white placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-mono"
                    required
                  />
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-[10px] font-black uppercase tracking-widest text-center"
                  >
                    {error}
                  </motion.div>
                )}
                
                <button
                  type="submit"
                  className="w-full bg-white text-slate-950 py-4.5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-blue-600 hover:text-white transition-all shadow-xl active:scale-[0.98] group mt-8"
                >
                  Confirm Entry
                  <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </form>

              <div className="mt-10 text-center">
                <p className="text-slate-600 text-[8px] font-black uppercase tracking-[0.4em]">
                  Encrypted System Access Layer
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const filteredMemberships = memberships.filter(m => {
    const userProfile = users.find(u => u.userId === m.userId);
    return userProfile?.fullName.toLowerCase().includes(search.toLowerCase()) || 
           userProfile?.email.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="bg-slate-50 min-h-screen py-24">
      <div className="container mx-auto px-6">
        {/* Header & Stats */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-20">
          <div>
            <div className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">
              Administrative Command
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter flex items-center gap-4 leading-none">
              <div className="w-16 h-16 bg-slate-950 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-slate-950/20">
                <LayoutDashboard size={28} />
              </div>
              ADMIN CONTROL CENTER
            </h1>
            <p className="text-slate-500 mt-4 font-medium max-w-xl">Manage the elite ecosystem, optimize operational performance, and scale the digital community.</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {[
            { label: 'Total Users', value: users.length, icon: <Users size={20} className="text-indigo-600" />, color: 'bg-indigo-50/50' },
            { label: 'Pending Approvals', value: memberships.filter(m => m.status === 'pending').length, icon: <Clock size={20} className="text-amber-600" />, color: 'bg-amber-50/50' },
            { label: 'Active Members', value: memberships.filter(m => m.status === 'active').length, icon: <CheckCircle2 size={20} className="text-emerald-600" />, color: 'bg-emerald-50/50' },
            { label: 'Unread Messages', value: messages.length, icon: <MessageSquare size={20} className="text-indigo-600" />, color: 'bg-indigo-50/50' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-[3rem] border border-white shadow-xl shadow-slate-200/40 hover:shadow-2xl transition-all group">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border border-white shadow-sm transition-transform group-hover:scale-110", stat.color)}>
                {stat.icon}
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
              <p className="text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid xl:grid-cols-3 gap-12">
          {/* Memberships Management */}
          <div className="xl:col-span-2 space-y-12">
            <div className="bg-white rounded-[3.5rem] border border-white shadow-2xl shadow-slate-200/40 overflow-hidden">
              <div className="p-10 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Applications</h3>
                </div>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Identify member..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 w-full sm:w-80 transition-all placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-50">
                    <tr>
                      <th className="px-10 py-6">Member Identity</th>
                      <th className="px-10 py-6">Tier Selection</th>
                      <th className="px-10 py-6">Status Portal</th>
                      <th className="px-10 py-6 text-right">Operations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    <AnimatePresence mode="popLayout">
                      {filteredMemberships.map((m) => {
                        const userProfile = users.find(u => u.userId === m.userId);
                        return (
                          <motion.tr 
                            key={m.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="hover:bg-slate-50/40 transition-colors group"
                          >
                            <td className="px-10 py-6">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-[1.25rem] bg-indigo-100 border-2 border-white shadow-sm flex items-center justify-center text-indigo-700 font-black text-lg overflow-hidden shrink-0">
                                  {userProfile?.profilePicture ? (
                                    <img src={userProfile.profilePicture} className="w-full h-full object-cover" />
                                  ) : (
                                    userProfile?.fullName.charAt(0)
                                  )}
                                </div>
                                <div>
                                  <p className="text-sm font-black text-slate-900 leading-tight mb-0.5">{userProfile?.fullName || 'Anonymous'}</p>
                                  <p className="text-[10px] text-slate-400 font-bold tracking-tight">{userProfile?.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-10 py-6">
                              <div className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest leading-none">
                                {m.planType}
                              </div>
                            </td>
                            <td className="px-10 py-6">
                              <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] inline-flex items-center gap-2 border ${
                                m.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                m.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-slate-100 text-slate-600 border-slate-200'
                              }`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${
                                  m.status === 'active' ? 'bg-emerald-500' :
                                  m.status === 'pending' ? 'bg-amber-500' : 'bg-slate-400'
                                }`}></div>
                                {m.status}
                              </span>
                            </td>
                            <td className="px-10 py-6 text-right">
                              <div className="flex justify-end gap-2">
                                {m.status === 'pending' && (
                                  <>
                                    <button 
                                      onClick={() => handleApprove(m.id!, m.planType)}
                                      className="p-3 bg-white text-emerald-600 border border-emerald-100 rounded-xl hover:bg-emerald-600 hover:text-white hover:shadow-lg hover:shadow-emerald-600/20 transition-all"
                                      title="Grant Access"
                                    >
                                      <CheckCircle2 size={18} />
                                    </button>
                                    <button 
                                      onClick={() => handleDecline(m.id!)}
                                      className="p-3 bg-white text-red-400 border border-red-50 rounded-xl hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-500/20 transition-all"
                                      title="Deny Access"
                                    >
                                      <XCircle size={18} />
                                    </button>
                                  </>
                                )}
                                <button 
                                  onClick={() => handleDeleteMember(m.userId)}
                                  className="p-3 bg-white text-slate-300 border border-slate-100 rounded-xl hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-500/20 transition-all opacity-0 group-hover:opacity-100"
                                  title="Erase Member"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>
                {filteredMemberships.length === 0 && (
                  <div className="p-24 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Search size={32} className="text-slate-200" />
                    </div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No matches detected in system</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Messages Column */}
          <div className="space-y-12">
            <div className="bg-white rounded-[3.5rem] border border-white shadow-2xl shadow-slate-200/40 p-10">
              <div className="flex items-center justify-between mb-10 px-2">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Concierge Inbox</h3>
                <div className="px-3 py-1 bg-indigo-600 text-white rounded-full text-[10px] font-black">
                  {messages.length}
                </div>
              </div>
              <div className="space-y-6">
                <AnimatePresence mode="popLayout">
                  {messages.length > 0 ? messages.map((msg) => (
                    <motion.div 
                      key={msg.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="p-8 bg-slate-50 rounded-[2.5rem] border border-white group relative shadow-sm hover:shadow-xl hover:bg-white transition-all duration-500"
                    >
                      <button 
                        onClick={() => handleLogMessageRead(msg.id!)}
                        className="absolute top-6 right-6 text-slate-300 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-xl"
                      >
                        <Trash2 size={16} />
                      </button>
                      <div className="mb-6">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
                          <span className="text-xs font-black text-slate-900 uppercase tracking-widest">{msg.name}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-bold inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-100 rounded-lg">
                          <Mail size={12} className="text-indigo-600" /> {msg.email}
                        </div>
                      </div>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">"{msg.message}"</p>
                      <div className="pt-6 border-t border-slate-100 flex items-center gap-2 text-[9px] font-black text-slate-300 uppercase tracking-widest">
                        <Calendar size={12} />
                        {msg.createdAt && typeof msg.createdAt.toDate === 'function' ? format(msg.createdAt.toDate(), 'PPP p') : 'Pending Transmission...'}
                      </div>
                    </motion.div>
                  )) : (
                    <div className="text-center py-20">
                      <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-white shadow-inner">
                        <MessageSquare size={40} className="text-slate-100" />
                      </div>
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Secure Inbox is Clear</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
