import { db } from "./firebase";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  setDoc,
} from "firebase/firestore";

const getTodayId = () =>
  new Date().toISOString().split("T")[0];

export const logSession = async (uid, { type, duration, startTime, taskId }) => {

  // 1. Save timer session
  await addDoc(collection(db, "users", uid, "sessions"), {
    type,
    duration,
    startTime,
    endTime: new Date(),
    linkedTaskId: taskId || null,
    status: "completed",
  });

  // 2. Update today's stats
  const today = getTodayId();
  const statsRef = doc(db, "users", uid, "stats", today);
  const statsSnap = await getDoc(statsRef);

  if (!statsSnap.exists()) {
    await setDoc(statsRef, {
      date: new Date(),
      totalFocusTime: duration,
      sessionsCompleted: 1,
      tasksCompleted: 0,
    });
  } else {
    const data = statsSnap.data();
    await updateDoc(statsRef, {
      totalFocusTime: data.totalFocusTime + duration,
      sessionsCompleted: data.sessionsCompleted + 1,
    });
  }
};
export const updateXP = async (uid, duration) => {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);

  const xpGain = Math.floor(duration / 60);
  const currentXP = snap.data().xp || 0;
  const newXP = currentXP + xpGain;

  const newLevel = Math.floor(Math.sqrt(newXP / 100));

  await updateDoc(userRef, { xp: newXP, level: newLevel });
};
