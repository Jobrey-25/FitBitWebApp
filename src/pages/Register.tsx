import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Dumbbell, UserPlus, FileCheck } from 'lucide-react';
import { handleFirestoreError, OperationType } from '../lib/error-handler';

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        try {
          await setDoc(userRef, {
            userId: user.uid,
            fullName: user.displayName || 'New Member',
            email: user.email || '',
            role: 'member',
            createdAt: serverTimestamp()
          });
        } catch (err: any) {
          console.error("Firestore error:", err);
          // If we fail here, we still want to try to navigate, but let the user know
          // However, rules might block it.
          handleFirestoreError(err, OperationType.CREATE, `users/${user.uid}`);
        }
      }
      
      // We don't navigate immediately here if App.tsx will do it
      // But we'll do it as a backup
      setTimeout(() => navigate('/dashboard'), 500);
    } catch (err: any) {
      console.error("Signup failed:", err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError("The signup window was closed. Please try again.");
      } else if (err.code === 'auth/cancelled-popup-request') {
        setError("Signup request was cancelled. Please refresh and try again.");
      } else {
        setError(err.message || "Signup failed. Please try again.");
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
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white mb-8 -rotate-3 shadow-xl shadow-indigo-600/30">
            <UserPlus size={36} />
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-3">Join The Pack</h2>
          <p className="text-slate-500 font-medium">Start your elite transformation</p>
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
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full flex items-center justify-center gap-4 px-8 py-5 border-2 border-slate-100 rounded-[2rem] font-bold text-slate-700 hover:border-indigo-600 hover:bg-slate-50 transition-all disabled:opacity-50 group"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-slate-300 border-t-indigo-600 rounded-full animate-spin"></div>
            ) : (
              <>
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span>Sign up with Google</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-6 py-6">
            <div className="flex-grow h-px bg-slate-100"></div>
            <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Digital Enrollment</span>
            <div className="flex-grow h-px bg-slate-100"></div>
          </div>
          
          <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
            <div className="flex items-center gap-3 text-slate-900 font-bold mb-5">
              <div className="p-2 bg-white rounded-xl shadow-sm leading-0">
                <FileCheck size={20} className="text-indigo-600" />
              </div>
              <span>Elite Benefits</span>
            </div>
            <ul className="text-xs text-slate-500 space-y-4 font-medium">
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
                <span>Secure digital profile creation</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
                <span>Premium membership selection</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
                <span>Master trainer appointment access</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-slate-500 font-medium flex items-center justify-center gap-2">
            Member already? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Secure Login</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
