import {
  adminUsers,
  inquiries,
  companies,
  placements,
  technologies,
  technologyCombinations,
  systemLogs,
  type AdminUser,
  type InsertAdminUser,
  type Inquiry,
  type InsertInquiry,
  type Company,
  type InsertCompany,
  type Placement,
  type InsertPlacement,
  type Technology,
  type InsertTechnology,
  type TechnologyCombination,
  type InsertTechnologyCombination,
  type SystemLog,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, arrayContains, and } from "drizzle-orm";

export interface IStorage {
  // Admin Users
  getAdminUser(id: string): Promise<AdminUser | undefined>;
  getAdminUserByUsername(username: string): Promise<AdminUser | undefined>;
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;

  // Inquiries
  getAllInquiries(): Promise<Inquiry[]>;
  getInquiry(id: string): Promise<Inquiry | undefined>;
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  updateInquiryStatus(id: string, status: string): Promise<Inquiry>;

  // Companies
  getAllCompanies(): Promise<Company[]>;
  getCompany(id: string): Promise<Company | undefined>;
  createCompany(company: InsertCompany): Promise<Company>;
  updateCompany(id: string, data: Partial<InsertCompany>): Promise<Company>;
  deleteCompany(id: string): Promise<void>;
  updateCompanyPlacementCount(companyId: string, increment: number): Promise<void>;

  // Placements
  getAllPlacements(): Promise<Placement[]>;
  getPlacement(id: string): Promise<Placement | undefined>;
  getPlacementsByCompany(companyId: string): Promise<Placement[]>;
  createPlacement(placement: InsertPlacement): Promise<Placement>;
  updatePlacement(id: string, data: Partial<InsertPlacement>): Promise<Placement>;
  deletePlacement(id: string): Promise<void>;

  // Technologies
  getAllTechnologies(): Promise<Technology[]>;
  getTechnology(id: string): Promise<Technology | undefined>;
  upsertTechnology(technology: InsertTechnology): Promise<Technology>;
  updateTechnologies(technologies: InsertTechnology[]): Promise<void>;

  // Technology Combinations
  getAllTechnologyCombinations(): Promise<TechnologyCombination[]>;
  getTechnologyCombination(id: string): Promise<TechnologyCombination | undefined>;
  createTechnologyCombination(combination: InsertTechnologyCombination): Promise<TechnologyCombination>;
  updateTechnologyCombination(id: string, data: Partial<InsertTechnologyCombination>): Promise<TechnologyCombination>;
  deleteTechnologyCombination(id: string): Promise<void>;
  findMatchingCombinations(selectedTechs: string[]): Promise<TechnologyCombination[]>;

  // System Logs
  createLog(action: string, details?: string): Promise<SystemLog>;
  getRecentLogs(limit: number): Promise<SystemLog[]>;
}

