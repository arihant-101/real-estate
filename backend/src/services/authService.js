import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { prisma } from "../lib/prisma.js";

const SALT_ROUNDS = 10;

export async function register({ email, password, name, role = "TENANT" }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const err = new Error("Email already registered");
    err.code = "VALIDATION_ERROR";
    err.status = 400;
    throw err;
  }
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await prisma.user.create({
    data: { email, hashedPassword, name, role },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });
  const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, { expiresIn: "7d" });
  return { user, token };
}

export async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const err = new Error("Invalid email or password");
    err.code = "UNAUTHORIZED";
    err.status = 401;
    throw err;
  }
  const ok = await bcrypt.compare(password, user.hashedPassword);
  if (!ok) {
    const err = new Error("Invalid email or password");
    err.code = "UNAUTHORIZED";
    err.status = 401;
    throw err;
  }
  const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, { expiresIn: "7d" });
  return {
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    token,
  };
}

export async function getMe(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, role: true },
  });
  if (!user) {
    const err = new Error("User not found");
    err.code = "NOT_FOUND";
    err.status = 404;
    throw err;
  }
  return user;
}
