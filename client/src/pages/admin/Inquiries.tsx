import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Search } from "lucide-react";
import { readInquiries, clearCache } from "@/utils/googleSheets";
import { useToast } from "@/hooks/use-toast";
import type { Inquiry } from "@/types";

export default function Inquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [filteredInquiries, setFilteredInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const { toast } = useToast();

  useEffect(() => {
    loadInquiries();
  }, []);

  useEffect(() => {
    filterInquiries();
  }, [inquiries, search, statusFilter]);

  const loadInquiries = async () => {
    try {
      setLoading(true);
      const data = await readInquiries();
      setInquiries(data);
    } catch (error) {
      console.error('Failed to load inquiries:', error);
      toast({
        title: "Error",
        description: "Failed to load inquiries",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterInquiries = () => {
    let filtered = inquiries;
    
    if (statusFilter !== "All") {
      filtered = filtered.filter(i => i.status === statusFilter);
    }
    
    if (search) {
      filtered = filtered.filter(i => 
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.phone.includes(search) ||
        i.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    setFilteredInquiries(filtered);
  };

  const handleMarkAsJoined = async (index: number) => {
    const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

    if (!APPS_SCRIPT_URL) {
      toast({
        title: "Configuration Error",
        description: "Google Apps Script URL is not configured.",
        variant: "destructive",
      });
      return;
    }

    try {
      const inquiry = inquiries[index];
      
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'updateInquiryStatus',
          data: {
            phone: inquiry.phone,
            timestamp: inquiry.timestamp,
            status: 'Joined'
          }
        })
      });
      
      clearCache();
      await loadInquiries();
      
      toast({
        title: "Success",
        description: "Status updated to Joined",
      });
    } catch (error: any) {
      console.error('Failed to update status:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const handleExportPhoneNumbers = () => {
    const pendingInquiries = inquiries.filter(i => i.status === "Pending");
    const csvContent = "Name,Phone\n" + 
      pendingInquiries.map(i => `${i.name},${i.phone}`).join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pending_inquiries_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    toast({
      title: "Success",
      description: "Phone numbers exported successfully",
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <LoadingSpinner text="Loading inquiries..." />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold" data-testid="text-page-title">Inquiries</h1>
            <p className="text-muted-foreground">Manage student inquiries</p>
          </div>
          <Button
            onClick={handleExportPhoneNumbers}
            className="min-h-[48px]"
            data-testid="button-export"
          >
            <Download className="mr-2 h-4 w-4" />
            Export Phone Numbers
          </Button>
        </div>

        <Card className="p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, phone, or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-[48px]"
                data-testid="input-search"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 h-[48px]" data-testid="select-status">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Joined">Joined</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Phone</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Course</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">College</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredInquiries.map((inquiry, index) => {
                  const originalIndex = inquiries.findIndex(i => 
                    i.name === inquiry.name && 
                    i.phone === inquiry.phone && 
                    i.timestamp === inquiry.timestamp
                  );
                  
                  return (
                    <tr key={index} className="border-t hover:bg-muted/30">
                      <td className="px-6 py-4">{inquiry.name}</td>
                      <td className="px-6 py-4">{inquiry.phone}</td>
                      <td className="px-6 py-4">{inquiry.email}</td>
                      <td className="px-6 py-4">{inquiry.courseInterest}</td>
                      <td className="px-6 py-4">{inquiry.college}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {inquiry.timestamp ? new Date(inquiry.timestamp).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            inquiry.status === "Joined"
                              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                          }`}
                        >
                          {inquiry.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {inquiry.status === "Pending" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkAsJoined(originalIndex)}
                            className="min-h-[40px]"
                            data-testid={`button-mark-joined-${index}`}
                          >
                            Mark as Joined
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
