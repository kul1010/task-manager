import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Link,
  Snackbar,
  Alert,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { loginSchema } from "../validation";
import { sanitizeForm } from "../utils/sanitize";
import { jwtDecode } from "jwt-decode"; // ✅ correct import

interface UserPayload {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

export default function LoginPage({
  onLogin,
}: {
  onLogin: (token: string, user: UserPayload) => void;
}) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const sanitizedForm = sanitizeForm({ identifier, password });

    const result = loginSchema.safeParse(sanitizedForm);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    const res = await fetch("http://localhost:4000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sanitizedForm),
    });
    const data = await res.json();

    if (data.token) {
      try {
        const decoded = jwtDecode<UserPayload>(data.token);
        localStorage.setItem("token", data.token);
        onLogin(data.token, decoded);
        setSnackbar({
          open: true,
          message: "Login successful!",
          severity: "success",
        });
      } catch (err) {
        console.error("Failed to decode token", err);
        setSnackbar({
          open: true,
          message: "Invalid token received",
          severity: "error",
        });
      }
    } else {
      setSnackbar({
        open: true,
        message: data.error || "Login failed",
        severity: "error",
      });
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 400, mx: "auto", mt: 5 }}
    >
      <Typography variant="h5" gutterBottom>
        Login
      </Typography>

      <TextField
        label="Username or Email"
        fullWidth
        margin="normal"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        error={!!errors.identifier}
        helperText={errors.identifier}
      />

      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={!!errors.password}
        helperText={errors.password}
      />

      <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
        Login
      </Button>

      <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
        New user?{" "}
        <Link component={RouterLink} to="/register">
          Register here
        </Link>
      </Typography>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}