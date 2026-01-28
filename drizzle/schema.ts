import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, index } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Fundraisers table - stores information about fundraisers
 */
export const fundraisers = mysqlTable("fundraisers", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  customerPhoneId: varchar("customerPhoneId", { length: 50 }),
  firstName: varchar("firstName", { length: 100 }),
  lastName: varchar("lastName", { length: 100 }),
  isFoundation: boolean("isFoundation").default(false),
  isCompany: boolean("isCompany").default(false),
  hebrewName: text("hebrewName"),
  email: varchar("email", { length: 320 }).notNull(),
  address2: text("address2"),
  address3: text("address3"),
  address4: text("address4"),
  status: mysqlEnum("status", ["active", "inactive"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("userIdIdx").on(table.userId),
  emailIdx: index("emailIdx").on(table.email),
}));

export type Fundraiser = typeof fundraisers.$inferSelect;
export type InsertFundraiser = typeof fundraisers.$inferInsert;

/**
 * Machine locations table - predefined locations for machines
 */
export const machineLocations = mysqlTable("machineLocations", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MachineLocation = typeof machineLocations.$inferSelect;
export type InsertMachineLocation = typeof machineLocations.$inferInsert;

/**
 * Credit card machines table
 */
export const creditCardMachines = mysqlTable("creditCardMachines", {
  id: int("id").autoincrement().primaryKey(),
  fundraiserId: int("fundraiserId"),
  machineName: varchar("machineName", { length: 100 }).notNull(),
  machineNumber: varchar("machineNumber", { length: 50 }).notNull().unique(),
  batchNumber: varchar("batchNumber", { length: 50 }),
  locationId: int("locationId"),
  status: mysqlEnum("status", ["available", "assigned", "returned", "inactive"]).default("available").notNull(),
  batchDate: timestamp("batchDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  fundraiserIdIdx: index("fundraiserIdIdx").on(table.fundraiserId),
  machineNumberIdx: index("machineNumberIdx").on(table.machineNumber),
  statusIdx: index("statusIdx").on(table.status),
}));

export type CreditCardMachine = typeof creditCardMachines.$inferSelect;
export type InsertCreditCardMachine = typeof creditCardMachines.$inferInsert;

/**
 * Redemption requests table
 */
export const redemptionRequests = mysqlTable("redemptionRequests", {
  id: int("id").autoincrement().primaryKey(),
  fundraiserId: int("fundraiserId").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  checkNumber: varchar("checkNumber", { length: 50 }),
  checkName: varchar("checkName", { length: 100 }),
  checkMemo: text("checkMemo"),
  status: mysqlEnum("status", ["pending", "approved", "released", "rejected"]).default("pending").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  fundraiserIdIdx: index("fundraiserIdIdx").on(table.fundraiserId),
  statusIdx: index("statusIdx").on(table.status),
}));

export type RedemptionRequest = typeof redemptionRequests.$inferSelect;
export type InsertRedemptionRequest = typeof redemptionRequests.$inferInsert;
