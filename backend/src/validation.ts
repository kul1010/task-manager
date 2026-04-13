import { Request, Response, NextFunction } from "express";

export function validateTask(req: Request, res: Response, next: NextFunction) {
  const { title, priority, status } = req.body;
  if (!title) return res.status(400).json({ error: "Title is required" });
  if (!["low", "medium", "high"].includes(priority))
    return res.status(400).json({ error: "Invalid priority" });
  if (!["pending", "in-progress", "done"].includes(status))
    return res.status(400).json({ error: "Invalid status" });
  next();
}