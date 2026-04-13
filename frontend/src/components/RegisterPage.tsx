import React, { useState } from "react";
import {
  TextField, Button, Box, Typography, Link, Snackbar, Alert,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { registerSchema } from "../validation";
import { sanitizeForm } from "../utils/sanitize";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", username: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const sanitizedForm = sanitizeForm(form);
    const result = registerSchema.safeParse(sanitizedForm);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        if (issue.path[0]) fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    const res = await fetch("http://localhost:4000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sanitizedForm),
    });
    const data = await res.json();

    if (data.error) {
      setSnackbar({ open: true, message: data.error, severity: "error" });
    } else {
      setForm({ firstName: "", lastName: "", email: "", username: "", password: "" });
      setSnackbar({ open: true, message: "Registration successful, redirecting to login...", severity: "success" });
      setTimeout(() => navigate("/login"), 2000);
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: "auto", mt: 5 }}>
      <Typography variant="h5" gutterBottom>Register</Typography>
      <TextField label="First Name" fullWidth margin="normal" value={form.firstName}
        onChange={e => setForm({ ...form, firstName: e.target.value })}
        error={!!errors.firstName} helperText={errors.firstName} />
      <TextField label="Last Name" fullWidth margin="normal" value={form.lastName}
        onChange={e => setForm({ ...form, lastName: e.target.value })}
        error={!!errors.lastName} helperText={errors.lastName} />
      <TextField label="Email" type="email" fullWidth margin="normal" value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
        error={!!errors.email} helperText={errors.email} />
      <TextField label="Username" fullWidth margin="normal" value={form.username}
        onChange={e => setForm({ ...form, username: e.target.value })}
        error={!!errors.username} helperText={errors.username} />
      <TextField label="Password" type="password" fullWidth margin="normal" value={form.password}
        onChange={e => setForm({ ...form, password: e.target.value })}
        error={!!errors.password} helperText={errors.password} />
      <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>Register</Button>
      <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
        Already have an account? <Link component={RouterLink} to="/login">Login here</Link>
      </Typography>
      <Snackbar open={snackbar.open} autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}