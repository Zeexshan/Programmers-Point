import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Admin Users Table
export const adminUsers = pgTable("admin_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Inquiries Table
export const inquiries = pgTable("inquiries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  fatherName: text("father_name").notNull(),
  phone: varchar("phone", { length: 13 }).notNull(), // +91XXXXXXXXXX format
  email: text("email").notNull(),
  dob: text("dob").notNull(), // DD/MM/YYYY format
  courseInterest: text("course_interest").notNull(),
  college: text("college").notNull(),
  branch: text("branch").notNull(),
  status: text("status").notNull().default("Pending"), // "Pending" or "Joined"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Companies Table
export const companies = pgTable("companies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  logoUrl: text("logo_url"),
  totalPlacements: integer("total_placements").notNull().default(0),
  avgPackage: text("avg_package"), // e.g., "8-15 LPA"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Placements Table
export const placements = pgTable("placements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentName: text("student_name").notNull(),
  companyId: varchar("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  package: text("package").notNull(), // e.g., "12 LPA"
  phone: varchar("phone", { length: 13 }).notNull(), // +91XXXXXXXXXX format
  photoUrl: text("photo_url"),
  profile: text("profile").notNull(), // e.g., "Java Developer"
  course: text("course").notNull(), // Course completed at institute
  review: text("review"),
  interviewRounds: text("interview_rounds"),
  studyDuration: text("study_duration"), // e.g., "6 months"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Technologies Table (cached data from Google Sheets)
export const technologies = pgTable("technologies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  category: text("category").notNull(), // "Frontend", "Backend", "Database"
  description: text("description"),
  vacancies: integer("vacancies"),
  avgPackage: text("avg_package"),
  topCompanies: text("top_companies"), // Comma-separated
  githubStars: text("github_stars"),
  npmDownloads: text("npm_downloads"),
  lastUpdated: text("last_updated"), // From Google Sheets
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Technology Combinations Table
export const technologyCombinations = pgTable("technology_combinations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  technologies: text("technologies").array().notNull(), // Array of technology names
  category: text("category").notNull(), // "Frontend", "Backend", "Full Stack", etc.
  jobRole: text("job_role").notNull(),
  techCount: integer("tech_count").notNull(),
  commonality: text("commonality").notNull(), // "Common", "Moderate", "Rare"
  vacancies: integer("vacancies").notNull(),
  fresherPackage: text("fresher_package").notNull(),
  experiencedPackage: text("experienced_package").notNull(),
  topCompanies: text("top_companies").array().notNull(), // Array of company names
  popularityScore: integer("popularity_score").notNull(), // 1-10
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// System Logs Table
export const systemLogs = pgTable("system_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  action: text("action").notNull(),
  details: text("details"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert Schemas
export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  createdAt: true,
});

export const insertInquirySchema = createInsertSchema(inquiries).omit({
  id: true,
  createdAt: true,
  status: true,
}).extend({
  phone: z.string().regex(/^\+91\d{10}$/, "Phone must be in +91XXXXXXXXXX format"),
  email: z.string().email("Invalid email address"),
  dob: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "Date must be in DD/MM/YYYY format"),
});

export const insertCompanySchema = createInsertSchema(companies).omit({
  id: true,
  createdAt: true,
  totalPlacements: true,
});

export const insertPlacementSchema = createInsertSchema(placements).omit({
  id: true,
  createdAt: true,
}).extend({
  phone: z.string().regex(/^\+91\d{10}$/, "Phone must be in +91XXXXXXXXXX format"),
});

export const insertTechnologySchema = createInsertSchema(technologies).omit({
  id: true,
  updatedAt: true,
});

export const insertTechnologyCombinationSchema = createInsertSchema(technologyCombinations).omit({
  id: true,
  createdAt: true,
});

// Types
export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;

export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;

export type Company = typeof companies.$inferSelect;
export type InsertCompany = z.infer<typeof insertCompanySchema>;

export type Placement = typeof placements.$inferSelect;
export type InsertPlacement = z.infer<typeof insertPlacementSchema>;

export type Technology = typeof technologies.$inferSelect;
export type InsertTechnology = z.infer<typeof insertTechnologySchema>;

export type TechnologyCombination = typeof technologyCombinations.$inferSelect;
export type InsertTechnologyCombination = z.infer<typeof insertTechnologyCombinationSchema>;

export type SystemLog = typeof systemLogs.$inferSelect;
