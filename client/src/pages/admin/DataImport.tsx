import { useState, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AdminDataImport() {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const { data: sheetsStatus } = useQuery<{ connected: boolean; message: string }>({
    queryKey: ["/api/google-sheets/status"],
  });

  const importCsvMutation = useMutation({
    mutationFn: async (file: File) => {
      const csvText = await file.text();
      
      return await apiRequest("POST", "/api/import/csv", { csvText });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/technologies"] });
      toast({ 
        title: "Success", 
        description: `Imported ${data.count || 0} technologies from CSV` 
      });
      setCsvFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to import CSV",
        variant: "destructive"
      });
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCsvFile(e.target.files[0]);
    }
  };

  const handleImportCsv = () => {
    if (csvFile) {
      importCsvMutation.mutate(csvFile);
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-heading" data-testid="text-page-title">Data Import</h1>
          <p className="text-muted-foreground">Import and sync data from CSV files and Google Sheets</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold font-heading mb-4">Import Technology Data from CSV</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Upload a CSV file with columns: Technology, Vacancies, Avg Package, Top Companies, Last Updated, Used For
            </p>
            <div className="space-y-4">
              <div>
                <Label htmlFor="csv-file">Select CSV File</Label>
                <Input
                  id="csv-file"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="h-12 cursor-pointer"
                  data-testid="input-csv-file"
                />
                {csvFile && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Selected: {csvFile.name}
                  </p>
                )}
              </div>
              <Button 
                className="w-full h-12" 
                disabled={!csvFile || importCsvMutation.isPending}
                onClick={handleImportCsv}
                data-testid="button-import-csv"
              >
                <Upload className="mr-2 h-4 w-4" />
                {importCsvMutation.isPending ? "Importing..." : "Import CSV"}
              </Button>
              <p className="text-xs text-muted-foreground">
                CSV Format: Technology, Vacancies, AvgPackage, TopCompanies, LastUpdated, UsedFor
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold font-heading mb-4">Google Sheets Connection</h3>
            <div className="mb-6">
              {sheetsStatus === undefined ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <AlertCircle className="h-5 w-5" />
                  <span>Checking connection...</span>
                </div>
              ) : sheetsStatus.connected ? (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-medium">Google Sheets Connected</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <XCircle className="h-5 w-5" />
                  <span className="font-medium">Not Connected</span>
                </div>
              )}
              <p className="text-sm text-muted-foreground mt-2">
                {sheetsStatus?.message || "Checking status..."}
              </p>
            </div>
            <Button 
              className="w-full h-12" 
              variant="outline"
              data-testid="button-setup-sheets"
            >
              Setup Google Sheets
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              Use Google Sheets to automatically export inquiry data and import technology information.
            </p>
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="text-xl font-semibold font-heading mb-4">Import Instructions</h3>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">CSV Import Format:</h4>
              <p className="text-muted-foreground mb-2">Your CSV file should have these columns in order:</p>
              <code className="block bg-muted p-3 rounded">
                Technology, Vacancies, Avg Package, Top Companies, Last Updated, Used For
              </code>
              <p className="text-muted-foreground mt-2">Example row:</p>
              <code className="block bg-muted p-3 rounded text-xs">
                Python, 950, "6-13 LPA", "Google, Amazon, Microsoft", "29-Oct-2025", "Data Science, ML, AI"
              </code>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Google Sheets Setup:</h4>
              <ol className="list-decimal list-inside text-muted-foreground space-y-1">
                <li>Click the "Setup Google Sheets" button above</li>
                <li>Authorize the Google Sheets connector in Replit</li>
                <li>Share your spreadsheet with the service account</li>
                <li>The connection status will update automatically</li>
              </ol>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
