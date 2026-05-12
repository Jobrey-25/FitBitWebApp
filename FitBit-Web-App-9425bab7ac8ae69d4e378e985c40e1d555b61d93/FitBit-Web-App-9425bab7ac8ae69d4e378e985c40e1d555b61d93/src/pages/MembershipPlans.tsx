import React from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, setDoc, doc, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { Membership } from '../types';
import { motion } from 'motion/react';
import { Check, Zap, Rocket, Crown } from 'lucide-react';
import { cn } from '../lib/utils';
import { handleFirestoreError, OperationType } from '../lib/error-handler';

const plans = [
  {
    type: 'monthly',
    name: 'Flex',
    price: 'R499',
    period: '/mo',
    icon: <Zap className="text-indigo-500" />,
    features: ['24/7 Global Access', 'Digital Locker Entry', 'Biopsy Standard Testing', 'Basics App Hub'],
    popular: false,
    color: 'border-slate-200'
  },
  {
    type: 'quarterly',
    name: 'Performance',
    price: 'R1,299',
    period: '/3mo',
    icon: <Rocket className="text-indigo-600" />,
    features: ['All Flex Features', '1-on-1 Strategy Session', 'Towel Service', 'Sauna & Recovery Access', 'Guest Access (2/mo)'],
    popular: true,
    color: 'border-indigo-600'
  },
  {
    type: 'annual',
    name: 'Platinum',
    price: 'R4,499',
    period: '/yr',
    icon: <Crown className="text-slate-900" />,
    features: ['All Performance Features', 'Unlimited PT Bookings', 'Private Dedicated Locker', 'Supplement Bundle (Monthly)', 'Priority Physiotherapy'],
    popular: false,
    color: 'border-slate-200'
  }
];

export default function MembershipPlans() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentMembership, setCurrentMembership] = React.useState<Membership | null>(null);
  const [loadingMember, setLoadingMember] = React.useState(true);

  React.useEffect(() => {
    if (!user) {
      setLoadingMember(false);
      return;
    }

    const unsub = onSnapshot(doc(db, 'memberships', user.uid), (docSnap) => {
      if (docSnap.exists()) {
        setCurrentMembership({ id: docSnap.id, ...docSnap.data() } as Membership);
      } else {
        setCurrentMembership(null);
      }
      setLoadingMember(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `memberships/${user.uid}`);
      setLoadingMember(false);
    });

    return () => unsub();
  }, [user]);

  const handleSelectPlan = async (planType: string, amount: number) => {
    if (!user) return navigate('/login');

    if (currentMembership && (currentMembership.status === 'active' || currentMembership.status === 'pending')) {
      alert(`You already have a ${currentMembership.planType} plan. Please contact support or the gym manager to change your plan.`);
      return;
    }

    try {
      // Use user.uid as the document ID to ensure exactly one membership per user
      const membershipRef = doc(db, 'memberships', user.uid);
      await setDoc(membershipRef, {
        userId: user.uid,
        planType,
        status: 'pending',
        updatedAt: serverTimestamp()
      }, { merge: true });

      const paymentRef = collection(db, 'payments');
      await addDoc(paymentRef, {
        userId: user.uid,
        amount,
        planType,
        paymentDate: serverTimestamp(),
        status: 'completed'
      });

      alert("Plan selected! Awaiting admin activation.");
      navigate('/dashboard');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'memberships/payments');
    }
  };

  if (loadingMember) {
    return <div className="py-24 bg-slate-50 min-h-screen text-center font-black text-slate-400">LOADING TIER DATA...</div>;
  }

  return (
    <div className="py-24 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="text-center mb-24">
          <h2 className="text-sm font-black text-indigo-600 uppercase tracking-[0.2em] mb-4">Membership</h2>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight">TRANSPARENT TIERING.</h1>
          <p className="text-slate-500 max-w-xl mx-auto font-medium text-lg leading-relaxed">
            {currentMembership 
              ? `You are currently on the ${currentMembership.planType} tier (${currentMembership.status}).` 
              : "No hidden fees. No activation charges. Just results."}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, i) => {
            const isCurrent = currentMembership?.planType === plan.type;
            const hasOtherPlan = currentMembership && (currentMembership.status === 'active' || currentMembership.status === 'pending') && !isCurrent;

            return (
              <motion.div 
                key={plan.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "bg-white rounded-[3rem] p-12 border-2 shadow-sm flex flex-col relative overflow-hidden group hover:shadow-2xl hover:shadow-slate-200 transition-all",
                  plan.color,
                  plan.popular && !hasOtherPlan && "shadow-xl shadow-indigo-600/5 scale-105 z-10",
                  isCurrent && "border-emerald-500 bg-emerald-50/10 shadow-lg shadow-emerald-500/5"
                )}
              >
                {isCurrent && (
                  <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-black px-6 py-2 rounded-bl-2xl uppercase tracking-widest shadow-lg">
                    Current Plan
                  </div>
                )}
                {plan.popular && !isCurrent && (
                  <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-black px-6 py-2 rounded-bl-2xl uppercase tracking-widest shadow-lg">
                    Recommended
                  </div>
                )}
                
                <div className="mb-12">
                  <div className="w-16 h-16 bg-slate-50 rounded-[1.25rem] flex items-center justify-center mb-8 border border-slate-100 group-hover:scale-110 transition-transform">
                    {React.cloneElement(plan.icon as React.ReactElement, { size: 32 })}
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-slate-900 tracking-tighter">{plan.price}</span>
                    <span className="text-slate-400 font-bold text-sm tracking-wide">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-5 mb-14 flex-grow">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-4 text-slate-500 text-sm font-bold">
                      <div className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                        <Check size={12} className="text-indigo-600" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => handleSelectPlan(plan.type, parseInt(plan.price.replace(/[^\d]/g, '')))}
                  disabled={!!currentMembership && (currentMembership.status === 'active' || currentMembership.status === 'pending')}
                  className={cn(
                    "w-full py-5 rounded-[1.25rem] font-black tracking-widest uppercase text-xs transition-all flex items-center justify-center gap-2",
                    isCurrent 
                      ? "bg-emerald-500 text-white cursor-default"
                      : hasOtherPlan
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : plan.popular 
                          ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-600/20" 
                          : "bg-slate-900 text-white hover:bg-slate-800"
                  )}
                >
                  {isCurrent ? 'Your Plan' : hasOtherPlan ? 'Plan Restricted' : 'Join Now'}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
