import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { db } from "../firebase/firebase";
import { useAuth } from "./AuthContext";
import { doc, updateDoc, addDoc, collection, setDoc, getDoc } from "firebase/firestore";

const TimerContext = createContext();
export const useTimer = () => useContext(TimerContext);

export const TimerProvider = ({ children }) => {
  const { user, profile } = useAuth();

  const [modes, setModes] = useState({
    pomodoro: 1500,
    shortBreak: 300,
    longBreak: 900,
  });

  const [timeLeft, setTimeLeft] = useState(1500);
  const [duration, setDuration] = useState(1500);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState("pomodoro");
  const [activeTaskId, setActiveTaskId] = useState(null);
  const timerRef = useRef(null);

  // Load user modes from Firestore
  useEffect(() => {
    if (profile?.settings?.timerModes) {
      setModes(profile.settings.timerModes);
      setTimeLeft(profile.settings.timerModes.pomodoro);
      setDuration(profile.settings.timerModes.pomodoro);
    }
  }, [profile]);

  // Timer Tick
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      finishSession();
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft]);

  // Log completed session to Firestore
  const finishSession = async () => {
    setIsActive(false);

    // Store session in Firestore
    await addDoc(collection(db, "users", user.uid, "sessions"), {
      type: mode,
      duration,
      startTime: new Date(Date.now() - duration * 1000),
      endTime: new Date(),
      linkedTaskId: activeTaskId || null,
      status: "completed",
    });

    // Update XP + Level
    const xpGained = Math.floor(duration / 60);
    const newXP = (profile.xp || 0) + xpGained;
    const newLevel = Math.floor(Math.sqrt(newXP / 100)) + 1;

    await updateDoc(doc(db, "users", user.uid), {
      xp: newXP,
      level: newLevel,
    });

    setActiveTaskId(null);
  };

  const startTask = (durationInSec, taskId) => {
    setDuration(durationInSec);
    setTimeLeft(durationInSec);
    setActiveTaskId(taskId);
    setMode("pomodoro");
    setIsActive(true);
  };

  const startTimer = () => setIsActive(true);
  const pauseTimer = () => setIsActive(false);

  const switchMode = (newMode) => {
    setMode(newMode);
    setActiveTaskId(null);
    setDuration(modes[newMode]);
    setTimeLeft(modes[newMode]);
    setIsActive(false);
  };

  // Save updated modes (Pomodoro lengths)
  const updateModes = async (newModes) => {
    setModes(newModes);

    await updateDoc(doc(db, "users", user.uid), {
      settings: {
        timerModes: newModes,
      },
    });
  };

  const progress = ((duration - timeLeft) / duration) * 100;

  return (
    <TimerContext.Provider
      value={{
        timeLeft,
        isActive,
        mode,
        modes,
        updateModes,
        startTimer,
        pauseTimer,
        switchMode,
        startTask,
        activeTaskId,
        duration,
        progress,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};
