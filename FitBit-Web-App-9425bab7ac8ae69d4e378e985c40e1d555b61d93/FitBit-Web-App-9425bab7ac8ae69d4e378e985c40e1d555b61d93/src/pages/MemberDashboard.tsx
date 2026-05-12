import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { 
  CreditCard, 
  Calendar, 
  User as UserIcon, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Dumbbell
} from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Membership, PaymentRecord, Appointment } from '../types';
import { handleFirestoreError, OperationType } from '../lib/error-handler';

export default function MemberDashboard() {
  const { user, profile } = useAuth();
  const [membership, setMembership] = useState<Membership | null>(null);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Real-time membership listener
    const memQuery = query(collection(db, 'memberships'), where('userId', '==', user.uid));
    const unsubMem = onSnapshot(memQuery, (snapshot) => {
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        setMembership({ id: doc.id, ...doc.data() } as Membership);
      }
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'memberships'));

    // Payments
    const payQuery = query(collection(db, 'payments'), where('userId', '==', user.uid), orderBy('paymentDate', 'desc'));
    const unsubPay = onSnapshot(payQuery, (snapshot) => {
      setPayments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PaymentRecord)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'payments'));

    // Appointments
    const apptQuery = query(collection(db, 'appointments'), where('memberId', '==', user.uid), orderBy('date', 'asc'));
    const unsubAppt = onSnapshot(apptQuery, (snapshot) => {
      setAppointments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'appointments'));

    setLoading(false);
    return () => {
      unsubMem();
      unsubPay();
      unsubAppt();
    };
  }, [user]);

  if (loading) return <div className="p-10 text-center">Loading your dashboard...</div>;

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-sm font-black text-indigo-600 uppercase tracking-[0.2em] mb-2">Member Portal</h1>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">PROGRESS TRACKER</h2>
            <p className="text-slate-400 mt-1 font-medium">Monitoring your evolution, {profile?.fullName ? profile.fullName.split(' ')[0] : 'Athlete'}.</p>
          </div>
          <div className="flex gap-4">
            <Link to="/profile" className="px-6 py-3.5 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 hover:border-indigo-600 transition-all flex items-center gap-2 shadow-sm">
              <UserIcon size={18} className="text-indigo-600" /> Edit Profile
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Membership Status Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-black text-slate-900 tracking-tighter">MEMBERSHIP</h3>
                {membership ? (
                  <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                    membership.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                    membership.status === 'pending' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                  }`}>
                    {membership.status}
                  </span>
                ) : (
                  <span className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-red-50 text-red-500 border border-red-100">
                    Inactive
                  </span>
                )}
              </div>

              {membership ? (
                <div className="grid sm:grid-cols-2 gap-10">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Plan</p>
                    <p className="text-3xl font-black text-slate-900 capitalize">{membership.planType}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Renewal Date</p>
                    <p className="text-xl font-bold text-slate-700">
                      {membership.endDate && typeof membership.endDate.toDate === 'function' ? format(membership.endDate.toDate(), 'PPP') : 'Validation Required'}
                    </p>
                  </div>
                  {membership.status === 'pending' && (
                    <div className="col-span-full bg-indigo-50/50 p-6 rounded-[1.5rem] border border-indigo-100/50 flex gap-4 text-indigo-900 text-sm font-medium leading-relaxed">
                      <AlertCircle size={20} className="shrink-0 text-indigo-600" />
                      Our managers are validating your payment. Full portal features will unlock once approved.
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-400 mb-8 font-medium">Unlock your potential by choosing a membership tier.</p>
                  <Link to="/plans" className="px-10 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black hover:bg-indigo-700 transition-all inline-flex items-center gap-3 shadow-xl shadow-indigo-600/20">
                    Explore Plans <ChevronRight size={20} />
                  </Link>
                </div>
              )}
            </motion.div>

            {/* Payment History */}
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-black text-slate-900 tracking-tighter">FINANCIAL LOGS</h3>
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 border border-slate-100">
                  <CreditCard size={20} />
                </div>
              </div>

              <div className="space-y-5">
                {payments.length > 0 ? payments.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl border border-slate-100 hover:bg-white transition-all hover:shadow-lg hover:shadow-slate-200/50 group">
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                        <CheckCircle2 size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{p.planType} Subscription</p>
                        <p className="text-xs text-slate-400 font-bold">
                          {p.paymentDate && typeof p.paymentDate.toDate === 'function' ? format(p.paymentDate.toDate(), 'PPP') : 'Processing...'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-slate-900">R{p.amount}</p>
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Transaction Verified</p>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-12 text-slate-300">
                    <CreditCard size={48} className="mx-auto mb-4 opacity-10" />
                    <p className="text-sm font-bold">No transactions logged</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            {/* Appointments */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-slate-900">Training sessions</h3>
                <Calendar size={20} className="text-slate-300" />
              </div>
              
              <div className="space-y-4 mb-8">
                {appointments.length > 0 ? appointments.map((a) => (
                  <div key={a.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-black text-blue-600 uppercase tracking-widest">Personal Training</span>
                      <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded-full border border-slate-100 capitalize">{a.status}</span>
                    </div>
                    <p className="font-bold text-slate-900">{format(new Date(a.date), 'PPP')}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <Clock size={14} />
                      <span>{a.time}</span>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-slate-500 italic">No upcoming sessions.</p>
                )}
              </div>

              <Link to="/trainers" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-center hover:bg-slate-800 transition-all block">
                Book a Trainer
              </Link>
            </div>

            {/* Quick Actions / Tips */}
            <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white">
              <h4 className="font-bold mb-4">Athlete Pro-Tip</h4>
              <p className="text-sm text-blue-100 leading-relaxed mb-6">
                Consistency is key. Schedule your sessions at least 24 hours in advance to secure your favorite slots.
              </p>
              <Link to="/contact" className="text-sm font-bold text-white border-b-2 border-white/30 hover:border-white transition-all">
                Need help? Contact gym support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
