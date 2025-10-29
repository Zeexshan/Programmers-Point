import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "wouter";
import { ArrowLeft, Building2, Users, Eye, EyeOff, Phone } from "lucide-react";
import logoUrl from "@assets/logo_1761740236721.png";
import type { Company, Placement } from "@shared/schema";

export default function PlacementShowcase() {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Placement | null>(null);
  const [showPhone, setShowPhone] = useState<Record<string, boolean>>({});

  const { data: companies, isLoading: companiesLoading } = useQuery<Company[]>({
    queryKey: ["/api/companies"],
  });

  const { data: placements } = useQuery<Placement[]>({
    queryKey: ["/api/placements"],
  });

  const getCompanyPlacements = (companyId: string) => {
    return placements?.filter(p => p.companyId === companyId) || [];
  };

  const maskPhone = (phone: string) => {
    if (phone.length < 8) return phone;
    return `${phone.slice(0, -4)}XXXX`;
  };

  const togglePhone = (placementId: string) => {
    setShowPhone(prev => ({ ...prev, [placementId]: !prev[placementId] }));
  };

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
            Our Success Stories
          </h1>
          <p className="text-lg text-muted-foreground">
            Meet our students who landed their dream jobs at top companies
          </p>
        </div>

        {companiesLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="bg-muted h-20 w-20 mx-auto mb-4 rounded-lg" />
                <div className="bg-muted h-6 w-24 mx-auto mb-2 rounded" />
                <div className="bg-muted h-4 w-16 mx-auto rounded" />
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {companies?.map((company) => {
              const companyPlacements = getCompanyPlacements(company.id);
              return (
                <Card
                  key={company.id}
                  className="p-6 hover-elevate cursor-pointer transition-all duration-300"
                  onClick={() => setSelectedCompany(company)}
                  data-testid={`card-company-${company.id}`}
                >
                  <div className="text-center">
                    {company.logoUrl ? (
                      <img
                        src={company.logoUrl}
                        alt={company.name}
                        className="h-20 w-20 object-contain mx-auto mb-4 grayscale hover:grayscale-0 transition-all"
                      />
                    ) : (
                      <div className="h-20 w-20 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Building2 className="h-10 w-10 text-muted-foreground" />
                      </div>
                    )}
                    <h3 className="font-semibold mb-2" data-testid={`text-company-name-${company.id}`}>
                      {company.name}
                    </h3>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{companyPlacements.length} Placed</span>
                    </div>
                    {company.avgPackage && (
                      <Badge variant="secondary" className="mt-2">
                        {company.avgPackage}
                      </Badge>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Company Placements Dialog */}
        <Dialog open={!!selectedCompany} onOpenChange={() => setSelectedCompany(null)}>
          <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-heading">
                {selectedCompany?.name} - Placements
              </DialogTitle>
            </DialogHeader>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {selectedCompany && getCompanyPlacements(selectedCompany.id).map((placement) => (
                <Card
                  key={placement.id}
                  className="p-6 hover-elevate cursor-pointer transition-all"
                  onClick={() => setSelectedStudent(placement)}
                  data-testid={`card-student-${placement.id}`}
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={placement.photoUrl || undefined} />
                      <AvatarFallback className="text-lg font-semibold">
                        {placement.studentName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold" data-testid={`text-student-name-${placement.id}`}>
                        {placement.studentName}
                      </h4>
                      <p className="text-sm text-muted-foreground">{placement.profile}</p>
                    </div>
                    <Badge variant="default" className="text-base font-semibold">
                      {placement.package}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Student Details Dialog */}
        <Dialog open={!!selectedStudent} onOpenChange={() => { setSelectedStudent(null); setShowPhone({}); }}>
          <DialogContent className="max-w-2xl">
            {selectedStudent && (
              <div className="space-y-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={selectedStudent.photoUrl || undefined} />
                    <AvatarFallback className="text-2xl font-semibold">
                      {selectedStudent.studentName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-2xl font-bold font-heading" data-testid="text-student-detail-name">
                      {selectedStudent.studentName}
                    </h3>
                    <p className="text-lg text-muted-foreground">{selectedStudent.profile}</p>
                  </div>
                  <Badge variant="default" className="text-xl font-bold px-4 py-2">
                    {selectedStudent.package}
                  </Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <p className="text-sm text-muted-foreground mb-1">Phone</p>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">
                        {showPhone[selectedStudent.id] ? selectedStudent.phone : maskPhone(selectedStudent.phone)}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => togglePhone(selectedStudent.id)}
                        data-testid="button-toggle-phone"
                      >
                        {showPhone[selectedStudent.id] ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <p className="text-sm text-muted-foreground mb-1">Course Completed</p>
                    <p className="font-medium">{selectedStudent.course}</p>
                  </Card>

                  {selectedStudent.studyDuration && (
                    <Card className="p-4">
                      <p className="text-sm text-muted-foreground mb-1">Study Duration</p>
                      <p className="font-medium">{selectedStudent.studyDuration}</p>
                    </Card>
                  )}

                  {selectedStudent.interviewRounds && (
                    <Card className="p-4">
                      <p className="text-sm text-muted-foreground mb-1">Interview Rounds</p>
                      <p className="font-medium">{selectedStudent.interviewRounds}</p>
                    </Card>
                  )}
                </div>

                {selectedStudent.review && (
                  <Card className="p-6">
                    <p className="text-sm text-muted-foreground mb-2">Testimonial</p>
                    <p className="text-foreground italic">"{selectedStudent.review}"</p>
                  </Card>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
