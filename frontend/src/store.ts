import {create} from "zustand";
import type { Task } from "./types";

type State = {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
};

export const useTaskStore = create<State>(set => ({
  tasks: [],
  setTasks: tasks => set({ tasks }),
}));