import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().trim().nonempty("First name is required"),

  lastName: z.string().trim().nonempty("Last name is required"),

  email: z.string().trim().superRefine((value, ctx) => {
    if (!value) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Email is required",
      });
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(value)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid email format",
      });
    }
  }),
  username: z.string().trim().nonempty("Username is required"),

  password: z.string().trim().nonempty("Password is required"),
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