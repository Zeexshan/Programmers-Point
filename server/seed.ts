import { db } from "./db";
import { adminUsers, companies, placements, technologies } from "@shared/schema";
import bcrypt from "bcrypt";

async function seed() {
  console.log("Seeding database...");

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await db.insert(adminUsers).values({
    username: "admin",
    password: hashedPassword,
  }).onConflictDoNothing();
  console.log("✓ Admin user created (username: admin, password: admin123)");

  // Seed companies
  const companiesData = [
    { name: "TCS", avgPackage: "6-10 LPA" },
    { name: "Infosys", avgPackage: "7-12 LPA" },
    { name: "Wipro", avgPackage: "6-11 LPA" },
    { name: "Accenture", avgPackage: "8-14 LPA" },
    { name: "HCL Technologies", avgPackage: "6-10 LPA" },
    { name: "Tech Mahindra", avgPackage: "7-11 LPA" },
    { name: "Capgemini", avgPackage: "8-13 LPA" },
    { name: "IBM", avgPackage: "9-15 LPA" },
  ];

  for (const company of companiesData) {
    await db.insert(companies).values(company).onConflictDoNothing();
  }
  console.log("✓ Companies seeded");

  // Seed technologies
  const technologiesData = [
    {
      name: "React",
      category: "Frontend",
      description: "Modern UI library",
      vacancies: 8500,
      avgPackage: "6-12 LPA",
      topCompanies: "TCS, Infosys, Wipro",
      githubStars: "220K+",
      npmDownloads: "18M/week",
      lastUpdated: new Date().toLocaleDateString('en-IN'),
    },
    {
      name: "Angular",
      category: "Frontend",
      description: "Enterprise framework",
      vacancies: 6200,
      avgPackage: "6-11 LPA",
      topCompanies: "Accenture, Capgemini, HCL",
      githubStars: "95K+",
      npmDownloads: "3M/week",
      lastUpdated: new Date().toLocaleDateString('en-IN'),
    },
    {
      name: "JavaScript",
      category: "Frontend",
      description: "Core web language",
      vacancies: 15000,
      avgPackage: "4-8 LPA",
      topCompanies: "All major companies",
      npmDownloads: "Universal",
      lastUpdated: new Date().toLocaleDateString('en-IN'),
    },
    {
      name: "Java",
      category: "Backend",
      description: "Enterprise backend language",
      vacancies: 12000,
      avgPackage: "5-10 LPA",
      topCompanies: "TCS, Accenture, HCL",
      githubStars: "Popular",
      lastUpdated: new Date().toLocaleDateString('en-IN'),
    },
    {
      name: "Python",
      category: "Backend",
      description: "Versatile programming language",
      vacancies: 9500,
      avgPackage: "6-13 LPA",
      topCompanies: "Google, Amazon, Microsoft",
      githubStars: "55K+",
      lastUpdated: new Date().toLocaleDateString('en-IN'),
    },
    {
      name: "Node.js",
      category: "Backend",
      description: "JavaScript runtime",
      vacancies: 7800,
      avgPackage: "7-14 LPA",
      topCompanies: "Startups, Tech companies",
      githubStars: "105K+",
      npmDownloads: "Core technology",
      lastUpdated: new Date().toLocaleDateString('en-IN'),
    },
    {
      name: "Django",
      category: "Backend",
      description: "Python web framework",
      vacancies: 4200,
      avgPackage: "7-13 LPA",
      topCompanies: "Instagram, Pinterest",
      githubStars: "76K+",
      lastUpdated: new Date().toLocaleDateString('en-IN'),
    },
    {
      name: "Spring Boot",
      category: "Backend",
      description: "Java framework",
      vacancies: 5500,
      avgPackage: "8-15 LPA",
      topCompanies: "Enterprise companies",
      githubStars: "72K+",
      lastUpdated: new Date().toLocaleDateString('en-IN'),
    },
    {
      name: "MySQL",
      category: "Database",
      description: "Relational database",
      vacancies: 8000,
      avgPackage: "5-9 LPA",
      topCompanies: "All companies",
      githubStars: "Popular",
      lastUpdated: new Date().toLocaleDateString('en-IN'),
    },
    {
      name: "MongoDB",
      category: "Database",
      description: "NoSQL database",
      vacancies: 6500,
      avgPackage: "6-12 LPA",
      topCompanies: "Startups, Modern apps",
      githubStars: "26K+",
      lastUpdated: new Date().toLocaleDateString('en-IN'),
    },
    {
      name: "PostgreSQL",
      category: "Database",
      description: "Advanced SQL database",
      vacancies: 5200,
      avgPackage: "6-11 LPA",
      topCompanies: "Tech companies",
      githubStars: "Popular",
      lastUpdated: new Date().toLocaleDateString('en-IN'),
    },
  ];

  for (const tech of technologiesData) {
    await db.insert(technologies).values(tech).onConflictDoNothing();
  }
  console.log("✓ Technologies seeded");

  console.log("\n✅ Database seeded successfully!");
  console.log("\nAdmin credentials:");
  console.log("Username: admin");
  console.log("Password: admin123");
  
  process.exit(0);
}

seed().catch((error) => {
  console.error("Error seeding database:", error);
  process.exit(1);
});
