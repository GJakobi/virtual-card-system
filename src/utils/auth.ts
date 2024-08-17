import jwt from "jsonwebtoken";
import { User } from "../entities/User";

const JWT_SECRET = "your_secret_key"; // Use environment variable in production

export const generateToken = (user: User): string => {
  return jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
};
