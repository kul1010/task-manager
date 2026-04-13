import { useEffect } from "react";
import { useTaskStore } from "../store";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import Header from "./Header";

export default function Dashboard({ user, onLogout }: { user: { username: string; firstName?: string; lastName?: string }; onLogout: () => void }) {
  const { setTasks } = useTaskStore();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:4000/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }, [setTasks]);

  return (
    <div>
      <Header user={user} onLogout={onLogout} />
      <TaskForm />
      <TaskList />
    </div>
  );
}