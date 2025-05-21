import { doc, setDoc } from "firebase/firestore";
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
