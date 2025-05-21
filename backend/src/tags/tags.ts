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
  const callsSnap = await getDocs(collection(db, "calls"));
  for (const docSnap of callsSnap.docs) {
    const tags = docSnap.data().tags || [];
    if (tags.includes(oldTag)) {
      const updatedTags = tags.map((t: string) => (t === oldTag ? newTag : t));
      await updateDoc(doc(db, "calls", docSnap.id), { tags: updatedTags });
    }
  }

  const tasksSnap = await getDocs(collection(db, "suggestedTasks"));
  for (const docSnap of tasksSnap.docs) {
    const taskTags = docSnap.data().tags || [];
    if (taskTags.includes(oldTag)) {
      const updatedTags = taskTags.map((t: string) => (t === oldTag ? newTag : t));
      await updateDoc(doc(db, "suggestedTasks", docSnap.id), { tags: updatedTags });
    }
  }

  const tagRef = doc(db, "tags", oldTag.toLowerCase());
  const newTagRef = doc(db, "tags", newTag.toLowerCase());
  await setDoc(newTagRef, { name: newTag });
  await deleteDoc(tagRef);
};

export const deleteTagEverywhere = async (tag: string) => {
  const callsSnap = await getDocs(collection(db, "calls"));
  for (const docSnap of callsSnap.docs) {
    const tags = docSnap.data().tags || [];
    const filtered = tags.filter((t: string) => t !== tag);
    await updateDoc(doc(db, "calls", docSnap.id), { tags: filtered });
  }

  const tasksSnap = await getDocs(collection(db, "suggestedTasks"));
  for (const docSnap of tasksSnap.docs) {
    const taskTags = docSnap.data().tags || [];
    const filtered = taskTags.filter((t: string) => t !== tag);
    await updateDoc(doc(db, "suggestedTasks", docSnap.id), { tags: filtered });
  }

  await deleteDoc(doc(db, "tags", tag.toLowerCase()));
};
