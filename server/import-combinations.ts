import { db } from "./db";
import { technologyCombinations } from "@shared/schema";

// CSV Data from Perplexity - Latest Job Market Data (31-Oct-2025)
const CSV_DATA = `Technology Combination,Job Role,Vacancies,Fresher Package,Experienced Package,Top Companies,Popularity Score
"HTML5","Frontend Developer",8000,"3-6 LPA","6-13 LPA","TCS, Infosys, Wipro, Capgemini, Cognizant, IBM",9
"CSS3","Frontend Developer",8000,"3-6 LPA","6-13 LPA","TCS, Infosys, Wipro, Capgemini, Cognizant, IBM",9
"JavaScript","Frontend Developer",9000,"3-6 LPA","7-14 LPA","Infosys, Wipro, Cognizant, IBM, TCS",10
"React.js","React Developer",6000,"4-7 LPA","7-16 LPA","Flipkart, Swiggy, Ola, PayTM, Infosys, Cognizant",9
"Angular JS","Angular Developer",4500,"4-7 LPA","7-15 LPA","HCL, TCS, Capgemini, Wipro, Infosys",8
"Bootstrap","UI Developer",3500,"3-6 LPA","6-11 LPA","Infosys, Capgemini, Tata, Wipro",7
"Java","Java Developer",10500,"3.5-7 LPA","6-14 LPA","TCS, HCL, Infosys, Wipro, Tech Mahindra",10
"Spring Boot","Spring Boot Developer",7000,"4-8 LPA","8-18 LPA","TCS, Infosys, IBM, Capgemini, Atos",9
"Django","Django Developer",2500,"4-7 LPA","7-14 LPA","Amazon, Flipkart, Capgemini, Infosys",7
"Python Core","Python Developer",9000,"3.8-6.5 LPA","7-15 LPA","Amazon, Google, Infosys, Capgemini, Cognizant",10
"Node.js","Node.js Developer",4000,"4-7 LPA","7-14 LPA","Flipkart, Swiggy, Zomato, PayTM, Ola",9
"Express.js","Node.js Developer",2800,"3.5-6 LPA","6-12 LPA","Infosys, Wipro, startups, Capgemini",8
"PHP Core","PHP Developer",3000,"2.5-4 LPA","5-9 LPA","Wipro, Capgemini, Infosys, startups",7
"Laravel","PHP Developer",900,"3-5 LPA","5-10 LPA","Capgemini, Tata, startups",6
"MySQL","DB Administrator",4500,"3.5-6 LPA","6-13 LPA","TCS, Infosys, Wipro, IBM, Tech Mahindra",8
"MongoDB","DB Developer",1200,"4-7 LPA","7-15 LPA","Flipkart, Swiggy, Zomato, Capgemini, startups",7
"Oracle","DB Administrator",3500,"3.5-6 LPA","6-14 LPA","Infosys, TCS, Oracle, IBM, Accenture",8
"TypeScript","Web Developer",3200,"4-7 LPA","7-15 LPA","Microsoft, Infosys, Cognizant, PayTM",7
"C++ with OOPS","C++ Developer",2100,"3.5-7 LPA","7-15 LPA","Infosys, Tata Elxsi, Tech Mahindra, Capgemini",8
"HTML5 + CSS3 + JavaScript","Frontend Developer",13000,"3-6 LPA","6-14 LPA","TCS, Infosys, Wipro, Capgemini, Cognizant",10
"HTML5 + CSS3 + JavaScript + React.js","Frontend Developer",7000,"4-7 LPA","7-16 LPA","Flipkart, Swiggy, Ola, PayTM, Infosys",9
"React.js + TypeScript","Frontend Developer",3500,"4-8 LPA","8-16 LPA","Swiggy, Flipkart, Ola, Capgemini",8
"React.js + Redux","Frontend Developer",1800,"4-8 LPA","7-16 LPA","PayTM, Swiggy, Flipkart",7
"Angular JS + TypeScript","Angular Developer",3000,"4-7 LPA","7-15 LPA","Capgemini, Infosys, Wipro",7
"HTML5 + CSS3 + JavaScript + Angular JS","Frontend Developer",5500,"4-7 LPA","7-15 LPA","HCL, TCS, Capgemini",8
"React.js + Node.js + MongoDB","MERN Stack Developer",2500,"4-8 LPA","8-16 LPA","Flipkart, Swiggy, Zomato, PayTM, Ola",9
"React.js + Node.js + Express.js + MongoDB","MERN Stack Developer",2300,"4-8 LPA","8-16 LPA","Flipkart, Swiggy, Zomato, PayTM",9
"Angular JS + Node.js + MongoDB","MEAN Stack Developer",1900,"4-8 LPA","7-15 LPA","Wipro, Capgemini, LTIMindtree",8
"Java + MySQL","Java Developer",8500,"3.5-7 LPA","6-14 LPA","TCS, Infosys, HCL",9
"Java + Spring Boot","Java Backend Developer",7200,"4-8 LPA","8-18 LPA","TCS, IBM, Infosys",9
"Python + Django","Python Developer",2700,"4-7 LPA","7-15 LPA","Amazon, Flipkart, Google, Capgemini",8
"Python + Flask","Python Developer",1200,"4-7 LPA","7-14 LPA","Startups, Infosys",6
"Node.js + Express.js + MongoDB","Node.js Developer",3800,"4-7 LPA","7-13 LPA","Flipkart, Swiggy, Ola",9
"MySQL + PHP","PHP Developer",3200,"2.7-4.5 LPA","5-10 LPA","Wipro, Capgemini, Infosys",7
"Oracle + Java Core J2SE","Java Developer",3500,"3.5-7 LPA","6-14 LPA","TCS, Infosys, Oracle",8
"JavaScript Advance","Frontend Developer",8800,"3-6 LPA","7-14 LPA","Infosys, Cognizant, IBM",9
"ES6","Frontend Developer",8900,"3-6 LPA","7-14 LPA","Infosys, Cognizant, IBM",9
"jQuery","Frontend Developer",3000,"3-6 LPA","6-11 LPA","Infosys, Capgemini",6
"DSA","Software Engineer",9500,"4-7 LPA","7-16 LPA","Amazon, Google, TCS",10
"PHP Advance","PHP Developer",1500,"2.7-4.5 LPA","5-10 LPA","Wipro, Capgemini, startups",5
"Java Advance J2EE, JDBC, Servlet, JSP, MVC","Java Developer",4200,"4-7 LPA","7-15 LPA","TCS, HCL, Capgemini",9
"Spring Core","Spring Developer",3400,"4-8 LPA","7-14 LPA","Infosys, TCS, Capgemini",8
"Spring JDBC + ORM","Java Backend Developer",3200,"4-7.5 LPA","7-15 LPA","TCS, Infosys, Capgemini",8
"Spring Security","Security Engineer",1500,"4-7 LPA","7-15 LPA","Infosys, Wipro, IBM",7
"Hibernate ORM","Java ORM Developer",2100,"4-7 LPA","7-14 LPA","TCS, Infosys, Capgemini",7
"Microservices","Backend Developer",4000,"4-8 LPA","7-16 LPA","Infosys, Cognizant, startups",9
"REST API","Backend Developer",4300,"4-8 LPA","7-15 LPA","Infosys, Cognizant, startups",9
"Maven","Java Developer",1200,"4-7 LPA","7-14 LPA","TCS, Infosys, Capgemini",6
"Front End Presentation","UI Developer",9000,"3-6 LPA","6-13 LPA","Infosys, TCS, Flipkart",9
"Code Ignitor","PHP Developer",400,"2.7-4 LPA","5-10 LPA","Startup agencies",4
"Wordpress","Web Developer",3500,"2.5-5 LPA","5-10 LPA","Web agencies, Freelancers",7
"C Programming","Systems Programmer",900,"2.7-4 LPA","5-8 LPA","Infosys, Tech Mahindra",6
"Java Core J2SE + SQL","Java Developer",2500,"3.5-7 LPA","6-14 LPA","TCS, Infosys, Oracle",8`;

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

