import React, { useEffect, useState } from "react";
import { useTaskStore } from "../store";
import TextField from "@mui/material/TextField";
import { useDebounce } from "../hooks/useDebounce";

export default function SearchBar() {
  const { tasks, setTasks } = useTaskStore();

  const [query, setQuery] = useState("");

  // ✅ debounce input
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    // ✅ Reset when empty
    if (!debouncedQuery) {
      setTasks(tasks);
      return;
    }

    // ✅ Do NOT search until at least 2 characters
    if (debouncedQuery.length < 2) {
      return;
    }

    const filtered = tasks.filter(task =>
      task.title.toLowerCase().includes(debouncedQuery.toLowerCase())
    );

    setTasks(filtered);
  }, [debouncedQuery, tasks, setTasks]);

  return (
    <TextField
      label="Search tasks"
      variant="outlined"
      fullWidth
      value={query}
      onChange={e => setQuery(e.target.value)}
      sx={{ marginBottom: 2 }}
      placeholder="Type at least 2 characters"
    />
  );
}