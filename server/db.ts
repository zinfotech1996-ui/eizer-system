import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, fundraisers, creditCardMachines, redemptionRequests, machineLocations, Fundraiser, CreditCardMachine, RedemptionRequest, MachineLocation } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Fundraiser queries
export async function getAllFundraisers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(fundraisers).orderBy(desc(fundraisers.createdAt));
}

export async function getFundraiserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(fundraisers).where(eq(fundraisers.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getFundraiserByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(fundraisers).where(eq(fundraisers.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createFundraiser(data: Omit<typeof fundraisers.$inferInsert, 'createdAt' | 'updatedAt'>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(fundraisers).values(data);
  return result;
}

export async function updateFundraiser(id: number, data: Partial<typeof fundraisers.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(fundraisers).set(data).where(eq(fundraisers.id, id));
}

// Machine Location queries
export async function getAllMachineLocations() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(machineLocations);
}

export async function createMachineLocation(data: Omit<typeof machineLocations.$inferInsert, 'createdAt'>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(machineLocations).values(data);
}

// Credit Card Machine queries
export async function getAllMachines() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(creditCardMachines).orderBy(desc(creditCardMachines.createdAt));
}

export async function getMachineById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(creditCardMachines).where(eq(creditCardMachines.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getMachinesByFundraiserId(fundraiserId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(creditCardMachines).where(eq(creditCardMachines.fundraiserId, fundraiserId));
}

export async function createMachine(data: Omit<typeof creditCardMachines.$inferInsert, 'createdAt' | 'updatedAt'>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(creditCardMachines).values(data);
}

export async function updateMachine(id: number, data: Partial<typeof creditCardMachines.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(creditCardMachines).set(data).where(eq(creditCardMachines.id, id));
}

// Redemption Request queries
export async function getAllRedemptionRequests() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(redemptionRequests).orderBy(desc(redemptionRequests.createdAt));
}

export async function getRedemptionRequestById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(redemptionRequests).where(eq(redemptionRequests.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getRedemptionRequestsByFundraiserId(fundraiserId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(redemptionRequests).where(eq(redemptionRequests.fundraiserId, fundraiserId)).orderBy(desc(redemptionRequests.createdAt));
}

export async function createRedemptionRequest(data: Omit<typeof redemptionRequests.$inferInsert, 'createdAt' | 'updatedAt'>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(redemptionRequests).values(data);
}

export async function updateRedemptionRequest(id: number, data: Partial<typeof redemptionRequests.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(redemptionRequests).set(data).where(eq(redemptionRequests.id, id));
}
