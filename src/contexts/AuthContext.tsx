import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserProfile } from '../types';
import { handleFirestoreError, OperationType } from '../lib/error-handler';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, profile: null, loading: true, isAdmin: false });

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (authUser) => {
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }

      setUser(authUser);
      
      if (authUser) {
        // Use onSnapshot for real-time profile updates (e.g. after registration)
        const profileRef = doc(db, 'users', authUser.uid);
        unsubscribeProfile = onSnapshot(profileRef, async (docSnap) => {
          let isAdminRole = false;
          if (docSnap.exists()) {
            const data = docSnap.data() as UserProfile;
            setProfile(data);
            isAdminRole = data.role === 'admin';
          }
          
          // Check email and admins collection
          const isEmailAdmin = authUser.email === 'nalamatlhakwana@gmail.com';
          let isCollectionAdmin = false;
          try {
            const adminDoc = await getDoc(doc(db, 'admins', authUser.uid));
            isCollectionAdmin = adminDoc.exists();
          } catch (e) {}

          setIsAdmin(isAdminRole || isEmailAdmin || isCollectionAdmin);
          setLoading(false);
        }, (error) => {
          handleFirestoreError(error, OperationType.GET, `users/${authUser.uid}`);
          if (authUser.email === 'nalamatlhakwana@gmail.com') {
            setIsAdmin(true);
          }
          setLoading(false);
        });
      } else {
        setProfile(null);
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}
