import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { DndContext, DragEndEvent, useDraggable, useDroppable } from "@dnd-kit/core";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowLeft, X, Briefcase, TrendingUp, Building2, Star, Calendar, Users, Target, Sparkles } from "lucide-react";
import { SiReact, SiJavascript, SiAngular, SiPython, SiNodedotjs, SiDjango, SiSpring, SiMysql, SiMongodb, SiPostgresql, SiHtml5, SiCss3, SiKotlin, SiR, SiGo } from "react-icons/si";
import { Coffee, Smartphone } from "lucide-react";
import confetti from "canvas-confetti";
import logoUrl from "@assets/logo_1761740236721.png";
import type { Technology, TechnologyCombination } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

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

// Dynamic calculation helpers
function calculateCombinedStats(selectedTechnologies: Technology[]) {
  if (selectedTechnologies.length === 0) return null;

  // Calculate total vacancies
  const totalVacancies = selectedTechnologies.reduce((sum, tech) => {
    return sum + (tech.vacancies || 0);
  }, 0);

  // Calculate average package range
  const packageRanges = selectedTechnologies
    .filter(tech => tech.avgPackage)
    .map(tech => {
      const matches = tech.avgPackage!.match(/(\d+)-(\d+)/);
      if (matches) {
        return { min: parseInt(matches[1]), max: parseInt(matches[2]) };
      }
      // Handle single number packages like "4.5 LPA"
      const singleMatch = tech.avgPackage!.match(/(\d+\.?\d*)/);
      if (singleMatch) {
        const val = parseFloat(singleMatch[1]);
        return { min: val, max: val };
      }
      return { min: 0, max: 0 };
    });

  const avgMin = packageRanges.length > 0
    ? Math.round(packageRanges.reduce((sum, p) => sum + p.min, 0) / packageRanges.length)
    : 0;

  const avgMax = packageRanges.length > 0
    ? Math.round(packageRanges.reduce((sum, p) => sum + p.max, 0) / packageRanges.length)
    : 0;

  // Merge unique companies
  const allCompanies = selectedTechnologies
    .filter(tech => tech.topCompanies)
    .flatMap(tech => tech.topCompanies!.split(',').map(c => c.trim()))
    .filter((company, index, self) => self.indexOf(company) === index)
    .slice(0, 8); // Show top 8

  // Merge skills/use cases from description field
  const allSkills = selectedTechnologies
    .filter(tech => tech.description)
    .flatMap(tech => tech.description!.split(',').map(s => s.trim()))
    .filter((skill, index, self) => self.indexOf(skill) === index)
    .slice(0, 10); // Limit to 10 skills for better UI

  // Generate smart title
  const title = generateStackTitle(selectedTechnologies);

  return {
    title,
    packageRange: avgMin > 0 && avgMax > 0 ? `${avgMin}-${avgMax} LPA` : "Competitive Package",
    vacancies: totalVacancies,
    companies: allCompanies,
    skills: allSkills,
    techCount: selectedTechnologies.length,
    description: generateDescription(selectedTechnologies)
  };
}

function generateStackTitle(techs: Technology[]): string {
  const names = techs.map(t => t.name);

  // Smart naming for common stacks
  if (names.includes('React') && names.includes('Node.js') && names.includes('MongoDB')) {
    return 'MERN Stack Developer';
  }
  if (names.includes('React') && names.includes('Express') && names.includes('Node.js') && names.includes('MongoDB')) {
    return 'MERN Stack Developer';
  }
  if (names.includes('Java') && names.includes('Spring Boot')) {
    return 'Java Full Stack Developer';
  }
  if (names.includes('Python') && names.includes('Django')) {
    return 'Python Full Stack Developer';
  }
  if (names.includes('HTML') && names.includes('CSS') && names.includes('JavaScript')) {
    return 'Frontend Developer';
  }
  if (names.includes('Angular') && names.includes('TypeScript')) {
    return 'Angular Developer';
  }

  // Generic titles
  if (techs.length === 1) {
    return `${names[0]} Developer`;
  }
  if (techs.length === 2) {
    return `${names[0]} + ${names[1]} Developer`;
  }
  if (techs.length === 3) {
    return `${names[0]}, ${names[1]} & ${names[2]} Developer`;
  }
  return `Multi-Stack Developer (${techs.length} technologies)`;
}

