import React, { useState } from "react";
import { useTaskStore } from "../store";
import {
  TextField,
  Select,
  MenuItem,
  Button,
  Box,
  FormControl,
  InputLabel,
  FormHelperText,
  Snackbar,
  Alert,
  Typography,
} from "@mui/material";
import { taskSchema } from "../validation";

function sanitizeInput(value: string) {
  return value.replace(/<[^>]*>?/gm, "").trim();
}

export default function TaskForm() {
  const { setTasks } = useTaskStore();
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "low",
    status: "pending",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const sanitizedForm = {
      title: sanitizeInput(form.title),
      description: sanitizeInput(form.description),
      priority: form.priority,
      status: form.status,
    };

    const result = taskSchema.safeParse(sanitizedForm);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    

    setErrors({});

    const token = localStorage.getItem("token");
    if (!token) {
      setSnackbar({
        open: true,
        message: "No token found, please login again",
        severity: "error",
      });
      return;
    }

    try {
      await fetch("http://localhost:4000/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(sanitizedForm),
      });

      const tasksRes = await fetch("http://localhost:4000/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const tasks = await tasksRes.json();
      setTasks(tasks);

      setForm({ title: "", description: "", priority: "low", status: "pending" });

      setSnackbar({
        open: true,
        message: "Task added successfully!",
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Failed to add task",
        severity: "error",
      });
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: "auto", mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        Add Task
      </Typography>

      <TextField
        label="Title"
        fullWidth
        margin="normal"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        error={!!errors.title}
        helperText={errors.title}   // shows "Title is required"
        required
      />


      <TextField
        label="Description"
        fullWidth
        margin="normal"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        multiline
        rows={3}
        error={!!errors.description}
        helperText={errors.description}   // ✅ shows "Please fill description"
        // required
      />

      <FormControl fullWidth margin="normal" error={!!errors.priority}>
        <InputLabel>Priority</InputLabel>
        <Select
          value={form.priority}
          label="Priority"
          onChange={(e) => setForm({ ...form, priority: e.target.value })}
        >
          <MenuItem value="low">Low</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="high">High</MenuItem>
        </Select>
        {errors.priority && <FormHelperText>{errors.priority}</FormHelperText>}
      </FormControl>

      <FormControl fullWidth margin="normal" error={!!errors.status}>
        <InputLabel>Status</InputLabel>
        <Select
          value={form.status}
          label="Status"
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="in-progress">In Progress</MenuItem>
          <MenuItem value="done">Done</MenuItem>
        </Select>
        {errors.status && <FormHelperText>{errors.status}</FormHelperText>}
      </FormControl>

      <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
        Add Task
      </Button>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}