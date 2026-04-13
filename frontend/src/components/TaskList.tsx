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
  DialogContentText,
  DialogActions,
} from "@mui/material";

export default function TaskList() {
  const { tasks, setTasks } = useTaskStore();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  async function handleDeleteConfirmed() {
    if (!selectedTaskId) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    // Delete task
    await fetch(`http://localhost:4000/tasks/${selectedTaskId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    // Refresh tasks
    const res = await fetch("http://localhost:4000/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const updated = await res.json();
    setTasks(updated);

    // Close dialog
    setOpenDialog(false);
    setSelectedTaskId(null);
  }

  function openDeleteDialog(id: number) {
    setSelectedTaskId(id);
    setOpenDialog(true);
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        {tasks.map((t) => (
          <Grid item xs={12} sm={6} md={4} key={t.id}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Priority: {t.priority}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Status: {t.status}
                </Typography>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  sx={{ mt: 2 }}
                  onClick={() => openDeleteDialog(t.id)}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you want to delete this task?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirmed} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}