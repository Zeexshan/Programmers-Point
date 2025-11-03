import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, User } from "lucide-react";
import { useState } from "react";
import type { Placement } from "@/types";

interface StudentCardProps {
  placement: Placement;
}

export function StudentCard({ placement }: StudentCardProps) {
  const [phoneRevealed, setPhoneRevealed] = useState(false);

  const maskPhone = (phone: string) => {
    if (!phone) return "**********";
    if (phone.length <= 4) return phone;
    return phone.slice(0, 2) + "*".repeat(phone.length - 4) + phone.slice(-2);
  };

  return (
    <Card className="min-h-[200px]" data-testid={`card-student-${placement.studentName.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {placement.photoUrl ? (
            <img
              src={placement.photoUrl}
              alt={placement.studentName}
              className="h-24 w-24 rounded-lg object-cover mx-auto md:mx-0"
              data-testid="img-student-photo"
            />
          ) : (
            <div className="h-24 w-24 rounded-lg bg-primary/10 flex items-center justify-center mx-auto md:mx-0">
              <User className="h-12 w-12 text-primary" />
            </div>
          )}

          <div className="flex-1 text-center md:text-left">
            <h3 className="font-bold text-lg" data-testid="text-student-name">
              {placement.studentName}
            </h3>
            <Badge variant="secondary" className="mt-1">
              {placement.company}
            </Badge>

            <div className="mt-3 space-y-2 text-sm">
              <p data-testid="text-profile">
                <span className="font-semibold">Profile:</span> {placement.profile}
              </p>
              <p data-testid="text-package" className="text-primary font-semibold">
                💰 Package: {placement.package}
              </p>
              <p data-testid="text-course">
                <span className="font-semibold">Course:</span> {placement.course}
              </p>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <Phone className="h-4 w-4" />
                <span className="font-mono" data-testid="text-phone">
                  {phoneRevealed ? placement.phone : maskPhone(placement.phone)}
                </span>
                {!phoneRevealed && (
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => setPhoneRevealed(true)}
                    className="h-auto p-0"
                    data-testid="button-show-phone"
                  >
                    Show
                  </Button>
                )}
              </div>
            </div>

            {placement.review && (
              <p className="mt-3 text-sm italic text-muted-foreground" data-testid="text-review">
                "{placement.review}"
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
