import React from "react";
import { AppBar, Toolbar, Typography, Button, Box, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTaskStore } from "../store";

export default function Header({
  user,
  onLogout,
}: {
  user: { username: string; firstName?: string; lastName?: string };
  onLogout: () => void;
}) {
  const navigate = useNavigate();
  const { setSearchQuery } = useTaskStore();

  function handleLogout() {
    localStorage.removeItem("token");
    onLogout();
    navigate("/login");
  }

  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
        {/* Left side: App name */}
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Task Manager
        </Typography>

        {/* Center: Search bar */}
        <TextField
          size="small"
          placeholder="Search tasks..."
          variant="outlined"
          sx={{
            backgroundColor: "white",
            borderRadius: 1,
            minWidth: 250,
          }}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Right side: Greeting + Logout */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="body1">
            Hi {user.firstName || user.username}
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}