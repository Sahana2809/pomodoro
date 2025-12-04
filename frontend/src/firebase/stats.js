import { db } from "./firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export const getStats = async (uid, range) => {
  const today = new Date();
  const days = range === "week" ? 7 : 30;
  const start = new Date(today.getTime() - days * 86400000);

  const q = query(
    collection(db, "users", uid, "stats"),
    where("date", ">=", start)
  );

  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

