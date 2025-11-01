// Seed script to populate Google Sheets with correct data
import {
  initializeSheets,
  writeTechnologies,
  writeCombinations,
  writeCompanies,
  writePlacements,
} from './googleSheets';

// Only technologies that are actually taught
const TAUGHT_TECHNOLOGIES = [
  // Frontend Technologies
  { name: 'HTML5', category: 'Frontend', subCategory: 'Markup', displayOrder: 1, vacancies: 8000, fresherPackage: '2-4 LPA', experiencedPackage: '4-8 LPA', topCompanies: 'TCS, Infosys, Wipro, Capgemini', popularityScore: 7, description: 'Standard markup language for creating web pages' },
  { name: 'CSS3', category: 'Frontend', subCategory: 'Styling', displayOrder: 2, vacancies: 8000, fresherPackage: '2-4 LPA', experiencedPackage: '4-8 LPA', topCompanies: 'TCS, Infosys, Wipro, Capgemini', popularityScore: 7, description: 'Style sheet language for web design' },
  { name: 'JavaScript', category: 'Frontend', subCategory: 'Programming', displayOrder: 3, vacancies: 9000, fresherPackage: '3-6 LPA', experiencedPackage: '7-14 LPA', topCompanies: 'Infosys, Wipro, Cognizant, IBM', popularityScore: 10, description: 'Core programming language for web development' },
  { name: 'JavaScript Advance', category: 'Frontend', subCategory: 'Programming', displayOrder: 4, vacancies: 7000, fresherPackage: '4-7 LPA', experiencedPackage: '8-15 LPA', topCompanies: 'Infosys, Wipro, Cognizant, IBM', popularityScore: 9, description: 'Advanced JavaScript concepts and patterns' },
  { name: 'jQuery', category: 'Frontend', subCategory: 'Library', displayOrder: 5, vacancies: 3000, fresherPackage: '3-5 LPA', experiencedPackage: '6-10 LPA', topCompanies: 'Infosys, Capgemini', popularityScore: 6, description: 'Fast, small JavaScript library for DOM manipulation' },
  { name: 'Bootstrap', category: 'Frontend', subCategory: 'Framework', displayOrder: 6, vacancies: 3500, fresherPackage: '3-5 LPA', experiencedPackage: '6-11 LPA', topCompanies: 'Infosys, Capgemini, Wipro', popularityScore: 7, description: 'Popular CSS framework for responsive design' },
  { name: 'ES6', category: 'Frontend', subCategory: 'Programming', displayOrder: 7, vacancies: 6000, fresherPackage: '3-6 LPA', experiencedPackage: '7-14 LPA', topCompanies: 'Infosys, Wipro, Cognizant', popularityScore: 8, description: 'Modern JavaScript with new features' },
  { name: 'React.js', category: 'Frontend', subCategory: 'Framework', displayOrder: 8, vacancies: 6000, fresherPackage: '4-7 LPA', experiencedPackage: '7-16 LPA', topCompanies: 'Flipkart, Swiggy, Ola, PayTM', popularityScore: 9, description: 'Popular library for building user interfaces' },
  { name: 'TypeScript', category: 'Frontend', subCategory: 'Programming', displayOrder: 9, vacancies: 3200, fresherPackage: '4-7 LPA', experiencedPackage: '7-15 LPA', topCompanies: 'Microsoft, Infosys, Cognizant', popularityScore: 7, description: 'Typed superset of JavaScript' },
  { name: 'Angular JS', category: 'Frontend', subCategory: 'Framework', displayOrder: 10, vacancies: 4500, fresherPackage: '4-7 LPA', experiencedPackage: '7-15 LPA', topCompanies: 'HCL, TCS, Capgemini, Wipro', popularityScore: 8, description: 'Comprehensive JavaScript framework' },

  // Backend Technologies
  { name: 'Python Core', category: 'Backend', subCategory: 'Programming', displayOrder: 11, vacancies: 9000, fresherPackage: '3-6 LPA', experiencedPackage: '7-15 LPA', topCompanies: 'Amazon, Google, Infosys', popularityScore: 10, description: 'Versatile programming language' },
  { name: 'Python Advance', category: 'Backend', subCategory: 'Programming', displayOrder: 12, vacancies: 7000, fresherPackage: '4-7 LPA', experiencedPackage: '8-16 LPA', topCompanies: 'Amazon, Google, Infosys', popularityScore: 9, description: 'Advanced Python programming concepts' },
  { name: 'Python OOPS', category: 'Backend', subCategory: 'Programming', displayOrder: 13, vacancies: 6500, fresherPackage: '4-7 LPA', experiencedPackage: '7-15 LPA', topCompanies: 'Amazon, Google, Infosys', popularityScore: 8, description: 'Object-oriented programming in Python' },
  { name: 'Django ORM', category: 'Backend', subCategory: 'Framework', displayOrder: 14, vacancies: 2000, fresherPackage: '4-7 LPA', experiencedPackage: '7-14 LPA', topCompanies: 'Amazon, Flipkart, Capgemini', popularityScore: 7, description: 'Database abstraction layer for Django' },
  { name: 'Django MVC', category: 'Backend', subCategory: 'Framework', displayOrder: 15, vacancies: 2500, fresherPackage: '4-7 LPA', experiencedPackage: '7-14 LPA', topCompanies: 'Amazon, Flipkart, Capgemini', popularityScore: 7, description: 'Model-View-Controller pattern in Django' },
  { name: 'Django Rest Framework', category: 'Backend', subCategory: 'Framework', displayOrder: 16, vacancies: 2200, fresherPackage: '4-8 LPA', experiencedPackage: '8-16 LPA', topCompanies: 'Amazon, Flipkart, Google', popularityScore: 8, description: 'Build RESTful APIs with Django' },
  { name: 'Java Core (J2SE)', category: 'Backend', subCategory: 'Programming', displayOrder: 17, vacancies: 10500, fresherPackage: '3-7 LPA', experiencedPackage: '6-14 LPA', topCompanies: 'TCS, HCL, Infosys, Wipro', popularityScore: 10, description: 'Core Java programming fundamentals' },
  { name: 'Java Advance (J2EE, JDBC, Servlet, JSP, MVC)', category: 'Backend', subCategory: 'Programming', displayOrder: 18, vacancies: 8000, fresherPackage: '4-8 LPA', experiencedPackage: '7-16 LPA', topCompanies: 'TCS, HCL, Infosys, Wipro', popularityScore: 9, description: 'Advanced Java enterprise technologies' },
  { name: 'Spring Core', category: 'Backend', subCategory: 'Framework', displayOrder: 19, vacancies: 5000, fresherPackage: '4-8 LPA', experiencedPackage: '7-16 LPA', topCompanies: 'TCS, Infosys, IBM', popularityScore: 8, description: 'Core Spring framework concepts' },
  { name: 'Spring JDBC + ORM', category: 'Backend', subCategory: 'Framework', displayOrder: 20, vacancies: 4500, fresherPackage: '4-8 LPA', experiencedPackage: '8-17 LPA', topCompanies: 'TCS, Infosys, IBM', popularityScore: 8, description: 'Database integration with Spring' },
  { name: 'Spring MVC', category: 'Backend', subCategory: 'Framework', displayOrder: 21, vacancies: 5500, fresherPackage: '4-8 LPA', experiencedPackage: '8-18 LPA', topCompanies: 'TCS, Infosys, IBM, Capgemini', popularityScore: 9, description: 'Web framework for Spring' },
  { name: 'Spring Boot', category: 'Backend', subCategory: 'Framework', displayOrder: 22, vacancies: 7000, fresherPackage: '4-8 LPA', experiencedPackage: '8-18 LPA', topCompanies: 'TCS, Infosys, IBM, Capgemini', popularityScore: 9, description: 'Rapid Spring application development' },
  { name: 'Spring Security', category: 'Backend', subCategory: 'Framework', displayOrder: 23, vacancies: 3500, fresherPackage: '5-9 LPA', experiencedPackage: '9-19 LPA', topCompanies: 'TCS, Infosys, IBM', popularityScore: 8, description: 'Security framework for Spring applications' },
  { name: 'Hibernate ORM', category: 'Backend', subCategory: 'Framework', displayOrder: 24, vacancies: 5000, fresherPackage: '4-8 LPA', experiencedPackage: '7-16 LPA', topCompanies: 'TCS, Infosys, Wipro, IBM', popularityScore: 8, description: 'Object-relational mapping for Java' },
  { name: 'Microservices', category: 'Backend', subCategory: 'Architecture', displayOrder: 25, vacancies: 4000, fresherPackage: '5-10 LPA', experiencedPackage: '10-22 LPA', topCompanies: 'Amazon, Google, Flipkart, TCS', popularityScore: 9, description: 'Distributed system architecture' },
  { name: 'REST API', category: 'Backend', subCategory: 'Architecture', displayOrder: 26, vacancies: 7500, fresherPackage: '4-7 LPA', experiencedPackage: '7-15 LPA', topCompanies: 'TCS, Infosys, Wipro, Flipkart', popularityScore: 9, description: 'RESTful web service development' },
  { name: 'Maven', category: 'Backend', subCategory: 'Tool', displayOrder: 27, vacancies: 3000, fresherPackage: '3-6 LPA', experiencedPackage: '6-12 LPA', topCompanies: 'TCS, Infosys, Wipro', popularityScore: 7, description: 'Build automation tool for Java' },
  { name: 'Node.js', category: 'Backend', subCategory: 'Runtime', displayOrder: 28, vacancies: 4000, fresherPackage: '4-7 LPA', experiencedPackage: '7-14 LPA', topCompanies: 'Flipkart, Swiggy, Zomato, PayTM', popularityScore: 9, description: 'JavaScript runtime for server-side' },
  { name: 'Express.js', category: 'Backend', subCategory: 'Framework', displayOrder: 29, vacancies: 2800, fresherPackage: '3-6 LPA', experiencedPackage: '6-12 LPA', topCompanies: 'Infosys, Wipro, startups', popularityScore: 8, description: 'Minimal web framework for Node.js' },

  // Database
  { name: 'MySQL', category: 'Database', subCategory: 'SQL', displayOrder: 30, vacancies: 4500, fresherPackage: '3-6 LPA', experiencedPackage: '6-13 LPA', topCompanies: 'TCS, Infosys, Wipro, IBM', popularityScore: 8, description: 'Popular relational database' },
  { name: 'MongoDB', category: 'Database', subCategory: 'NoSQL', displayOrder: 31, vacancies: 1200, fresherPackage: '4-7 LPA', experiencedPackage: '7-15 LPA', topCompanies: 'Flipkart, Swiggy, Zomato', popularityScore: 7, description: 'Document-oriented NoSQL database' },
  { name: 'Oracle SQL', category: 'Database', subCategory: 'SQL', displayOrder: 32, vacancies: 3500, fresherPackage: '3-6 LPA', experiencedPackage: '6-14 LPA', topCompanies: 'Infosys, TCS, Oracle, IBM', popularityScore: 8, description: 'Enterprise-grade relational database' },

  // Other
  { name: 'PHP Core', category: 'Other', subCategory: 'Programming', displayOrder: 33, vacancies: 3000, fresherPackage: '2-4 LPA', experiencedPackage: '5-9 LPA', topCompanies: 'Wipro, Capgemini, Infosys', popularityScore: 7, description: 'Server-side scripting language' },
  { name: 'PHP Advance', category: 'Other', subCategory: 'Programming', displayOrder: 34, vacancies: 2500, fresherPackage: '3-5 LPA', experiencedPackage: '5-10 LPA', topCompanies: 'Wipro, Capgemini, Infosys', popularityScore: 6, description: 'Advanced PHP programming' },
  { name: 'PHP OOPS', category: 'Other', subCategory: 'Programming', displayOrder: 35, vacancies: 2200, fresherPackage: '3-5 LPA', experiencedPackage: '5-10 LPA', topCompanies: 'Wipro, Capgemini, Infosys', popularityScore: 6, description: 'Object-oriented PHP' },
  { name: 'Laravel', category: 'Other', subCategory: 'Framework', displayOrder: 36, vacancies: 900, fresherPackage: '3-5 LPA', experiencedPackage: '5-10 LPA', topCompanies: 'Capgemini, startups', popularityScore: 6, description: 'PHP web application framework' },
  { name: 'Code Igniter', category: 'Other', subCategory: 'Framework', displayOrder: 37, vacancies: 600, fresherPackage: '2-4 LPA', experiencedPackage: '4-8 LPA', topCompanies: 'Wipro, Infosys', popularityScore: 5, description: 'Lightweight PHP framework' },
  { name: 'WordPress', category: 'Other', subCategory: 'CMS', displayOrder: 38, vacancies: 2500, fresherPackage: '2-4 LPA', experiencedPackage: '4-9 LPA', topCompanies: 'Wipro, Capgemini, startups', popularityScore: 7, description: 'Popular content management system' },
  { name: 'C Programming', category: 'Other', subCategory: 'Programming', displayOrder: 39, vacancies: 900, fresherPackage: '2-4 LPA', experiencedPackage: '5-8 LPA', topCompanies: 'Infosys, Tech Mahindra', popularityScore: 6, description: 'Foundational programming language' },
  { name: 'C++ with OOPS', category: 'Other', subCategory: 'Programming', displayOrder: 40, vacancies: 2100, fresherPackage: '3-6 LPA', experiencedPackage: '7-15 LPA', topCompanies: 'Infosys, Tech Mahindra, Capgemini', popularityScore: 8, description: 'Object-oriented C++ programming' },
  { name: 'DSA', category: 'Other', subCategory: 'Algorithms', displayOrder: 41, vacancies: 9500, fresherPackage: '4-7 LPA', experiencedPackage: '7-16 LPA', topCompanies: 'Amazon, Google, TCS', popularityScore: 10, description: 'Data structures and algorithms' },
  { name: 'Front End Presentation', category: 'Frontend', subCategory: 'Skills', displayOrder: 42, vacancies: 5000, fresherPackage: '3-5 LPA', experiencedPackage: '5-10 LPA', topCompanies: 'TCS, Infosys, Wipro', popularityScore: 6, description: 'Frontend development presentation skills' },
];

