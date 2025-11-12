import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, DollarSign } from "lucide-react";
import type { Company } from "@/types";

interface CompanyCardProps {
  company: Company;
  onClick?: () => void;
}

export function CompanyCard({ company, onClick }: CompanyCardProps) {
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-lg min-h-[120px]"
      onClick={onClick}
      data-testid={`card-company-${company.name.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <CardContent className="p-6 flex flex-col items-center text-center">
        {company.logoUrl && !logoFailed ? (
          <img
            src={company.logoUrl}
            alt={company.name}
            className="h-16 w-16 object-contain mb-3"
            data-testid={`img-company-logo-${company.name}`}
            onError={() => setLogoFailed(true)}
          />
        ) : (
          <div className="h-16 w-16 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
            <span className="text-2xl font-bold text-primary">
              {company.name.charAt(0)}
            </span>
          </div>
        )}
        <h3 className="font-bold text-lg" data-testid={`text-company-name-${company.name}`}>
          {company.name}
        </h3>
        <div className="mt-2 space-y-1 text-sm text-muted-foreground">
          <p className="flex items-center gap-1 justify-center" data-testid={`text-placements-${company.name}`}>
            <Users className="h-4 w-4" />
            {company.totalPlacements} placements
          </p>
          <p className="font-semibold text-primary flex items-center gap-1 justify-center" data-testid={`text-package-${company.name}`}>
            <DollarSign className="h-4 w-4" />
            {company.avgPackage}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
