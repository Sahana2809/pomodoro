import React, { createContext, useState, useContext, useEffect } from "react";
import { auth, db } from "../firebase/firebase";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import { doc, setDoc, getDoc } from "firebase/firestore";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // Firebase Auth user
  const [profile, setProfile] = useState(null); // Firestore user document
  const [loading, setLoading] = useState(true); // Page loading state

  // ---------------------------------------------------
  // Create Firestore user profile on first signup
  // ---------------------------------------------------
  const createUserProfile = async (firebaseUser) => {
    try {
      const userRef = doc(db, "users", firebaseUser.uid);

      await setDoc(userRef, {
        email: firebaseUser.email,
        createdAt: new Date(),
        settings: {
          timerModes: {
            pomodoro: 1500,
            shortBreak: 300,
            longBreak: 900,
          },
        },
        xp: 0,
        level: 1,
      });

      console.log("User profile created for:", firebaseUser.uid);
    } catch (error) {
      console.error("Error creating profile:", error.message);
    }
  };

  // ---------------------------------------------------
  // SIGNUP
  // ---------------------------------------------------
  const signup = async (email, password) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await createUserProfile(result.user);
      return result.user;
    } catch (error) {
      console.error("Signup error:", error.message);
      throw error;
    }
  };

  // ---------------------------------------------------
  // LOGIN
  // ---------------------------------------------------
  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      console.error("Login error:", error.message);
      throw error;
    }
  };

  // ---------------------------------------------------
  // LOGOUT
  // ---------------------------------------------------
  const logout = async () => {
    await signOut(auth);
  };

  // ---------------------------------------------------
  // AUTH STATE LISTENER
  // Prevents infinite loading and loads Firestore profile
  // ---------------------------------------------------
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("Auth state changed:", firebaseUser);

      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          const docRef = doc(db, "users", firebaseUser.uid);
          const snapshot = await getDoc(docRef);

          if (snapshot.exists()) {
            setProfile(snapshot.data());
          } else {
            console.log("No profile found → Creating one");
            await createUserProfile(firebaseUser);
            const newSnapshot = await getDoc(docRef);
            setProfile(newSnapshot.data());
          }
        } catch (error) {
          console.error("Error loading profile:", error.message);
        }
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // ---------------------------------------------------
  // PROVIDER VALUE
  // ---------------------------------------------------
  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        signup,
        login,
        logout,
        loading,
      }}
    >
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl animate-pulse text-pastel-pink">
            Loading...
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
