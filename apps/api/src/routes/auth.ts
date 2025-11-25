/**
 * Authentication routes
 */

import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { AuthService } from "../services/AuthService.js";

const authService = new AuthService();

export async function authRoutes(fastify: FastifyInstance) {
  // Login
  fastify.post("/login", async (request: FastifyRequest, reply: FastifyReply) => {
    const body = request.body as { email: string; password: string };

    const user = await authService.login({
      email: body.email,
      password: body.password,
    });

    if (!user) {
      return reply.status(401).send({
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password",
        },
      });
    }

    const token = fastify.jwt.sign({ userId: user.id, email: user.email });

    return reply.send({
      user,
      token,
    });
  });

  // Register
  fastify.post("/register", async (request: FastifyRequest, reply: FastifyReply) => {
    const body = request.body as { email: string; password: string; name?: string };

    try {
      const user = await authService.register({
        email: body.email,
        password: body.password,
        name: body.name,
      });

      const token = fastify.jwt.sign({ userId: user.id, email: user.email });

      return reply.status(201).send({
        user,
        token,
      });
    } catch (error: any) {
      if (error.code === "P2002") {
        return reply.status(409).send({
          error: {
            code: "EMAIL_EXISTS",
            message: "Email already registered",
          },
        });
      }
      throw error;
    }
  });

  // Get current user
  fastify.get(
    "/me",
    { preHandler: [fastify.authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const user = request.user as { userId: string };
      const userData = await authService.getUserById(user.userId);

      if (!userData) {
        return reply.status(404).send({
          error: {
            code: "USER_NOT_FOUND",
            message: "User not found",
          },
        });
      }

      return reply.send({ user: userData });
    }
  );

  // Logout (client-side token removal, but we can invalidate if needed)
  fastify.post(
    "/logout",
    { preHandler: [fastify.authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return reply.send({ message: "Logged out" });
    }
  );
}

