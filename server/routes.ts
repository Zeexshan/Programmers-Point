import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertInquirySchema, insertCompanySchema, insertPlacementSchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import * as XLSX from "xlsx";
import { getUncachableGoogleSheetClient } from "./googleSheets";

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

  const httpServer = createServer(app);

  return httpServer;
}
