import { doc, setDoc, collection, getDocs  } from "firebase/firestore";
import { db } from "../firestore/firebaseConfig";

export const saveSuggestedTask = async (
  id: string,
  task: { name: string; tags: string[] }
) => {
  await setDoc(doc(db, "suggestedTasks", id), {
    name: task.name,
    tags: task.tags,
  });
};


export const querySuggestedTasksByTags = async (tags: string[]) => {
  const snapshot = await getDocs(collection(db, "suggestedTasks"));

  const lowercaseTags = tags.map(t => t.toLowerCase());

  const matchingTasks: { id: string, name: string }[] = [];

  snapshot.forEach(doc => {
    const data = doc.data();
    const taskTags: string[] = data.tags || [];

    const hasAllTags = lowercaseTags.every(tag =>
      taskTags.map(t => t.toLowerCase()).includes(tag)
    );

    if (hasAllTags) {
      matchingTasks.push({ id: doc.id, name: data.name });
    }
  });

  return matchingTasks;
};