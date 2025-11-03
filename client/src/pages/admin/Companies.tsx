import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Edit, Building2 } from "lucide-react";
import { fetchAllData, updateSheet, clearCache } from "@/utils/googleSheets";
import { useToast } from "@/hooks/use-toast";
import type { Company } from "@/types";

export default function Companies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const data = await fetchAllData();
      setCompanies(data.companies);
    } catch (error) {
      console.error('Failed to load companies:', error);
      toast({
        title: "Error",
        description: "Failed to load companies",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingCompany) return;

    try {
      setIsSaving(true);
      const companyIndex = companies.findIndex(c => c.name === editingCompany.name);
      
      if (companyIndex === -1) {
        throw new Error("Company not found");
      }

      const values = [[
        editingCompany.name,
        editingCompany.logoUrl,
        editingCompany.totalPlacements.toString(),
        editingCompany.avgPackage
      ]];

      await updateSheet('Companies', `A${companyIndex + 2}:D${companyIndex + 2}`, values);
      
      clearCache();
      await loadCompanies();
      
      setEditingCompany(null);
      toast({
        title: "Success",
        description: "Company updated successfully",
      });
    } catch (error: any) {
      console.error('Failed to update company:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update company",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <LoadingSpinner text="Loading companies..." />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold" data-testid="text-page-title">Companies</h1>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {companies.map((company) => (
            <Card key={company.name} className="p-6" data-testid={`card-company-${company.name.toLowerCase().replace(/\s+/g, '-')}`}>
              <div className="text-center">
                {company.logoUrl ? (
                  <img
                    src={company.logoUrl}
                    alt={company.name}
                    className="h-20 w-20 object-contain mx-auto mb-4"
                  />
                ) : (
                  <div className="h-20 w-20 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Building2 className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
                <h3 className="font-semibold mb-2">{company.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {company.totalPlacements} placements
                </p>
                <p className="text-sm font-medium text-primary mb-4">
                  {company.avgPackage}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingCompany(company)}
                  className="w-full min-h-[48px]"
                  data-testid={`button-edit-${company.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Edit Dialog */}
        <Dialog open={!!editingCompany} onOpenChange={() => setEditingCompany(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Company</DialogTitle>
            </DialogHeader>
            {editingCompany && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Company Name</Label>
                  <Input
                    value={editingCompany.name}
                    onChange={(e) => setEditingCompany({...editingCompany, name: e.target.value})}
                    className="h-[48px]"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Logo URL</Label>
                  <Input
                    value={editingCompany.logoUrl}
                    onChange={(e) => setEditingCompany({...editingCompany, logoUrl: e.target.value})}
                    className="h-[48px]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Total Placements</Label>
                    <Input
                      type="number"
                      value={editingCompany.totalPlacements}
                      onChange={(e) => setEditingCompany({...editingCompany, totalPlacements: parseInt(e.target.value)})}
                      className="h-[48px]"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Average Package</Label>
                    <Input
                      value={editingCompany.avgPackage}
                      onChange={(e) => setEditingCompany({...editingCompany, avgPackage: e.target.value})}
                      className="h-[48px]"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setEditingCompany(null)}
                    className="min-h-[48px]"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveEdit}
                    disabled={isSaving}
                    className="min-h-[48px]"
                    data-testid="button-save-company"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
