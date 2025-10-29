import { AdminLayout } from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";

export default function AdminSettings() {
  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-heading" data-testid="text-page-title">Settings</h1>
          <p className="text-muted-foreground">Configure your admin panel</p>
        </div>

        <Card className="p-6">
          <p className="text-muted-foreground">Settings will be available here.</p>
        </Card>
      </div>
    </AdminLayout>
  );
}
