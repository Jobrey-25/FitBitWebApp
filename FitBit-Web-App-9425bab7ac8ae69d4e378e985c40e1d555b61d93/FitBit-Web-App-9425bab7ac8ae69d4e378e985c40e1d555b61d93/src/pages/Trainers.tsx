import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, getDocs, addDoc, onSnapshot, serverTimestamp, doc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Star, 
  User as UserIcon,
  Plus
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { Trainer, Appointment } from '../types';
import { handleFirestoreError, OperationType } from '../lib/error-handler';

export default function Trainers() {
  const { user, isAdmin, profile } = useAuth();
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [bookingTrainer, setBookingTrainer] = useState<Trainer | null>(null);
  const [selectedDate, setSelectedDate] = useState(format(addDays(new Date(), 1), 'yyyy-MM-dd'));
  const [selectedTime, setSelectedTime] = useState('10:00');
  const [loading, setLoading] = useState(true);

  // Admin New Trainer Form
  const [isAddingTrainer, setIsAddingTrainer] = useState(false);
  const [newTrainer, setNewTrainer] = useState({ name: '', specialization: '', bio: '', photoUrl: '' });

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'trainers'), (snap) => {
      setTrainers(snap.docs.map(d => ({ id: d.id, ...d.data() } as Trainer)));
      setLoading(false);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'trainers'));

    return () => unsub();
  }, []);

  const handleBookSession = async () => {
    if (!user || !bookingTrainer) return;

    if (!isAdmin && profile?.role !== 'member') {
      alert("Please ensure you have an active membership to book a session.");
      return;
    }

    try {
      await addDoc(collection(db, 'appointments'), {
        memberId: user.uid,
        trainerId: bookingTrainer.id,
        date: selectedDate,
        time: selectedTime,
        status: 'scheduled'
      });
      alert(`Session booked with ${bookingTrainer.name}!`);
      setBookingTrainer(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'appointments');
    }
  };

  const handleAddTrainer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    try {
      await addDoc(collection(db, 'trainers'), newTrainer);
      setIsAddingTrainer(false);
      setNewTrainer({ name: '', specialization: '', bio: '', photoUrl: '' });
      alert("Trainer added successfully!");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'trainers');
    }
  };

  const handleDeleteTrainer = async (id: string) => {
    if (!isAdmin || !confirm("Erase this master from the archives?")) return;
    try {
      await deleteDoc(doc(db, 'trainers', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `trainers/${id}`);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-24">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
          <div className="max-w-2xl">
            <div className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">
              World Class Coaching
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.9]">ELITE MASTERS</h1>
            <p className="text-slate-500 font-medium text-lg leading-relaxed">Our master trainers are certified professionals dedicated to engineering your physical peak performance.</p>
          </div>
          {isAdmin && (
            <button 
              onClick={() => setIsAddingTrainer(true)}
              className="px-8 py-5 bg-indigo-600 text-white rounded-3xl font-black flex items-center gap-3 hover:bg-indigo-700 hover:scale-105 transition-all shadow-xl shadow-indigo-600/30 uppercase tracking-widest text-xs"
            >
              <Plus size={20} /> Add Master
            </button>
          )}
        </div>

        {isAddingTrainer && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-20 bg-white p-12 rounded-[3.5rem] border border-white shadow-2xl shadow-slate-200/60 max-w-2xl mx-auto"
          >
            <h3 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tight">New Trainer Profile</h3>
            <form onSubmit={handleAddTrainer} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Full Name</label>
                  <input 
                    type="text" placeholder="e.g. Marcus Aurelius" required 
                    value={newTrainer.name} onChange={e => setNewTrainer({...newTrainer, name: e.target.value})}
                    className="p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] w-full focus:ring-2 focus:ring-indigo-600 focus:outline-none transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Specialization</label>
                  <input 
                    type="text" placeholder="e.g. Biomechanics" required 
                    value={newTrainer.specialization} onChange={e => setNewTrainer({...newTrainer, specialization: e.target.value})}
                    className="p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] w-full focus:ring-2 focus:ring-indigo-600 focus:outline-none transition-all font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Photo URL</label>
                <input 
                  type="url" placeholder="https://..." 
                  value={newTrainer.photoUrl} onChange={e => setNewTrainer({...newTrainer, photoUrl: e.target.value})}
                  className="p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] w-full focus:ring-2 focus:ring-indigo-600 focus:outline-none transition-all font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Professional Bio</label>
                <textarea 
                  placeholder="Draft the legacy..." 
                  value={newTrainer.bio} onChange={e => setNewTrainer({...newTrainer, bio: e.target.value})}
                  className="p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] w-full h-40 focus:ring-2 focus:ring-indigo-600 focus:outline-none transition-all font-medium resize-none"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-grow py-5 bg-indigo-600 text-white rounded-3xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 uppercase tracking-widest text-xs">Save Master</button>
                <button type="button" onClick={() => setIsAddingTrainer(false)} className="px-10 py-5 bg-slate-100 text-slate-500 rounded-3xl font-black hover:bg-slate-200 transition-all uppercase tracking-widest text-xs">Cancel</button>
              </div>
            </form>
          </motion.div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {trainers.map((trainer) => (
            <div key={trainer.id} className="bg-white rounded-[3rem] border border-white shadow-xl shadow-slate-200/40 overflow-hidden group hover:shadow-2xl transition-all duration-500">
              <div className="h-80 overflow-hidden bg-slate-200 relative">
                {trainer.photoUrl ? (
                  <img src={trainer.photoUrl} alt={trainer.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <UserIcon size={80} strokeWidth={1} />
                  </div>
                )}
                <div className="absolute top-6 right-6 flex flex-col gap-2 items-end">
                  <div className="bg-white/90 backdrop-blur-xl px-4 py-2 rounded-2xl flex items-center gap-2 text-[10px] font-black text-slate-900 shadow-xl shadow-black/5 uppercase tracking-widest">
                    <Star fill="#6366f1" className="text-indigo-500" size={14} /> 
                    <span>4.9 Mastery Score</span>
                  </div>
                  {isAdmin && (
                    <button 
                      onClick={() => handleDeleteTrainer(trainer.id)}
                      className="p-3 bg-red-500/10 text-red-500 backdrop-blur-md rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-lg"
                      title="Erase Master"
                    >
                      <Plus className="rotate-45" size={18} />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="p-10">
                <div className="mb-6">
                  <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">{trainer.name}</h3>
                  <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                    {trainer.specialization}
                  </div>
                </div>
                <p className="text-slate-500 font-medium text-sm leading-relaxed mb-10 line-clamp-3 italic opacity-80">"{trainer.bio || 'Excellence is not an act, but a habit. Transforming lives daily.'}"</p>
                
                <button 
                  onClick={() => setBookingTrainer(trainer)}
                  className="w-full py-5 bg-slate-950 text-white rounded-3xl font-black hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-slate-950/20 uppercase tracking-[0.2em] text-[10px] group-hover:bg-indigo-600"
                >
                  <Calendar size={18} /> {isAdmin ? 'Schedule Session' : 'Reserve Session'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Booking Modal */}
        {bookingTrainer && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => setBookingTrainer(null)}></div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-white w-full max-w-md rounded-[3.5rem] p-12 relative z-10 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] border border-white"
            >
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mx-auto mb-6">
                  <Calendar size={32} />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-3 tracking-tighter uppercase">Book Session</h3>
                <p className="text-slate-500 font-medium">Engineering excellence with <span className="text-indigo-600 font-bold underline decoration-2 underline-offset-4">{bookingTrainer.name}</span></p>
              </div>
              
              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Phase Selection (Date)</label>
                  <input 
                    type="date" 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:outline-none font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Temporal Slot (Time)</label>
                  <div className="relative">
                    <select 
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:outline-none font-bold text-slate-900 appearance-none pr-10"
                    >
                      <option value="08:00">08:00 AM - MORNING PEAK</option>
                      <option value="09:00">09:00 AM - MORNING FOCUS</option>
                      <option value="10:00">10:00 AM - PRIME FLOW</option>
                      <option value="11:00">11:00 AM - MIDDAY ENERGY</option>
                      <option value="14:00">02:00 PM - AFTERNOON POWER</option>
                      <option value="15:00">03:00 PM - POST-LUNCH BURN</option>
                      <option value="16:00">04:00 PM - EVENING STRENGTH</option>
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <Clock size={20} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <button 
                    onClick={handleBookSession}
                    className="py-5 bg-indigo-600 text-white rounded-3xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/30 uppercase tracking-widest text-[10px]"
                  >
                    Confirm
                  </button>
                  <button 
                    onClick={() => setBookingTrainer(null)}
                    className="py-5 bg-slate-100 text-slate-500 rounded-3xl font-black hover:bg-slate-200 transition-all uppercase tracking-widest text-[10px]"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
