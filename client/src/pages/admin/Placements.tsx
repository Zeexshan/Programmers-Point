import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AdminLayout } from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Edit, Trash2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertPlacementSchema, type InsertPlacement, type Placement, type Company } from "@shared/schema";

export default function AdminPlacements() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlacement, setEditingPlacement] = useState<Placement | null>(null);
  const { toast } = useToast();

  const { data: placements, isLoading } = useQuery<Placement[]>({
    queryKey: ["/api/placements"],
  });

  const { data: companies } = useQuery<Company[]>({
    queryKey: ["/api/companies"],
  });

  const form = useForm<InsertPlacement>({
    resolver: zodResolver(insertPlacementSchema),
    defaultValues: {
      studentName: "",
      companyId: "",
      package: "",
      phone: "",
      photoUrl: "",
      profile: "",
      course: "",
      review: "",
      interviewRounds: "",
      studyDuration: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertPlacement) => {
      if (editingPlacement) {
        return await apiRequest("PATCH", `/api/placements/${editingPlacement.id}`, data);
      }
      return await apiRequest("POST", "/api/placements", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/placements"] });
      toast({ title: "Success", description: editingPlacement ? "Placement updated" : "Placement added" });
      setDialogOpen(false);
      setEditingPlacement(null);
      form.reset();
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to save placement",
        variant: "destructive"
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/placements/${id}`, null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/placements"] });
      toast({ title: "Success", description: "Placement deleted" });
    },
  });

  const handleEdit = (placement: Placement) => {
    setEditingPlacement(placement);
    form.reset({
      studentName: placement.studentName,
      companyId: placement.companyId,
      package: placement.package,
      phone: placement.phone,
      photoUrl: placement.photoUrl || "",
      profile: placement.profile,
      course: placement.course,
      review: placement.review || "",
      interviewRounds: placement.interviewRounds || "",
      studyDuration: placement.studyDuration || "",
    });
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingPlacement(null);
    form.reset({
      studentName: "",
      companyId: "",
      package: "",
      phone: "",
      photoUrl: "",
      profile: "",
      course: "",
      review: "",
      interviewRounds: "",
      studyDuration: "",
    });
    setDialogOpen(true);
  };

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
          <Button onClick={handleAdd} data-testid="button-add-placement">
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
                      No placements found. Click "Add Placement" to create one.
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
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-10"
                            onClick={() => handleEdit(placement)}
                            data-testid={`button-edit-${placement.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-10 text-destructive hover:text-destructive"
                            onClick={() => deleteMutation.mutate(placement.id)}
                            data-testid={`button-delete-${placement.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
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

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPlacement ? "Edit Placement" : "Add Student Placement"}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="studentName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Student Name *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Sachin Kumar" className="h-12" data-testid="input-student-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="companyId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12" data-testid="select-company">
                              <SelectValue placeholder="Select company" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {companies?.map((company) => (
                              <SelectItem key={company.id} value={company.id}>
                                {company.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="profile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profile/Job Title *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Java Developer" className="h-12" data-testid="input-profile" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="package"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Package *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., 4 LPA" className="h-12" data-testid="input-package" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="+919876543210" className="h-12" data-testid="input-phone" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="course"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Completed *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Core Java + Advanced Java" className="h-12" data-testid="input-course" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="photoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Photo URL (optional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://... or leave blank for avatar" className="h-12" data-testid="input-photo-url" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="studyDuration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Study Duration (optional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., 6 months" className="h-12" data-testid="input-study-duration" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="interviewRounds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interview Rounds (optional)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., 3 rounds - Technical, Managerial, HR" className="h-12" data-testid="input-interview-rounds" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="review"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student Review (optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Student's testimonial about the training..." 
                          className="min-h-20" 
                          data-testid="textarea-review"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full h-12" disabled={createMutation.isPending} data-testid="button-save-placement">
                  {createMutation.isPending ? "Saving..." : (editingPlacement ? "Update Placement" : "Add Placement")}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
