import { collection, getDocs, query, where, addDoc, Timestamp, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firestore/firebaseConfig";





export const getCallsFromDB = async () => {
  const snapshot = await getDocs(collection(db, "calls"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};



export const checkCallExists = async (name: string) => {
  const q = query(collection(db, "calls"), where("name", "==", name));
  const snapshot = await getDocs(q);
  return !snapshot.empty;
};



export const createCallInDB = async (name: string) => {
  const newCall = {
    name,
    createdAt: Timestamp.now(),
    tags: [],
    tasks: []
  };
  const docRef = await addDoc(collection(db, "calls"), newCall);
  return { id: docRef.id, ...newCall };
};



export const addTaskToCallInDB = async (
  callId: string,
  task: { id: string; name: string }
) => {
  const callRef = doc(db, "calls", callId);
  const snap = await getDoc(callRef);

  if (!snap.exists()) {
    throw new Error("Call not found");
  }

  const callData = snap.data();
  const existingTasks = callData.tasks || [];

  if (existingTasks.some((t: any) => t.id === task.id)) {
    throw new Error("Task already exists in this call");
  }

  const newTask = {
    id: task.id,
    name: task.name,
    status: "New"
  };

  const updatedTasks = [...existingTasks, newTask];
  await updateDoc(callRef, { tasks: updatedTasks });

  return newTask;
};




export const updateCallTagsInDB = async (callId: string, tags: string[]) => {
  const callRef = doc(db, "calls", callId);
  await updateDoc(callRef, { tags });
};


export const updateTaskStatusInCall = async (callId: string, taskId: string, status: string) => {
  const callRef = doc(db, "calls", callId);
  const callSnap = await getDoc(callRef);

  if (!callSnap.exists()) throw new Error("Call not found");

  const callData = callSnap.data();
  const updatedTasks = callData.tasks.map((task: any) =>
    task.id === taskId ? { ...task, status } : task
  );

  await updateDoc(callRef, { tasks: updatedTasks });
};