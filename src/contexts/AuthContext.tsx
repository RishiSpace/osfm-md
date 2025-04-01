import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider, database } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const saveUserToDatabase = async (user: any) => {
    const userRef = ref(database, `users/${user.uid}`);
    const snapshot = await get(userRef);
    
    if (!snapshot.exists()) {
      await set(userRef, {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        lastLogin: Date.now()
      });
    } else {
      await set(userRef, {
        ...(snapshot.val()),
        lastLogin: Date.now()
      });
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await saveUserToDatabase(result.user);
      return result;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await saveUserToDatabase(user);
      }
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    loading,
    signInWithGoogle: handleSignInWithGoogle,
    signOut: () => signOut(auth)
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};