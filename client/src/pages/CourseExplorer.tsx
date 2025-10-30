import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DndContext, DragEndEvent, useDraggable, useDroppable } from "@dnd-kit/core";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowLeft, X, Briefcase, TrendingUp, Building2, Star, Calendar, Users } from "lucide-react";
import { SiReact, SiJavascript, SiAngular, SiPython, SiNodedotjs, SiDjango, SiSpring, SiMysql, SiMongodb, SiPostgresql, SiHtml5, SiCss3, SiKotlin, SiR, SiGo } from "react-icons/si";
import { Coffee, Smartphone } from "lucide-react";
import confetti from "canvas-confetti";
import logoUrl from "@assets/logo_1761740236721.png";
import type { Technology } from "@shared/schema";

// Tech icon mapping
const techIcons: Record<string, any> = {
  "React": SiReact,
  "JavaScript": SiJavascript,
  "Angular": SiAngular,
  "Java": Coffee,
  "Python": SiPython,
  "Node.js": SiNodedotjs,
  "Django": SiDjango,
  "Spring Boot": SiSpring,
  "MySQL": SiMysql,
  "MongoDB": SiMongodb,
  "PostgreSQL": SiPostgresql,
  "HTML": SiHtml5,
  "CSS": SiCss3,
  "Kotlin": SiKotlin,
  "React Native": SiReact,
  "SQL": Building2,
  "R": SiR,
  "Go": SiGo,
  "Express": SiNodedotjs,
};

