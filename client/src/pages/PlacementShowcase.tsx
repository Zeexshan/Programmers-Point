import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { CompanyCard } from "@/components/CompanyCard";
import { StudentCard } from "@/components/StudentCard";
import { X } from "lucide-react";
import { fetchAllData } from "@/utils/googleSheets";
import type { Company, Placement, AllData } from "@/types";

export default function PlacementShowcase() {
  const [allData, setAllData] = useState<AllData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

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

  const getCompanyPlacements = (companyName: string): Placement[] => {
    return allData?.placements.filter(p => p.company === companyName) || [];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <LoadingSpinner text="Loading placements..." />
        <Footer />
      </div>
    );
  }

  const filteredPlacements = selectedCompany 
    ? getCompanyPlacements(selectedCompany.name)
    : [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="container max-w-7xl mx-auto px-4 md:px-8 py-12 flex-1">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-3" data-testid="text-page-title">
            Our Success Stories
          </h1>
          <p className="text-lg text-muted-foreground">
            Meet our students who landed their dream jobs at top companies
          </p>
        </div>

        {!selectedCompany ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {allData?.companies.map(company => (
              <CompanyCard
                key={company.name}
                company={company}
                onClick={() => setSelectedCompany(company)}
              />
            ))}
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold" data-testid="text-company-placements-title">
                {selectedCompany.name} Placements ({filteredPlacements.length})
              </h2>
              <Button
                variant="outline"
                onClick={() => setSelectedCompany(null)}
                className="min-h-[48px]"
                data-testid="button-back-to-companies"
              >
                <X className="h-4 w-4 mr-2" />
                Back to Companies
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {filteredPlacements.map((placement, index) => (
                <StudentCard key={index} placement={placement} />
              ))}
            </div>

            {filteredPlacements.length === 0 && (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">No placements found for this company.</p>
              </Card>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
