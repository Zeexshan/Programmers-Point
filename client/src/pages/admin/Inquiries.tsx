import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AdminLayout } from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Search } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Inquiry } from "@shared/schema";

export default function AdminInquiries() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  const { data: inquiries, isLoading } = useQuery<Inquiry[]>({
    queryKey: ["/api/inquiries"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return await apiRequest("PATCH", `/api/inquiries/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inquiries"] });
      toast({ title: "Success", description: "Status updated successfully" });
    },
  });

  const exportExcelMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/inquiries/export");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inquiries_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Excel file downloaded" });
    },
  });

  const filteredInquiries = inquiries?.filter(inquiry => {
    const matchesSearch = inquiry.name.toLowerCase().includes(search.toLowerCase()) ||
                         inquiry.phone.includes(search) ||
                         inquiry.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || inquiry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold font-heading" data-testid="text-page-title">Inquiries</h1>
            <p className="text-muted-foreground">Manage student inquiries</p>
          </div>
          <Button
            onClick={() => exportExcelMutation.mutate()}
            disabled={exportExcelMutation.isPending}
            data-testid="button-export"
          >
            <Download className="mr-2 h-4 w-4" />
            Export to Excel
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, phone, or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-12"
                data-testid="input-search"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 h-12" data-testid="select-status">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Joined">Joined</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 sticky top-0">
                <tr className="h-14">
                  <th className="px-6 text-left text-sm font-semibold">Name</th>
                  <th className="px-6 text-left text-sm font-semibold">Phone</th>
                  <th className="px-6 text-left text-sm font-semibold">Email</th>
                  <th className="px-6 text-left text-sm font-semibold">Course</th>
                  <th className="px-6 text-left text-sm font-semibold">College</th>
                  <th className="px-6 text-left text-sm font-semibold">Date</th>
                  <th className="px-6 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 text-left text-sm font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-muted-foreground">
                      Loading...
                    </td>
                  </tr>
                ) : filteredInquiries?.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-muted-foreground">
                      No inquiries found
                    </td>
                  </tr>
                ) : (
                  filteredInquiries?.map((inquiry) => (
                    <tr key={inquiry.id} className="border-t h-16 hover:bg-muted/30" data-testid={`row-inquiry-${inquiry.id}`}>
                      <td className="px-6">{inquiry.name}</td>
                      <td className="px-6">{inquiry.phone}</td>
                      <td className="px-6 text-sm">{inquiry.email}</td>
                      <td className="px-6">{inquiry.courseInterest}</td>
                      <td className="px-6 text-sm">{inquiry.college}</td>
                      <td className="px-6 text-sm text-muted-foreground">
                        {new Date(inquiry.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6">
                        <Badge
                          variant={inquiry.status === "Joined" ? "default" : "secondary"}
                        >
                          {inquiry.status}
                        </Badge>
                      </td>
                      <td className="px-6">
                        <Select
                          value={inquiry.status}
                          onValueChange={(value) =>
                            updateStatusMutation.mutate({ id: inquiry.id, status: value })
                          }
                        >
                          <SelectTrigger className="w-32 h-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Joined">Joined</SelectItem>
                          </SelectContent>
                        </Select>
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
