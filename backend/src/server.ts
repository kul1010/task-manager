import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import YAML from "yaml";
import { authenticate } from "./middleware/auth";
import { Task } from "./types";
import { validateTask } from "./validation";

// 🔧 Load config from YAML
const file = fs.readFileSync("./config.yaml", "utf8");
const config = YAML.parse(file);

const app = express();
app.use(cors({ origin: config.cors.origin }));
app.use(express.json());

// In-memory tasks
let tasks: Task[] = [];
let idCounter = 1;

// In-memory users
interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
}
let users: User[] = [];
let userIdCounter = 1;

// Use secret and expiry from YAML
const SECRET = config.jwt.secret;
const EXPIRES_IN = config.jwt.expiresIn;

// 🔐 Register route
app.post("/register", async (req, res) => {
  const { username, email, firstName, lastName, password } = req.body;
  if (users.find(u => u.username === username || u.email === email)) {
    return res.status(400).json({ error: "User already exists" });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const newUser: User = {
    id: userIdCounter++,
    username,
    email,
    firstName,
    lastName,
    passwordHash,
  };
  users.push(newUser);
  res.status(201).json({ id: newUser.id, username, email });
});

// 🔐 Login route (username OR email)
app.post("/login", async (req, res) => {
  const { identifier, password } = req.body; // identifier can be username or email
  const user = users.find(u => u.username === identifier || u.email === identifier);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  // ✅ Include firstName and lastName in the JWT payload
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    SECRET,
    { expiresIn: EXPIRES_IN }
  );

  res.json({ token });
});


// ✅ Protected task routes
app.get("/tasks", authenticate, (_, res) => res.json(tasks));

app.post("/tasks", authenticate, validateTask, (req, res) => {
  const newTask: Task = { id: idCounter++, ...req.body };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.patch("/tasks/:id", authenticate, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const task = tasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ error: "Task not found" });
  Object.assign(task, req.body);
  res.json(task);
});

app.delete("/tasks/:id", authenticate, (req, res) => {
  const id = parseInt(req.params.id, 10);
  tasks = tasks.filter(t => t.id !== id);
  res.status(204).send();
});

// Fallback
app.use((_, res) => res.status(404).json({ error: "Route not found" }));

export default app;

if (require.main === module) {
  app.listen(config.server.port, () =>
    console.log(`Backend running on http://localhost:${config.server.port}`)
  );
}