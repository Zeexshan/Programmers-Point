import { useState, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, CheckCircle2, XCircle, AlertCircle, Download } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AdminDataImport() {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [combinationsCsvFile, setCombinationsCsvFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const combinationsFileInputRef = useRef<HTMLInputElement>(null);
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

  const importCombinationsCsvMutation = useMutation({
    mutationFn: async (file: File) => {
      const csvText = await file.text();
      
      return await apiRequest("POST", "/api/import/combinations-csv", { csvText });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/technology-combinations"] });
      toast({ 
        title: "Success", 
        description: `Imported ${data.count || 0} technology combinations from CSV` 
      });
      setCombinationsCsvFile(null);
      if (combinationsFileInputRef.current) {
        combinationsFileInputRef.current.value = "";
      }
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to import combinations CSV",
        variant: "destructive"
      });
    }
  });

  const importFromGoogleSheetsMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/import/google-sheets");
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies"] });
      queryClient.invalidateQueries({ queryKey: ["/api/technology-combinations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/inquiries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/placements"] });
      queryClient.invalidateQueries({ queryKey: ["/api/technologies"] });
      
      const r = data.results;
      const totalImported = r.companies.imported + r.combinations.imported + r.inquiries.imported + r.placements.imported + r.technologies.imported;
      const totalSkipped = r.companies.skipped + r.combinations.skipped + r.inquiries.skipped + r.placements.skipped + r.technologies.skipped;
      const totalFailed = r.companies.failed + r.combinations.failed + r.inquiries.failed + r.placements.failed + r.technologies.failed;
      
      let description = `✅ Imported: ${totalImported} records`;
      if (totalSkipped > 0) description += ` | ⏭️ Skipped: ${totalSkipped} (already exist)`;
      if (totalFailed > 0) description += ` | ❌ Failed: ${totalFailed}`;
      
      toast({ 
        title: "Import Complete", 
        description,
        duration: 8000,
      });

      if (data.errors && data.errors.length > 0) {
        console.error("Import errors:", data.errors);
      }
    },
    onError: (error: any) => {
      toast({ 
        title: "Import Failed", 
        description: error.message || "Failed to import from Google Sheets",
        variant: "destructive"
      });
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCsvFile(e.target.files[0]);
    }
  };

  const handleCombinationsFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCombinationsCsvFile(e.target.files[0]);
    }
  };

  const handleImportCsv = () => {
    if (csvFile) {
      importCsvMutation.mutate(csvFile);
    }
  };

  const handleImportCombinationsCsv = () => {
    if (combinationsCsvFile) {
      importCombinationsCsvMutation.mutate(combinationsCsvFile);
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
            <h3 className="text-xl font-semibold font-heading mb-4">Import Job Market Data (Combinations)</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Upload CSV with: Technology Combination, Job Role, Vacancies, Fresher Package, Experienced Package, Top Companies, Popularity Score
            </p>
            <div className="space-y-4">
              <div>
                <Label htmlFor="combinations-csv-file">Select CSV File</Label>
                <Input
                  id="combinations-csv-file"
                  type="file"
                  accept=".csv"
                  onChange={handleCombinationsFileChange}
                  ref={combinationsFileInputRef}
                  className="h-12 cursor-pointer"
                  data-testid="input-combinations-csv-file"
                />
                {combinationsCsvFile && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Selected: {combinationsCsvFile.name}
                  </p>
                )}
              </div>
              <Button 
                className="w-full h-12" 
                disabled={!combinationsCsvFile || importCombinationsCsvMutation.isPending}
                onClick={handleImportCombinationsCsv}
                data-testid="button-import-combinations-csv"
              >
                <Upload className="mr-2 h-4 w-4" />
                {importCombinationsCsvMutation.isPending ? "Importing..." : "Import Combinations"}
              </Button>
              <p className="text-xs text-muted-foreground">
                This will replace all existing combination data with the new CSV data
              </p>
            </div>
          </Card>
        </div>

        <div className="mb-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold font-heading mb-4">Import from Google Sheets</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Import all data (companies, combinations, inquiries, placements, technologies) from your connected Google Sheet into the database.
            </p>
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
              onClick={() => importFromGoogleSheetsMutation.mutate()}
              disabled={!sheetsStatus?.connected || importFromGoogleSheetsMutation.isPending}
              data-testid="button-import-google-sheets"
            >
              <Download className="mr-2 h-4 w-4" />
              {importFromGoogleSheetsMutation.isPending ? "Importing..." : "Import All Data from Google Sheets"}
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              This will import all data from your Google Sheet. Existing records won't be duplicated.
            </p>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
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
