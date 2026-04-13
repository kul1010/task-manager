// backend/src/users.ts
import bcrypt from "bcryptjs";

export interface User {
  id: number;
  username: string;
  passwordHash: string;
}

let users: User[] = [];
let idCounter = 1;

export async function createUser(username: string, password: string) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user: User = { id: idCounter++, username, passwordHash };
  users.push(user);
  return user;
}

export function findUser(username: string) {
  return users.find(u => u.username === username);
}