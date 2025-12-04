// =========================
// Firebase Imports & Setup
// =========================
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// Limit concurrent Cloud Function containers
functions.runWith({ maxInstances: 10 });

// Utility: format today (YYYY-MM-DD)
function getTodayId() {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

// ==============================
// 1. Create User Profile Trigger
// ==============================
exports.createUserProfile = functions.auth.user().onCreate(async (user) => {
  const userRef = admin.firestore().collection("users").doc(user.uid);

  await userRef.set({
    email: user.email,
    displayName: user.displayName || "",
    photoURL: user.photoURL || "",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
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

  console.log("User profile created:", user.uid);
});

// =====================================
// 2. logSession — Core Pomodoro Logging
// =====================================
exports.logSession = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "You must be logged in."
    );
  }

  const uid = context.auth.uid;
  const { type, duration, startTime, linkedTaskId } = data;

  if (!type || !duration || !startTime) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Missing required fields."
    );
  }

  if (duration > 3600) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Duration cannot exceed 60 minutes."
    );
  }

  const userRef = admin.firestore().collection("users").doc(uid);
  const todayId = getTodayId();
  const statsRef = userRef.collection("stats").doc(todayId);
  const sessionRef = userRef.collection("sessions").doc();

  const xpGained = Math.floor(duration / 60); // 1 XP per minute

  await admin.firestore().runTransaction(async (tx) => {
    const userSnap = await tx.get(userRef);
    const statsSnap = await tx.get(statsRef);

    // 1. Save session log
    tx.set(sessionRef, {
      type,
      duration,
      startTime,
      endTime: new Date().toISOString(),
      linkedTaskId: linkedTaskId || null,
      status: "completed",
    });

    // 2. Stats update
    const existing = statsSnap.exists ? statsSnap.data() : {};

    tx.set(
      statsRef,
      {
        date: admin.firestore.Timestamp.now(),
        totalFocusTime: (existing.totalFocusTime || 0) + duration,
        sessionsCompleted: (existing.sessionsCompleted || 0) + 1,
      },
      { merge: true }
    );

    // 3. XP & Level logic
    const newXP = (userSnap.data().xp || 0) + xpGained;
    const newLevel = Math.floor(Math.sqrt(newXP / 100)); // basic level system

    tx.update(userRef, { xp: newXP, level: newLevel });

    // 4. Optional: Mark task complete if provided
    if (linkedTaskId) {
      const taskRef = userRef.collection("tasks").doc(linkedTaskId);
      tx.update(taskRef, {
        completed: true,
        completedAt: new Date().toISOString(),
      });
    }
  });

  return { success: true, xpGained };
});

// ======================================
// 3. getDashboardStats — Weekly/Monthly
// ======================================
exports.getDashboardStats = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated");
  }

  const uid = context.auth.uid;
  const range = data.range; // "week" or "month"

  const userRef = admin.firestore().collection("users").doc(uid);

  const today = new Date();
  const days = range === "week" ? 7 : 30;
  const start = new Date(today.getTime() - days * 86400000);

  const statsSnap = await userRef
    .collection("stats")
    .where("date", ">=", start)
    .get();

  const chartData = [];
  let total = 0;

  statsSnap.forEach((doc) => {
    const d = doc.data();
    const date = d.date.toDate();

    chartData.push({
      name: date.toLocaleDateString("en-US", { weekday: "short" }),
      minutes: Math.floor((d.totalFocusTime || 0) / 60),
    });

    total += d.totalFocusTime || 0;
  });

  return {
    chartData,
    totalFocusHours: total / 3600,
  };
});
