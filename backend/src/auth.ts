// backend/src/auth.ts
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { createUser, findUser } from "./users";

const router = express.Router();
const SECRET = "super-secret-key"; // use env var in production

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (findUser(username)) return res.status(400).json({ error: "User exists" });
  const user = await createUser(username, password);
  res.json({ id: user.id, username: user.username });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = findUser(username);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user.id, username: user.username }, SECRET, {
    expiresIn: "1h",
  });
  res.json({ token });
});

export default router;