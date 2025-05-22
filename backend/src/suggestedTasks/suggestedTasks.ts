import { doc, setDoc, collection, getDocs, deleteDoc, updateDoc, addDoc} from "firebase/firestore";
import { db } from "../firestore/firebaseConfig";



export const saveSuggestedTask = async (
  task: { name: string; tags: string[] }
): Promise<string> => {
  const normalizedName = task.name.trim().toLowerCase();

  const snapshot = await getDocs(collection(db, "suggestedTasks"));
  const alreadyExists = snapshot.docs.some(doc => {
    const existingName = (doc.data().name || "").trim().toLowerCase();
    return existingName === normalizedName;
  });

  if (alreadyExists) {
    throw new Error("A task with this name already exists.");
  }

  const docRef = await addDoc(collection(db, "suggestedTasks"), {
    name: task.name.trim(),
    tags: task.tags,
  });

  return docRef.id;
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



export const getAllSuggestedTasksFromDB = async () => {
  const snapshot = await getDocs(collection(db, "suggestedTasks"));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    name: doc.data().name
  }));
};




export const deleteSuggestedTaskFromDB = async (taskId: string) => {
  await deleteDoc(doc(db, "suggestedTasks", taskId));

  const callsSnapshot = await getDocs(collection(db, "calls"));
  for (const callDoc of callsSnapshot.docs) {
    const callData = callDoc.data();
    const tasks = callData.tasks || [];
    const updatedTasks = tasks.filter((task: any) => task.id !== taskId);

    if (updatedTasks.length !== tasks.length) {
      await updateDoc(doc(db, "calls", callDoc.id), {
        tasks: updatedTasks,
      });
    }
  }
};



export const updateSuggestedTaskName = async (taskId: string, newName: string) => {
  await updateDoc(doc(db, "suggestedTasks", taskId), {
    name: newName,
  });

  const callsSnapshot = await getDocs(collection(db, "calls"));
  for (const callDoc of callsSnapshot.docs) {
    const callData = callDoc.data();
    const tasks = callData.tasks || [];
    let hasChanged = false;

    const updatedTasks = tasks.map((task: any) => {
      if (task.id === taskId && task.name !== newName) {
        hasChanged = true;
        return { ...task, name: newName };
      }
      return task;
    });

    if (hasChanged) {
      await updateDoc(doc(db, "calls", callDoc.id), {
        tasks: updatedTasks,
      });
    }
  }
};
