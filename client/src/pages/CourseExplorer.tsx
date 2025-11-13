import { useState, useEffect, type ReactNode } from "react";
import { DndContext, DragEndEvent, DragOverlay, useDraggable, useDroppable } from "@dnd-kit/core";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { X, Briefcase, TrendingUp, Building2, Sparkles, GraduationCap, Palette, Settings, Database, Bot, Code, DollarSign, Check, Target, Rocket, Gamepad2 } from "lucide-react";
import { Link } from "wouter";
import { fetchAllData } from "@/utils/googleSheets";
import type { Technology, AllData } from "@/types";

function DraggableTechCard({ tech, isSelected }: { tech: Technology; isSelected: boolean }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: tech.name,
    data: tech,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0.5 : 1,
  } : undefined;

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Frontend": "from-blue-500/20 to-blue-600/20 border-blue-500/30",
      "Backend": "from-green-500/20 to-green-600/20 border-green-500/30",
      "Database": "from-orange-500/20 to-orange-600/20 border-orange-500/30",
      "AI/ML": "from-purple-500/20 to-purple-600/20 border-purple-500/30",
    };
    return colors[category] || "from-gray-500/20 to-gray-600/20 border-gray-500/30";
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, ReactNode> = {
      "Frontend": <Palette className="h-5 w-5" />,
      "Backend": <Settings className="h-5 w-5" />,
      "Database": <Database className="h-5 w-5" />,
      "AI/ML": <Bot className="h-5 w-5" />,
    };
    return icons[category] || <Code className="h-5 w-5" />;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        relative bg-gradient-to-br ${getCategoryColor(tech.mainCategory)}
        border-2 rounded-md p-3 cursor-grab active:cursor-grabbing
        transition-all duration-200 hover-elevate
        ${isSelected ? 'ring-2 ring-primary' : ''}
        ${isDragging ? 'opacity-50' : ''}
      `}
      data-testid={`card-technology-${tech.name.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="flex-shrink-0">{getCategoryIcon(tech.mainCategory)}</div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm truncate" data-testid={`text-tech-name-${tech.name}`}>
            {tech.name}
          </h3>
          <p className="text-xs text-muted-foreground truncate">{tech.subCategory}</p>
        </div>
      </div>
      <div className="flex gap-1 text-xs items-center">
        <DollarSign className="h-3 w-3" />
        <span className="bg-background/50 px-2 py-0.5 rounded text-xs">{tech.fresherPackage}</span>
      </div>
      {isSelected && (
        <div className="absolute top-1 right-1">
          <Badge variant="default" className="h-5 w-5 p-0 flex items-center justify-center"><Check className="h-3 w-3" /></Badge>
        </div>
      )}
    </div>
  );
}

