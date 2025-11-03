import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { TechnologyCard } from "@/components/TechnologyCard";
import { X, Briefcase, TrendingUp, Building2, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { fetchAllData } from "@/utils/googleSheets";
import type { Technology, Combination, AllData } from "@/types";

export default function CourseExplorer() {
  const [allData, setAllData] = useState<AllData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTechs, setSelectedTechs] = useState<Technology[]>([]);
  const [result, setResult] = useState<any | null>(null);

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

    // Try to find exact match first
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

    // Calculate from individual technologies
    const totalVacancies = selectedTechs.reduce((sum, tech) => sum + tech.vacancies, 0);
    const allCompanies = [...new Set(
      selectedTechs.flatMap(tech => tech.topCompanies.split(',').map(c => c.trim()))
    )].slice(0, 8);

    setResult({
      type: 'calculated',
      title: selectedTechs.length === 1 
        ? `${selectedTechs[0].name} Developer`
        : `${selectedTechs.map(t => t.name).join(', ')} Developer`,
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <LoadingSpinner text="Loading courses..." />
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="container max-w-7xl mx-auto px-4 md:px-8 py-12 flex-1">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-3" data-testid="text-page-title">
            Explore Your Career Path
          </h1>
          <p className="text-lg text-muted-foreground">
            Select technologies to discover career opportunities and packages
          </p>
        </div>

        {/* Selected Technologies */}
        {selectedTechs.length > 0 && (
          <Card className="mb-8 p-6">
            <h3 className="font-semibold mb-4">Selected Technologies:</h3>
            <div className="flex flex-wrap gap-3">
              {selectedTechs.map(tech => (
                <Badge
                  key={tech.name}
                  variant="default"
                  className="px-4 py-2 text-base h-auto min-h-[48px] cursor-pointer"
                  data-testid={`selected-tech-${tech.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {tech.name}
                  <button
                    onClick={() => removeTech(tech.name)}
                    className="ml-2 hover:text-destructive"
                    data-testid={`button-remove-${tech.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </Badge>
              ))}
            </div>
          </Card>
        )}

        {/* Technology Groups */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {Object.entries(groupedTechs).map(([mainCategory, subCategories]) => (
            <Card key={mainCategory} className="p-6" data-testid={`category-${mainCategory.toLowerCase()}`}>
              <h2 className="text-2xl font-bold mb-6 text-primary">
                {mainCategory}
              </h2>
              <div className="space-y-6">
                {Object.entries(subCategories).map(([subCategory, techs]) => (
                  <div key={subCategory}>
                    <h3 className="text-lg font-semibold mb-3 text-muted-foreground">
                      {subCategory}
                    </h3>
                    <div className="grid gap-3">
                      {techs.sort((a, b) => a.displayOrder - b.displayOrder).map(tech => (
                        <TechnologyCard
                          key={tech.name}
                          technology={tech}
                          selected={selectedTechs.some(t => t.name === tech.name)}
                          onClick={() => toggleTechnology(tech)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Result Card */}
        {result && (
          <Card className={`p-8 border-2 ${
            result.type === 'exact' 
              ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-500/50'
              : 'bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20'
          }`} data-testid="result-card">
            <div className="text-center space-y-6">
              <div>
                {result.type === 'exact' && (
                  <Badge variant="default" className="text-lg px-4 py-2 bg-green-600 hover:bg-green-700 mb-4">
                    🎯 Perfect Match!
                  </Badge>
                )}
                {result.type === 'calculated' && (
                  <Badge variant="default" className="text-lg px-4 py-2 mb-4">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Custom Combination
                  </Badge>
                )}
                <h2 className="text-3xl md:text-4xl font-bold mb-3" data-testid="text-job-role">
                  {result.title}
                </h2>
                <p className="text-sm text-muted-foreground mb-2">
                  Combining {result.techCount} {result.techCount === 1 ? 'technology' : 'technologies'}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <Card className="p-6">
                  <div className="flex flex-col items-center">
                    <TrendingUp className="h-8 w-8 mb-3 text-primary" />
                    <p className="text-sm text-muted-foreground mb-2">Package Range</p>
                    <p className="text-xl font-bold text-primary" data-testid="text-fresher-package">
                      💰 Fresher: {result.fresherPackage}
                    </p>
                    <p className="text-xl font-bold text-secondary" data-testid="text-experienced-package">
                      💼 Experienced: {result.experiencedPackage}
                    </p>
                  </div>
                </Card>
                
                <Card className="p-6">
                  <div className="flex flex-col items-center">
                    <Briefcase className="h-8 w-8 mb-3 text-secondary" />
                    <p className="text-sm text-muted-foreground mb-2">Total Vacancies</p>
                    <p className="text-2xl font-bold text-secondary" data-testid="text-vacancies">
                      {result.vacancies.toLocaleString()}+
                    </p>
                  </div>
                </Card>
                
                {result.companies.length > 0 && (
                  <Card className="p-6 md:col-span-2">
                    <div className="flex flex-col items-center">
                      <Building2 className="h-8 w-8 mb-3 text-primary" />
                      <p className="text-sm text-muted-foreground mb-3">Top Hiring Companies</p>
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
              </div>

              <div className="mt-8">
                <Link href="/inquiry">
                  <Button size="lg" className="min-h-[48px] text-base font-semibold px-8" data-testid="button-learn-stack">
                    🚀 Learn This Stack
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
}