function generateDescription(techs: Technology[]): string {
  if (techs.length === 1) {
    return techs[0].description || "Specialized technology development";
  }
  
  const categories = [...new Set(techs.map(t => t.category))];
  
  if (categories.length === 1) {
    if (categories[0] === 'Frontend') return "Build modern, responsive user interfaces";
    if (categories[0] === 'Backend') return "Develop robust server-side applications";
    if (categories[0] === 'Database') return "Design and manage data storage solutions";
  }
  
  if (categories.includes('Frontend') && categories.includes('Backend')) {
    return "Full-stack development across frontend and backend";
  }
  
  return "Multi-technology development role with diverse skills";
}

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
              Combine technologies to explore career paths (no limit!)
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

type MatchType = 'exact' | 'subset' | 'calculated' | null;

interface CombinedResult {
  title: string;
  packageRange: string;
  fresherPackage?: string;
  experiencedPackage?: string;
  vacancies: number;
  companies: string[];
  skills: string[];
  techCount: number;
  description: string;
  matchType: MatchType;
  popularityScore?: number;
  commonality?: string;
}

export default function CourseExplorer() {
  const [selectedTechs, setSelectedTechs] = useState<Technology[]>([]);
  const [result, setResult] = useState<CombinedResult | null>(null);
  const [isMatching, setIsMatching] = useState(false);

  // Fetch technologies from Google Sheets with caching
  const { data: technologies, isLoading } = useQuery<any[]>({
    queryKey: ["/api/sheets/technologies"],
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    
    if (over && over.id === 'drop-zone' && active.data.current) {
      const tech = active.data.current as Technology;
      
      // Allow unlimited technologies - no limit!
      if (!selectedTechs.find(t => t.id === tech.id)) {
        const newSelection = [...selectedTechs, tech];
        setSelectedTechs(newSelection);
        
        // Haptic feedback
        if ('vibrate' in navigator) {
          navigator.vibrate(200);
        }
        
        // Calculate dynamic result
        updateResult(newSelection);
        
        // Trigger confetti animation when 2+ techs selected!
        if (newSelection.length >= 2) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8']
          });
          
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
        }
      }
    }
  };

  const updateResult = async (techs: Technology[]) => {
    if (techs.length === 0) {
      setResult(null);
      return;
    }

    setIsMatching(true);
    
    try {
      // Fetch combinations from Google Sheets and match locally
      const allCombinations = await apiRequest<any[]>({
        url: "/api/sheets/combinations",
        method: "GET",
      });
      
      const selectedNames = techs.map(t => t.name);
      
      // Find exact or subset matches
      const matches = allCombinations?.filter((combo: any) => {
        const comboTechs = combo.technologies;
        // Check if all selected techs are in this combination
        return selectedNames.every(name => comboTechs.includes(name));
      }).sort((a: any, b: any) => {
        // Prefer exact matches, then sort by popularity
        const aExact = a.technologies.length === selectedNames.length ? 1 : 0;
        const bExact = b.technologies.length === selectedNames.length ? 1 : 0;
        if (aExact !== bExact) return bExact - aExact;
        return (b.popularityScore || 0) - (a.popularityScore || 0);
      }) || [];

      if (matches && matches.length > 0) {
        const bestMatch = matches[0];
        
        // Determine match type
        const isExact = bestMatch.technologies.length === selectedNames.length;
        const matchType: MatchType = isExact ? 'exact' : 'subset';
        
        // Convert match to result format
        const matchResult: CombinedResult = {
          title: bestMatch.jobRole,
          packageRange: `${bestMatch.fresherPackage} (Fresher) | ${bestMatch.experiencedPackage} (Exp.)`,
          fresherPackage: bestMatch.fresherPackage,
          experiencedPackage: bestMatch.experiencedPackage,
          vacancies: bestMatch.vacancies,
          companies: Array.isArray(bestMatch.topCompanies) ? bestMatch.topCompanies : bestMatch.topCompanies.split(',').map((c: string) => c.trim()),
          skills: [],
          techCount: techs.length,
          description: `${bestMatch.category}${bestMatch.vacancies ? ` • ${bestMatch.vacancies.toLocaleString()} job openings` : ''}`,
          matchType,
          popularityScore: bestMatch.popularityScore,
          commonality: 'Common',
        };
        
        setResult(matchResult);
      } else {
        // No matches found - fall back to calculated result
        const calculatedResult = calculateCombinedStats(techs);
        if (calculatedResult) {
          setResult({
            ...calculatedResult,
            matchType: 'calculated'
          });
        }
      }
    } catch (error) {
      console.error('Error matching technologies:', error);
      // Fall back to calculated result on error
      const calculatedResult = calculateCombinedStats(techs);
      if (calculatedResult) {
        setResult({
          ...calculatedResult,
          matchType: 'calculated'
        });
      }
    } finally {
      setIsMatching(false);
    }
  };

  const removeTech = (id: string) => {
    const newSelection = selectedTechs.filter(t => t.id !== id);
    setSelectedTechs(newSelection);
    updateResult(newSelection);
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

        {/* Dynamic Result Card */}
        {result && (
          <Card className={`mt-8 p-8 border-2 animate-in fade-in-0 slide-in-from-bottom-4 duration-500 ${
            result.matchType === 'exact' 
              ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-500/50'
              : result.matchType === 'subset'
              ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-500/50'
              : 'bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20'
          }`}>
            <div className="text-center space-y-6">
              <div>
                {result.matchType === 'exact' && (
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Badge variant="default" className="text-lg px-4 py-2 bg-green-600 hover:bg-green-700">
                      <Target className="h-4 w-4 mr-2" />
                      🎯 Perfect Match!
                    </Badge>
                    {result.popularityScore && (
                      <Badge variant="secondary" className="text-sm px-3 py-2">
                        ⭐ Popularity: {result.popularityScore}/10
                      </Badge>
                    )}
                  </div>
                )}
                {result.matchType === 'subset' && (
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Badge variant="default" className="text-lg px-4 py-2 bg-blue-600 hover:bg-blue-700">
                      <Sparkles className="h-4 w-4 mr-2" />
                      ✨ Best Match
                    </Badge>
                    {result.popularityScore && (
                      <Badge variant="secondary" className="text-sm px-3 py-2">
                        ⭐ Popularity: {result.popularityScore}/10
                      </Badge>
                    )}
                  </div>
                )}
                {result.matchType === 'calculated' && (
                  <Badge variant="default" className="text-lg px-4 py-2 mb-4">
                    🔄 Custom Combination
                  </Badge>
                )}
                <h2 className="text-3xl md:text-4xl font-bold font-heading mb-3" data-testid="text-combination-name">
                  {result.matchType === 'exact' ? '🎯 ' : result.matchType === 'subset' ? '✨ ' : '🎓 '}{result.title}
                </h2>
                <p className="text-sm text-muted-foreground mb-2">
                  Combining {result.techCount} {result.techCount === 1 ? 'technology' : 'technologies'}
                </p>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{result.description}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <Card className="p-6 hover-elevate transition-all">
                  <div className="flex flex-col items-center">
                    <TrendingUp className="h-8 w-8 mb-3 text-primary" />
                    <p className="text-sm text-muted-foreground mb-2">💰 Average Package</p>
                    <p className="text-2xl font-bold text-primary" data-testid="text-package-range">
                      {result.packageRange}
                    </p>
                  </div>
                </Card>
                
                <Card className="p-6 hover-elevate transition-all">
                  <div className="flex flex-col items-center">
                    <Briefcase className="h-8 w-8 mb-3 text-secondary" />
                    <p className="text-sm text-muted-foreground mb-2">📊 Total Vacancies</p>
                    <p className="text-2xl font-bold text-secondary" data-testid="text-vacancies">
                      {result.vacancies.toLocaleString()}+
                    </p>
                  </div>
                </Card>
                
                {result.companies && result.companies.length > 0 && (
                  <Card className="p-6 hover-elevate transition-all md:col-span-2">
                    <div className="flex flex-col items-center">
                      <Building2 className="h-8 w-8 mb-3 text-primary" />
                      <p className="text-sm text-muted-foreground mb-3">🏢 Top Hiring Companies</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {result.companies.map((company: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-sm">
                            {company}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Card>
                )}
                
                {result.skills && result.skills.length > 0 && (
                  <Card className="p-6 hover-elevate transition-all md:col-span-2">
                    <div className="flex flex-col items-center">
                      <Star className="h-8 w-8 mb-3 text-secondary" />
                      <p className="text-sm text-muted-foreground mb-3">🎓 Skills & Applications</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {result.skills.map((skill: string, i: number) => (
                          <Badge key={i} variant="secondary" className="text-sm px-3 py-1">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Card>
                )}
              </div>

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
