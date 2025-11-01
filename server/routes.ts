import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertInquirySchema, insertCompanySchema, insertPlacementSchema, insertTechnologyCombinationSchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import * as XLSX from "xlsx";
import {
  getUncachableGoogleSheetClient,
  readTechnologies,
  writeTechnologies,
  updateTechnology,
  deleteTechnology,
  readCombinations,
  writeCombinations,
  updateCombination,
  deleteCombination,
  readCompanies,
  writeCompanies,
  readPlacements,
  writePlacements,
  readInquiries,
  appendInquiry,
  updateInquiryStatus as updateSheetInquiryStatus,
} from "./googleSheets";

// Queue system to prevent race conditions during Google Sheets sync
let companiesSyncQueue: Promise<void> = Promise.resolve();
let combinationsSyncQueue: Promise<void> = Promise.resolve();

// Helper functions to sync database to Google Sheets with queue
async function syncCompaniesToSheets() {
  // Chain onto the existing queue to ensure serial execution
  companiesSyncQueue = companiesSyncQueue.then(async () => {
    try {
      const companies = await storage.getAllCompanies();
      const sheetData = companies.map(c => ({
        name: c.name,
        logoUrl: c.logoUrl || '',
        totalPlacements: c.totalPlacements,
        avgPackage: c.avgPackage || '',
      }));
      await writeCompanies(sheetData);
      console.log(`Synced ${companies.length} companies to Google Sheets`);
    } catch (error) {
      console.error("Error syncing companies to sheets:", error);
    }
  });
  
  return companiesSyncQueue;
}

