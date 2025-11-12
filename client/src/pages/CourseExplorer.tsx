import { useState, useEffect } from "react";
import { DndContext, DragEndEvent, DragOverlay, useDraggable, useDroppable } from "@dnd-kit/core";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { X, Briefcase, TrendingUp, Building2, Sparkles, GraduationCap } from "lucide-react";
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

  const getCategoryEmoji = (category: string) => {
    const emojis: Record<string, string> = {
      "Frontend": "🎨",
      "Backend": "⚙️",
      "Database": "💾",
      "AI/ML": "🤖",
    };
    return emojis[category] || "💻";
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        relative bg-gradient-to-br ${getCategoryColor(tech.mainCategory)}
        border-2 rounded-lg p-4 cursor-grab active:cursor-grabbing
        transition-all duration-300 hover:shadow-xl hover:-translate-y-1
        ${isSelected ? 'ring-2 ring-primary scale-95' : ''}
        ${isDragging ? 'opacity-50' : ''}
      `}
      data-testid={`card-technology-${tech.name.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-3xl">{getCategoryEmoji(tech.mainCategory)}</span>
        <div className="flex-1">
          <h3 className="font-bold text-sm" data-testid={`text-tech-name-${tech.name}`}>
            {tech.name}
          </h3>
          <p className="text-xs text-muted-foreground">{tech.subCategory}</p>
        </div>
      </div>
      <div className="mt-3 flex gap-2 text-xs">
        <span className="bg-background/50 px-2 py-1 rounded">💰 {tech.fresherPackage}</span>
      </div>
      {isSelected && (
        <div className="absolute top-1 right-1">
          <Badge variant="default" className="text-xs">✓</Badge>
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
        border-4 border-dashed rounded-2xl p-8 min-h-[300px]
        transition-all duration-300
        ${isOver 
          ? 'border-primary bg-primary/10 scale-[1.02]' 
          : 'border-muted-foreground/30 bg-muted/30'
        }
      `}
      data-testid="drop-zone"
    >
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold mb-2">
          {selectedTechs.length === 0 ? '🎯 Drop Technologies Here' : '✨ Your Stack'}
        </h3>
        <p className="text-sm text-muted-foreground">
          {selectedTechs.length === 0 
            ? 'Click or drag technologies to combine them' 
            : `Combining ${selectedTechs.length} ${selectedTechs.length === 1 ? 'technology' : 'technologies'}`
          }
        </p>
      </div>

      {selectedTechs.length > 0 && (
        <div className="flex flex-wrap gap-3 justify-center">
          {selectedTechs.map((tech) => (
            <div
              key={tech.name}
              className="group relative bg-card border-2 border-primary/50 rounded-lg px-4 py-2 shadow-lg animate-scale-in"
              data-testid={`selected-chip-${tech.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <span className="font-semibold">{tech.name}</span>
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
      className="mt-8 overflow-hidden animate-scale-in bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10 border-2 border-purple-500/30"
      data-testid="result-card"
    >
      <CardContent className="p-8">
        <div className="text-center space-y-6">
          {/* Header */}
          <div>
            {result.type === 'exact' && (
              <Badge className="text-lg px-4 py-2 bg-green-600 hover:bg-green-700 mb-4">
                🎯 Perfect Match!
              </Badge>
            )}
            {result.type === 'calculated' && (
              <Badge className="text-lg px-4 py-2 mb-4">
                <Sparkles className="h-4 w-4 mr-2" />
                Custom Combination
              </Badge>
            )}
            <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent" data-testid="text-job-role">
              ✨ {result.title}
            </h2>
            <p className="text-sm text-muted-foreground">
              Combining {result.techCount} {result.techCount === 1 ? 'technology' : 'technologies'}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {/* Package Card */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-500/30">
              <CardContent className="p-6">
                <TrendingUp className="h-10 w-10 mb-3 text-green-600 mx-auto" />
                <p className="text-sm text-muted-foreground mb-3">Package Range</p>
                <div className="space-y-1">
                  <p className="text-lg font-bold text-green-600" data-testid="text-fresher-package">
                    💰 Fresher: {result.fresherPackage}
                  </p>
                  <p className="text-lg font-bold text-green-700" data-testid="text-experienced-package">
                    💼 Experienced: {result.experiencedPackage}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Vacancies Card */}
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-500/30">
              <CardContent className="p-6">
                <Briefcase className="h-10 w-10 mb-3 text-blue-600 mx-auto" />
                <p className="text-sm text-muted-foreground mb-3">Total Vacancies</p>
                <p className="text-3xl font-bold text-blue-600" data-testid="text-vacancies">
                  {result.vacancies.toLocaleString()}+
                </p>
              </CardContent>
            </Card>

            {/* Companies Card */}
            {result.companies.length > 0 && (
              <Card className="md:col-span-2 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-500/30">
                <CardContent className="p-6">
                  <Building2 className="h-10 w-10 mb-3 text-purple-600 mx-auto" />
                  <p className="text-sm text-muted-foreground mb-3">Top Hiring Companies</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {result.companies.map((company: string, i: number) => (
                      <Badge key={i} variant="outline" className="text-sm bg-background/50">
                        🏢 {company}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <Link href="/inquiry">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                data-testid="button-learn-stack"
              >
                <GraduationCap className="mr-2 h-5 w-5" />
                🚀 Learn This Stack
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
    const allCompanies = [...new Set(
      selectedTechs.flatMap(tech => tech.topCompanies.split(',').map(c => c.trim()))
    )].slice(0, 8);

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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="container max-w-7xl mx-auto px-4 md:px-8 py-12 flex-1">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent" data-testid="text-page-title">
            🎮 Build Your Tech Stack
          </h1>
          <p className="text-lg text-muted-foreground">
            Combine technologies like Infinite Craft to discover career paths
          </p>
        </div>

        <DndContext onDragEnd={handleDragEnd} onDragStart={(e) => setActiveDragId(e.active.id as string)}>
          <div className="grid lg:grid-cols-[350px_1fr] gap-8">
            {/* Left Panel: Technology Palette */}
            <div className="space-y-6 lg:max-h-[calc(100vh-300px)] lg:overflow-y-auto lg:pr-4 scrollbar-thin">
              <Card className="p-6 sticky top-0 bg-card/95 backdrop-blur z-10">
                <h2 className="text-2xl font-bold mb-2">🧩 Available Technologies</h2>
                <p className="text-sm text-muted-foreground">Click or drag to add</p>
              </Card>

              {Object.entries(groupedTechs).map(([mainCategory, subCategories]) => (
                <div key={mainCategory} className="space-y-4">
                  <h3 className="text-xl font-bold text-primary px-2">
                    {mainCategory}
                  </h3>
                  {Object.entries(subCategories).map(([subCategory, techs]) => (
                    <div key={subCategory} className="space-y-3">
                      <h4 className="text-sm font-semibold text-muted-foreground px-2">
                        {subCategory}
                      </h4>
                      <div className="grid gap-3">
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

            {/* Right Panel: Workspace + Result */}
            <div className="space-y-6">
              <DropZone 
                selectedTechs={selectedTechs} 
                onRemove={removeTech}
              />

              {result && <ResultCard result={result} />}
            </div>
          </div>

          {/* Drag Overlay */}
          <DragOverlay>
            {activeTech && (
              <div className="bg-card border-2 border-primary rounded-lg p-4 shadow-2xl opacity-80">
                <div className="font-bold">{activeTech.name}</div>
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
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-scale-in {
          animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }

        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: hsl(var(--muted-foreground) / 0.3);
          border-radius: 3px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--muted-foreground) / 0.5);
        }
      `}</style>
    </div>
  );
}
