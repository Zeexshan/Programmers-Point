import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertInquirySchema, insertCompanySchema, insertPlacementSchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import * as XLSX from "xlsx";

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

  const httpServer = createServer(app);

  return httpServer;
}