export class DatabaseStorage implements IStorage {
  // Admin Users
  async getAdminUser(id: string): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.id, id));
    return user || undefined;
  }

  async getAdminUserByUsername(username: string): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
    return user || undefined;
  }

  async createAdminUser(insertUser: InsertAdminUser): Promise<AdminUser> {
    const [user] = await db
      .insert(adminUsers)
      .values(insertUser)
      .returning();
    return user;
  }

  // Inquiries
  async getAllInquiries(): Promise<Inquiry[]> {
    return await db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
  }

  async getInquiry(id: string): Promise<Inquiry | undefined> {
    const [inquiry] = await db.select().from(inquiries).where(eq(inquiries.id, id));
    return inquiry || undefined;
  }

  async createInquiry(inquiry: InsertInquiry): Promise<Inquiry> {
    const [created] = await db
      .insert(inquiries)
      .values(inquiry)
      .returning();
    return created;
  }

  async updateInquiryStatus(id: string, status: string): Promise<Inquiry> {
    const [updated] = await db
      .update(inquiries)
      .set({ status })
      .where(eq(inquiries.id, id))
      .returning();
    return updated;
  }

  // Companies
  async getAllCompanies(): Promise<Company[]> {
    return await db.select().from(companies).orderBy(companies.name);
  }

  async getCompany(id: string): Promise<Company | undefined> {
    const [company] = await db.select().from(companies).where(eq(companies.id, id));
    return company || undefined;
  }

  async createCompany(company: InsertCompany): Promise<Company> {
    const [created] = await db
      .insert(companies)
      .values(company)
      .returning();
    return created;
  }

  async updateCompany(id: string, data: Partial<InsertCompany>): Promise<Company> {
    const [updated] = await db
      .update(companies)
      .set(data)
      .where(eq(companies.id, id))
      .returning();
    return updated;
  }

  async deleteCompany(id: string): Promise<void> {
    await db.delete(companies).where(eq(companies.id, id));
  }

  async updateCompanyPlacementCount(companyId: string, increment: number): Promise<void> {
    await db
      .update(companies)
      .set({ 
        totalPlacements: sql`${companies.totalPlacements} + ${increment}` 
      })
      .where(eq(companies.id, companyId));
  }

  // Placements
  async getAllPlacements(): Promise<Placement[]> {
    return await db.select().from(placements).orderBy(desc(placements.createdAt));
  }

  async getPlacement(id: string): Promise<Placement | undefined> {
    const [placement] = await db.select().from(placements).where(eq(placements.id, id));
    return placement || undefined;
  }

  async getPlacementsByCompany(companyId: string): Promise<Placement[]> {
    return await db.select().from(placements).where(eq(placements.companyId, companyId));
  }

  async createPlacement(placement: InsertPlacement): Promise<Placement> {
    const [created] = await db
      .insert(placements)
      .values(placement)
      .returning();
    return created;
  }

  async updatePlacement(id: string, data: Partial<InsertPlacement>): Promise<Placement> {
    const [updated] = await db
      .update(placements)
      .set(data)
      .where(eq(placements.id, id))
      .returning();
    return updated;
  }

  async deletePlacement(id: string): Promise<void> {
    await db.delete(placements).where(eq(placements.id, id));
  }

  // Technologies
  async getAllTechnologies(): Promise<Technology[]> {
    return await db.select().from(technologies).orderBy(technologies.category, technologies.name);
  }

  async getTechnology(id: string): Promise<Technology | undefined> {
    const [tech] = await db.select().from(technologies).where(eq(technologies.id, id));
    return tech || undefined;
  }

  async upsertTechnology(technology: InsertTechnology): Promise<Technology> {
    const existing = await db.select().from(technologies).where(eq(technologies.name, technology.name));
    
    if (existing.length > 0) {
      const [updated] = await db
        .update(technologies)
        .set({
          ...technology,
          updatedAt: new Date(),
        })
        .where(eq(technologies.name, technology.name))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(technologies)
        .values(technology)
        .returning();
      return created;
    }
  }

  async updateTechnologies(techs: InsertTechnology[]): Promise<void> {
    for (const tech of techs) {
      await this.upsertTechnology(tech);
    }
  }

  // Technology Combinations
  async getAllTechnologyCombinations(): Promise<TechnologyCombination[]> {
    return await db.select().from(technologyCombinations).orderBy(desc(technologyCombinations.popularityScore), desc(technologyCombinations.vacancies));
  }

  async getTechnologyCombination(id: string): Promise<TechnologyCombination | undefined> {
    const [combination] = await db.select().from(technologyCombinations).where(eq(technologyCombinations.id, id));
    return combination || undefined;
  }

  async createTechnologyCombination(combination: InsertTechnologyCombination): Promise<TechnologyCombination> {
    const [created] = await db
      .insert(technologyCombinations)
      .values(combination)
      .returning();
    return created;
  }

  async updateTechnologyCombination(id: string, data: Partial<InsertTechnologyCombination>): Promise<TechnologyCombination> {
    const [updated] = await db
      .update(technologyCombinations)
      .set(data)
      .where(eq(technologyCombinations.id, id))
      .returning();
    return updated;
  }

  async deleteTechnologyCombination(id: string): Promise<void> {
    await db.delete(technologyCombinations).where(eq(technologyCombinations.id, id));
  }

  async findMatchingCombinations(selectedTechs: string[]): Promise<TechnologyCombination[]> {
    // Get all combinations from database
    const allCombinations = await db.select().from(technologyCombinations);
    
    // Filter to find exact and subset matches
    const matches = allCombinations.filter(combo => {
      const comboTechs = combo.technologies;
      
      // Check if all selected techs are in this combination
      const allSelectedInCombo = selectedTechs.every(tech => 
        comboTechs.some(comboTech => 
          comboTech.toLowerCase().trim() === tech.toLowerCase().trim()
        )
      );
      
      // Check if all combo techs are in selected (exact match)
      const allComboInSelected = comboTechs.every(comboTech => 
        selectedTechs.some(tech => 
          tech.toLowerCase().trim() === comboTech.toLowerCase().trim()
        )
      );
      
      // Return true if it's an exact match or if all selected techs are in combo
      return allSelectedInCombo;
    });
    
    // Sort by: exact matches first (same length), then by popularity, then by vacancies
    matches.sort((a, b) => {
      const aIsExact = a.technologies.length === selectedTechs.length;
      const bIsExact = b.technologies.length === selectedTechs.length;
      
      if (aIsExact && !bIsExact) return -1;
      if (!aIsExact && bIsExact) return 1;
      
      if (b.popularityScore !== a.popularityScore) {
        return b.popularityScore - a.popularityScore;
      }
      
      return b.vacancies - a.vacancies;
    });
    
    return matches;
  }

  // System Logs
  async createLog(action: string, details?: string): Promise<SystemLog> {
    const [log] = await db
      .insert(systemLogs)
      .values({ action, details })
      .returning();
    return log;
  }

  async getRecentLogs(limit: number): Promise<SystemLog[]> {
    return await db.select().from(systemLogs).orderBy(desc(systemLogs.createdAt)).limit(limit);
  }
}

export const storage = new DatabaseStorage();
