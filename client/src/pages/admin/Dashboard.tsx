import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminLayout } from "@/components/AdminLayout";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Users, Briefcase, Building2, CheckCircle, Clock, RefreshCw } from "lucide-react";
import { fetchAllData, readInquiries, clearCache } from "@/utils/googleSheets";
import { useToast } from "@/hooks/use-toast";
import type { Inquiry } from "@/types";

export default function AdminDashboard() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalInquiries: 0,
    pendingInquiries: 0,
    joinedStudents: 0,
    totalPlacements: 0,
    totalCompanies: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [allData, inquiriesData] = await Promise.all([
        fetchAllData(),
        readInquiries()
      ]);

      setInquiries(inquiriesData);
      setStats({
        totalInquiries: inquiriesData.length,
        pendingInquiries: inquiriesData.filter(i => i.status === "Pending").length,
        joinedStudents: inquiriesData.filter(i => i.status === "Joined").length,
        totalPlacements: allData.placements.length,
        totalCompanies: allData.companies.length,
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      clearCache();
      await loadData();
      toast({
        title: "Success",
        description: "Data refreshed successfully",
      });
    } catch (error) {
      console.error('Failed to refresh data:', error);
      toast({
        title: "Error",
        description: "Failed to refresh data",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <LoadingSpinner text="Loading dashboard..." />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold" data-testid="text-dashboard-title">Dashboard</h1>
            <p className="text-muted-foreground">Welcome to Programmers Point Admin Panel</p>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            className="min-h-[48px]"
            data-testid="button-refresh"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="h-10 w-10 text-primary" />
            </div>
            <p className="text-2xl font-bold mb-1" data-testid="stat-total-inquiries">{stats.totalInquiries}</p>
            <p className="text-sm text-muted-foreground">Total Inquiries</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Clock className="h-10 w-10 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold mb-1" data-testid="stat-pending">{stats.pendingInquiries}</p>
            <p className="text-sm text-muted-foreground">Pending Inquiries</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <p className="text-2xl font-bold mb-1" data-testid="stat-joined">{stats.joinedStudents}</p>
            <p className="text-sm text-muted-foreground">Joined Students</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Briefcase className="h-10 w-10 text-secondary" />
            </div>
            <p className="text-2xl font-bold mb-1" data-testid="stat-placements">{stats.totalPlacements}</p>
            <p className="text-sm text-muted-foreground">Total Placements</p>
          </Card>
        </div>

        {/* Recent Inquiries */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Inquiries</h2>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Phone</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Course</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.slice(0, 10).map((inquiry, index) => (
                    <tr key={index} className="border-t hover:bg-muted/30">
                      <td className="px-6 py-4">{inquiry.name}</td>
                      <td className="px-6 py-4">{inquiry.phone}</td>
                      <td className="px-6 py-4">{inquiry.courseInterest}</td>
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
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {inquiry.timestamp ? new Date(inquiry.timestamp).toLocaleDateString() : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
