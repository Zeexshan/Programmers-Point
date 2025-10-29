import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

export default function AdminDataImport() {
  const [sheetsUrl, setSheetsUrl] = useState("");

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-heading" data-testid="text-page-title">Data Import</h1>
          <p className="text-muted-foreground">Import data from Google Sheets</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold font-heading mb-4">Import Placements</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Import student placement data from a Google Sheet with columns:
              Student Name, Company, Package, Phone, Photo URL, Profile, Course, Review
            </p>
            <div className="space-y-4">
              <div>
                <Label htmlFor="placement-url">Google Sheets URL</Label>
                <Input
                  id="placement-url"
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                  value={sheetsUrl}
                  onChange={(e) => setSheetsUrl(e.target.value)}
                  className="h-12"
                  data-testid="input-sheets-url"
                />
              </div>
              <Button className="w-full h-12" data-testid="button-import-placements">
                <Upload className="mr-2 h-4 w-4" />
                Import Placements
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold font-heading mb-4">Update Job Data</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Fetch latest job market data from your Google Sheet with columns:
              Technology, Vacancies, Avg Package, Top Companies, Last Updated
            </p>
            <Button className="w-full h-12" data-testid="button-update-job-data">
              <Upload className="mr-2 h-4 w-4" />
              Update from Google Sheets
            </Button>
          </Card>
        </div>

        <Card className="mt-6 p-6">
          <h3 className="text-xl font-semibold font-heading mb-4">Import History</h3>
          <p className="text-sm text-muted-foreground">
            No imports yet. Your import history will appear here.
          </p>
        </Card>
      </div>
    </AdminLayout>
  );
}
