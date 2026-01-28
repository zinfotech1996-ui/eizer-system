import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";
import { authRouter } from "./routers-auth";

// Helper to create admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  auth: authRouter,

  // Fundraiser procedures
  fundraisers: router({
    list: adminProcedure.query(() => db.getAllFundraisers()),
    
    getById: adminProcedure.input(z.object({ id: z.number() })).query(({ input }) =>
      db.getFundraiserById(input.id)
    ),

    getByUserId: protectedProcedure.input(z.object({ userId: z.number() })).query(({ input }) =>
      db.getFundraiserByUserId(input.userId)
    ),

    create: adminProcedure.input(z.object({
      userId: z.number(),
      customerPhoneId: z.string().optional(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      isFoundation: z.boolean().optional(),
      isCompany: z.boolean().optional(),
      hebrewName: z.string().optional(),
      email: z.string().email(),
      address2: z.string().optional(),
      address3: z.string().optional(),
      address4: z.string().optional(),
      status: z.enum(["active", "inactive"]).optional(),
    })).mutation(({ input }) => db.createFundraiser(input)),

    update: adminProcedure.input(z.object({
      id: z.number(),
      customerPhoneId: z.string().optional(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      isFoundation: z.boolean().optional(),
      isCompany: z.boolean().optional(),
      hebrewName: z.string().optional(),
      email: z.string().email().optional(),
      address2: z.string().optional(),
      address3: z.string().optional(),
      address4: z.string().optional(),
      status: z.enum(["active", "inactive"]).optional(),
    })).mutation(({ input }) => {
      const { id, ...data } = input;
      return db.updateFundraiser(id, data);
    }),
  }),

  // Machine Location procedures
  machineLocations: router({
    list: publicProcedure.query(() => db.getAllMachineLocations()),

    create: adminProcedure.input(z.object({
      name: z.string(),
      description: z.string().optional(),
    })).mutation(({ input }) => db.createMachineLocation(input)),
  }),

  // Credit Card Machine procedures
  machines: router({
    list: adminProcedure.query(() => db.getAllMachines()),

    getById: protectedProcedure.input(z.object({ id: z.number() })).query(({ input }) =>
      db.getMachineById(input.id)
    ),

    getByFundraiserId: protectedProcedure.input(z.object({ fundraiserId: z.number() })).query(({ input }) =>
      db.getMachinesByFundraiserId(input.fundraiserId)
    ),

    create: adminProcedure.input(z.object({
      fundraiserId: z.number().optional(),
      machineName: z.string(),
      machineNumber: z.string(),
      batchNumber: z.string().optional(),
      locationId: z.number().optional(),
      status: z.enum(["available", "assigned", "returned", "inactive"]).optional(),
    })).mutation(({ input }) => db.createMachine(input)),

    update: adminProcedure.input(z.object({
      id: z.number(),
      fundraiserId: z.number().optional().nullable(),
      machineName: z.string().optional(),
      machineNumber: z.string().optional(),
      batchNumber: z.string().optional().nullable(),
      locationId: z.number().optional().nullable(),
      status: z.enum(["available", "assigned", "returned", "inactive"]).optional(),
      batchDate: z.date().optional().nullable(),
    })).mutation(({ input }) => {
      const { id, ...data } = input;
      return db.updateMachine(id, data);
    }),
  }),

  // Redemption Request procedures
  redemptions: router({
    list: adminProcedure.query(() => db.getAllRedemptionRequests()),

    getById: protectedProcedure.input(z.object({ id: z.number() })).query(({ input }) =>
      db.getRedemptionRequestById(input.id)
    ),

    getByFundraiserId: protectedProcedure.input(z.object({ fundraiserId: z.number() })).query(({ input }) =>
      db.getRedemptionRequestsByFundraiserId(input.fundraiserId)
    ),

    create: protectedProcedure.input(z.object({
      fundraiserId: z.number(),
      amount: z.string(),
      checkNumber: z.string().optional(),
      checkName: z.string().optional(),
      checkMemo: z.string().optional(),
      notes: z.string().optional(),
    })).mutation(async ({ input }) => {
      const result = await db.createRedemptionRequest({
        ...input,
        status: "pending",
      });
      console.log(`[NOTIFICATION] New redemption request created for fundraiser ${input.fundraiserId}`);
      return result;
    }),

    update: adminProcedure.input(z.object({
      id: z.number(),
      status: z.enum(["pending", "approved", "released", "rejected"]).optional(),
      checkNumber: z.string().optional(),
      checkName: z.string().optional(),
      checkMemo: z.string().optional(),
      notes: z.string().optional(),
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      const result = await db.updateRedemptionRequest(id, data);
      if (data.status && (data.status === "approved" || data.status === "released" || data.status === "rejected")) {
        console.log(`[NOTIFICATION] Redemption request ${id} status changed to ${data.status}`);
      }
      return result;
    }),
  }),
});

export type AppRouter = typeof appRouter;