// Predefined combinations
const combinations: Record<string, any> = {
  // Frontend Stacks
  "CSS+HTML+JavaScript": {
    name: "Frontend Developer",
    package: "4-8 LPA",
    vacancies: "8000+",
    companies: ["TCS", "Infosys", "Wipro", "Accenture", "Cognizant"],
    roles: ["UI Developer", "Web Designer", "Frontend Engineer"],
    description: "Build beautiful, interactive websites and web applications"
  },
  "JavaScript+React": {
    name: "React Developer",
    package: "6-12 LPA",
    vacancies: "6000+",
    companies: ["Facebook", "Netflix", "Airbnb", "Uber", "Swiggy"],
    roles: ["React Developer", "Frontend Engineer", "UI Specialist"],
    description: "Create modern, dynamic user interfaces"
  },
  
  // Full Stack Stacks
  "MongoDB+Node.js+React": {
    name: "MERN Stack Developer",
    package: "8-15 LPA",
    vacancies: "5000+",
    companies: ["Flipkart", "Swiggy", "Zomato", "PayTM", "Ola"],
    roles: ["Full Stack Developer", "MERN Developer", "JavaScript Engineer"],
    description: "Full-stack JavaScript development with modern tools"
  },
  "Express+MongoDB+Node.js+React": {
    name: "MERN Stack Developer",
    package: "8-15 LPA",
    vacancies: "5000+",
    companies: ["Flipkart", "Swiggy", "Zomato", "PayTM", "Ola"],
    roles: ["Full Stack Developer", "MERN Developer", "JavaScript Engineer"],
    description: "Full-stack JavaScript development with modern tools"
  },
  "Java+MySQL+Spring Boot": {
    name: "Java Full Stack Developer",
    package: "7-14 LPA",
    vacancies: "9000+",
    companies: ["TCS", "Infosys", "Capgemini", "HCL", "Accenture"],
    roles: ["Java Developer", "Backend Engineer", "Full Stack Java Dev"],
    description: "Enterprise-level application development"
  },
  "Django+PostgreSQL+Python": {
    name: "Python Full Stack Developer",
    package: "8-16 LPA",
    vacancies: "6000+",
    companies: ["Google", "Instagram", "Spotify", "Netflix", "Amazon"],
    roles: ["Python Developer", "Django Developer", "Backend Engineer"],
    description: "AI-ready web development with Python"
  },
  "Django+MySQL+Python": {
    name: "Python Full Stack Developer",
    package: "8-16 LPA",
    vacancies: "6000+",
    companies: ["Google", "Instagram", "Spotify", "Netflix", "Amazon"],
    roles: ["Python Developer", "Django Developer", "Backend Engineer"],
    description: "Web development with Python and databases"
  },
  
  // Backend Stacks
  "Java+MySQL": {
    name: "Java Backend Developer",
    package: "5-12 LPA",
    vacancies: "7000+",
    companies: ["TCS", "Infosys", "Wipro", "HCL", "Tech Mahindra"],
    roles: ["Backend Developer", "Java Engineer", "Server-side Developer"],
    description: "Build robust backend systems"
  },
  "MySQL+Python": {
    name: "Python Backend Developer",
    package: "6-13 LPA",
    vacancies: "5500+",
    companies: ["Google", "Amazon", "Microsoft", "Netflix"],
    roles: ["Backend Developer", "Python Engineer", "API Developer"],
    description: "Backend development with Python"
  },
  "MongoDB+Node.js": {
    name: "Node.js Backend Developer",
    package: "6-13 LPA",
    vacancies: "4500+",
    companies: ["PayTM", "Ola", "Zomato", "Swiggy"],
    roles: ["Backend Developer", "Node.js Engineer", "API Developer"],
    description: "Fast, scalable backend with JavaScript"
  },
  
  // Mobile Development
  "JavaScript+React+React Native": {
    name: "Mobile App Developer",
    package: "7-14 LPA",
    vacancies: "3500+",
    companies: ["Flipkart", "Uber", "Discord", "Shopify"],
    roles: ["Mobile Developer", "React Native Developer", "Cross-platform Dev"],
    description: "Build iOS and Android apps with JavaScript"
  },
  "Java+Kotlin": {
    name: "Android Developer",
    package: "6-13 LPA",
    vacancies: "4000+",
    companies: ["Google", "Samsung", "Xiaomi", "PhonePe"],
    roles: ["Android Developer", "Mobile Engineer", "App Developer"],
    description: "Native Android app development"
  },
  
  // Data Science Stacks
  "Python+R+SQL": {
    name: "Data Scientist",
    package: "8-18 LPA",
    vacancies: "3000+",
    companies: ["Google", "Amazon", "Microsoft", "Flipkart"],
    roles: ["Data Scientist", "ML Engineer", "Data Analyst"],
    description: "Extract insights from data using advanced analytics"
  },
  
  // DevOps Stacks
  "Go+Python": {
    name: "DevOps Engineer",
    package: "8-16 LPA",
    vacancies: "4000+",
    companies: ["Google", "Amazon", "Microsoft", "Flipkart"],
    roles: ["DevOps Engineer", "Site Reliability Engineer", "Cloud Engineer"],
    description: "Automate and manage infrastructure"
  }
};

function DraggableTech({ tech }: { tech: Technology }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: tech.id,
    data: tech,
  });

  const Icon = techIcons[tech.name] || null;

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 1,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`cursor-grab active:cursor-grabbing touch-none select-none ${isDragging ? 'scale-105' : ''}`}
      data-testid={`draggable-tech-${tech.id}`}
    >
      <Badge
        variant="outline"
        className="px-6 py-3 text-base font-medium hover-elevate transition-all duration-200 h-auto min-h-12"
      >
        {Icon && <Icon className="mr-2 h-5 w-5" />}
        {tech.name}
      </Badge>
    </div>
  );
}

