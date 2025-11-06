import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Edit } from "lucide-react";
import { fetchAllData, clearCache } from "@/utils/googleSheets";
import { useToast } from "@/hooks/use-toast";
import type { Placement, AllData } from "@/types";

export default function Placements() {
  const [allData, setAllData] = useState<AllData | null>(null);
  const [filteredPlacements, setFilteredPlacements] = useState<Placement[]>([]);
  const [loading, setLoading] = useState(true);
  const [companyFilter, setCompanyFilter] = useState("All");
  const [editingPlacement, setEditingPlacement] = useState<Placement | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPlacements();
  }, []);

  useEffect(() => {
    if (allData) {
      filterPlacements();
    }
  }, [allData, companyFilter]);

  const loadPlacements = async () => {
    try {
      setLoading(true);
      const data = await fetchAllData();
      setAllData(data);
    } catch (error) {
      console.error('Failed to load placements:', error);
      toast({
        title: "Error",
        description: "Failed to load placements",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterPlacements = () => {
    if (!allData) return;
    
    if (companyFilter === "All") {
      setFilteredPlacements(allData.placements);
    } else {
      setFilteredPlacements(allData.placements.filter(p => p.company === companyFilter));
    }
  };

  const handleSaveEdit = async () => {
    if (!editingPlacement || !allData) return;

    try {
      setIsSaving(true);
      const placementIndex = allData.placements.findIndex(
        p => p.studentName === editingPlacement.studentName && p.company === editingPlacement.company
      );
      
      if (placementIndex === -1) {
        throw new Error("Placement not found");
      }

      const values = [[
        editingPlacement.studentName,
        editingPlacement.company,
        editingPlacement.package,
        editingPlacement.phone,
        editingPlacement.photoUrl,
        editingPlacement.profile,
        editingPlacement.course,
        editingPlacement.review,
        editingPlacement.joiningDate
      ]];

      // TODO: Implement Apps Script endpoint for updating placements
      // await updateSheet('Placements', `A${placementIndex + 2}:I${placementIndex + 2}`, values);
      
      toast({
        title: "Feature Not Available",
        description: "Editing placements requires Google Apps Script setup. Please edit directly in the Google Sheet for now.",
        variant: "destructive",
      });
      setEditingPlacement(null);
    } catch (error: any) {
      console.error('Failed to update placement:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update placement",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <LoadingSpinner text="Loading placements..." />
      </AdminLayout>
    );
  }

  const companies = ["All", ...Array.from(new Set(allData?.placements.map(p => p.company) || []))];

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold" data-testid="text-page-title">Placements</h1>
        </div>

        <Card className="p-6 mb-6">
          <div className="flex gap-4">
            <Select value={companyFilter} onValueChange={setCompanyFilter}>
              <SelectTrigger className="w-full md:w-[200px] h-[48px]" data-testid="select-company-filter">
                <SelectValue placeholder="Filter by company" />
              </SelectTrigger>
              <SelectContent>
                {companies.map(company => (
                  <SelectItem key={company} value={company}>{company}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Student Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Company</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Package</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Profile</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Course</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlacements.map((placement, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{placement.studentName}</TableCell>
                    <TableCell>{placement.company}</TableCell>
                    <TableCell>{placement.package}</TableCell>
                    <TableCell>{placement.profile}</TableCell>
                    <TableCell>{placement.course}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingPlacement(placement)}
                        data-testid={`button-edit-${placement.studentName.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={!!editingPlacement} onOpenChange={() => setEditingPlacement(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Placement</DialogTitle>
            </DialogHeader>
            {editingPlacement && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Student Name</Label>
                    <Input
                      value={editingPlacement.studentName}
                      onChange={(e) => setEditingPlacement({...editingPlacement, studentName: e.target.value})}
                      className="h-[48px]"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Company</Label>
                    <Input
                      value={editingPlacement.company}
                      onChange={(e) => setEditingPlacement({...editingPlacement, company: e.target.value})}
                      className="h-[48px]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Package</Label>
                    <Input
                      value={editingPlacement.package}
                      onChange={(e) => setEditingPlacement({...editingPlacement, package: e.target.value})}
                      className="h-[48px]"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Phone</Label>
                    <Input
                      value={editingPlacement.phone}
                      onChange={(e) => setEditingPlacement({...editingPlacement, phone: e.target.value})}
                      className="h-[48px]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Profile</Label>
                    <Input
                      value={editingPlacement.profile}
                      onChange={(e) => setEditingPlacement({...editingPlacement, profile: e.target.value})}
                      className="h-[48px]"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Course</Label>
                    <Input
                      value={editingPlacement.course}
                      onChange={(e) => setEditingPlacement({...editingPlacement, course: e.target.value})}
                      className="h-[48px]"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Photo URL</Label>
                  <Input
                    value={editingPlacement.photoUrl}
                    onChange={(e) => setEditingPlacement({...editingPlacement, photoUrl: e.target.value})}
                    className="h-[48px]"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Review</Label>
                  <Textarea
                    value={editingPlacement.review}
                    onChange={(e) => setEditingPlacement({...editingPlacement, review: e.target.value})}
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setEditingPlacement(null)}
                    className="min-h-[48px]"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveEdit}
                    disabled={isSaving}
                    className="min-h-[48px]"
                    data-testid="button-save-placement"
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

function TableRow({ children }: { children: React.ReactNode }) {
  return <tr className="border-t hover:bg-muted/30">{children}</tr>;
}

function TableCell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-6 py-4 ${className}`}>{children}</td>;
}
