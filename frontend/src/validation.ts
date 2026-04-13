import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const loginSchema = z.object({
  identifier: z.string().min(1, "Username or Email is required"),
  password: z.string().min(1, "Password is required"),
});

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  // description: z.string().min(1, "Description is required"),
  priority: z.enum(["low", "medium", "high"], {
    message: "Priority must be low, medium, or high",
  }),
  status: z.enum(["pending", "in-progress", "done"], {
    message: "Status must be pending, in-progress, or done",
  }),
});