function DropZone({ selectedTechs, onRemove }: { selectedTechs: Technology[], onRemove: (id: string) => void }) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'drop-zone',
  });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[400px] border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${
        isOver ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-muted-foreground/30'
      }`}
      data-testid="drop-zone"
    >
      {selectedTechs.length === 0 ? (
        <div className="h-full flex items-center justify-center text-center">
          <div className="space-y-3">
            <div className={`text-6xl ${isOver ? 'animate-bounce' : ''}`}>🎯</div>
            <p className="text-lg font-medium text-muted-foreground">
              Drag and drop technologies here
            </p>
            <p className="text-sm text-muted-foreground">
              Combine 2-4 technologies to explore career paths
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-3">
            {selectedTechs.map(tech => {
              const Icon = techIcons[tech.name] || null;
              return (
                <Badge
                  key={tech.id}
                  variant="default"
                  className="px-4 py-2 text-base h-auto min-h-12"
                  data-testid={`selected-tech-${tech.id}`}
                >
                  {Icon && <Icon className="mr-2 h-5 w-5" />}
                  {tech.name}
                  <button
                    onClick={() => onRemove(tech.id)}
                    className="ml-2 hover:text-destructive-foreground"
                    data-testid={`button-remove-tech-${tech.id}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </Badge>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CourseExplorer() {
  const [selectedTechs, setSelectedTechs] = useState<Technology[]>([]);
  const [combination, setCombination] = useState<any>(null);

  const { data: technologies, isLoading } = useQuery<Technology[]>({
    queryKey: ["/api/technologies"],
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    
    if (over && over.id === 'drop-zone' && active.data.current) {
      const tech = active.data.current as Technology;
      
      // Allow up to 4 technologies for combinations like MERN + Express
      if (!selectedTechs.find(t => t.id === tech.id) && selectedTechs.length < 4) {
        const newSelection = [...selectedTechs, tech];
        setSelectedTechs(newSelection);
        
        // Haptic feedback
        if ('vibrate' in navigator) {
          navigator.vibrate(200);
        }
        
        // Check for combinations
        checkCombination(newSelection);
      }
    }
  };

  const checkCombination = (techs: Technology[]) => {
    if (techs.length < 2) {
      setCombination(null);
      return;
    }

    const techNames = techs.map(t => t.name).sort();
    const key = techNames.join('+');
    
    if (combinations[key]) {
      setCombination(combinations[key]);
      
      // Trigger confetti animation for valid combination!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8']
      });
      
      // Second burst for extra celebration
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
      }, 250);
      
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 400);
    } else {
      // Generic combination
      setCombination({
        name: techNames.join(' + ') + " Developer",
        package: "6-12 LPA",
        vacancies: "2000+",
        companies: ["TCS", "Infosys", "Wipro"],
        description: "Multi-technology development role",
        roles: ["Software Developer", "Full Stack Developer"],
      });
    }
  };

  const removeTech = (id: string) => {
    const newSelection = selectedTechs.filter(t => t.id !== id);
    setSelectedTechs(newSelection);
    checkCombination(newSelection);
  };

  const frontend = technologies?.filter(t => t.category === "Frontend") || [];
  const backend = technologies?.filter(t => t.category === "Backend") || [];
  const database = technologies?.filter(t => t.category === "Database") || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="container max-w-7xl mx-auto px-4 md:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="h-10 w-10" data-testid="button-back">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <img src={logoUrl} alt="Programmers Point" className="h-12" data-testid="img-logo" />
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold font-heading mb-3" data-testid="text-page-title">
            Explore Your Career Path
          </h1>
          <p className="text-lg text-muted-foreground">
            Drag and combine technologies to discover career opportunities and packages
          </p>
        </div>

        <DndContext onDragEnd={handleDragEnd}>
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Frontend */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold font-heading mb-4 text-primary">
                Frontend
              </h3>
              <div className="flex flex-wrap gap-3">
                {frontend.map(tech => (
                  <DraggableTech key={tech.id} tech={tech} />
                ))}
              </div>
            </Card>

            {/* Backend */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold font-heading mb-4 text-secondary">
                Backend
              </h3>
              <div className="flex flex-wrap gap-3">
                {backend.map(tech => (
                  <DraggableTech key={tech.id} tech={tech} />
                ))}
              </div>
            </Card>

            {/* Database */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold font-heading mb-4 text-primary">
                Database
              </h3>
              <div className="flex flex-wrap gap-3">
                {database.map(tech => (
                  <DraggableTech key={tech.id} tech={tech} />
                ))}
              </div>
            </Card>
          </div>

          <DropZone selectedTechs={selectedTechs} onRemove={removeTech} />
        </DndContext>

        {/* Combination Result */}
        {combination && (
          <Card className="mt-8 p-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary/20 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-6">
              <div>
                <Badge variant="default" className="text-lg px-4 py-2 mb-4">
                  🎉 Career Path Unlocked!
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold font-heading mb-3" data-testid="text-combination-name">
                  🎯 {combination.name}
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{combination.description}</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                <Card className="p-6 hover-elevate transition-all">
                  <div className="flex flex-col items-center">
                    <TrendingUp className="h-8 w-8 mb-3 text-primary" />
                    <p className="text-sm text-muted-foreground mb-2">💰 Average Package</p>
                    <p className="text-2xl font-bold text-primary">{combination.package}</p>
                  </div>
                </Card>
                
                {combination.vacancies && (
                  <Card className="p-6 hover-elevate transition-all">
                    <div className="flex flex-col items-center">
                      <Briefcase className="h-8 w-8 mb-3 text-secondary" />
                      <p className="text-sm text-muted-foreground mb-2">📊 Current Vacancies</p>
                      <p className="text-2xl font-bold text-secondary">{combination.vacancies}</p>
                    </div>
                  </Card>
                )}
                
                {combination.companies && (
                  <Card className="p-6 hover-elevate transition-all md:col-span-2">
                    <div className="flex flex-col items-center">
                      <Building2 className="h-8 w-8 mb-3 text-primary" />
                      <p className="text-sm text-muted-foreground mb-3">🏢 Top Hiring Companies</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {combination.companies.map((company: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-sm">
                            {company}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Card>
                )}
              </div>

              {combination.roles && combination.roles.length > 0 && (
                <Card className="p-6 max-w-3xl mx-auto">
                  <div className="flex flex-col items-center">
                    <Users className="h-8 w-8 mb-3 text-secondary" />
                    <p className="text-sm text-muted-foreground mb-3">👔 Job Roles Available</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {combination.roles.map((role: string, i: number) => (
                        <Badge key={i} variant="secondary" className="text-base px-4 py-2">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              )}

              <div className="mt-8">
                <Link href="/inquiry">
                  <Button size="lg" className="min-h-14 text-base font-semibold px-8" data-testid="button-learn-stack">
                    🚀 Learn This Stack
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        )}

        {/* Technology Details */}
        {!isLoading && technologies && technologies.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold font-heading mb-8 text-center">
              Technology Market Insights
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {technologies.map(tech => {
                const Icon = techIcons[tech.name] || null;
                return (
                  <Card key={tech.id} className="p-6 hover-elevate transition-all duration-300" data-testid={`card-tech-${tech.id}`}>
                    <div className="flex items-start gap-4 mb-4">
                      {Icon && (
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <Icon className="h-8 w-8 text-primary" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold font-heading mb-1">
                          {tech.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">{tech.description}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {tech.vacancies && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                            <Briefcase className="h-3 w-3" />
                            Vacancies
                          </p>
                          <p className="font-semibold">{tech.vacancies.toLocaleString()}</p>
                        </div>
                      )}
                      {tech.avgPackage && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            Package
                          </p>
                          <p className="font-semibold">{tech.avgPackage}</p>
                        </div>
                      )}
                      {tech.topCompanies && (
                        <div className="col-span-2">
                          <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            Top Hiring
                          </p>
                          <p className="text-sm">{tech.topCompanies}</p>
                        </div>
                      )}
                      {tech.githubStars && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            GitHub
                          </p>
                          <p className="text-sm">{tech.githubStars}</p>
                        </div>
                      )}
                      {tech.npmDownloads && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">npm</p>
                          <p className="text-sm">{tech.npmDownloads}</p>
                        </div>
                      )}
                    </div>

                    {tech.lastUpdated && (
                      <div className="mt-4 pt-4 border-t text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Updated: {tech.lastUpdated}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
