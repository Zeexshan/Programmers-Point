import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { AdminLayout } from "@/components/AdminLayout";
import { Users, Briefcase, Building2, CheckCircle, Clock } from "lucide-react";
import type { Inquiry, Company, Placement } from "@shared/schema";

export default function AdminDashboard() {
  const { data: inquiries } = useQuery<Inquiry[]>({
    queryKey: ["/api/inquiries"],
  });

  const { data: companies } = useQuery<Company[]>({
    queryKey: ["/api/companies"],
  });

  const { data: placements } = useQuery<Placement[]>({
    queryKey: ["/api/placements"],
  });

  const pendingInquiries = inquiries?.filter(i => i.status === "Pending").length || 0;
  const joinedInquiries = inquiries?.filter(i => i.status === "Joined").length || 0;

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-heading" data-testid="text-dashboard-title">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to Programmers Point Admin Panel</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Clock className="h-10 w-10 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold mb-1" data-testid="stat-pending">{pendingInquiries}</p>
            <p className="text-sm text-muted-foreground">Pending Inquiries</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <p className="text-2xl font-bold mb-1" data-testid="stat-joined">{joinedInquiries}</p>
            <p className="text-sm text-muted-foreground">Joined Students</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Briefcase className="h-10 w-10 text-primary" />
            </div>
            <p className="text-2xl font-bold mb-1" data-testid="stat-placements">{placements?.length || 0}</p>
            <p className="text-sm text-muted-foreground">Total Placements</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Building2 className="h-10 w-10 text-secondary" />
            </div>
            <p className="text-2xl font-bold mb-1" data-testid="stat-companies">{companies?.length || 0}</p>
            <p className="text-sm text-muted-foreground">Partner Companies</p>
          </Card>
        </div>

        {/* Recent Inquiries */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold font-heading mb-4">Recent Inquiries</h2>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 sticky top-0">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Phone</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Course</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries?.slice(0, 10).map((inquiry) => (
                    <tr key={inquiry.id} className="border-t hover:bg-muted/30">
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
                        {new Date(inquiry.createdAt).toLocaleDateString()}
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
