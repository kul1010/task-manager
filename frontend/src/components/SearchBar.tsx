import React, { useState } from "react";
import { useTaskStore } from "../store";
import TextField from "@mui/material/TextField";

export default function SearchBar() {
  const { tasks, setTasks } = useTaskStore();
  const [query, setQuery] = useState("");

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value.toLowerCase();
    setQuery(q);
    const filtered = tasks.filter(t => t.title.toLowerCase().includes(q));
    setTasks(filtered);
  }

  return (
    <TextField
      label="Search tasks"
      variant="outlined"
      fullWidth
      value={query}
      onChange={handleSearch}
      sx={{ marginBottom: 2 }}
    />
  );
}