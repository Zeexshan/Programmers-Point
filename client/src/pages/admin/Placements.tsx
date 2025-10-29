import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Placement, Company } from "@shared/schema";

export default function AdminPlacements() {
  const { data: placements, isLoading } = useQuery<Placement[]>({
    queryKey: ["/api/placements"],
  });

  const { data: companies } = useQuery<Company[]>({
    queryKey: ["/api/companies"],
  });

  const getCompanyName = (companyId: string) => {
    return companies?.find(c => c.id === companyId)?.name || "Unknown";
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold font-heading" data-testid="text-page-title">Placements</h1>
            <p className="text-muted-foreground">Manage student placements</p>
          </div>
          <Button data-testid="button-add-placement">
            <Plus className="mr-2 h-4 w-4" />
            Add Placement
          </Button>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 sticky top-0">
                <tr className="h-14">
                  <th className="px-6 text-left text-sm font-semibold">Student Name</th>
                  <th className="px-6 text-left text-sm font-semibold">Company</th>
                  <th className="px-6 text-left text-sm font-semibold">Profile</th>
                  <th className="px-6 text-left text-sm font-semibold">Package</th>
                  <th className="px-6 text-left text-sm font-semibold">Course</th>
                  <th className="px-6 text-left text-sm font-semibold">Phone</th>
                  <th className="px-6 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-muted-foreground">
                      Loading...
                    </td>
                  </tr>
                ) : placements?.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-muted-foreground">
                      No placements found
                    </td>
                  </tr>
                ) : (
                  placements?.map((placement) => (
                    <tr key={placement.id} className="border-t h-16 hover:bg-muted/30" data-testid={`row-placement-${placement.id}`}>
                      <td className="px-6">{placement.studentName}</td>
                      <td className="px-6">{getCompanyName(placement.companyId)}</td>
                      <td className="px-6">{placement.profile}</td>
                      <td className="px-6 font-semibold text-primary">{placement.package}</td>
                      <td className="px-6 text-sm">{placement.course}</td>
                      <td className="px-6 text-sm">{placement.phone}</td>
                      <td className="px-6">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="h-10">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="h-10 text-destructive">
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
