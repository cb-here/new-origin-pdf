import React, { useState, useRef } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Upload,
  Download,
  Copy,
  Check,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { generateBulkPatientConsentPDF } from "@/lib/api";

interface CSVRow {
  patientName: string;
  mrn: string;
  soc: string;
  certificationStart: string;
  certificationEnd: string;
  startMonth: string;
  endMonth: string;
  discipline1?: string;
  newFrequency1?: string;
  discipline2?: string;
  newFrequency2?: string;
  discipline3?: string;
  newFrequency3?: string;
  discipline4?: string;
  newFrequency4?: string;
  discipline5?: string;
  newFrequency5?: string;
  discipline6?: string;
  newFrequency6?: string;
  patientSignature: string;
  patientSignatureDate: string;
  agencyRepSignature: string;
  agencyRepDate: string;
}

interface CSVParseResult {
  data: CSVRow[];
  errors: string[];
}

export interface ConsentBulkRecord {
  patientName: string;
  mrn: string;
  soc: string;
  certificationPeriod: string;
  disciplineFrequencies: { discipline: string; newFrequency: string }[];
  patientSignatureDate: string;
  agencyRepDate: string;
  timestamp: string;
  source: "bulk";
}

interface CSVUploadProps {
  onDataParsed: (data: any[]) => void;
}

