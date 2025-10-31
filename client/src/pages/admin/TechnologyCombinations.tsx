import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Edit, Plus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { TechnologyCombination } from "@shared/schema";

export default function TechnologyCombinations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: combinations, isLoading } = useQuery<TechnologyCombination[]>({
    queryKey: ["/api/technology-combinations"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest({
        url: `/api/technology-combinations/${id}`,
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/technology-combinations"] });
      toast({
        title: "Success",
        description: "Technology combination deleted successfully",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete technology combination",
      });
    },
  });

  // Filter combinations
  const filteredCombinations = combinations?.filter((combo) => {
    const matchesSearch =
      combo.jobRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
      combo.technologies.some((tech) => tech.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === "All" || combo.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = ["All", ...new Set(combinations?.map((c) => c.category) || [])];

  return (
    <div className="container max-w-7xl mx-auto px-4 md:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-heading mb-2" data-testid="text-page-title">
            Technology Combinations
          </h1>
          <p className="text-muted-foreground">
            Manage pre-defined technology combinations with job roles and market data
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-combination">
              <Plus className="h-4 w-4 mr-2" />
              Add Combination
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Technology Combination</DialogTitle>
              <DialogDescription>
                Create a new pre-defined technology combination with job role and market data.
              </DialogDescription>
            </DialogHeader>
            <AddCombinationForm onClose={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by job role or technology..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
                data-testid="input-search"
              />
            </div>
          </div>
          <div>
            <Label>Category</Label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger data-testid="select-category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Role</TableHead>
              <TableHead>Technologies</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Vacancies</TableHead>
              <TableHead>Packages</TableHead>
              <TableHead>Popularity</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            )}
            {!isLoading && filteredCombinations && filteredCombinations.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No technology combinations found
                </TableCell>
              </TableRow>
            )}
            {filteredCombinations?.map((combo) => (
              <TableRow key={combo.id} data-testid={`row-combination-${combo.id}`}>
                <TableCell className="font-medium">{combo.jobRole}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {combo.technologies.slice(0, 3).map((tech, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {combo.technologies.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{combo.technologies.length - 3}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{combo.category}</Badge>
                </TableCell>
                <TableCell>{combo.vacancies.toLocaleString()}</TableCell>
                <TableCell className="text-xs">
                  <div>F: {combo.fresherPackage}</div>
                  <div>E: {combo.experiencedPackage}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={combo.popularityScore >= 8 ? "default" : "secondary"}>
                    ⭐ {combo.popularityScore}/10
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMutation.mutate(combo.id)}
                    disabled={deleteMutation.isPending}
                    data-testid={`button-delete-${combo.id}`}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <div className="mt-4 text-sm text-muted-foreground text-center">
        Showing {filteredCombinations?.length || 0} of {combinations?.length || 0} technology combinations
      </div>
    </div>
  );
}

function AddCombinationForm({ onClose }: { onClose: () => void }) {
  const [technologies, setTechnologies] = useState("");
  const [category, setCategory] = useState("Frontend");
  const [jobRole, setJobRole] = useState("");
  const [vacancies, setVacancies] = useState("");
  const [fresherPackage, setFresherPackage] = useState("");
  const [experiencedPackage, setExperiencedPackage] = useState("");
  const [companies, setCompanies] = useState("");
  const [popularityScore, setPopularityScore] = useState("5");
  const [commonality, setCommonality] = useState("Common");
  const { toast } = useToast();

  const addMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest({
        url: "/api/technology-combinations",
        method: "POST",
        body: data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/technology-combinations"] });
      toast({
        title: "Success",
        description: "Technology combination added successfully",
      });
      onClose();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add technology combination",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const techArray = technologies.split(",").map((t) => t.trim()).filter(Boolean);
    const companiesArray = companies.split(",").map((c) => c.trim()).filter(Boolean);

    addMutation.mutate({
      technologies: techArray,
      category,
      jobRole,
      techCount: techArray.length,
      commonality,
      vacancies: parseInt(vacancies) || 0,
      fresherPackage,
      experiencedPackage,
      topCompanies: companiesArray,
      popularityScore: parseInt(popularityScore) || 5,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Technologies (comma-separated)</Label>
        <Input
          value={technologies}
          onChange={(e) => setTechnologies(e.target.value)}
          placeholder="React, Node.js, MongoDB"
          required
          data-testid="input-technologies"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger data-testid="select-category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Frontend">Frontend</SelectItem>
              <SelectItem value="Backend">Backend</SelectItem>
              <SelectItem value="Full Stack">Full Stack</SelectItem>
              <SelectItem value="Mobile">Mobile</SelectItem>
              <SelectItem value="Data Science">Data Science</SelectItem>
              <SelectItem value="Database">Database</SelectItem>
              <SelectItem value="Rare">Rare</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Commonality</Label>
          <Select value={commonality} onValueChange={setCommonality}>
            <SelectTrigger data-testid="select-commonality">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Common">Common</SelectItem>
              <SelectItem value="Moderate">Moderate</SelectItem>
              <SelectItem value="Rare">Rare</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Job Role</Label>
        <Input
          value={jobRole}
          onChange={(e) => setJobRole(e.target.value)}
          placeholder="MERN Stack Developer"
          required
          data-testid="input-job-role"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Vacancies</Label>
          <Input
            type="number"
            value={vacancies}
            onChange={(e) => setVacancies(e.target.value)}
            placeholder="2500"
            required
            data-testid="input-vacancies"
          />
        </div>
        <div>
          <Label>Popularity Score (1-10)</Label>
          <Input
            type="number"
            min="1"
            max="10"
            value={popularityScore}
            onChange={(e) => setPopularityScore(e.target.value)}
            required
            data-testid="input-popularity"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Fresher Package</Label>
          <Input
            value={fresherPackage}
            onChange={(e) => setFresherPackage(e.target.value)}
            placeholder="4-8 LPA"
            required
            data-testid="input-fresher-package"
          />
        </div>
        <div>
          <Label>Experienced Package</Label>
          <Input
            value={experiencedPackage}
            onChange={(e) => setExperiencedPackage(e.target.value)}
            placeholder="8-16 LPA"
            required
            data-testid="input-experienced-package"
          />
        </div>
      </div>

      <div>
        <Label>Top Companies (comma-separated)</Label>
        <Input
          value={companies}
          onChange={(e) => setCompanies(e.target.value)}
          placeholder="Flipkart, Swiggy, Zomato"
          required
          data-testid="input-companies"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose} data-testid="button-cancel">
          Cancel
        </Button>
        <Button type="submit" disabled={addMutation.isPending} data-testid="button-submit">
          {addMutation.isPending ? "Adding..." : "Add Combination"}
        </Button>
      </div>
    </form>
  );
}
