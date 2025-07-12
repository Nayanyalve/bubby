import { auth, database } from "../firebaseConfig";

// ATENÇÃO: você vai passar "uid" como argumento nas funções

export const addToFavorites = async (event, uid) => {
  if (!uid) return;

  const ref = database
    .collection("favoritos")
    .doc(uid)
    .collection("items")
    .doc(event.id);

  await ref.set(event);
};

export const removeFromFavorites = async (eventId, uid) => {
  if (!uid) return;

  await database
    .collection("favoritos")
    .doc(uid)
    .collection("items")
    .doc(eventId)
    .delete();
};

export const getUserFavorites = async (uid) => {
  if (!uid) return [];

  const snapshot = await database
    .collection("favoritos")
    .doc(uid)
    .collection("items")
    .get();

  return snapshot.docs.map((doc) => doc.data());
};

export const isFavorite = async (eventId, uid) => {
  if (!uid) return false;

  const doc = await database
    .collection("favoritos")
    .doc(uid)
    .collection("items")
    .doc(eventId)
    .get();

  return doc.exists;
};