const PatientConsentCSVUpload: React.FC<CSVUploadProps> = ({
  onDataParsed,
}) => {
  const [csvText, setCsvText] = useState('');
  const [parseResult, setParseResult] = useState<CSVParseResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [isGeneratingPDFs, setIsGeneratingPDFs] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateCSVTemplate = () => {
    const headers = [
      "patientName",
      "mrn",
      "soc",
      "certificationStart",
      "certificationEnd",
      "startMonth",
      "endMonth",
      "discipline1",
      "newFrequency1",
      "discipline2",
      "newFrequency2",
      "discipline3",
      "newFrequency3",
      "discipline4",
      "newFrequency4",
      "discipline5",
      "newFrequency5",
      "discipline6",
      "newFrequency6",
      "patientSignature",
      "patientSignatureDate",
      "agencyRepSignature",
      "agencyRepDate",
    ];

    const sampleData = [
      "John Doe",
      "123456",
      "2024-01-01",
      "2024-01-01",
      "2024-03-31",
      "01",
      "02",
      "Physical Therapy",
      "3x/week",
      "Occupational Therapy",
      "2x/week",
      "Speech Therapy",
      "1x/week",
      "",
      "",
      "",
      "",
      "",
      "",
      "John Doe",
      "2024-01-01",
      "Agency Representative",
      "2024-01-01",
    ];

    return [headers.join(","), sampleData.join(",")].join("\n");
  };

  const handleCopyTemplate = async () => {
    const template = generateCSVTemplate();
    try {
      await navigator.clipboard.writeText(template);
      setCopied(true);
      toast.success('CSV template copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy template');
    }
  };

  const handleDownloadTemplate = () => {
    const template = generateCSVTemplate();
    const blob = new Blob([template], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "patient-consent-template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Template downloaded");
  };

  const parseCSVText = (text: string): CSVParseResult => {
    const errors: string[] = [];
    const data: CSVRow[] = [];

    if (!text.trim()) {
      return { data, errors: ['CSV text is empty'] };
    }

    try {
      const lines = text.trim().split('\n');
      if (lines.length < 2) {
        errors.push('CSV must have at least a header row and one data row');
        return { data, errors };
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
      const requiredHeaders = ['patientName', 'mrn', 'soc', 'certificationStart', 'certificationEnd', 'startMonth', 'endMonth', 'patientSignature', 'agencyRepSignature'];

      // Check for required headers
      for (const required of requiredHeaders) {
        if (!headers.includes(required)) {
          errors.push(`Missing required header: ${required}`);
        }
      }

      if (errors.length > 0) {
        return { data, errors };
      }

      // Parse data rows
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        const row: any = {};

        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });

        // Validate required fields
        if (!row.patientName) {
          errors.push(`Row ${i}: Patient name is required`);
        }
        if (!row.mrn) {
          errors.push(`Row ${i}: MRN is required`);
        }
        if (!row.startMonth) {
          errors.push(`Row ${i}: Start month is required`);
        }
        if (!row.endMonth) {
          errors.push(`Row ${i}: End month is required`);
        }
        if (!row.patientSignature) {
          errors.push(`Row ${i}: Patient signature is required`);
        }
        if (!row.agencyRepSignature) {
          errors.push(`Row ${i}: Agency representative signature is required`);
        }

        data.push(row as CSVRow);
      }

    } catch (error) {
      errors.push(`Error parsing CSV: ${error.message}`);
    }

    return { data, errors };
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setCsvText(text);
      handleParseCSV(text);
    };
    reader.readAsText(file);
  };

  const handleParseCSV = (text: string = csvText) => {
    if (!text.trim()) {
      setParseResult(null);
      return;
    }

    const result = parseCSVText(text);
    setParseResult(result);

    if (result.errors.length === 0) {
      toast.success(`Successfully parsed ${result.data.length} rows`);
    } else {
      toast.error(`Found ${result.errors.length} errors in CSV`);
    }
  };

  const handleProcessData = () => {
    if (parseResult && parseResult.errors.length === 0) {
      onDataParsed(parseResult.data);
      toast.success('CSV data processed successfully');
    }
  };

  const handleBulkPDFGeneration = async () => {
    if (!parseResult || parseResult.data.length === 0) {
      toast.error("No data to process. Please parse CSV data first.");
      return;
    }

    setIsGeneratingPDFs(true);

    try {
      // Convert CSV data to the format expected by the backend
      const bulkData = parseResult.data.map((row) => {
        const disciplineFrequencies = [];

        // Convert individual discipline fields to array format
        for (let i = 1; i <= 6; i++) {
          const discipline = (row as any)[`discipline${i}`] as string;
          const frequency = (row as any)[`newFrequency${i}`] as string;

          disciplineFrequencies.push({
            discipline: discipline || "",
            newFrequency: frequency || "",
          });
        }

        return {
          patientName: row.patientName,
          mrn: row.mrn,
          soc: row.soc,
          certificationStart: row.certificationStart,
          certificationEnd: row.certificationEnd,
          startMonth: row.startMonth,
          endMonth: row.endMonth,
          disciplineFrequencies,
          patientSignature: row.patientSignature,
          patientSignatureDate: row.patientSignatureDate,
          agencyRepSignature: row.agencyRepSignature,
          agencyRepDate: row.agencyRepDate,
        };
      });

      await generateBulkPatientConsentPDF(bulkData, false);

      toast.success(
        `Successfully generated ${parseResult.data.length} Patient Consent PDFs!`
      );

      // Clear the data after successful generation
      setCsvText('');
      setParseResult(null);
    } catch (error) {
      console.error("Error generating bulk PDFs:", error);
      toast.error("Failed to generate PDFs. Please try again.");
    } finally {
      setIsGeneratingPDFs(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>CSV Upload for Bulk Patient Consent Forms</CardTitle>
          <CardDescription>
            Upload or paste CSV data to create multiple Patient Consent forms at once
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-col sm:flex-row">
            <Button
              variant="outline"
              onClick={handleCopyTemplate}
              className="flex items-center gap-2"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Template'}
            </Button>
            <Button
              variant="outline"
              onClick={handleDownloadTemplate}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Template
            </Button>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload CSV File
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
          />

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Or paste CSV data here:
            </label>
            <Textarea
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder="patientName,mrn,soc,certificationStart,certificationEnd,startMonth,endMonth,discipline1,newFrequency1,discipline2,newFrequency2,discipline3,newFrequency3,discipline4,newFrequency4,discipline5,newFrequency5,discipline6,newFrequency6,patientSignature,patientSignatureDate,agencyRepSignature,agencyRepDate"
              rows={6}
              className="font-mono text-sm"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={() => handleParseCSV()}>
              Parse CSV Data
            </Button>
            {parseResult && parseResult.errors.length === 0 && (
              <Button onClick={handleProcessData} className="bg-primary">
                Process {parseResult.data.length} Forms
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {parseResult && (
        <Card>
          <CardHeader>
            <CardTitle>Parse Results</CardTitle>
          </CardHeader>
          <CardContent>
            {parseResult.errors.length > 0 && (
              <Alert className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    <p className="font-medium">Found {parseResult.errors.length} errors:</p>
                    <ul className="list-disc list-inside text-sm">
                      {parseResult.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {parseResult.data.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Parsed Data ({parseResult.data.length} rows):</h4>
                  <Button
                    onClick={handleBulkPDFGeneration}
                    disabled={isGeneratingPDFs}
                    className="flex items-center gap-2"
                  >
                    {isGeneratingPDFs ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating PDFs...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Generate {parseResult.data.length} PDFs
                      </>
                    )}
                  </Button>
                </div>
                <div className="border rounded-md max-h-96 overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className='whitespace-nowrap'>Patient Name</TableHead>
                        <TableHead className='whitespace-nowrap'>MRN</TableHead>
                        <TableHead className='whitespace-nowrap'>SOC</TableHead>
                        <TableHead className='whitespace-nowrap'>Cert Start</TableHead>
                        <TableHead className='whitespace-nowrap'>Cert End</TableHead>
                        <TableHead className='whitespace-nowrap'>Start Month</TableHead>
                        <TableHead className='whitespace-nowrap'>End Month</TableHead>
                        <TableHead className='whitespace-nowrap'>Discipline 1</TableHead>
                        <TableHead className='whitespace-nowrap'>Frequency 1</TableHead>
                        <TableHead className='whitespace-nowrap'>Patient Signature</TableHead>
                        <TableHead className='whitespace-nowrap'>Agency Signature</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parseResult.data.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell className='whitespace-nowrap'>{row.patientName}</TableCell>
                          <TableCell className="font-mono text-sm whitespace-nowrap">{row.mrn}</TableCell>
                          <TableCell className='whitespace-nowrap'>{row.soc}</TableCell>
                          <TableCell className='whitespace-nowrap'>{row.certificationStart}</TableCell>
                          <TableCell className='whitespace-nowrap'>{row.certificationEnd}</TableCell>
                          <TableCell className='whitespace-nowrap'>{row.startMonth}</TableCell>
                          <TableCell className='whitespace-nowrap'>{row.endMonth}</TableCell>
                          <TableCell className='whitespace-nowrap'>{row.discipline1 || '-'}</TableCell>
                          <TableCell className='whitespace-nowrap'>{row.newFrequency1 || '-'}</TableCell>
                          <TableCell className='whitespace-nowrap max-w-32 truncate'>{row.patientSignature}</TableCell>
                          <TableCell className='whitespace-nowrap max-w-32 truncate'>{row.agencyRepSignature}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PatientConsentCSVUpload;
