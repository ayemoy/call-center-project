import { db } from '../firestore/firebaseConfig';
import { collection, getDocs, doc, setDoc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';






export const getAllTags = async (): Promise<string[]> => {
  const snapshot = await getDocs(collection(db, "tags"));
  return snapshot.docs.map(doc => doc.data().name);
};




export const addTagIfNotExists = async (name: string): Promise<string> => {
  const cleanName = name.trim().toLowerCase();
  const tagRef = doc(db, "tags", cleanName);
  const tagSnap = await getDoc(tagRef);

  if (tagSnap.exists()) {
    throw new Error("Tag already exists");
  }

  await setDoc(tagRef, { name: name.trim() });
  return "Tag created";
};





export const renameTagEverywhere = async (oldTag: string, newTag: string) => {
  const cleanOld = oldTag.trim();
  const cleanNew = newTag.trim();

  // Update in calls
  const callsSnap = await getDocs(collection(db, "calls"));
  for (const docSnap of callsSnap.docs) {
    const tags: string[] = docSnap.data().tags || [];
    const updatedTags = tags.map(t =>
      t.toLowerCase() === cleanOld.toLowerCase() ? cleanNew : t
    );
    if (JSON.stringify(updatedTags) !== JSON.stringify(tags)) {
      await updateDoc(doc(db, "calls", docSnap.id), { tags: updatedTags });
    }
  }

  // Update in suggestedTasks
  const tasksSnap = await getDocs(collection(db, "suggestedTasks"));
  for (const docSnap of tasksSnap.docs) {
    const tags: string[] = docSnap.data().tags || [];
    const updatedTags = tags.map(t =>
      t.toLowerCase() === cleanOld.toLowerCase() ? cleanNew : t
    );
    if (JSON.stringify(updatedTags) !== JSON.stringify(tags)) {
      await updateDoc(doc(db, "suggestedTasks", docSnap.id), { tags: updatedTags });
    }
  }

  // Update tag document
  const oldTagRef = doc(db, "tags", cleanOld.toLowerCase());
  const newTagRef = doc(db, "tags", cleanNew.toLowerCase());

  if (cleanOld.toLowerCase() !== cleanNew.toLowerCase()) {
    await setDoc(newTagRef, { name: cleanNew });
    await deleteDoc(oldTagRef);
  } else {
    await updateDoc(oldTagRef, { name: cleanNew });
  }
};






export const deleteTagEverywhere = async (tag: string) => {
  const cleanTag = tag.trim();

  // Remove from calls
  const callsSnap = await getDocs(collection(db, "calls"));
  for (const docSnap of callsSnap.docs) {
    const tags: string[] = docSnap.data().tags || [];
    const filtered = tags.filter(t => t !== cleanTag);
    if (filtered.length !== tags.length) {
      await updateDoc(doc(db, "calls", docSnap.id), { tags: filtered });
    }
  }

  // Remove from suggestedTasks
  const tasksSnap = await getDocs(collection(db, "suggestedTasks"));
  for (const docSnap of tasksSnap.docs) {
    const tags: string[] = docSnap.data().tags || [];
    const filtered = tags.filter(t => t !== cleanTag);
    if (filtered.length !== tags.length) {
      await updateDoc(doc(db, "suggestedTasks", docSnap.id), { tags: filtered });
    }
  }

  // Remove from tags collection
  await deleteDoc(doc(db, "tags", cleanTag.toLowerCase()));
};