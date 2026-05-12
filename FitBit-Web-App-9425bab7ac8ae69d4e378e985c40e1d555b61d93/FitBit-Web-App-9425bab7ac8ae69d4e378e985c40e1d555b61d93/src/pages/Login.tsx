import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Dumbbell, ShieldCheck, Mail, ArrowRight } from 'lucide-react';
import { handleFirestoreError, OperationType } from '../lib/error-handler';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists in our Firestore
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        try {
          // Initial profile for direct Google auth
          await setDoc(userRef, {
            userId: user.uid,
            fullName: user.displayName || 'Gym Member',
            email: user.email || '',
            role: 'member',
            createdAt: serverTimestamp()
          });
        } catch (err: any) {
          console.error("Firestore error:", err);
          handleFirestoreError(err, OperationType.CREATE, `users/${user.uid}`);
        }
      }
      
      setTimeout(() => navigate('/dashboard'), 500);
    } catch (err: any) {
      console.error("Login failed:", err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError("The login window was closed. Please try again.");
      } else if (err.code === 'auth/cancelled-popup-request') {
        setError("Login request was cancelled. Please refresh and try again.");
      } else {
        setError(err.message || "Login failed. Please verify your connection and try again.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-slate-50 px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white p-10 md:p-14 rounded-[3.5rem] shadow-2xl shadow-slate-200/60 border border-white"
      >
        <div className="flex flex-col items-center text-center mb-12">
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white mb-8 rotate-3 shadow-xl shadow-indigo-600/30">
            <Dumbbell size={36} />
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-3">Welcome Back</h2>
          <p className="text-slate-500 font-medium">Access your elite performance portal</p>
        </div>

        <div className="space-y-5">
          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-[10px] font-black uppercase tracking-widest text-center"
            >
              {error}
            </motion.div>
          )}
          <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-4 px-8 py-5 border-2 border-slate-100 rounded-[2rem] font-bold text-slate-700 hover:border-indigo-600 hover:bg-slate-50 transition-all disabled:opacity-50 group"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-slate-300 border-t-indigo-600 rounded-full animate-spin"></div>
            ) : (
              <>
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span>Continue with Google</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-6 py-6">
            <div className="flex-grow h-px bg-slate-100"></div>
            <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Secure Entry</span>
            <div className="flex-grow h-px bg-slate-100"></div>
          </div>
          
          <div className="bg-indigo-50/50 p-8 rounded-[2.5rem] border border-indigo-100/50 flex gap-5 items-start">
            <div className="p-3 bg-white rounded-2xl shadow-sm">
              <ShieldCheck className="text-indigo-600" size={24} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Encrypted Access</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">Biometric and digital security ensures your private health data remains confidential.</p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-slate-500 font-medium flex items-center justify-center gap-2">
            New here? <Link to="/register" className="text-indigo-600 font-bold hover:underline">Create Account</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
