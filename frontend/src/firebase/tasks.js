import { db } from "./firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";

export const addTask = async (uid, title, duration, tag) => {
  await addDoc(collection(db, "users", uid, "tasks"), {
    title,
    duration,
    tag,
    completed: false,
    createdAt: new Date(),
  });
};

export const toggleTask = async (uid, taskId, currentValue) => {
  await updateDoc(doc(db, "users", uid, "tasks", taskId), {
    completed: !currentValue,
    completedAt: !currentValue ? new Date() : null,
  });
};

export const deleteTask = async (uid, taskId) => {
  await deleteDoc(doc(db, "users", uid, "tasks", taskId));
};

export const getTasks = async (uid) => {
  const snap = await getDocs(collection(db, "users", uid, "tasks"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};
