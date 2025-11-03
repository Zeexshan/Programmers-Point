import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Technology } from "@/types";

interface TechnologyCardProps {
  technology: Technology;
  selected?: boolean;
  onClick?: () => void;
}

export function TechnologyCard({ technology, selected = false, onClick }: TechnologyCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md min-h-[48px] ${
        selected ? "ring-2 ring-primary bg-primary/5" : ""
      }`}
      onClick={onClick}
      data-testid={`card-technology-${technology.name.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-sm md:text-base" data-testid={`text-tech-name-${technology.name}`}>
              {technology.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {technology.subCategory}
            </p>
          </div>
          {selected && (
            <Badge variant="default" className="ml-2">
              Selected
            </Badge>
          )}
        </div>
        <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span data-testid="text-vacancies">📊 {technology.vacancies.toLocaleString()} jobs</span>
          <span data-testid="text-package">💰 {technology.fresherPackage}</span>
        </div>
      </CardContent>
    </Card>
  );
}