function DropZone({ 
  selectedTechs, 
  onRemove 
}: { 
  selectedTechs: Technology[]; 
  onRemove: (name: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'workspace-dropzone',
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        border-4 border-dashed rounded-xl p-6 min-h-[200px]
        transition-all duration-300
        ${isOver 
          ? 'border-primary bg-primary/10 scale-[1.01]' 
          : 'border-muted-foreground/30 bg-muted/30'
        }
      `}
      data-testid="drop-zone"
    >
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          {selectedTechs.length === 0 ? (
            <>
              <Target className="h-5 w-5" />
              <h3 className="text-lg font-bold">Drop Technologies Here</h3>
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              <h3 className="text-lg font-bold">Your Stack</h3>
            </>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {selectedTechs.length === 0 
            ? 'Click or drag technologies to combine them' 
            : `Combining ${selectedTechs.length} ${selectedTechs.length === 1 ? 'technology' : 'technologies'}`
          }
        </p>
      </div>

      {selectedTechs.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center">
          {selectedTechs.map((tech) => (
            <div
              key={tech.name}
              className="group relative bg-card border-2 border-primary/50 rounded-md px-3 py-2 shadow-lg animate-scale-in"
              data-testid={`selected-chip-${tech.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <span className="font-semibold text-sm">{tech.name}</span>
              <button
                onClick={() => onRemove(tech.name)}
                className="ml-2 text-muted-foreground hover:text-destructive transition-colors"
                data-testid={`button-remove-${tech.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ResultCard({ result }: { result: any }) {
  return (
    <Card 
      className="mt-6 overflow-hidden animate-scale-in bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10 border-2 border-purple-500/30"
      data-testid="result-card"
    >
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          {/* Header */}
          <div>
            {result.type === 'exact' && (
              <Badge className="text-base px-3 py-1 bg-green-600 hover:bg-green-700 mb-3 flex items-center gap-2 w-fit mx-auto">
                <Target className="h-4 w-4" />
                Perfect Match!
              </Badge>
            )}
            {result.type === 'calculated' && (
              <Badge className="text-base px-3 py-1 mb-3 flex items-center gap-2 w-fit mx-auto">
                <Sparkles className="h-4 w-4" />
                Custom Combination
              </Badge>
            )}
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent" data-testid="text-job-role">
              {result.title}
            </h2>
            <p className="text-sm text-muted-foreground">
              Combining {result.techCount} {result.techCount === 1 ? 'technology' : 'technologies'}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 gap-3 max-w-2xl mx-auto">
            {/* Package Card */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-500/30">
              <CardContent className="p-4">
                <TrendingUp className="h-8 w-8 mb-2 text-green-600 mx-auto" />
                <p className="text-xs text-muted-foreground mb-2">Package Range</p>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-green-600 flex items-center gap-1 justify-center" data-testid="text-fresher-package">
                    <DollarSign className="h-4 w-4" />
                    Fresher: {result.fresherPackage}
                  </p>
                  <p className="text-sm font-bold text-green-700 flex items-center gap-1 justify-center" data-testid="text-experienced-package">
                    <Briefcase className="h-4 w-4" />
                    Experienced: {result.experiencedPackage}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Vacancies Card */}
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-500/30">
              <CardContent className="p-4">
                <Briefcase className="h-8 w-8 mb-2 text-blue-600 mx-auto" />
                <p className="text-xs text-muted-foreground mb-2">Total Vacancies</p>
                <p className="text-2xl font-bold text-blue-600" data-testid="text-vacancies">
                  {result.vacancies.toLocaleString()}+
                </p>
              </CardContent>
            </Card>

            {/* Companies Card */}
            {result.companies.length > 0 && (
              <Card className="md:col-span-2 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-500/30">
                <CardContent className="p-4">
                  <Building2 className="h-8 w-8 mb-2 text-purple-600 mx-auto" />
                  <p className="text-xs text-muted-foreground mb-2">Top Hiring Companies</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {result.companies.map((company: string, i: number) => (
                      <Badge key={i} variant="outline" className="text-xs bg-background/50 flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {company}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <Link href={`/inquiry?course=${encodeURIComponent(result.title)}`}>
              <Button 
                size="lg" 
                className="text-base px-6 py-5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                data-testid="button-learn-stack"
              >
                <Rocket className="mr-2 h-5 w-5" />
                Learn This Stack
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CourseExplorer() {
  const [allData, setAllData] = useState<AllData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTechs, setSelectedTechs] = useState<Technology[]>([]);
  const [result, setResult] = useState<any | null>(null);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchAllData();
      setAllData(data);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedTechs.length > 0 && allData) {
      calculateResult();
    } else {
      setResult(null);
    }
  }, [selectedTechs, allData]);

  const calculateResult = () => {
    if (!allData) return;

    const selectedNames = selectedTechs.map(t => t.name);

    const exactMatch = allData.combinations.find(combo => {
      return combo.technologies.length === selectedNames.length &&
        combo.technologies.every(t => selectedNames.includes(t)) &&
        selectedNames.every(t => combo.technologies.includes(t));
    });

    if (exactMatch) {
      setResult({
        type: 'exact',
        title: exactMatch.jobRole,
        fresherPackage: exactMatch.fresherPackage,
        experiencedPackage: exactMatch.experiencedPackage,
        vacancies: exactMatch.vacancies,
        companies: exactMatch.topCompanies.split(',').map(c => c.trim()),
        techCount: selectedTechs.length
      });
      return;
    }

    const totalVacancies = selectedTechs.reduce((sum, tech) => sum + tech.vacancies, 0);
    const allCompanies = Array.from(new Set(
      selectedTechs.flatMap(tech => tech.topCompanies.split(',').map(c => c.trim()))
    )).slice(0, 8);

    setResult({
      type: 'calculated',
      title: selectedTechs.length === 1 
        ? `${selectedTechs[0].name} Developer`
        : `${selectedTechs.map(t => t.name).join(' + ')} Developer`,
      fresherPackage: 'Competitive',
      experiencedPackage: 'As per experience',
      vacancies: totalVacancies,
      companies: allCompanies,
      techCount: selectedTechs.length
    });
  };

  const toggleTechnology = (tech: Technology) => {
    const isSelected = selectedTechs.some(t => t.name === tech.name);
    if (isSelected) {
      setSelectedTechs(selectedTechs.filter(t => t.name !== tech.name));
    } else {
      setSelectedTechs([...selectedTechs, tech]);
    }
  };

  const removeTech = (techName: string) => {
    setSelectedTechs(selectedTechs.filter(t => t.name !== techName));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragId(null);

    if (over && over.id === 'workspace-dropzone') {
      const tech = active.data.current as Technology;
      if (!selectedTechs.some(t => t.name === tech.name)) {
        setSelectedTechs([...selectedTechs, tech]);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <LoadingSpinner text="Loading technologies..." />
        <Footer />
      </div>
    );
  }

  const groupedTechs = allData?.technologies.reduce((acc, tech) => {
    if (!acc[tech.mainCategory]) {
      acc[tech.mainCategory] = {};
    }
    if (!acc[tech.mainCategory][tech.subCategory]) {
      acc[tech.mainCategory][tech.subCategory] = [];
    }
    acc[tech.mainCategory][tech.subCategory].push(tech);
    return acc;
  }, {} as Record<string, Record<string, Technology[]>>) || {};

  const activeTech = activeDragId 
    ? allData?.technologies.find(t => t.name === activeDragId)
    : null;

  const getCategoryHeaderColor = (category: string) => {
    const colors: Record<string, string> = {
      "Frontend": "from-blue-600 to-blue-700",
      "Backend": "from-green-600 to-green-700",
      "Database": "from-orange-600 to-orange-700",
      "AI/ML": "from-purple-600 to-purple-700",
    };
    return colors[category] || "from-gray-600 to-gray-700";
  };

  const getCategoryBgColor = (category: string) => {
    const colors: Record<string, string> = {
      "Frontend": "bg-blue-500/5",
      "Backend": "bg-green-500/5",
      "Database": "bg-orange-500/5",
      "AI/ML": "bg-purple-500/5",
    };
    return colors[category] || "bg-gray-500/5";
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="container max-w-7xl mx-auto px-4 md:px-6 py-8 flex-1">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Gamepad2 className="h-10 w-10 text-purple-600" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent" data-testid="text-page-title">
              Build Your Tech Stack
            </h1>
          </div>
          <p className="text-base text-muted-foreground">
            Combine technologies like Infinite Craft to discover career paths
          </p>
        </div>

        <DndContext onDragEnd={handleDragEnd} onDragStart={(e) => setActiveDragId(e.active.id as string)}>
          {/* Drop Zone */}
          <div className="mb-6">
            <DropZone 
              selectedTechs={selectedTechs} 
              onRemove={removeTech}
            />
          </div>

          {/* Result */}
          {result && <ResultCard result={result} />}

          {/* Technologies Grid */}
          <div className="mt-8 space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-1">Available Technologies</h2>
              <p className="text-sm text-muted-foreground">Click or drag any technology to add it to your stack</p>
            </div>

            {Object.entries(groupedTechs).map(([mainCategory, subCategories]) => (
              <div key={mainCategory} className={`rounded-xl p-6 ${getCategoryBgColor(mainCategory)}`}>
                <h3 className={`text-2xl font-bold mb-4 bg-gradient-to-r ${getCategoryHeaderColor(mainCategory)} bg-clip-text text-transparent flex items-center gap-2`}>
                  {mainCategory === "Frontend" && <Palette className="h-6 w-6 text-blue-600" />}
                  {mainCategory === "Backend" && <Settings className="h-6 w-6 text-green-600" />}
                  {mainCategory === "Database" && <Database className="h-6 w-6 text-orange-600" />}
                  {mainCategory === "AI/ML" && <Bot className="h-6 w-6 text-purple-600" />}
                  {mainCategory}
                </h3>
                
                {Object.entries(subCategories).map(([subCategory, techs]) => (
                  <div key={subCategory} className="mb-6 last:mb-0">
                    <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                      {subCategory}
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                      {techs.sort((a, b) => a.displayOrder - b.displayOrder).map(tech => (
                        <div
                          key={tech.name}
                          onClick={() => toggleTechnology(tech)}
                        >
                          <DraggableTechCard 
                            tech={tech} 
                            isSelected={selectedTechs.some(t => t.name === tech.name)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Drag Overlay */}
          <DragOverlay>
            {activeTech && (
              <div className="bg-card border-2 border-primary rounded-md p-3 shadow-2xl opacity-90">
                <div className="font-bold text-sm">{activeTech.name}</div>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>

      <Footer />

      <style>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-scale-in {
          animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </div>
  );
}
