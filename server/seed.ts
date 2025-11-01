import { db } from "./db";
import { adminUsers, companies, placements, technologies } from "@shared/schema";
import bcrypt from "bcrypt";
import { importTechnologyCombinations } from "./import-combinations";

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

  const technologiesData = [
    {
      name: "HTML5",
      category: "Frontend",
      description: "Markup language for creating web pages and applications",
      vacancies: 8000,
      avgPackage: "3-6 LPA",
      topCompanies: "TCS, Infosys, Wipro, Capgemini, Cognizant, IBM",
      githubStars: "Universal",
      lastUpdated: "31-Oct-2025",
    },
    {
      name: "CSS3",
      category: "Frontend",
      description: "Styling language for web pages with modern features",
      vacancies: 8000,
      avgPackage: "3-6 LPA",
      topCompanies: "TCS, Infosys, Wipro, Capgemini, Cognizant, IBM",
      githubStars: "Universal",
      lastUpdated: "31-Oct-2025",
    },
    {
      name: "JavaScript",
      category: "Frontend",
      description: "Programming language for web development",
      vacancies: 9000,
      avgPackage: "3-6 LPA",
      topCompanies: "Infosys, Wipro, Cognizant, IBM, TCS",
      npmDownloads: "Universal",
      lastUpdated: "31-Oct-2025",
    },
    {
      name: "JavaScript Advance",
      category: "Frontend",
      description: "Advanced JavaScript concepts and patterns",
      vacancies: 8800,
      avgPackage: "3-6 LPA",
      topCompanies: "Infosys, Cognizant, IBM",
      npmDownloads: "Universal",
      lastUpdated: "31-Oct-2025",
    },
    {
      name: "ES6",
      category: "Frontend",
      description: "Modern JavaScript with latest features",
      vacancies: 8900,
      avgPackage: "3-6 LPA",
      topCompanies: "Infosys, Cognizant, IBM",
      npmDownloads: "Universal",
      lastUpdated: "31-Oct-2025",
    },
    {
      name: "jQuery",
      category: "Frontend",
      description: "JavaScript library for DOM manipulation",
      vacancies: 3000,
      avgPackage: "3-6 LPA",
      topCompanies: "Infosys, Capgemini",
      githubStars: "59K+",
      npmDownloads: "3M/week",
      lastUpdated: "31-Oct-2025",
    },
    {
      name: "React.js",
      category: "Frontend",
      description: "Popular JavaScript library for building UIs",
      vacancies: 6000,
      avgPackage: "4-7 LPA",
      topCompanies: "Flipkart, Swiggy, Ola, PayTM, Infosys, Cognizant",
      githubStars: "220K+",
      npmDownloads: "18M/week",
      lastUpdated: "31-Oct-2025",
    },
    {
      name: "Angular JS",
      category: "Frontend",
      description: "Enterprise framework for web applications",
      vacancies: 4500,
      avgPackage: "4-7 LPA",
      topCompanies: "HCL, TCS, Capgemini, Wipro, Infosys",
      githubStars: "95K+",
      npmDownloads: "3M/week",
      lastUpdated: "31-Oct-2025",
    },
    {
      name: "TypeScript",
      category: "Frontend",
      description: "Typed superset of JavaScript",
      vacancies: 3200,
      avgPackage: "4-7 LPA",
      topCompanies: "Microsoft, Infosys, Cognizant, PayTM",
      githubStars: "98K+",
      npmDownloads: "50M/week",
      lastUpdated: "31-Oct-2025",
    },
    {
      name: "Bootstrap",
      category: "Frontend",
      description: "CSS framework for responsive design",
      vacancies: 3500,
      avgPackage: "3-6 LPA",
      topCompanies: "Infosys, Capgemini, Tata, Wipro",
      githubStars: "167K+",
      npmDownloads: "5M/week",
      lastUpdated: "31-Oct-2025",
    },
    {
      name: "Front End Presentation",
      category: "Frontend",
      description: "Creating engaging UI presentations",
      vacancies: 9000,
      avgPackage: "3-6 LPA",
      topCompanies: "Infosys, TCS, Flipkart",
      githubStars: "Universal",
      lastUpdated: "31-Oct-2025",
    },
    {
      name: "Python Core",
      category: "Backend",
      description: "Core Python programming fundamentals",
      vacancies: 9000,
      avgPackage: "3.8-6.5 LPA",
      topCompanies: "Amazon, Google, Infosys, Capgemini, Cognizant",
      githubStars: "55K+",
      lastUpdated: "31-Oct-2025",
    },
    {
      name: "Python Advance",
      category: "Backend",
      description: "Advanced Python concepts and libraries",
      vacancies: 9000,
      avgPackage: "3.8-6.5 LPA",
      topCompanies: "Amazon, Google, Infosys, Capgemini, Cognizant",
      githubStars: "55K+",
      lastUpdated: "31-Oct-2025",
    },
    {
      name: "Django",
      category: "Backend",
      description: "Python web framework for rapid development",
      vacancies: 2500,
      avgPackage: "4-7 LPA",
      topCompanies: "Amazon, Flipkart, Capgemini, Infosys",
      githubStars: "76K+",
      lastUpdated: "31-Oct-2025",
    },
    {
      name: "Java Core J2SE",
      category: "Backend",
      description: "Core Java programming",
      vacancies: 10500,
      avgPackage: "3.5-7 LPA",
      topCompanies: "TCS, HCL, Infosys, Wipro, Tech Mahindra",
      githubStars: "Popular",
      lastUpdated: "31-Oct-2025",
    },
    {
      name: "Java Advance J2EE",
      category: "Backend",
      description: "Enterprise Java technologies",
      vacancies: 4200,
      avgPackage: "4-7 LPA",
      topCompanies: "TCS, HCL, Capgemini",
      githubStars: "Popular",
      lastUpdated: "31-Oct-2025",
    },
    {
      name: "Spring Boot",
      category: "Backend",
      description: "Java framework for enterprise applications",
      vacancies: 7000,
      avgPackage: "4-8 LPA",
      topCompanies: "TCS, Infosys, IBM, Capgemini, Atos",
      githubStars: "72K+",
      lastUpdated: "31-Oct-2025",
    },
    {
      name: "Spring Core",
      category: "Backend",
      description: "Core Spring Framework",
      vacancies: 3400,
      avgPackage: "4-8 LPA",
      topCompanies: "Infosys, TCS, Capgemini",
      githubStars: "55K+",
      lastUpdated: "31-Oct-2025",
    },
    {
      name: "Spring Security",
      category: "Backend",
      description: "Authentication and authorization framework",
      vacancies: 1500,
      avgPackage: "4-7 LPA",
      topCompanies: "Infosys, Wipro, IBM",
      githubStars: "Popular",
      lastUpdated: "31-Oct-2025",
    },
    {
      name: "Hibernate ORM",
      category: "Backend",
      description: "Object-relational mapping for Java",
      vacancies: 2100,
      avgPackage: "4-7 LPA",
      topCompanies: "TCS, Infosys, Capgemini",
      githubStars: "Popular",
      lastUpdated: "31-Oct-2025",
    },
    {
      name: "Node.js",
      category: "Backend",
      description: "JavaScript runtime for backend development",
      vacancies: 4000,
      avgPackage: "4-7 LPA",
      topCompanies: "Flipkart, Swiggy, Zomato, PayTM, Ola",
      githubStars: "105K+",
      npmDownloads: "Core technology",
      lastUpdated: "31-Oct-2025",
    },
    {
      name: "Express.js",
      category: "Backend",
      description: "Node.js web framework",
      vacancies: 2800,
      avgPackage: "3.5-6 LPA",
      topCompanies: "Infosys, Wipro, startups, Capgemini",
      githubStars: "64K+",
      npmDownloads: "22M/week",
      lastUpdated: "31-Oct-2025",
    },
    {
      name: "PHP Core",
      category: "Backend",
      description: "Server-side scripting language",
      vacancies: 3000,
      avgPackage: "2.5-4 LPA",
      topCompanies: "Wipro, Capgemini, Infosys, startups",
      githubStars: "37K+",
      lastUpdated: "31-Oct-2025",
    },
    {
      name: "PHP Advance",
      category: "Backend",
      description: "Advanced PHP concepts",
      vacancies: 1500,
      avgPackage: "2.7-4.5 LPA",
      topCompanies: "Wipro, Capgemini, startups",
      githubStars: "37K+",
      lastUpdated: "31-Oct-2025",
    },
    {
      name: "Laravel",
      category: "Backend",
      description: "PHP framework for web applications",
      vacancies: 900,
      avgPackage: "3-5 LPA",
      topCompanies: "Capgemini, Tata, startups",
      githubStars: "76K+",
      lastUpdated: "31-Oct-2025",
    },
    {
      name: "Code Ignitor",
      category: "Backend",
      description: "Lightweight PHP framework",
      vacancies: 400,
      avgPackage: "2.7-4 LPA",
      topCompanies: "Startup agencies",
      githubStars: "18K+",
      lastUpdated: "31-Oct-2025",
    },
    {
      name: "WordPress",
      category: "Backend",
      description: "Content management system",
      vacancies: 3500,
      avgPackage: "2.5-5 LPA",
      topCompanies: "Web agencies, Freelancers",
      githubStars: "Popular",
      lastUpdated: "31-Oct-2025",
    },
    {
      name: "MySQL",
      category: "Database",
      description: "Relational database management system",
      vacancies: 4500,
      avgPackage: "3.5-6 LPA",
      topCompanies: "TCS, Infosys, Wipro, IBM, Tech Mahindra",
      githubStars: "Popular",
      lastUpdated: "31-Oct-2025",
    },
    {
      name: "MongoDB",
      category: "Database",
      description: "NoSQL document database",
      vacancies: 1200,
      avgPackage: "4-7 LPA",
      topCompanies: "Flipkart, Swiggy, Zomato, Capgemini, startups",
      githubStars: "26K+",
      lastUpdated: "31-Oct-2025",
    },
    {
      name: "Oracle",
      category: "Database",
      description: "Enterprise database system",
      vacancies: 3500,
      avgPackage: "3.5-6 LPA",
      topCompanies: "Infosys, TCS, Oracle, IBM, Accenture",
      githubStars: "Popular",
      lastUpdated: "31-Oct-2025",
    },
    {
      name: "C Programming",
      category: "Backend",
      description: "Systems programming language",
      vacancies: 900,
      avgPackage: "2.7-4 LPA",
      topCompanies: "Infosys, Tech Mahindra",
      githubStars: "Popular",
      lastUpdated: "31-Oct-2025",
    },
    {
      name: "C++ with OOPS",
      category: "Backend",
      description: "Object-oriented C++ programming",
      vacancies: 2100,
      avgPackage: "3.5-7 LPA",
      topCompanies: "Infosys, Tata Elxsi, Tech Mahindra, Capgemini",
      githubStars: "Popular",
      lastUpdated: "31-Oct-2025",
    },
    {
      name: "Microservices",
      category: "Backend",
      description: "Microservices architecture pattern",
      vacancies: 4000,
      avgPackage: "4-8 LPA",
      topCompanies: "Infosys, Cognizant, startups",
      githubStars: "Popular",
      lastUpdated: "31-Oct-2025",
    },
    {
      name: "REST API",
      category: "Backend",
      description: "RESTful web services",
      vacancies: 4300,
      avgPackage: "4-8 LPA",
      topCompanies: "Infosys, Cognizant, startups",
      githubStars: "Universal",
      lastUpdated: "31-Oct-2025",
    },
    {
      name: "Maven",
      category: "Backend",
      description: "Build automation tool for Java",
      vacancies: 1200,
      avgPackage: "4-7 LPA",
      topCompanies: "TCS, Infosys, Capgemini",
      githubStars: "Popular",
      lastUpdated: "31-Oct-2025",
    },
    {
      name: "DSA",
      category: "Other",
      description: "Data Structures and Algorithms",
      vacancies: 9500,
      avgPackage: "4-7 LPA",
      topCompanies: "Amazon, Google, TCS",
      githubStars: "Universal",
      lastUpdated: "31-Oct-2025",
    },
  ];

  for (const tech of technologiesData) {
    await db.insert(technologies).values(tech).onConflictDoNothing();
  }
  console.log("✓ Technologies seeded (including all CSV data)");

  // Import technology combinations
  console.log("\n📦 Importing technology combinations...");
  const { imported, skipped } = await importTechnologyCombinations();
  console.log(`✓ Technology combinations imported: ${imported} combinations`);

  console.log("\n✅ Database seeded successfully!");
  console.log("\n📊 Summary:");
  console.log(`   - ${companiesData.length} companies added`);
  console.log(`   - ${placementsData ? placementsData.length : 6} student placements added`);
  console.log(`   - ${technologiesData.length} technologies added`);
  console.log(`   - ${imported} technology combinations added`);
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
