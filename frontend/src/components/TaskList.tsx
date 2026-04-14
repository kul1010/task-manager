import React, { useState } from "react";
import { useTaskStore } from "../store";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

export default function TaskList() {
  const { tasks, setTasks } = useTaskStore();

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  /* ---------- DELETE ---------- */
  async function handleDeleteConfirmed() {
    if (!selectedTask) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    await fetch(`http://localhost:4000/tasks/${selectedTask.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    refreshTasks(token);
    setOpenDeleteDialog(false);
  }

  /* ---------- EDIT ---------- */
  async function handleEditSave() {
    if (!selectedTask) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    await fetch(`http://localhost:4000/tasks/${selectedTask.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(selectedTask),
    });

    refreshTasks(token);
    setOpenEditDialog(false);
  }

  async function refreshTasks(token: string) {
    const res = await fetch("http://localhost:4000/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const updated = await res.json();
    setTasks(updated);
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        {tasks.map((t) => (
          <Grid item xs={12} sm={6} md={4} key={t.id}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6">{t.title}</Typography>
                <Typography>Priority: {t.priority}</Typography>
                <Typography>Status: {t.status}</Typography>

                <Button
                  sx={{ mt: 2, mr: 1 }}
                  variant="outlined"
                  onClick={() => {
                    setSelectedTask(t);
                    setOpenEditDialog(true);
                  }}
                >
                  Edit
                </Button>

                <Button
                  sx={{ mt: 2 }}
                  color="error"
                  variant="contained"
                  onClick={() => {
                    setSelectedTask(t);
                    setOpenDeleteDialog(true);
                  }}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ✅ Edit Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={selectedTask?.title || ""}
            onChange={(e) =>
              setSelectedTask({ ...selectedTask, title: e.target.value })
            }
          />
          <TextField
            label="Status"
            fullWidth
            margin="normal"
            value={selectedTask?.status || ""}
            onChange={(e) =>
              setSelectedTask({ ...selectedTask, status: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* ✅ Delete Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirmed} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}