// Parse CSV and import data
export async function importTechnologyCombinations() {
  try {
    const lines = CSV_DATA.trim().split('\n');
    const headers = parseCSVLine(lines[0]);
    
    console.log('🚀 Starting import of technology combinations...');
    console.log(`📊 Found ${lines.length - 1} combinations to import`);
    
    // Clear existing combinations first
    await db.delete(technologyCombinations);
    console.log('🗑️  Cleared existing combinations');
    
    let imported = 0;
    let skipped = 0;
    
    for (let i = 1; i < lines.length; i++) {
      try {
        const values = parseCSVLine(lines[i]);
        
        // Parse technologies from the combination string
        // Handle both "Tech1 + Tech2" and "Tech1" formats
        const techComboStr = values[0].replace(/"/g, '');
        const technologies = techComboStr.split('+').map(t => t.trim()).filter(t => t.length > 0);
        
        // Parse companies from comma-separated string
        const companiesStr = values[5].replace(/"/g, '');
        const companies = companiesStr.split(',').map(c => c.trim());
        
        const vacancies = parseInt(values[2]);
        const category = determineCategory(technologies);
        const commonality = determineCommonality(vacancies);
        
        const combination = {
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
        };
        
        await db.insert(technologyCombinations).values(combination);
        imported++;
        
        if (imported % 10 === 0) {
          console.log(`✅ Imported ${imported} combinations...`);
        }
      } catch (error) {
        console.error(`❌ Error importing line ${i}:`, error);
        skipped++;
      }
    }
    
    console.log(`\n✅ Import complete!`);
    console.log(`✅ Successfully imported: ${imported}`);
    console.log(`⚠️ Skipped (errors): ${skipped}`);
    console.log(`📊 Total combinations in database: ${imported}`);
    
    return { imported, skipped };
  } catch (error) {
    console.error('❌ Failed to import technology combinations:', error);
    throw error;
  }
}

// Run import if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  importTechnologyCombinations()
    .then(() => {
      console.log('\n🎉 Import successful!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Import failed:', error);
      process.exit(1);
    });
}
