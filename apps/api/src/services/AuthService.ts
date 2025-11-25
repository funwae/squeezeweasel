/**
 * Authentication service
 */

import bcrypt from "bcryptjs";
import { prisma } from "../db/client.js";
import type { User } from "@squeezeweasel/shared-types";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

export class AuthService {
  async login(credentials: LoginCredentials): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email: credentials.email },
    });

    if (!user || !user.passwordHash) {
      return null;
    }

    const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
    if (!isValid) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name || undefined,
      authProvider: user.authProvider.toLowerCase() as "email" | "google" | "microsoft",
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async register(data: RegisterData): Promise<User> {
    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        passwordHash,
        authProvider: "EMAIL",
      },
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name || undefined,
      authProvider: "email",
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async getUserById(userId: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name || undefined,
      authProvider: user.authProvider.toLowerCase() as "email" | "google" | "microsoft",
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

