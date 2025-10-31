import { db } from "./db";
import { technologyCombinations } from "@shared/schema";

// CSV Data - Comprehensive Technology Combinations
const CSV_DATA = `Technologies,Category,Suggested Job Role,Tech Count,Commonality,Vacancies,Fresher Package,Experienced Package,Top Companies,Popularity Score
"HTML5, CSS3, JavaScript",Frontend,"Frontend Developer",3,Common,13000,"3-6 LPA","6-14 LPA","TCS, Infosys, Wipro, Capgemini, Cognizant, IBM",10
"HTML5, CSS3, JavaScript, React",Frontend,"React Developer",4,Common,7000,"4-7 LPA","7-16 LPA","Flipkart, Swiggy, Ola, PayTM, Infosys, Cognizant",9
"HTML5, CSS3, JavaScript, React, TypeScript",Frontend,"React + TypeScript Frontend Developer",5,Common,3500,"4-8 LPA","8-16 LPA","Swiggy, Flipkart, Ola, Capgemini",8
"HTML5, CSS3, JavaScript, React, Redux",Frontend,"React Frontend Engineer (with Redux)",5,Common,1800,"4-8 LPA","7-16 LPA","PayTM, Swiggy, Flipkart",7
"HTML5, CSS3, JavaScript, React, Tailwind CSS",Frontend,"React UI Developer",5,Common,1500,"4-7 LPA","7-15 LPA","Startups, Infosys, Capgemini",7
"HTML5, CSS3, JavaScript, React, Bootstrap",Frontend,"React Frontend Developer (Bootstrap)",5,Common,1600,"4-7 LPA","7-14 LPA","TCS, Infosys, Wipro",7
"HTML5, CSS3, JavaScript, Angular",Frontend,"Angular Developer",4,Common,5500,"4-7 LPA","7-15 LPA","HCL, TCS, Capgemini, Wipro, Infosys",8
"HTML5, CSS3, JavaScript, Angular, TypeScript",Frontend,"Angular (TypeScript) Developer",5,Common,3000,"4-7 LPA","7-15 LPA","Capgemini, Infosys, Wipro",7
"HTML5, CSS3, JavaScript, Angular, Bootstrap",Frontend,"Angular UI Developer",5,Moderate,2000,"4-7 LPA","7-14 LPA","HCL, TCS, Capgemini",6
"HTML5, CSS3, JavaScript, Vue.js",Frontend,"Vue.js Developer",4,Moderate,1800,"4-7 LPA","7-14 LPA","Startups, Infosys, Cognizant",6
"HTML5, CSS3, JavaScript, Vue.js, Tailwind CSS",Frontend,"Vue UI Developer",5,Moderate,800,"4-7 LPA","7-13 LPA","Startups, Capgemini",5
"HTML5, CSS3, JavaScript, React, TypeScript, Tailwind CSS",Frontend,"React + TS UI Engineer",6,Common,2000,"5-8 LPA","8-16 LPA","Flipkart, Swiggy, PayTM",8
"HTML5, CSS3, JavaScript, React, Redux, TypeScript",Frontend,"Senior React + TS Developer",6,Common,1500,"5-9 LPA","9-18 LPA","Swiggy, Ola, Flipkart",8
"HTML5, CSS3, JavaScript, React, Bootstrap, Redux",Frontend,"React Frontend Engineer (Bootstrap + Redux)",6,Moderate,1200,"4-8 LPA","7-15 LPA","TCS, Infosys, PayTM",6
"HTML5, CSS3, JavaScript, Angular, TypeScript, Tailwind CSS",Frontend,"Angular Frontend Engineer",6,Moderate,1500,"5-8 LPA","8-15 LPA","Capgemini, Wipro, HCL",6
"HTML5, CSS3, JavaScript, TypeScript",Frontend,"JavaScript/TypeScript Frontend Developer",4,Common,3200,"4-7 LPA","7-15 LPA","Microsoft, Infosys, Cognizant, PayTM",7
"HTML5, CSS3, JavaScript, Tailwind CSS",Frontend,"Frontend UI Developer (Tailwind)",4,Common,1000,"3-5 LPA","6-10 LPA","Startups, Infosys, Capgemini",6
"HTML5, CSS3, JavaScript, Bootstrap",Frontend,"Frontend Developer (Bootstrap)",4,Common,3500,"3-6 LPA","6-11 LPA","Infosys, Capgemini, Tata, Wipro",7
"HTML5, CSS3, JavaScript, React, Styled Components",Frontend,"React UI Developer (styled-components)",5,Moderate,1000,"4-7 LPA","7-14 LPA","Startups, Flipkart",5
"HTML5, CSS3, JavaScript, Vue.js, TypeScript",Frontend,"Vue + TypeScript Developer",5,Moderate,900,"4-7 LPA","7-14 LPA","Startups, Cognizant",5
"JavaScript",Frontend,"Frontend Developer",1,Common,9000,"3-6 LPA","7-14 LPA","Infosys, Wipro, Cognizant, IBM, TCS",10
"React.js",Frontend,"React Developer",1,Common,6000,"4-7 LPA","7-16 LPA","Flipkart, Swiggy, Ola, PayTM, Infosys, Cognizant",9
"Angular JS",Frontend,"Angular Developer",1,Common,4500,"4-7 LPA","7-15 LPA","HCL, TCS, Capgemini, Wipro, Infosys",8
"Bootstrap",Frontend,"UI Developer",1,Common,3500,"3-6 LPA","6-11 LPA","Infosys, Capgemini, Tata, Wipro",7
"Tailwind CSS",Frontend,"Frontend Developer",1,Common,1000,"3-5 LPA","6-10 LPA","Startups, Infosys, Capgemini",6
"TypeScript",Frontend,"Web Developer",1,Common,3200,"4-7 LPA","7-15 LPA","Microsoft, Infosys, Cognizant, PayTM",7
"jQuery",Frontend,"Frontend Developer",1,Moderate,3000,"3-6 LPA","6-11 LPA","Infosys, Capgemini",6
"React, TypeScript",Frontend,"React TypeScript Developer",2,Moderate,3500,"4-8 LPA","8-16 LPA","Swiggy, Flipkart, Ola, Capgemini",8
"React, Redux",Frontend,"Frontend Developer",2,Moderate,1800,"4-8 LPA","7-16 LPA","PayTM, Swiggy, Flipkart",7
"Java, Spring Boot, MySQL",Backend,"Java Backend Developer",3,Common,8500,"4-8 LPA","8-18 LPA","TCS, Infosys, IBM, Capgemini, Atos",9
"Java, Spring Boot, Oracle",Backend,"Enterprise Java Developer",3,Moderate,3500,"4-8 LPA","8-18 LPA","TCS, Infosys, Oracle, IBM",8
"Python, Django, PostgreSQL",Backend,"Python Backend Developer (Django)",3,Common,2700,"4-7 LPA","7-15 LPA","Amazon, Flipkart, Google, Capgemini, Infosys",8
"Python, Flask, MySQL",Backend,"Python Backend Developer (Flask)",3,Moderate,1200,"4-7 LPA","7-14 LPA","Startups, Infosys",6
"Node.js, Express, MongoDB",Backend,"Node.js Backend Developer",3,Common,3800,"4-7 LPA","7-13 LPA","Flipkart, Swiggy, Ola",9
"Node.js, Express, MySQL",Backend,"Node.js Backend Developer (SQL)",3,Moderate,2500,"4-7 LPA","7-12 LPA","Infosys, Wipro, startups",7
"PHP, Laravel, MySQL",Backend,"PHP Backend Developer (Laravel)",3,Common,900,"3-5 LPA","5-10 LPA","Capgemini, Tata, startups",6
"C#, .NET, SQL Server",Backend,".NET Backend Developer",3,Common,2500,"4-7 LPA","7-14 LPA","Microsoft, Infosys, Wipro",7
"Go, Gin, PostgreSQL",Backend,"Go Backend Developer",3,Rare,600,"5-8 LPA","8-16 LPA","Google, Flipkart, startups",5
"Ruby, Rails, PostgreSQL",Backend,"Ruby on Rails Developer",3,Moderate,800,"4-7 LPA","7-14 LPA","Capgemini, ThoughtWorks, startups",5
"Python, Django, MySQL, Redis",Backend,"Python Backend Developer (Django + Redis)",4,Moderate,1500,"4-8 LPA","8-15 LPA","Amazon, Flipkart, Infosys",7
"Java, Spring Boot, MongoDB",Backend,"Java Backend Developer (NoSQL)",3,Moderate,2000,"4-8 LPA","8-16 LPA","TCS, Infosys, startups",7
"Node.js, Express, PostgreSQL, Redis",Backend,"Node.js Backend Engineer (SQL + Caching)",4,Moderate,2000,"4-8 LPA","8-15 LPA","Flipkart, Swiggy, PayTM",7
"Go, PostgreSQL, Docker",Backend,"Go Microservices Developer",3,Rare,800,"5-9 LPA","9-18 LPA","Google, Flipkart, startups",6
"Java, Spring Boot, Oracle, Kafka",Backend,"Enterprise Java Systems Developer",4,Rare,1200,"5-9 LPA","9-20 LPA","TCS, Infosys, Oracle",7
"Python, Flask, PostgreSQL, Celery",Backend,"Python Backend Engineer (Async Tasks)",4,Moderate,900,"4-8 LPA","8-16 LPA","Amazon, startups",6
"Node.js, Express, MongoDB, TypeScript",Backend,"Node + TypeScript Backend Developer",4,Common,2500,"4-8 LPA","8-15 LPA","Flipkart, Swiggy, Zomato",8
"Java, Spring Boot, MySQL, Hibernate",Backend,"Java Backend Developer (Hibernate)",4,Common,3200,"4-7.5 LPA","7-15 LPA","TCS, Infosys, Capgemini",8
"Python, Django, Oracle",Backend,"Enterprise Python Developer (Django + Oracle)",3,Rare,800,"4-8 LPA","8-16 LPA","Oracle, Infosys",5
"Java",Backend,"Java Developer",1,Common,10500,"3.5-7 LPA","6-14 LPA","TCS, HCL, Infosys, Wipro, Tech Mahindra",10
"Spring Boot",Backend,"Spring Boot Developer",1,Common,7000,"4-8 LPA","8-18 LPA","TCS, Infosys, IBM, Capgemini, Atos",9
"Django",Backend,"Django Developer",1,Moderate,2500,"4-7 LPA","7-14 LPA","Amazon, Flipkart, Capgemini, Infosys",7
"Python Core",Backend,"Python Developer",1,Common,9000,"3.8-6.5 LPA","7-15 LPA","Amazon, Google, Infosys, Capgemini, Cognizant",10
"Node.js",Backend,"Node.js Developer",1,Common,4000,"4-7 LPA","7-14 LPA","Flipkart, Swiggy, Zomato, PayTM, Ola",9
"Express.js",Backend,"Node.js Developer",1,Moderate,2800,"3.5-6 LPA","6-12 LPA","Infosys, Wipro, startups, Capgemini",8
"PHP Core",Backend,"PHP Developer",1,Moderate,3000,"2.5-4 LPA","5-9 LPA","Wipro, Capgemini, Infosys, startups",7
"Laravel",Backend,"PHP Developer",1,Moderate,900,"3-5 LPA","5-10 LPA","Capgemini, Tata, startups",6
"Go",Backend,"Go Backend Developer",1,Rare,450,"6-14 LPA","6-14 LPA","Google, Flipkart",5
"Ruby",Backend,"Ruby Developer",1,Moderate,300,"5-10 LPA","5-10 LPA","Capgemini, ThoughtWorks",5
"C#",Backend,".NET Developer",1,Moderate,2200,"4-7 LPA","7-14 LPA","Microsoft, Capgemini",7
"Java, MySQL",Backend,"Java Developer",2,Common,8500,"3.5-7 LPA","6-14 LPA","TCS, Infosys, HCL",9
"Java, Spring Boot",Backend,"Java Backend Developer",2,Common,7200,"4-8 LPA","8-18 LPA","TCS, IBM, Infosys",9
"Python, Django",Backend,"Python Developer",2,Moderate,2700,"4-7 LPA","7-15 LPA","Amazon, Flipkart, Google, Capgemini",8
"Python, Flask",Backend,"Python Developer",2,Moderate,1200,"4-7 LPA","7-14 LPA","Startups, Infosys",6
"MySQL, PHP",Backend,"PHP Developer",2,Moderate,3200,"2.7-4.5 LPA","5-10 LPA","Wipro, Capgemini, Infosys",7
"Oracle, Java",Backend,"Java Developer",2,Moderate,3500,"3.5-7 LPA","6-14 LPA","TCS, Infosys, Oracle",8
"MySQL",Database,"DB Administrator",1,Common,4500,"3.5-6 LPA","6-13 LPA","TCS, Infosys, Wipro, IBM, Tech Mahindra",8
"MongoDB",Database,"DB Developer",1,Moderate,1200,"4-7 LPA","7-15 LPA","Flipkart, Swiggy, Zomato, Capgemini, startups",7
"Oracle",Database,"DB Administrator",1,Common,3500,"3.5-6 LPA","6-14 LPA","Infosys, TCS, Oracle, IBM, Accenture",8
"PostgreSQL",Database,"DB Administrator",1,Moderate,2000,"3.5-6 LPA","6-13 LPA","Amazon, Google, Infosys",7
"React, Node.js, Express, MongoDB",Full Stack,"MERN Stack Developer",4,Common,2300,"4-8 LPA","8-16 LPA","Flipkart, Swiggy, Zomato, PayTM, Ola",9
"React, Node.js, Express, MySQL",Full Stack,"React + Node Full Stack Developer (SQL)",4,Common,2000,"4-8 LPA","8-15 LPA","Infosys, Wipro, TCS",8
"Angular, Java, Spring Boot, MySQL",Full Stack,"Java Full Stack Developer (Angular)",4,Common,3000,"4-8 LPA","8-16 LPA","TCS, Infosys, Capgemini",8
"React, Java, Spring Boot, MySQL",Full Stack,"Full Stack JavaScript + Java Integration Engineer",4,Moderate,2500,"4-8 LPA","8-16 LPA","TCS, Infosys, HCL",7
"Vue.js, Node.js, Express, MongoDB",Full Stack,"Vue Full Stack Developer",4,Moderate,1200,"4-7 LPA","7-14 LPA","Startups, Infosys",6
"React, Django, PostgreSQL",Full Stack,"React + Django Full Stack Developer",3,Moderate,1800,"4-8 LPA","8-15 LPA","Amazon, Flipkart, Google",7
"React, Python, Django, PostgreSQL",Full Stack,"React + Django Full Stack Developer",4,Common,2000,"4-8 LPA","8-16 LPA","Amazon, Flipkart, Google, Infosys",8
"Angular, Python, Django, MySQL",Full Stack,"Angular + Django Full Stack Developer",4,Moderate,1200,"4-7 LPA","7-14 LPA","Capgemini, Infosys",6
"HTML5, CSS3, JavaScript, Node.js, Express, MongoDB",Full Stack,"Full Stack JavaScript Developer",6,Common,3000,"4-7 LPA","7-14 LPA","Flipkart, Swiggy, Zomato",8
"HTML5, CSS3, JavaScript, React, Node.js, MongoDB",Full Stack,"MERN Full Stack Developer",6,Common,2500,"4-8 LPA","8-16 LPA","Flipkart, Swiggy, Zomato, PayTM, Ola",9
"HTML5, CSS3, JavaScript, React, Node.js, MySQL",Full Stack,"React + Node Full Stack Developer",6,Common,2200,"4-8 LPA","8-15 LPA","TCS, Infosys, Wipro",8
"HTML5, CSS3, JavaScript, Angular, Java, Spring Boot, Oracle",Full Stack,"Enterprise Full Stack Developer (Angular + Java)",7,Rare,1500,"5-9 LPA","9-18 LPA","TCS, Infosys, Oracle",7
"React, Spring Boot, MySQL",Full Stack,"React + Spring Boot Full Stack Developer",3,Common,2800,"4-8 LPA","8-16 LPA","TCS, Infosys, Capgemini",8
"React, Java, Spring Boot, MySQL, Redis",Full Stack,"React + Java Full Stack (with caching)",5,Moderate,1800,"5-8 LPA","8-16 LPA","TCS, Infosys, HCL",7
"Vue.js, Java, Spring Boot, MongoDB",Full Stack,"Vue + Java Full Stack Developer",4,Moderate,900,"4-7 LPA","7-14 LPA","Startups, Infosys",5
"React, Node.js, Express, PostgreSQL",Full Stack,"React + Node Full Stack (Postgres)",4,Common,2000,"4-8 LPA","8-15 LPA","Flipkart, Swiggy, Infosys",8
"React, Node.js, Express, MongoDB, Redis",Full Stack,"React Full Stack (with caching)",5,Moderate,1500,"5-8 LPA","8-16 LPA","Flipkart, Swiggy, PayTM",7
"Angular, Node.js, Express, MongoDB",Full Stack,"Angular Full Stack Developer (MEAN-like)",4,Moderate,1900,"4-8 LPA","7-15 LPA","Wipro, Capgemini, LTIMindtree",8
"Angular, Node.js, Express, PostgreSQL",Full Stack,"Angular + Node Full Stack (Postgres)",4,Moderate,1200,"4-7 LPA","7-14 LPA","Capgemini, Wipro",6
"React, Django, MySQL, Elasticsearch",Full Stack,"React + Django Full Stack (search enabled)",4,Rare,800,"5-8 LPA","8-16 LPA","Amazon, Flipkart",6
"React, Node.js, Express, MongoDB, TypeScript",Full Stack,"Type-safe MERN Full Stack Developer",5,Moderate,1800,"5-8 LPA","8-16 LPA","Flipkart, Swiggy, Ola",8
"React, Node.js, Express, MongoDB, GraphQL",Full Stack,"React + Node Full Stack (GraphQL)",5,Moderate,1200,"5-9 LPA","9-18 LPA","Flipkart, PayTM, startups",7
"HTML5, CSS3, JavaScript, Vue.js, Node.js, MongoDB",Full Stack,"Vue Full Stack Developer",6,Moderate,1000,"4-7 LPA","7-14 LPA","Startups, Infosys",6
"HTML5, CSS3, JavaScript, React, Java, Spring Boot, PostgreSQL",Full Stack,"Full Stack Engineer (React + Java)",7,Rare,1500,"5-9 LPA","9-18 LPA","TCS, Infosys, Capgemini",7
"HTML5, CSS3, JavaScript, React, Django, PostgreSQL",Full Stack,"React + Django Full Stack Developer",6,Moderate,1600,"4-8 LPA","8-15 LPA","Amazon, Flipkart, Google",7
"React, PHP, Laravel, MySQL",Full Stack,"React + Laravel Full Stack Developer",4,Moderate,700,"4-7 LPA","7-13 LPA","Capgemini, startups",5
"React, PHP, Laravel, MySQL, Redis",Full Stack,"React + Laravel Full Stack (with caching)",5,Moderate,500,"4-8 LPA","8-14 LPA","Startups, Capgemini",5
"Vue.js, Python, Flask, PostgreSQL",Full Stack,"Vue + Flask Full Stack Developer",4,Rare,600,"4-7 LPA","7-14 LPA","Startups",4
"Angular, Java, Spring Boot, MySQL, Docker",Full Stack,"Angular + Java Full Stack (containerized)",5,Rare,1200,"5-8 LPA","8-16 LPA","TCS, Infosys, Capgemini",6
"React, Node.js, Express, MongoDB, Docker",Full Stack,"Containerized MERN Full Stack Developer",5,Moderate,1500,"5-8 LPA","8-16 LPA","Flipkart, Swiggy, Zomato",7
"React, Node.js, Express, MongoDB, Kubernetes",Full Stack,"Cloud-native MERN Developer",5,Rare,900,"6-10 LPA","10-20 LPA","Google, Amazon, Flipkart",6
"HTML5, CSS3, JavaScript, React, Node.js, Express, MongoDB",Full Stack,"Full Stack Web Developer (MERN)",7,Common,2300,"4-8 LPA","8-16 LPA","Flipkart, Swiggy, Zomato, PayTM",9
"React, Node.js, Express, MySQL, TypeScript",Full Stack,"TypeScript Full Stack Developer",5,Moderate,1600,"5-8 LPA","8-16 LPA","Infosys, Wipro, PayTM",7
"React, Go, PostgreSQL",Full Stack,"React + Go Full Stack Developer",3,Rare,500,"5-9 LPA","9-18 LPA","Google, Flipkart, startups",5
"Vue.js, Go, PostgreSQL, Docker",Full Stack,"Vue + Go Full Stack Developer",4,Rare,400,"5-9 LPA","9-18 LPA","Google, startups",4
"React, Node.js, MongoDB",Full Stack,"MERN Stack Developer",3,Common,2500,"4-8 LPA","8-16 LPA","Flipkart, Swiggy, Zomato, PayTM, Ola",9
"Vue.js, Node.js, MongoDB",Full Stack,"Vue.js Full Stack Developer",3,Moderate,1200,"4-7 LPA","7-14 LPA","Startups, Infosys",6
"React, Next.js, Node.js, PostgreSQL",Full Stack,"React + Next.js Full Stack Developer",4,Common,1800,"5-8 LPA","8-16 LPA","Vercel, Flipkart, startups",8
"React, Next.js, Node.js, MongoDB",Full Stack,"Full Stack Developer (Next.js + Node)",4,Common,1600,"5-8 LPA","8-16 LPA","Startups, Flipkart",7
"React, GraphQL, Apollo, Node.js, MongoDB",Full Stack,"GraphQL Full Stack Engineer",5,Moderate,1000,"5-9 LPA","9-18 LPA","Flipkart, PayTM, startups",7
"React, Node.js, Express, MongoDB, Redis, Docker",Full Stack,"Full Stack Engineer (MERN + caching + docker)",6,Moderate,1200,"6-10 LPA","10-20 LPA","Flipkart, Swiggy, Zomato",7
"React, Node.js, Express, MongoDB, AWS",Full Stack,"Cloud MERN Developer (AWS)",5,Rare,1400,"6-10 LPA","10-20 LPA","Amazon, Flipkart, startups",7
"React, Django, PostgreSQL, Docker",Full Stack,"Containerized React + Django Full Stack Developer",4,Moderate,1000,"5-8 LPA","8-16 LPA","Amazon, Google, startups",6
"React Native, JavaScript",Mobile,"React Native Mobile Developer",2,Common,2800,"4-7 LPA","7-14 LPA","Flipkart, Swiggy, Ola, startups",8
"React Native, JavaScript, Node.js, Express, MongoDB",Mobile,"Full Stack Mobile Developer (React Native + Node)",5,Common,1800,"5-8 LPA","8-16 LPA","Flipkart, Swiggy, Ola, Zomato",8
"Flutter, Dart",Mobile,"Flutter Developer",2,Common,3200,"4-7 LPA","7-15 LPA","Google, startups, Infosys",8
"Flutter, Dart, Firebase",Mobile,"Flutter + Firebase Mobile Developer",3,Common,2000,"4-7 LPA","7-14 LPA","Google, startups",7
"Kotlin, Android SDK",Mobile,"Android (Kotlin) Developer",2,Common,2500,"4-7 LPA","7-14 LPA","Google, Samsung, Infosys",8
"Swift, iOS SDK",Mobile,"iOS (Swift) Developer",2,Common,1800,"5-9 LPA","9-18 LPA","Apple, startups",7
"React Native, TypeScript, Node.js, Express, MySQL",Mobile,"Type-safe React Native Full Stack Mobile Developer",5,Moderate,1200,"5-8 LPA","8-16 LPA","Flipkart, Ola, startups",7
"Flutter, Dart, Node.js, Express, PostgreSQL",Mobile,"Flutter Full Stack Mobile Developer",5,Moderate,1000,"5-8 LPA","8-15 LPA","Startups, Infosys",6
"Kotlin, Spring Boot, PostgreSQL",Mobile,"Android + Java Backend Mobile Developer",3,Moderate,800,"4-7 LPA","7-14 LPA","Google, Infosys",6
"Swift, Django, MySQL",Mobile,"iOS + Python Backend Mobile Developer",3,Moderate,600,"5-8 LPA","8-16 LPA","Apple, startups",5
"React Native, GraphQL, Node.js",Mobile,"Mobile App Developer (GraphQL backend)",3,Moderate,900,"5-8 LPA","8-15 LPA","Flipkart, startups",6
"Flutter, Firebase, Firestore",Mobile,"Flutter + Firebase Developer",3,Common,2200,"4-7 LPA","7-14 LPA","Google, startups",7
"React Native, Redux",Mobile,"React Native + Redux Mobile Developer",2,Common,1500,"4-7 LPA","7-14 LPA","Flipkart, Ola",7
"React Native, Expo, Firebase",Mobile,"Expo + React Native Mobile Developer",3,Common,1800,"4-7 LPA","7-14 LPA","Startups, Flipkart",7
"Python, Pandas, NumPy, MySQL",Data Science,"Data Analyst / Data Scientist (Python)",4,Common,900,"4-8 LPA","8-18 LPA","Google, Amazon, startups",6
"Python, Pandas, NumPy, PostgreSQL",Data Science,"Data Scientist (with Postgres)",4,Common,800,"4-8 LPA","8-18 LPA","Amazon, Google, IBM",6
"Python, scikit-learn, Pandas, MySQL",Data Science,"Machine Learning Engineer (classical ML)",4,Common,700,"5-9 LPA","9-18 LPA","Google, Amazon, startups",6
"Python, TensorFlow, NumPy, PostgreSQL",Data Science,"Deep Learning Engineer",4,Moderate,600,"5-9 LPA","9-20 LPA","Google, Microsoft, startups",6
"Python, PyTorch, Pandas, MySQL",Data Science,"Deep Learning Researcher",4,Moderate,500,"5-9 LPA","9-20 LPA","Google, Microsoft, startups",5
"R, dplyr, ggplot2, PostgreSQL",Data Science,"R Data Analyst",4,Moderate,400,"4-7 LPA","7-15 LPA","IBM, Accenture",5
"Python, Pandas, NumPy, Oracle",Data Science,"Data Scientist (Oracle backend)",4,Rare,300,"4-8 LPA","8-16 LPA","Oracle, Infosys",4
"Python, Pandas, NumPy, SQLite",Data Science,"Data Analyst (Lightweight SQL)",4,Common,600,"4-7 LPA","7-14 LPA","Startups, Infosys",5
"Python, scikit-learn, Pandas, MongoDB",Data Science,"Data Scientist (NoSQL research data)",4,Rare,400,"4-8 LPA","8-16 LPA","Startups, Amazon",4
"Python, Pandas, NumPy, Hadoop, MySQL",Data Science,"Big Data Analyst",5,Rare,500,"5-9 LPA","9-18 LPA","IBM, Accenture, Infosys",5
"Python, Pandas, NumPy, SQL",Data Science,"Data Analyst",4,Common,900,"4-8 LPA","8-18 LPA","Google, Amazon, startups",6
"Python, Spark, PySpark, PostgreSQL",Data Science,"Data Engineer / Big Data Specialist",4,Rare,600,"5-9 LPA","9-20 LPA","Amazon, IBM, Accenture",6
"Python, TensorFlow, Keras, MySQL",Data Science,"Deep Learning Engineer",4,Moderate,800,"5-9 LPA","9-20 LPA","Google, Microsoft, startups",6
"Python, scikit-learn, XGBoost, PostgreSQL",Data Science,"ML Engineer (tabular models)",4,Moderate,500,"5-9 LPA","9-18 LPA","Amazon, Google, startups",5
"Python, R, SQL",Data Science,"Data Scientist",3,Moderate,1200,"4-8 LPA","8-18 LPA","Amazon, Google, IBM, Accenture",7
"Python, Pandas, NumPy, SQL",Data Science,"Data Scientist",4,Moderate,900,"4-8 LPA","8-18 LPA","Google, Amazon, startups",6
"Python, TensorFlow, Keras",Data Science,"Machine Learning Engineer",3,Moderate,800,"5-9 LPA","9-20 LPA","Google, Microsoft, startups",6
"Go, PostgreSQL",Rare,"Go Backend Developer",2,Rare,600,"5-8 LPA","8-16 LPA","Google, Flipkart, startups",5
"Rust, WebAssembly, JavaScript",Rare,"Frontend Performance Engineer (Rust + WASM)",3,Rare,200,"6-10 LPA","10-20 LPA","Mozilla, startups",4
"Rust, PostgreSQL, Docker",Rare,"Systems Backend Developer (Rust)",3,Rare,300,"6-10 LPA","10-20 LPA","Amazon, Mozilla, startups",4
"Go, Docker, Kubernetes, PostgreSQL",Rare,"Cloud-native Go Developer",4,Rare,800,"6-10 LPA","10-20 LPA","Google, Amazon, Flipkart",6
"Elixir, Phoenix, PostgreSQL",Rare,"Elixir Backend Developer",3,Rare,150,"5-9 LPA","9-18 LPA","Startups",3`;

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

