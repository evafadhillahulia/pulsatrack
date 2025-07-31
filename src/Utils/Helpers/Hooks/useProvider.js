import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../../firebase/firebase";

// Fetch data
export const useProvider = () => {
  const [providers, setProviders] = useState([]);

  const fetchProviders = async () => {
    const snapshot = await getDocs(collection(db, "provider"));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setProviders(data);
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  return { providers, fetchProviders };
};

// Tambah data
export const useStoreProvider = () => {
  const storeProvider = async (newData) => {
    await addDoc(collection(db, "provider"), newData);
  };

  return { storeProvider };
};

// Update data
export const useUpdateProvider = () => {
  const updateProvider = async (id, updatedData) => {
    const ref = doc(db, "provider", id);
    await updateDoc(ref, updatedData);
  };

  return { updateProvider };
};

// Hapus data
export const useDeleteProvider = () => {
  const deleteProvider = async (id) => {
    const ref = doc(db, "provider", id);
    await deleteDoc(ref);
  };

  return { deleteProvider };
};
