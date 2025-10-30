import { db } from "./db";
import { adminUsers, companies, placements, technologies } from "@shared/schema";
import bcrypt from "bcrypt";

async function seed() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await db.insert(adminUsers).values({
    username: "admin",
    password: hashedPassword,
  }).onConflictDoNothing();
  console.log("✓ Admin user created (username: admin, password: admin123)");

  // Seed companies with requested data
  const companiesData = [
    { 
      name: "TCS", 
      logoUrl: "https://logo.clearbit.com/tcs.com",
      totalPlacements: 15,
      avgPackage: "4.5 LPA" 
    },
    { 
      name: "Infosys", 
      logoUrl: "https://logo.clearbit.com/infosys.com",
      totalPlacements: 12,
      avgPackage: "5.2 LPA" 
    },
    { 
      name: "Wipro", 
      logoUrl: "https://logo.clearbit.com/wipro.com",
      totalPlacements: 8,
      avgPackage: "4.8 LPA" 
    },
    { 
      name: "Accenture", 
      logoUrl: "https://logo.clearbit.com/accenture.com",
      totalPlacements: 10,
      avgPackage: "8-14 LPA" 
    },
    { 
      name: "HCL Technologies", 
      logoUrl: "https://logo.clearbit.com/hcltech.com",
      totalPlacements: 7,
      avgPackage: "6-10 LPA" 
    },
    { 
      name: "Tech Mahindra", 
      logoUrl: "https://logo.clearbit.com/techmahindra.com",
      totalPlacements: 6,
      avgPackage: "7-11 LPA" 
    },
    { 
      name: "Capgemini", 
      logoUrl: "https://logo.clearbit.com/capgemini.com",
      totalPlacements: 9,
      avgPackage: "8-13 LPA" 
    },
    { 
      name: "IBM", 
      logoUrl: "https://logo.clearbit.com/ibm.com",
      totalPlacements: 5,
      avgPackage: "9-15 LPA" 
    },
    { 
      name: "Cognizant", 
      logoUrl: "https://logo.clearbit.com/cognizant.com",
      totalPlacements: 11,
      avgPackage: "5-11 LPA" 
    },
    { 
      name: "Google", 
      logoUrl: "https://logo.clearbit.com/google.com",
      totalPlacements: 2,
      avgPackage: "15-30 LPA" 
    },
    { 
      name: "Amazon", 
      logoUrl: "https://logo.clearbit.com/amazon.com",
      totalPlacements: 3,
      avgPackage: "18-35 LPA" 
    },
    { 
      name: "Microsoft", 
      logoUrl: "https://logo.clearbit.com/microsoft.com",
      totalPlacements: 4,
      avgPackage: "20-40 LPA" 
    },
  ];

  const insertedCompanies = [];
  for (const company of companiesData) {
    const [result] = await db.insert(companies).values(company).onConflictDoNothing().returning();
    insertedCompanies.push(result);
  }
  console.log("✓ Companies seeded");

  // Get company IDs for placements
  const allCompanies = await db.select().from(companies);
  const tcsCompany = allCompanies.find(c => c.name === "TCS");
  const infosysCompany = allCompanies.find(c => c.name === "Infosys");

  // Define placements data
  const placementsData = tcsCompany && infosysCompany ? [
    {
      studentName: "Sachin Kumar",
      companyId: tcsCompany.id,
      package: "4 LPA",
      phone: "+919876543210",
      photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sachin",
      profile: "Java Developer",
      course: "Core Java + Advanced Java",
      review: "Great training! Cleared TCS interview easily.",
      interviewRounds: "3 rounds - Technical, Managerial, HR",
      studyDuration: "6 months"
    },
    {
      studentName: "Zeeshan Ahmed",
      companyId: tcsCompany.id,
      package: "10 LPA",
      phone: "+919123456789",
      photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zeeshan",
      profile: "Senior Software Engineer",
      course: "Full Stack Java (Spring Boot + React)",
      review: "Excellent mentorship. Got TCS Digital with 10 LPA!",
      interviewRounds: "4 rounds - Coding, System Design, Technical, HR",
      studyDuration: "8 months"
    },
    {
      studentName: "Priya Sharma",
      companyId: infosysCompany.id,
      package: "5.5 LPA",
      phone: "+919988776655",
      photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
      profile: "Python Developer",
      course: "Python + Django + MySQL",
      review: "Practical projects helped a lot in interviews.",
      interviewRounds: "3 rounds - Technical, Coding, HR",
      studyDuration: "6 months"
    },
    {
      studentName: "Rahul Verma",
      companyId: tcsCompany.id,
      package: "4.2 LPA",
      phone: "+919876512345",
      photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
      profile: "Frontend Developer",
      course: "React + JavaScript + HTML/CSS",
      review: "Amazing learning experience. Industry-ready skills!",
      interviewRounds: "3 rounds - Technical, Project Discussion, HR",
      studyDuration: "5 months"
    },
    {
      studentName: "Anjali Gupta",
      companyId: infosysCompany.id,
      package: "5 LPA",
      phone: "+919123498765",
      photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anjali",
      profile: "Full Stack Developer",
      course: "MERN Stack (MongoDB + Express + React + Node.js)",
      review: "Comprehensive training with real-world projects.",
      interviewRounds: "4 rounds - Coding, Technical, Managerial, HR",
      studyDuration: "7 months"
    },
    {
      studentName: "Karan Singh",
      companyId: tcsCompany.id,
      package: "4.5 LPA",
      phone: "+919988123456",
      photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Karan",
      profile: "Backend Developer",
      course: "Node.js + Express + PostgreSQL",
      review: "Practical approach to teaching. Highly recommended!",
      interviewRounds: "3 rounds - Technical, System Design, HR",
      studyDuration: "6 months"
    },
  ] : [];

  // Seed sample student placements
  if (placementsData.length > 0) {
    for (const placement of placementsData) {
      await db.insert(placements).values(placement).onConflictDoNothing();
    }
    console.log("✓ Sample student placements seeded");
  }

  // Seed technologies from CSV data
  const technologiesData = [
    {
      name: "Python",
      category: "Backend",
      description: "Data Science, ML, AI, Automation, Web Dev",
      vacancies: 950,
      avgPackage: "6-13 LPA",
      topCompanies: "Google, Amazon, Microsoft",
      githubStars: "55K+",
      lastUpdated: "29-Oct-2025",
    },
    {
      name: "Java",
      category: "Backend",
      description: "Enterprise Apps, Backend, Android Dev",
      vacancies: 1200,
      avgPackage: "5-10 LPA",
      topCompanies: "TCS, Accenture, HCL",
      githubStars: "Popular",
      lastUpdated: "29-Oct-2025",
    },
    {
      name: "React",
      category: "Frontend",
      description: "Web UI, SPAs, Frontend Development",
      vacancies: 850,
      avgPackage: "6-12 LPA",
      topCompanies: "TCS, Infosys, Wipro",
      githubStars: "220K+",
      npmDownloads: "18M/week",
      lastUpdated: "29-Oct-2025",
    },
    {
      name: "JavaScript",
      category: "Frontend",
      description: "Frontend, Web Apps, Full Stack",
      vacancies: 1100,
      avgPackage: "5-12 LPA",
      topCompanies: "Infosys, Cognizant, IBM",
      npmDownloads: "Universal",
      lastUpdated: "29-Oct-2025",
    },
    {
      name: "C++",
      category: "Backend",
      description: "System Software, Game Dev, Performance Apps",
      vacancies: 700,
      avgPackage: "5-12 LPA",
      topCompanies: "Microsoft, Amazon, Intel",
      githubStars: "Popular",
      lastUpdated: "29-Oct-2025",
    },
    {
      name: "C#",
      category: "Backend",
      description: "Windows Apps, Game Dev, Enterprise",
      vacancies: 650,
      avgPackage: "6-11 LPA",
      topCompanies: "Microsoft, Capgemini",
      githubStars: "Popular",
      lastUpdated: "29-Oct-2025",
    },
    {
      name: "SQL",
      category: "Database",
      description: "Database Management, Data Analytics",
      vacancies: 800,
      avgPackage: "4-10 LPA",
      topCompanies: "TCS, Oracle, HCL",
      githubStars: "Universal",
      lastUpdated: "29-Oct-2025",
    },
    {
      name: "Go",
      category: "Backend",
      description: "Cloud Infra, System Programming",
      vacancies: 450,
      avgPackage: "6-14 LPA",
      topCompanies: "Google, Flipkart",
      githubStars: "120K+",
      lastUpdated: "29-Oct-2025",
    },
    {
      name: "Rust",
      category: "Backend",
      description: "Performance Apps, System Dev",
      vacancies: 400,
      avgPackage: "6-15 LPA",
      topCompanies: "Amazon, Mozilla",
      githubStars: "95K+",
      lastUpdated: "29-Oct-2025",
    },
    {
      name: "Swift",
      category: "Frontend",
      description: "iOS/macOS App Development",
      vacancies: 450,
      avgPackage: "7-16 LPA",
      topCompanies: "Apple, Tech Mahindra",
      githubStars: "66K+",
      lastUpdated: "29-Oct-2025",
    },
    {
      name: "TypeScript",
      category: "Frontend",
      description: "Scalable Web Apps, Full Stack",
      vacancies: 500,
      avgPackage: "6-13 LPA",
      topCompanies: "Microsoft, Infosys",
      githubStars: "98K+",
      npmDownloads: "50M/week",
      lastUpdated: "29-Oct-2025",
    },
    {
      name: "PHP",
      category: "Backend",
      description: "Web Development, Server-side Scripting",
      vacancies: 600,
      avgPackage: "4-9 LPA",
      topCompanies: "Wipro, TCS, Siemens",
      githubStars: "37K+",
      lastUpdated: "29-Oct-2025",
    },
    {
      name: "Kotlin",
      category: "Frontend",
      description: "Android Apps, Backend Dev",
      vacancies: 420,
      avgPackage: "6-11 LPA",
      topCompanies: "Google, Infosys",
      githubStars: "48K+",
      lastUpdated: "29-Oct-2025",
    },
    {
      name: "Scala",
      category: "Backend",
      description: "Big Data, Functional Programming",
      vacancies: 350,
      avgPackage: "7-13 LPA",
      topCompanies: "Infosys, TCS",
      githubStars: "14K+",
      lastUpdated: "29-Oct-2025",
    },
    {
      name: "Ruby",
      category: "Backend",
      description: "Web Development (Rails)",
      vacancies: 300,
      avgPackage: "5-10 LPA",
      topCompanies: "Capgemini, ThoughtWorks",
      githubStars: "21K+",
      lastUpdated: "29-Oct-2025",
    },
    {
      name: "Dart",
      category: "Frontend",
      description: "Mobile Apps (Flutter)",
      vacancies: 200,
      avgPackage: "5-9 LPA",
      topCompanies: "Google, Cognizant",
      githubStars: "10K+",
      lastUpdated: "29-Oct-2025",
    },
    {
      name: "Perl",
      category: "Backend",
      description: "Scripting, System Automation",
      vacancies: 100,
      avgPackage: "4-8 LPA",
      topCompanies: "IBM, Accenture",
      githubStars: "Popular",
      lastUpdated: "29-Oct-2025",
    },
    {
      name: "MATLAB",
      category: "Other",
      description: "Simulation, Data Analysis",
      vacancies: 80,
      avgPackage: "7-14 LPA",
      topCompanies: "MathWorks, HCL",
      githubStars: "Proprietary",
      lastUpdated: "29-Oct-2025",
    },
    {
      name: "R",
      category: "Other",
      description: "Data Science, Stats Analysis",
      vacancies: 120,
      avgPackage: "6-12 LPA",
      topCompanies: "Google, Amazon",
      githubStars: "Popular",
      lastUpdated: "29-Oct-2025",
    },
    {
      name: "Solidity",
      category: "Other",
      description: "Blockchain Apps, Smart Contracts",
      vacancies: 90,
      avgPackage: "8-17 LPA",
      topCompanies: "Polygon, Tata",
      githubStars: "22K+",
      lastUpdated: "29-Oct-2025",
    },
    {
      name: "Node.js",
      category: "Backend",
      description: "JavaScript runtime for backend development",
      vacancies: 780,
      avgPackage: "7-14 LPA",
      topCompanies: "Startups, Tech companies",
      githubStars: "105K+",
      npmDownloads: "Core technology",
      lastUpdated: "29-Oct-2025",
    },
    {
      name: "Angular",
      category: "Frontend",
      description: "Enterprise framework for web applications",
      vacancies: 620,
      avgPackage: "6-11 LPA",
      topCompanies: "Accenture, Capgemini, HCL",
      githubStars: "95K+",
      npmDownloads: "3M/week",
      lastUpdated: "29-Oct-2025",
    },
    {
      name: "Django",
      category: "Backend",
      description: "Python web framework",
      vacancies: 420,
      avgPackage: "7-13 LPA",
      topCompanies: "Instagram, Pinterest",
      githubStars: "76K+",
      lastUpdated: "29-Oct-2025",
    },
    {
      name: "Spring Boot",
      category: "Backend",
      description: "Java framework for enterprise applications",
      vacancies: 550,
      avgPackage: "8-15 LPA",
      topCompanies: "Enterprise companies",
      githubStars: "72K+",
      lastUpdated: "29-Oct-2025",
    },
    {
      name: "MySQL",
      category: "Database",
      description: "Relational database management system",
      vacancies: 800,
      avgPackage: "5-9 LPA",
      topCompanies: "All companies",
      githubStars: "Popular",
      lastUpdated: "29-Oct-2025",
    },
    {
      name: "MongoDB",
      category: "Database",
      description: "NoSQL document database",
      vacancies: 650,
      avgPackage: "6-12 LPA",
      topCompanies: "Startups, Modern apps",
      githubStars: "26K+",
      lastUpdated: "29-Oct-2025",
    },
    {
      name: "PostgreSQL",
      category: "Database",
      description: "Advanced SQL database",
      vacancies: 520,
      avgPackage: "6-11 LPA",
      topCompanies: "Tech companies",
      githubStars: "Popular",
      lastUpdated: "29-Oct-2025",
    },
    {
      name: "HTML",
      category: "Frontend",
      description: "Markup language for web pages",
      vacancies: 1500,
      avgPackage: "3-7 LPA",
      topCompanies: "All web companies",
      githubStars: "Universal",
      lastUpdated: "29-Oct-2025",
    },
    {
      name: "CSS",
      category: "Frontend",
      description: "Styling language for web pages",
      vacancies: 1400,
      avgPackage: "3-7 LPA",
      topCompanies: "All web companies",
      githubStars: "Universal",
      lastUpdated: "29-Oct-2025",
    },
    {
      name: "Bootstrap",
      category: "Frontend",
      description: "CSS framework for responsive design",
      vacancies: 800,
      avgPackage: "4-8 LPA",
      topCompanies: "Web development companies",
      githubStars: "167K+",
      npmDownloads: "5M/week",
      lastUpdated: "29-Oct-2025",
    },
    {
      name: "Express",
      category: "Backend",
      description: "Node.js web framework",
      vacancies: 700,
      avgPackage: "6-12 LPA",
      topCompanies: "Startups, Modern companies",
      githubStars: "64K+",
      npmDownloads: "22M/week",
      lastUpdated: "29-Oct-2025",
    },
  ];

  for (const tech of technologiesData) {
    await db.insert(technologies).values(tech).onConflictDoNothing();
  }
  console.log("✓ Technologies seeded (including all CSV data)");

  console.log("\n✅ Database seeded successfully!");
  console.log("\n📊 Summary:");
  console.log(`   - ${companiesData.length} companies added`);
  console.log(`   - ${placementsData ? placementsData.length : 6} student placements added`);
  console.log(`   - ${technologiesData.length} technologies added`);
  console.log("\n🔐 Admin credentials:");
  console.log("   Username: admin");
  console.log("   Password: admin123");
  console.log("\n💡 To run this seed script:");
  console.log("   npm run db:seed\n");
  
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Error seeding database:", error);
  process.exit(1);
});
