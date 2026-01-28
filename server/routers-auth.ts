import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";
import { hashPassword, verifyPassword } from "./auth-utils";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";

export const authRouter = router({
  me: publicProcedure.query(opts => opts.ctx.user),
  
  login: publicProcedure.input(z.object({
    usernameOrEmail: z.string().min(1, "Username or email required"),
    password: z.string().min(6, "Password required"),
  })).mutation(async ({ input }) => {
    const user = await db.getUserByUsernameOrEmail(input.usernameOrEmail);
    if (!user || !user.password) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid credentials" });
    }
    const isValid = verifyPassword(input.password, user.password);
    if (!isValid) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid credentials" });
    }
    await db.updateUserLastSignedIn(user.id);
    return { success: true, user };
  }),
  
  signup: publicProcedure.input(z.object({
    username: z.string().min(3, "Username must be at least 3 characters").max(100),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    name: z.string().optional(),
  })).mutation(async ({ input }) => {
    const existing = await db.getUserByUsernameOrEmail(input.username);
    if (existing) {
      throw new TRPCError({ code: "CONFLICT", message: "Username already exists" });
    }
    const existingEmail = await db.getUserByUsernameOrEmail(input.email);
    if (existingEmail) {
      throw new TRPCError({ code: "CONFLICT", message: "Email already registered" });
    }
    const hashedPassword = hashPassword(input.password);
    const newUser = await db.createUser({
      username: input.username,
      email: input.email,
      password: hashedPassword,
      name: input.name || input.username,
      role: "user",
      loginMethod: "password",
    });
    return { success: true, user: newUser };
  }),
  
  logout: publicProcedure.mutation(({ ctx }) => {
    const cookieOptions = getSessionCookieOptions(ctx.req);
    ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    return { success: true } as const;
  }),
});