// Parse CSV and import data
export async function importTechnologyCombinations() {
  try {
    const lines = CSV_DATA.trim().split('\n');
    const headers = parseCSVLine(lines[0]);
    
    console.log('🚀 Starting import of technology combinations...');
    console.log(`📊 Found ${lines.length - 1} combinations to import`);
    
    let imported = 0;
    let skipped = 0;
    
    for (let i = 1; i < lines.length; i++) {
      try {
        const values = parseCSVLine(lines[i]);
        
        // Parse technologies from comma-separated string
        const technologiesStr = values[0].replace(/"/g, '');
        const technologies = technologiesStr.split(',').map(t => t.trim());
        
        // Parse companies from comma-separated string
        const companiesStr = values[8].replace(/"/g, '');
        const companies = companiesStr.split(',').map(c => c.trim());
        
        const combination = {
          technologies,
          category: values[1],
          jobRole: values[2].replace(/"/g, ''),
          techCount: parseInt(values[3]),
          commonality: values[4],
          vacancies: parseInt(values[5]),
          fresherPackage: values[6].replace(/"/g, ''),
          experiencedPackage: values[7].replace(/"/g, ''),
          topCompanies: companies,
          popularityScore: parseInt(values[9]),
        };
        
        await db.insert(technologyCombinations).values(combination);
        imported++;
        
        if (imported % 20 === 0) {
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
