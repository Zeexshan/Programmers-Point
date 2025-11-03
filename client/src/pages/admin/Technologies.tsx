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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Search } from "lucide-react";
import { fetchAllData, updateSheet, clearCache } from "@/utils/googleSheets";
import { useToast } from "@/hooks/use-toast";
import type { Technology } from "@/types";

export default function Technologies() {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [filteredTechs, setFilteredTechs] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [editingTech, setEditingTech] = useState<Technology | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadTechnologies();
  }, []);

  useEffect(() => {
    filterTechnologies();
  }, [technologies, searchTerm, categoryFilter]);

  const loadTechnologies = async () => {
    try {
      setLoading(true);
      const data = await fetchAllData();
      setTechnologies(data.technologies);
    } catch (error) {
      console.error('Failed to load technologies:', error);
      toast({
        title: "Error",
        description: "Failed to load technologies",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterTechnologies = () => {
    let filtered = technologies;
    
    if (categoryFilter !== "All") {
      filtered = filtered.filter(t => t.mainCategory === categoryFilter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.subCategory.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredTechs(filtered);
  };

  const handleSaveEdit = async () => {
    if (!editingTech) return;

    try {
      setIsSaving(true);
      const techIndex = technologies.findIndex(t => t.name === editingTech.name);
      
      if (techIndex === -1) {
        throw new Error("Technology not found");
      }

      const values = [[
        editingTech.name,
        editingTech.mainCategory,
        editingTech.subCategory,
        editingTech.displayOrder.toString(),
        editingTech.vacancies.toString(),
        editingTech.fresherPackage,
        editingTech.experiencedPackage,
        editingTech.topCompanies,
        editingTech.popularityScore.toString(),
        editingTech.description
      ]];

      await updateSheet('Technologies', `A${techIndex + 2}:J${techIndex + 2}`, values);
      
      clearCache();
      await loadTechnologies();
      
      setEditingTech(null);
      toast({
        title: "Success",
        description: "Technology updated successfully",
      });
    } catch (error: any) {
      console.error('Failed to update technology:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update technology",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const categories = ["All", ...Array.from(new Set(technologies.map(t => t.mainCategory)))];

  if (loading) {
    return (
      <AdminLayout>
        <LoadingSpinner text="Loading technologies..." />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold" data-testid="text-page-title">Technologies</h1>
        </div>

        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search technologies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-[48px]"
                data-testid="input-search"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[200px] h-[48px]" data-testid="select-category-filter">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Technology</TableHead>
                <TableHead>Main Category</TableHead>
                <TableHead>Sub Category</TableHead>
                <TableHead>Vacancies</TableHead>
                <TableHead>Fresher Package</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTechs.map((tech) => (
                <TableRow key={tech.name}>
                  <TableCell className="font-medium">{tech.name}</TableCell>
                  <TableCell>{tech.mainCategory}</TableCell>
                  <TableCell>{tech.subCategory}</TableCell>
                  <TableCell>{tech.vacancies.toLocaleString()}</TableCell>
                  <TableCell>{tech.fresherPackage}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingTech(tech)}
                      data-testid={`button-edit-${tech.name.toLowerCase().replace(/\s+/g, '-')}`}
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
        <Dialog open={!!editingTech} onOpenChange={() => setEditingTech(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Technology</DialogTitle>
            </DialogHeader>
            {editingTech && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Technology Name</Label>
                  <Input
                    value={editingTech.name}
                    onChange={(e) => setEditingTech({...editingTech, name: e.target.value})}
                    className="h-[48px]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Main Category</Label>
                    <Input
                      value={editingTech.mainCategory}
                      onChange={(e) => setEditingTech({...editingTech, mainCategory: e.target.value})}
                      className="h-[48px]"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Sub Category</Label>
                    <Input
                      value={editingTech.subCategory}
                      onChange={(e) => setEditingTech({...editingTech, subCategory: e.target.value})}
                      className="h-[48px]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Vacancies</Label>
                    <Input
                      type="number"
                      value={editingTech.vacancies}
                      onChange={(e) => setEditingTech({...editingTech, vacancies: parseInt(e.target.value)})}
                      className="h-[48px]"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Popularity Score</Label>
                    <Input
                      type="number"
                      value={editingTech.popularityScore}
                      onChange={(e) => setEditingTech({...editingTech, popularityScore: parseInt(e.target.value)})}
                      className="h-[48px]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Fresher Package</Label>
                    <Input
                      value={editingTech.fresherPackage}
                      onChange={(e) => setEditingTech({...editingTech, fresherPackage: e.target.value})}
                      className="h-[48px]"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Experienced Package</Label>
                    <Input
                      value={editingTech.experiencedPackage}
                      onChange={(e) => setEditingTech({...editingTech, experiencedPackage: e.target.value})}
                      className="h-[48px]"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Top Companies (comma-separated)</Label>
                  <Input
                    value={editingTech.topCompanies}
                    onChange={(e) => setEditingTech({...editingTech, topCompanies: e.target.value})}
                    className="h-[48px]"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Description</Label>
                  <Input
                    value={editingTech.description}
                    onChange={(e) => setEditingTech({...editingTech, description: e.target.value})}
                    className="h-[48px]"
                  />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setEditingTech(null)}
                    className="min-h-[48px]"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveEdit}
                    disabled={isSaving}
                    className="min-h-[48px]"
                    data-testid="button-save-technology"
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
