// src/Utils/Helpers/Hooks/useTransaksi.js
import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../firebase/firebase";

export const useTransaksi = () => {
  const [transaksi, setTransaksi] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTransaksi = async () => {
    setLoading(true);
    const snapshot = await getDocs(collection(db, "transaksi"));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setTransaksi(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTransaksi();
  }, []);

  return { transaksi, fetchTransaksi, loading };
};

export const useStoreTransaksi = () => {
  const store = async (data) => {
    await addDoc(collection(db, "transaksi"), data);
  };

  const destroy = async (id) => {
    await deleteDoc(doc(db, "transaksi", id));
  };

  return { store, destroy };
};
