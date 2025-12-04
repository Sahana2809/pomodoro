import React, { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebase/firebase";

import { useAuth } from "./AuthContext";
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

const TaskContext = createContext();
export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);

  // Listen to Firestore Tasks
  useEffect(() => {
    if (!user) {
      setTasks([]);
      return;
    }

    const q = query(
      collection(db, "users", user.uid, "tasks"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const t = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(t);
    });

    return () => unsub();
  }, [user]);

  // Add task
  const addTask = async (title, duration) => {
    await addDoc(collection(db, "users", user.uid, "tasks"), {
      title,
      duration,
      completed: false,
      createdAt: new Date(),
    });
  };

  // Toggle task completion
  const toggleTask = async (id) => {
    const ref = doc(db, "users", user.uid, "tasks", id);
    const task = tasks.find((t) => t.id === id);
    await updateDoc(ref, {
      completed: !task.completed,
      completedAt: task.completed ? null : new Date(),
    });
  };

  // Delete task
  const deleteTask = async (id) => {
    const ref = doc(db, "users", user.uid, "tasks", id);
    await deleteDoc(ref);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        toggleTask,
        deleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
