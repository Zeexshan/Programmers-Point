import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AdminLayout } from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Plus, Edit, Trash2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertCompanySchema, type InsertCompany, type Company } from "@shared/schema";

export default function AdminCompanies() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const { toast } = useToast();

  const { data: companies, isLoading } = useQuery<any[]>({
    queryKey: ["/api/sheets/companies"],
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });

  const form = useForm<InsertCompany>({
    resolver: zodResolver(insertCompanySchema),
    defaultValues: {
      name: "",
      logoUrl: "",
      avgPackage: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertCompany) => {
      // Google Sheets integration: read-only for now
      // User should edit data directly in Google Sheets at:
      // https://docs.google.com/spreadsheets/d/1q1mo556ComV_PkDb14wmZcP6Tv__aB6Q2qCfhElmFaU
      toast({ 
        title: "Google Sheets Integration", 
        description: "Please update your Google Sheet directly. Changes will appear within 1 hour (cache refresh).",
      });
      throw new Error("Please edit data in Google Sheets");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sheets/companies"] });
      setDialogOpen(false);
      setEditingCompany(null);
      form.reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (name: string) => {
      toast({ 
        title: "Google Sheets Integration", 
        description: "Please delete rows directly in your Google Sheet. Changes will appear within 1 hour.",
      });
      throw new Error("Please edit data in Google Sheets");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sheets/companies"] });
    },
  });

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    form.reset({
      name: company.name,
      logoUrl: company.logoUrl || "",
      avgPackage: company.avgPackage || "",
    });
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingCompany(null);
    form.reset({
      name: "",
      logoUrl: "",
      avgPackage: "",
    });
    setDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold font-heading" data-testid="text-page-title">Companies</h1>
            <p className="text-muted-foreground">Manage partner companies</p>
          </div>
          <Button onClick={handleAdd} data-testid="button-add-company">
            <Plus className="mr-2 h-4 w-4" />
            Add Company
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            [...Array(8)].map((_, i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="bg-muted h-20 w-20 mx-auto mb-4 rounded" />
                <div className="bg-muted h-6 w-24 mx-auto mb-2 rounded" />
              </Card>
            ))
          ) : companies?.length === 0 ? (
            <Card className="p-8 col-span-full text-center text-muted-foreground">
              No companies found. Click "Add Company" to create one.
            </Card>
          ) : (
            companies?.map((company) => (
              <Card key={company.id} className="p-6" data-testid={`card-company-${company.id}`}>
                <div className="text-center mb-4">
                  {company.logoUrl ? (
                    <img
                      src={company.logoUrl}
                      alt={company.name}
                      className="h-20 w-20 object-contain mx-auto"
                    />
                  ) : (
                    <div className="h-20 w-20 bg-muted rounded mx-auto" />
                  )}
                </div>
                <h3 className="font-semibold text-center mb-2">{company.name}</h3>
                <p className="text-sm text-center text-muted-foreground mb-4">
                  {company.totalPlacements} Placements
                </p>
                {company.avgPackage && (
                  <p className="text-sm text-center text-muted-foreground mb-4">
                    Avg: {company.avgPackage}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 h-10"
                    onClick={() => handleEdit(company)}
                    data-testid={`button-edit-${company.id}`}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 h-10 text-destructive hover:text-destructive"
                    onClick={() => deleteMutation.mutate(company.id)}
                    data-testid={`button-delete-${company.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCompany ? "Edit Company" : "Add Company"}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., TCS, Infosys" className="h-12" data-testid="input-company-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="logoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo URL (optional)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://..." className="h-12" data-testid="input-logo-url" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="avgPackage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Average Package (optional)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., 8-12 LPA" className="h-12" data-testid="input-avg-package" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full h-12" disabled={createMutation.isPending} data-testid="button-save-company">
                  {createMutation.isPending ? "Saving..." : (editingCompany ? "Update" : "Add")}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