// Only valid combinations using taught technologies
const TAUGHT_COMBINATIONS = [
  { technologies: ['HTML5', 'CSS3', 'JavaScript'], jobRole: 'Frontend Developer', category: 'Frontend', vacancies: 13000, fresherPackage: '3-6 LPA', experiencedPackage: '6-14 LPA', topCompanies: ['TCS', 'Infosys', 'Wipro', 'Capgemini'], popularityScore: 10 },
  { technologies: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap'], jobRole: 'Frontend Developer', category: 'Frontend', vacancies: 5000, fresherPackage: '3-6 LPA', experiencedPackage: '6-12 LPA', topCompanies: ['TCS', 'Infosys', 'Wipro'], popularityScore: 8 },
  { technologies: ['HTML5', 'CSS3', 'JavaScript', 'React.js'], jobRole: 'React Developer', category: 'Frontend', vacancies: 7000, fresherPackage: '4-7 LPA', experiencedPackage: '7-16 LPA', topCompanies: ['Flipkart', 'Swiggy', 'Ola', 'PayTM'], popularityScore: 9 },
  { technologies: ['HTML5', 'CSS3', 'JavaScript', 'Angular JS'], jobRole: 'Angular Developer', category: 'Frontend', vacancies: 5500, fresherPackage: '4-7 LPA', experiencedPackage: '7-15 LPA', topCompanies: ['HCL', 'TCS', 'Capgemini'], popularityScore: 8 },
  { technologies: ['React.js', 'Node.js', 'MongoDB'], jobRole: 'MERN Stack Developer', category: 'Full Stack', vacancies: 2500, fresherPackage: '4-8 LPA', experiencedPackage: '8-16 LPA', topCompanies: ['Flipkart', 'Swiggy', 'Zomato', 'PayTM'], popularityScore: 9 },
  { technologies: ['React.js', 'Node.js', 'Express.js', 'MongoDB'], jobRole: 'MERN Stack Developer', category: 'Full Stack', vacancies: 2300, fresherPackage: '4-8 LPA', experiencedPackage: '8-16 LPA', topCompanies: ['Flipkart', 'Swiggy', 'Zomato'], popularityScore: 9 },
  { technologies: ['Angular JS', 'Node.js', 'MongoDB'], jobRole: 'MEAN Stack Developer', category: 'Full Stack', vacancies: 1900, fresherPackage: '4-8 LPA', experiencedPackage: '7-15 LPA', topCompanies: ['Wipro', 'Capgemini'], popularityScore: 8 },
  { technologies: ['Python Core', 'Django MVC', 'MySQL'], jobRole: 'Python Django Developer', category: 'Full Stack', vacancies: 2700, fresherPackage: '4-7 LPA', experiencedPackage: '7-15 LPA', topCompanies: ['Amazon', 'Flipkart', 'Google'], popularityScore: 8 },
  { technologies: ['Java Core (J2SE)', 'Spring Boot', 'MySQL'], jobRole: 'Java Full Stack Developer', category: 'Full Stack', vacancies: 8500, fresherPackage: '4-8 LPA', experiencedPackage: '8-18 LPA', topCompanies: ['TCS', 'Infosys', 'IBM'], popularityScore: 9 },
  { technologies: ['Node.js', 'Express.js', 'MongoDB'], jobRole: 'Node.js Developer', category: 'Backend', vacancies: 3800, fresherPackage: '4-7 LPA', experiencedPackage: '7-13 LPA', topCompanies: ['Flipkart', 'Swiggy', 'Ola'], popularityScore: 9 },
  { technologies: ['PHP Core', 'Laravel', 'MySQL'], jobRole: 'PHP Laravel Developer', category: 'Full Stack', vacancies: 900, fresherPackage: '3-5 LPA', experiencedPackage: '5-10 LPA', topCompanies: ['Capgemini', 'startups'], popularityScore: 6 },
  { technologies: ['Java Core (J2SE)', 'MySQL'], jobRole: 'Java Developer', category: 'Backend', vacancies: 8500, fresherPackage: '3-7 LPA', experiencedPackage: '6-14 LPA', topCompanies: ['TCS', 'Infosys', 'HCL'], popularityScore: 9 },
  { technologies: ['Python Core', 'MySQL'], jobRole: 'Python Developer', category: 'Backend', vacancies: 5000, fresherPackage: '4-7 LPA', experiencedPackage: '7-14 LPA', topCompanies: ['Amazon', 'Infosys', 'Google'], popularityScore: 8 },
  { technologies: ['HTML5', 'CSS3', 'JavaScript', 'jQuery', 'Bootstrap'], jobRole: 'Frontend UI Developer', category: 'Frontend', vacancies: 4000, fresherPackage: '3-6 LPA', experiencedPackage: '6-12 LPA', topCompanies: ['Infosys', 'Capgemini', 'TCS'], popularityScore: 7 },
];

const COMPANIES = [
  { name: 'TCS', logoUrl: 'https://logo.clearbit.com/tcs.com', totalPlacements: 45, avgPackage: '3.5-7 LPA' },
  { name: 'Infosys', logoUrl: 'https://logo.clearbit.com/infosys.com', totalPlacements: 38, avgPackage: '4-8 LPA' },
  { name: 'Wipro', logoUrl: 'https://logo.clearbit.com/wipro.com', totalPlacements: 32, avgPackage: '3.5-7 LPA' },
  { name: 'Capgemini', logoUrl: 'https://logo.clearbit.com/capgemini.com', totalPlacements: 28, avgPackage: '4-8 LPA' },
  { name: 'HCL', logoUrl: 'https://logo.clearbit.com/hcltech.com', totalPlacements: 25, avgPackage: '3.5-7 LPA' },
  { name: 'IBM', logoUrl: 'https://logo.clearbit.com/ibm.com', totalPlacements: 18, avgPackage: '5-10 LPA' },
  { name: 'Amazon', logoUrl: 'https://logo.clearbit.com/amazon.com', totalPlacements: 12, avgPackage: '8-15 LPA' },
  { name: 'Flipkart', logoUrl: 'https://logo.clearbit.com/flipkart.com', totalPlacements: 10, avgPackage: '7-12 LPA' },
  { name: 'Google', logoUrl: 'https://logo.clearbit.com/google.com', totalPlacements: 5, avgPackage: '12-25 LPA' },
  { name: 'Swiggy', logoUrl: 'https://logo.clearbit.com/swiggy.com', totalPlacements: 8, avgPackage: '6-10 LPA' },
  { name: 'Zomato', logoUrl: 'https://logo.clearbit.com/zomato.com', totalPlacements: 7, avgPackage: '5-9 LPA' },
  { name: 'PayTM', logoUrl: 'https://logo.clearbit.com/paytm.com', totalPlacements: 9, avgPackage: '6-11 LPA' },
];

const PLACEMENTS = [
  { studentName: 'Rajesh Kumar', company: 'TCS', package: '4.5 LPA', phone: '+919876543210', photoUrl: 'https://i.pravatar.cc/150?img=12', profile: 'Java Developer', course: 'Java Full Stack', review: 'Great learning experience at Programmers Point. The faculty is very supportive and industry-oriented.', joiningDate: '15/08/2024' },
  { studentName: 'Priya Sharma', company: 'Infosys', package: '5.2 LPA', phone: '+919876543211', photoUrl: 'https://i.pravatar.cc/150?img=45', profile: 'React Developer', course: 'MERN Stack', review: 'Excellent training program. Got placed in my dream company with good package.', joiningDate: '20/07/2024' },
  { studentName: 'Amit Patel', company: 'Amazon', package: '12 LPA', phone: '+919876543212', photoUrl: 'https://i.pravatar.cc/150?img=33', profile: 'Backend Engineer', course: 'Python Django', review: 'The best decision I made was joining Programmers Point. Highly recommend!', joiningDate: '10/09/2024' },
  { studentName: 'Neha Singh', company: 'Flipkart', package: '8.5 LPA', phone: '+919876543213', photoUrl: 'https://i.pravatar.cc/150?img=47', profile: 'Full Stack Developer', course: 'MERN Stack', review: 'Outstanding faculty and placement support. Thank you Programmers Point!', joiningDate: '25/06/2024' },
  { studentName: 'Rohit Verma', company: 'Wipro', package: '4.8 LPA', phone: '+919876543214', photoUrl: 'https://i.pravatar.cc/150?img=51', profile: 'Angular Developer', course: 'Angular JS', review: 'Practical hands-on training helped me crack the interview easily.', joiningDate: '05/08/2024' },
  { studentName: 'Sneha Reddy', company: 'Capgemini', package: '5.5 LPA', phone: '+919876543215', photoUrl: 'https://i.pravatar.cc/150?img=44', profile: 'Java Spring Boot Developer', course: 'Java Full Stack', review: 'Professional training with real-world projects. Great placement assistance.', joiningDate: '12/07/2024' },
];

async function seedGoogleSheets() {
  try {
    console.log('🌱 Starting Google Sheets seeding process...\n');
    
    // Step 1: Initialize sheets with headers
    console.log('📋 Initializing sheet headers...');
    await initializeSheets();
    console.log('✅ Headers initialized\n');
    
    // Step 2: Write technologies
    console.log(`📚 Writing ${TAUGHT_TECHNOLOGIES.length} technologies...`);
    await writeTechnologies(TAUGHT_TECHNOLOGIES);
    console.log(`✅ Technologies written (${TAUGHT_TECHNOLOGIES.length} total)\n`);
    
    // Step 3: Write combinations
    console.log(`🔗 Writing ${TAUGHT_COMBINATIONS.length} technology combinations...`);
    await writeCombinations(TAUGHT_COMBINATIONS);
    console.log(`✅ Combinations written (${TAUGHT_COMBINATIONS.length} total)\n`);
    
    // Step 4: Write companies
    console.log(`🏢 Writing ${COMPANIES.length} companies...`);
    await writeCompanies(COMPANIES);
    console.log(`✅ Companies written (${COMPANIES.length} total)\n`);
    
    // Step 5: Write placements
    console.log(`🎓 Writing ${PLACEMENTS.length} student placements...`);
    await writePlacements(PLACEMENTS);
    console.log(`✅ Placements written (${PLACEMENTS.length} total)\n`);
    
    console.log('🎉 Google Sheets seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Technologies: ${TAUGHT_TECHNOLOGIES.length}`);
    console.log(`   - Combinations: ${TAUGHT_COMBINATIONS.length}`);
    console.log(`   - Companies: ${COMPANIES.length}`);
    console.log(`   - Placements: ${PLACEMENTS.length}`);
    console.log('\n✨ Your Google Sheet is now ready to use!');
    
  } catch (error) {
    console.error('❌ Error seeding Google Sheets:', error);
    throw error;
  }
}

// Run the seed function
seedGoogleSheets()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
