import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Edit } from "lucide-react";
import { fetchAllData, updateSheet, clearCache } from "@/utils/googleSheets";
import { useToast } from "@/hooks/use-toast";
import type { Combination } from "@/types";

export default function Combinations() {
  const [combinations, setCombinations] = useState<Combination[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCombo, setEditingCombo] = useState<Combination | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadCombinations();
  }, []);

  const loadCombinations = async () => {
    try {
      setLoading(true);
      const data = await fetchAllData();
      setCombinations(data.combinations);
    } catch (error) {
      console.error('Failed to load combinations:', error);
      toast({
        title: "Error",
        description: "Failed to load combinations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingCombo) return;

    try {
      setIsSaving(true);
      const comboIndex = combinations.findIndex(c => c.jobRole === editingCombo.jobRole);
      
      if (comboIndex === -1) {
        throw new Error("Combination not found");
      }

      const values = [[
        editingCombo.technologies.join(', '),
        editingCombo.jobRole,
        editingCombo.category,
        editingCombo.vacancies.toString(),
        editingCombo.fresherPackage,
        editingCombo.experiencedPackage,
        editingCombo.topCompanies,
        editingCombo.popularityScore.toString()
      ]];

      await updateSheet('Combinations', `A${comboIndex + 2}:H${comboIndex + 2}`, values);
      
      clearCache();
      await loadCombinations();
      
      setEditingCombo(null);
      toast({
        title: "Success",
        description: "Combination updated successfully",
      });
    } catch (error: any) {
      console.error('Failed to update combination:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update combination",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <LoadingSpinner text="Loading combinations..." />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold" data-testid="text-page-title">Technology Combinations</h1>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Role</TableHead>
                <TableHead>Technologies</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Vacancies</TableHead>
                <TableHead>Fresher Package</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {combinations.map((combo, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{combo.jobRole}</TableCell>
                  <TableCell className="max-w-md">
                    <div className="flex flex-wrap gap-1">
                      {combo.technologies.map((tech, i) => (
                        <span key={i} className="text-xs bg-primary/10 px-2 py-1 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{combo.category}</TableCell>
                  <TableCell>{combo.vacancies.toLocaleString()}</TableCell>
                  <TableCell>{combo.fresherPackage}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingCombo(combo)}
                      data-testid={`button-edit-${combo.jobRole.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={!!editingCombo} onOpenChange={() => setEditingCombo(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Combination</DialogTitle>
            </DialogHeader>
            {editingCombo && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Job Role</Label>
                  <Input
                    value={editingCombo.jobRole}
                    onChange={(e) => setEditingCombo({...editingCombo, jobRole: e.target.value})}
                    className="h-[48px]"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Technologies (comma-separated)</Label>
                  <Input
                    value={editingCombo.technologies.join(', ')}
                    onChange={(e) => setEditingCombo({...editingCombo, technologies: e.target.value.split(',').map(t => t.trim())})}
                    className="h-[48px]"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Category</Label>
                  <Input
                    value={editingCombo.category}
                    onChange={(e) => setEditingCombo({...editingCombo, category: e.target.value})}
                    className="h-[48px]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Vacancies</Label>
                    <Input
                      type="number"
                      value={editingCombo.vacancies}
                      onChange={(e) => setEditingCombo({...editingCombo, vacancies: parseInt(e.target.value)})}
                      className="h-[48px]"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Popularity Score</Label>
                    <Input
                      type="number"
                      value={editingCombo.popularityScore}
                      onChange={(e) => setEditingCombo({...editingCombo, popularityScore: parseInt(e.target.value)})}
                      className="h-[48px]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Fresher Package</Label>
                    <Input
                      value={editingCombo.fresherPackage}
                      onChange={(e) => setEditingCombo({...editingCombo, fresherPackage: e.target.value})}
                      className="h-[48px]"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Experienced Package</Label>
                    <Input
                      value={editingCombo.experiencedPackage}
                      onChange={(e) => setEditingCombo({...editingCombo, experiencedPackage: e.target.value})}
                      className="h-[48px]"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Top Companies (comma-separated)</Label>
                  <Input
                    value={editingCombo.topCompanies}
                    onChange={(e) => setEditingCombo({...editingCombo, topCompanies: e.target.value})}
                    className="h-[48px]"
                  />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setEditingCombo(null)}
                    className="min-h-[48px]"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveEdit}
                    disabled={isSaving}
                    className="min-h-[48px]"
                    data-testid="button-save-combination"
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
