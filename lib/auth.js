import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

export function signToken(payload) {
  const fs = require('fs');
  const path = require('path');
  const logPath = path.join(process.cwd(), 'debug.log');
  const log = (msg) => fs.appendFileSync(logPath, new Date().toISOString() + ': ' + msg + '\n');

  log("signToken called with payload: " + JSON.stringify(payload));
  console.log("signToken called with payload:", payload);
  if (!payload) {
    log("signToken Error: Payload is null/undefined");
    console.error("signToken Error: Payload is null/undefined");
    throw new Error("signToken Error: Payload is null/undefined");
  }
  // Ensure payload is a plain object
  if (typeof payload !== 'object' || Array.isArray(payload)) {
    log("signToken Error: Payload must be an object. Got: " + typeof payload + " " + JSON.stringify(payload));
    console.error("signToken Error: Payload must be an object. Got:", typeof payload, payload);
    console.error(new Error().stack);
  }
  const plainPayload = JSON.parse(JSON.stringify(payload));
  return jwt.sign(plainPayload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  return verifyToken(token);
}

export async function verifyAuth() {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}