async function syncCombinationsToSheets() {
  // Chain onto the existing queue to ensure serial execution
  combinationsSyncQueue = combinationsSyncQueue.then(async () => {
    try {
      const combinations = await storage.getAllTechnologyCombinations();
      const sheetData = combinations.map(c => ({
        technologies: c.technologies,
        jobRole: c.jobRole,
        category: c.category,
        vacancies: c.vacancies,
        fresherPackage: c.fresherPackage,
        experiencedPackage: c.experiencedPackage,
        topCompanies: c.topCompanies,
        popularityScore: c.popularityScore,
      }));
      await writeCombinations(sheetData);
      console.log(`Synced ${combinations.length} combinations to Google Sheets`);
    } catch (error) {
      console.error("Error syncing combinations to sheets:", error);
    }
  });
  
  return combinationsSyncQueue;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // ========== INQUIRIES ==========
  
  // Get all inquiries
  app.get("/api/inquiries", async (req, res) => {
    try {
      const inquiries = await storage.getAllInquiries();
      res.json(inquiries);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create inquiry
  app.post("/api/inquiries", async (req, res) => {
    try {
      const validated = insertInquirySchema.parse(req.body);
      const inquiry = await storage.createInquiry(validated);
      
      // Log creation
      await storage.createLog("inquiry_created", `Inquiry from ${inquiry.name}`);
      
      // TODO: Export to Google Sheets in production
      // await exportInquiriesToSheets([inquiry]);
      
      res.json(inquiry);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ error: validationError.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  });

  // Update inquiry status
  app.patch("/api/inquiries/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!status || !["Pending", "Joined"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      
      const inquiry = await storage.updateInquiryStatus(id, status);
      await storage.createLog("inquiry_updated", `Status changed to ${status}`);
      
      res.json(inquiry);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Export inquiries to Excel
  app.get("/api/inquiries/export", async (req, res) => {
    try {
      const inquiries = await storage.getAllInquiries();
      
      const worksheet = XLSX.utils.json_to_sheet(inquiries.map(i => ({
        "Name": i.name,
        "Father's Name": i.fatherName,
        "Phone": i.phone,
        "Email": i.email,
        "DOB": i.dob,
        "Course Interest": i.courseInterest,
        "College": i.college,
        "Branch": i.branch,
        "Status": i.status,
        "Date": new Date(i.createdAt).toLocaleDateString(),
      })));
      
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Inquiries");
      
      const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
      
      res.setHeader("Content-Disposition", `attachment; filename=inquiries_${new Date().toISOString().split('T')[0]}.xlsx`);
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.send(buffer);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ========== COMPANIES ==========
  
  // Get all companies
  app.get("/api/companies", async (req, res) => {
    try {
      const companies = await storage.getAllCompanies();
      res.json(companies);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create company
  app.post("/api/companies", async (req, res) => {
    try {
      const validated = insertCompanySchema.parse(req.body);
      const company = await storage.createCompany(validated);
      await storage.createLog("company_created", `Company ${company.name} added`);
      
      // Sync to Google Sheets in background (don't wait for it)
      syncCompaniesToSheets().catch(err => console.error("Error syncing companies to sheets:", err));
      
      res.json(company);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ error: validationError.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  });

  // Update company
  app.patch("/api/companies/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const company = await storage.updateCompany(id, req.body);
      await storage.createLog("company_updated", `Company ${company.name} updated`);
      
      // Sync to Google Sheets in background
      syncCompaniesToSheets().catch(err => console.error("Error syncing companies to sheets:", err));
      
      res.json(company);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Delete company
  app.delete("/api/companies/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteCompany(id);
      await storage.createLog("company_deleted", `Company deleted`);
      
      // Sync to Google Sheets in background
      syncCompaniesToSheets().catch(err => console.error("Error syncing companies to sheets:", err));
      
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ========== PLACEMENTS ==========
  
  // Get all placements
  app.get("/api/placements", async (req, res) => {
    try {
      const placements = await storage.getAllPlacements();
      res.json(placements);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create placement
  app.post("/api/placements", async (req, res) => {
    try {
      const validated = insertPlacementSchema.parse(req.body);
      const placement = await storage.createPlacement(validated);
      
      // Update company placement count
      await storage.updateCompanyPlacementCount(placement.companyId, 1);
      await storage.createLog("placement_created", `Placement for ${placement.studentName}`);
      
      res.json(placement);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ error: validationError.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  });

  // Update placement
  app.patch("/api/placements/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const placement = await storage.updatePlacement(id, req.body);
      await storage.createLog("placement_updated", `Placement for ${placement.studentName} updated`);
      res.json(placement);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Delete placement
  app.delete("/api/placements/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const placement = await storage.getPlacement(id);
      
      if (placement) {
        // Update company placement count
        await storage.updateCompanyPlacementCount(placement.companyId, -1);
      }
      
      await storage.deletePlacement(id);
      await storage.createLog("placement_deleted", "Placement deleted");
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ========== TECHNOLOGIES ==========
  
  // Get all technologies
  app.get("/api/technologies", async (req, res) => {
    try {
      const technologies = await storage.getAllTechnologies();
      res.json(technologies);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update technologies from Google Sheets or manual data
  app.post("/api/technologies/update", async (req, res) => {
    try {
      const { technologies } = req.body;
      
      if (!Array.isArray(technologies)) {
        return res.status(400).json({ error: "Technologies must be an array" });
      }
      
      await storage.updateTechnologies(technologies);
      await storage.createLog("technologies_updated", `Updated ${technologies.length} technologies`);
      
      res.json({ success: true, count: technologies.length });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ========== TECHNOLOGY COMBINATIONS ==========
  
  // Get all technology combinations
  app.get("/api/technology-combinations", async (req, res) => {
    try {
      const combinations = await storage.getAllTechnologyCombinations();
      res.json(combinations);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Match selected technologies to combinations
  app.post("/api/technology-combinations/match", async (req, res) => {
    try {
      const { selectedTechnologies } = req.body;
      
      if (!Array.isArray(selectedTechnologies) || selectedTechnologies.length === 0) {
        return res.status(400).json({ error: "selectedTechnologies must be a non-empty array" });
      }
      
      const matches = await storage.findMatchingCombinations(selectedTechnologies);
      res.json(matches);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create technology combination
  app.post("/api/technology-combinations", async (req, res) => {
    try {
      const validated = insertTechnologyCombinationSchema.parse(req.body);
      const combination = await storage.createTechnologyCombination(validated);
      await storage.createLog("combination_created", `Combination ${combination.jobRole} added`);
      
      // Sync to Google Sheets in background
      syncCombinationsToSheets().catch(err => console.error("Error syncing combinations to sheets:", err));
      
      res.json(combination);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ error: validationError.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  });

  // Update technology combination
  app.patch("/api/technology-combinations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const combination = await storage.updateTechnologyCombination(id, req.body);
      await storage.createLog("combination_updated", `Combination ${combination.jobRole} updated`);
      
      // Sync to Google Sheets in background
      syncCombinationsToSheets().catch(err => console.error("Error syncing combinations to sheets:", err));
      
      res.json(combination);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Delete technology combination
  app.delete("/api/technology-combinations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      // Get the combination first to retrieve its jobRole for Google Sheets sync
      const combination = await storage.getTechnologyCombination(id);
      
      // Delete from database
      await storage.deleteTechnologyCombination(id);
      await storage.createLog("combination_deleted", "Combination deleted");
      
      // Sync to Google Sheets in background
      syncCombinationsToSheets().catch(err => console.error("Error syncing combinations to sheets:", err));
      
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ========== SYSTEM LOGS ==========
  
  // Get recent logs
  app.get("/api/logs", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const logs = await storage.getRecentLogs(limit);
      res.json(logs);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ========== IMPORT / EXPORT ==========
  
  // CSV Import for technologies
  app.post("/api/import/csv", async (req, res) => {
    try {
      const { csvText } = req.body;
      
      if (!csvText) {
        return res.status(400).json({ error: "CSV text is required" });
      }
      
      const lines = csvText.trim().split('\n');
      if (lines.length < 2) {
        return res.status(400).json({ error: "CSV must have header and at least one data row" });
      }
      
      const headers = lines[0].split(',').map((h: string) => h.trim().replace(/"/g, ''));
      const technologies = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map((v: string) => v.trim().replace(/"/g, ''));
        
        if (values.length >= 6) {
          const categoryMap: Record<string, string> = {
            'python': 'Backend',
            'java': 'Backend',
            'javascript': 'Frontend',
            'typescript': 'Frontend',
            'react': 'Frontend',
            'angular': 'Frontend',
            'vue': 'Frontend',
            'node': 'Backend',
            'express': 'Backend',
            'django': 'Backend',
            'spring': 'Backend',
            'sql': 'Database',
            'mysql': 'Database',
            'mongodb': 'Database',
            'postgresql': 'Database',
            'html': 'Frontend',
            'css': 'Frontend',
          };
          
          const techName = values[0].toLowerCase();
          let category = 'Other';
          for (const [key, value] of Object.entries(categoryMap)) {
            if (techName.includes(key)) {
              category = value;
              break;
            }
          }
          
          technologies.push({
            name: values[0],
            category,
            vacancies: parseInt(values[1]) || 0,
            avgPackage: values[2],
            topCompanies: values[3],
            lastUpdated: values[4],
            description: values[5] || '',
          });
        }
      }
      
      await storage.updateTechnologies(technologies);
      await storage.createLog("csv_import", `Imported ${technologies.length} technologies from CSV`);
      
      res.json({ success: true, count: technologies.length });
    } catch (error: any) {
      console.error("CSV import error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // CSV Import for technology combinations
  app.post("/api/import/combinations-csv", async (req, res) => {
    try {
      const { csvText } = req.body;
      
      if (!csvText) {
        return res.status(400).json({ error: "CSV text is required" });
      }
      
      // Helper function to parse CSV line with quote handling
      function parseCSVLine(line: string): string[] {
        const result: string[] = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        
        result.push(current.trim());
        return result;
      }
      
      // Helper to determine category based on technologies
      function determineCategory(technologies: string[]): string {
        const techNames = technologies.map(t => t.toLowerCase());
        
        if (techNames.some(t => t.includes('react') || t.includes('angular') || t.includes('html') || t.includes('css') || t.includes('frontend'))) {
          if (techNames.some(t => t.includes('node') || t.includes('express') || t.includes('django') || t.includes('spring') || t.includes('java') || t.includes('python'))) {
            return 'Full Stack';
          }
          return 'Frontend';
        }
        
        if (techNames.some(t => t.includes('java') || t.includes('spring') || t.includes('node') || t.includes('express') || t.includes('django') || t.includes('php') || t.includes('python'))) {
          return 'Backend';
        }
        
        if (techNames.some(t => t.includes('mysql') || t.includes('mongodb') || t.includes('oracle') || t.includes('database') || t.includes('sql'))) {
          return 'Database';
        }
        
        return 'Other';
      }
      
      // Helper to determine commonality based on vacancies
      function determineCommonality(vacancies: number): string {
        if (vacancies >= 5000) return 'Common';
        if (vacancies >= 2000) return 'Moderate';
        return 'Rare';
      }
      
      const lines = csvText.trim().split('\n');
      if (lines.length < 2) {
        return res.status(400).json({ error: "CSV must have header and at least one data row" });
      }
      
      const combinations = [];
      
      // Clear existing combinations first
      await storage.deleteAllTechnologyCombinations();
      
      for (let i = 1; i < lines.length; i++) {
        try {
          const values = parseCSVLine(lines[i]);
          
          if (values.length >= 7) {
            // Parse technologies from the combination string
            const techComboStr = values[0].replace(/"/g, '');
            const technologies = techComboStr.split('+').map(t => t.trim()).filter(t => t.length > 0);
            
            // Parse companies from comma-separated string
            const companiesStr = values[5].replace(/"/g, '');
            const companies = companiesStr.split(',').map(c => c.trim());
            
            const vacancies = parseInt(values[2]);
            const category = determineCategory(technologies);
            const commonality = determineCommonality(vacancies);
            
            combinations.push({
              technologies,
              category,
              jobRole: values[1].replace(/"/g, ''),
              techCount: technologies.length,
              commonality,
              vacancies,
              fresherPackage: values[3].replace(/"/g, ''),
              experiencedPackage: values[4].replace(/"/g, ''),
              topCompanies: companies,
              popularityScore: parseInt(values[6]),
            });
          }
        } catch (error) {
          console.error(`Error parsing line ${i}:`, error);
        }
      }
      
      // Bulk insert all combinations
      for (const combination of combinations) {
        await storage.createTechnologyCombination(combination);
      }
      
      await storage.createLog("combinations_csv_import", `Imported ${combinations.length} technology combinations from CSV`);
      
      res.json({ success: true, count: combinations.length });
    } catch (error: any) {
      console.error("Combinations CSV import error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Google Sheets Connection Status
  app.get("/api/google-sheets/status", async (req, res) => {
    try {
      const sheets = await getUncachableGoogleSheetClient();
      
      res.json({ 
        connected: true, 
        message: "Google Sheets is connected and ready to use" 
      });
    } catch (error: any) {
      res.json({ 
        connected: false, 
        message: error.message || "Google Sheets not connected. Please set up the connector in Replit." 
      });
    }
  });

  // ========== GOOGLE SHEETS INTEGRATION ==========
  
  // Technologies from Google Sheets
  app.get("/api/sheets/technologies", async (req, res) => {
    try {
      const technologies = await readTechnologies();
      res.json(technologies);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/sheets/technologies", async (req, res) => {
    try {
      const technology = req.body;
      const technologies = await readTechnologies();
      technologies.push(technology);
      await writeTechnologies(technologies);
      res.json({ success: true, technology });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/sheets/technologies/:name", async (req, res) => {
    try {
      const { name } = req.params;
      const updates = req.body;
      const updated = await updateTechnology(decodeURIComponent(name), updates);
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/sheets/technologies/:name", async (req, res) => {
    try {
      const { name } = req.params;
      await deleteTechnology(decodeURIComponent(name));
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Combinations from Google Sheets
  app.get("/api/sheets/combinations", async (req, res) => {
    try {
      const combinations = await readCombinations();
      res.json(combinations);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/sheets/combinations", async (req, res) => {
    try {
      const combination = req.body;
      const combinations = await readCombinations();
      combinations.push(combination);
      await writeCombinations(combinations);
      res.json({ success: true, combination });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/sheets/combinations/:jobRole", async (req, res) => {
    try {
      const { jobRole } = req.params;
      const updates = req.body;
      const updated = await updateCombination(decodeURIComponent(jobRole), updates);
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/sheets/combinations/:jobRole", async (req, res) => {
    try {
      const { jobRole } = req.params;
      await deleteCombination(decodeURIComponent(jobRole));
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Companies from Google Sheets
  app.get("/api/sheets/companies", async (req, res) => {
    try {
      const companies = await readCompanies();
      res.json(companies);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Placements from Google Sheets
  app.get("/api/sheets/placements", async (req, res) => {
    try {
      const placements = await readPlacements();
      res.json(placements);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Inquiries from Google Sheets
  app.get("/api/sheets/inquiries", async (req, res) => {
    try {
      const inquiries = await readInquiries();
      res.json(inquiries);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/sheets/inquiries", async (req, res) => {
    try {
      const validated = insertInquirySchema.parse(req.body);
      await appendInquiry(validated);
      res.json({ success: true });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ error: validationError.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  });

  app.patch("/api/sheets/inquiries/:phone", async (req, res) => {
    try {
      const { phone } = req.params;
      const { status } = req.body;
      
      if (!status || !["Pending", "Joined"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      
      await updateSheetInquiryStatus(decodeURIComponent(phone), status);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ========== DATA IMPORT FROM GOOGLE SHEETS ==========
  
  // Import all data from Google Sheets to Database
  app.post("/api/import/google-sheets", async (req, res) => {
    try {
      const results = {
        companies: 0,
        combinations: 0,
        inquiries: 0,
        placements: 0,
        technologies: 0,
      };

      // Import Companies
      try {
        const sheetCompanies = await readCompanies();
        for (const company of sheetCompanies) {
          try {
            await storage.createCompany({
              name: company.name,
              logoUrl: company.logoUrl || null,
              totalPlacements: company.totalPlacements || 0,
              avgPackage: company.avgPackage || null,
            });
            results.companies++;
          } catch (error) {
            // Skip if already exists
            console.log(`Skipping company ${company.name}: already exists`);
          }
        }
      } catch (error) {
        console.error("Error importing companies:", error);
      }

      // Import Technology Combinations
      try {
        const sheetCombinations = await readCombinations();
        for (const combo of sheetCombinations) {
          try {
            await storage.createTechnologyCombination({
              technologies: combo.technologies,
              jobRole: combo.jobRole,
              category: combo.category,
              vacancies: combo.vacancies || 0,
              fresherPackage: combo.fresherPackage || '',
              experiencedPackage: combo.experiencedPackage || '',
              topCompanies: combo.topCompanies,
              popularityScore: combo.popularityScore || 5,
            });
            results.combinations++;
          } catch (error) {
            console.log(`Skipping combination ${combo.jobRole}: already exists`);
          }
        }
      } catch (error) {
        console.error("Error importing combinations:", error);
      }

      // Import Inquiries
      try {
        const sheetInquiries = await readInquiries();
        for (const inquiry of sheetInquiries) {
          try {
            await storage.createInquiry({
              name: inquiry.name,
              fatherName: inquiry.fatherName || '',
              phone: inquiry.phone,
              email: inquiry.email || null,
              dob: inquiry.dob || null,
              courseInterest: inquiry.courseInterest,
              college: inquiry.college || null,
              branch: inquiry.branch || null,
              status: inquiry.status || 'Pending',
            });
            results.inquiries++;
          } catch (error) {
            console.log(`Skipping inquiry ${inquiry.phone}: already exists`);
          }
        }
      } catch (error) {
        console.error("Error importing inquiries:", error);
      }

      // Import Placements
      try {
        const sheetPlacements = await readPlacements();
        // First ensure companies exist
        const existingCompanies = await storage.getAllCompanies();
        const companyMap = new Map(existingCompanies.map(c => [c.name.toLowerCase(), c.id]));

        for (const placement of sheetPlacements) {
          try {
            const companyId = companyMap.get(placement.company.toLowerCase());
            if (!companyId) {
              console.log(`Skipping placement for ${placement.studentName}: company ${placement.company} not found`);
              continue;
            }

            await storage.createPlacement({
              studentName: placement.studentName,
              companyId: companyId,
              package: placement.package,
              phone: placement.phone || null,
              photoUrl: placement.photoUrl || null,
              profile: placement.profile || null,
              course: placement.course || null,
              review: placement.review || null,
              joiningDate: placement.joiningDate || null,
            });
            results.placements++;
          } catch (error) {
            console.log(`Skipping placement ${placement.studentName}: error creating`);
          }
        }
      } catch (error) {
        console.error("Error importing placements:", error);
      }

      // Import Technologies
      try {
        const sheetTechnologies = await readTechnologies();
        for (const tech of sheetTechnologies) {
          try {
            await storage.upsertTechnology({
              name: tech.name,
              category: tech.category,
              subCategory: tech.subCategory || null,
              displayOrder: tech.displayOrder || 0,
              vacancies: tech.vacancies || 0,
              fresherPackage: tech.fresherPackage || '',
              experiencedPackage: tech.experiencedPackage || '',
              topCompanies: tech.topCompanies || '',
              popularityScore: tech.popularityScore || 5,
              description: tech.description || null,
            });
            results.technologies++;
          } catch (error) {
            console.log(`Skipping technology ${tech.name}: error creating`);
          }
        }
      } catch (error) {
        console.error("Error importing technologies:", error);
      }

      await storage.createLog("google_sheets_import", `Imported ${JSON.stringify(results)}`);

      res.json({
        success: true,
        message: "Data imported successfully from Google Sheets",
        results,
      });
    } catch (error: any) {
      console.error("Error importing from Google Sheets:", error);
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
