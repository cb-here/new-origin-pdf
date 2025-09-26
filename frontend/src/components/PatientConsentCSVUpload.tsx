import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileSpreadsheet, Download, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { generateBulkPatientConsentPDF } from '@/lib/api';

interface CSVRow {
  patientName: string;
  mrn: string;
  soc: string;
  certificationStart: string;
  certificationEnd: string;
  discipline1: string;
  newFrequency1: string;
  discipline2: string;
  newFrequency2: string;
  discipline3: string;
  newFrequency3: string;
  discipline4: string;
  newFrequency4: string;
  discipline5: string;
  newFrequency5: string;
  discipline6: string;
  newFrequency6: string;
  patientSignatureDate: string;
  agencyRepDate: string;
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
  source: 'bulk';
}

interface CSVUploadProps {
  onFormsAdded?: (forms: ConsentBulkRecord[]) => void;
}

const PatientConsentCSVUpload: React.FC<CSVUploadProps> = ({ onFormsAdded }) => {
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingPDFs, setIsGeneratingPDFs] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadTemplate = () => {
    const headers = [
      'patientName',
      'mrn',
      'soc',
      'certificationStart',
      'certificationEnd',
      'discipline1',
      'newFrequency1',
      'discipline2',
      'newFrequency2',
      'discipline3',
      'newFrequency3',
      'discipline4',
      'newFrequency4',
      'discipline5',
      'newFrequency5',
      'discipline6',
      'newFrequency6',
      'patientSignatureDate',
      'agencyRepDate'
    ];

    const sampleData = [
      'John Doe',
      '123456',
      '2024-01-01',
      '2024-01-01',
      '2024-03-31',
      'Physical Therapy',
      '3x/week',
      'Occupational Therapy',
      '2x/week',
      'Speech Therapy',
      '1x/week',
      '',
      '',
      '',
      '',
      '',
      '',
      '2024-01-01',
      '2024-01-01'
    ];

    const csvContent = [headers.join(','), sampleData.join(',')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'patient-consent-template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('CSV template downloaded');
  };

  const parseCSV = (csvText: string): CSVRow[] => {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      const row: any = {};
      
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      
      return row as CSVRow;
    });
  };

  const convertToJSON = (csvRows: CSVRow[]): ConsentBulkRecord[] => {
    return csvRows.map(row => {
      const disciplineFrequencies: { discipline: string; newFrequency: string }[] = [];
      
      for (let i = 1; i <= 6; i++) {
        const discipline = (row as any)[`discipline${i}`] as string | undefined;
        const frequency = (row as any)[`newFrequency${i}`] as string | undefined;
        
        if (discipline || frequency) {
          disciplineFrequencies.push({
            discipline: discipline || '',
            newFrequency: frequency || ''
          });
        }
      }

      return {
        patientName: row.patientName,
        mrn: row.mrn,
        soc: row.soc,
        certificationPeriod: `${row.certificationStart} - ${row.certificationEnd}`,
        disciplineFrequencies,
        patientSignatureDate: row.patientSignatureDate,
        agencyRepDate: row.agencyRepDate,
        timestamp: new Date().toISOString(),
        source: 'bulk' as const,
      };
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    setIsProcessing(true);

    try {
      const text = await file.text();
      const parsedData = parseCSV(text);
      setCsvData(parsedData);

      const jsonOutput = convertToJSON(parsedData);
      console.log('Bulk CSV Upload - Patient Consent Forms:', jsonOutput);

      onFormsAdded?.(jsonOutput);

      toast.success(`${parsedData.length} records processed and added to forms list.`);
    } catch (error) {
      console.error('Error processing CSV:', error);
      toast.error('Failed to process the CSV file. Please check the format.');
    } finally {
      setIsProcessing(false);
    }
  };

  const clearData = () => {
    setCsvData([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
    toast.success('All uploaded data has been cleared.');
  };

  const handleBulkPDFGeneration = async () => {
    if (csvData.length === 0) {
      toast.error('No data to process. Please upload a CSV file first.');
      return;
    }

    setIsGeneratingPDFs(true);

    try {
      // Convert CSV data to the format expected by the backend
      const bulkData = csvData.map(row => {
        const disciplineFrequencies = [];

        // Convert individual discipline fields to array format
        for (let i = 1; i <= 6; i++) {
          const discipline = (row as any)[`discipline${i}`] as string;
          const frequency = (row as any)[`newFrequency${i}`] as string;

          disciplineFrequencies.push({
            discipline: discipline || '',
            newFrequency: frequency || ''
          });
        }

        return {
          patientName: row.patientName,
          mrn: row.mrn,
          soc: row.soc,
          certificationStart: row.certificationStart,
          certificationEnd: row.certificationEnd,
          disciplineFrequencies,
          patientSignatureDate: row.patientSignatureDate,
          agencyRepDate: row.agencyRepDate,
          // Add default signature values for bulk processing
          patientSignature: row.patientName, // Convert name to signature
          agencyRepSignature: 'Agency Representative'
        };
      });

      await generateBulkPatientConsentPDF(bulkData, false);

      toast.success(`Successfully generated ${csvData.length} Patient Consent PDFs!`);

      // Clear the data after successful generation
      clearData();

    } catch (error) {
      console.error('Error generating bulk PDFs:', error);
      toast.error('Failed to generate PDFs. Please try again.');
    } finally {
      setIsGeneratingPDFs(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-3">
          <FileSpreadsheet className="w-6 h-6" />
          Bulk CSV Upload
        </CardTitle>
        <CardDescription>
          Upload a CSV file using the template below to create multiple Patient Consent forms.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
            <div className="text-sm">
              <p className="font-medium mb-2">CSV Format Requirements:</p>
              <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
                <li>Use the provided template for correct column headers</li>
                <li>Date format: YYYY-MM-DD (e.g., 2024-01-01)</li>
                <li>Up to 6 discipline/frequency pairs supported</li>
                <li>Empty discipline/frequency pairs will be ignored</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button onClick={downloadTemplate} variant="outline" className="flex items-center gap-2 h-12">
            <Download className="w-5 h-5" />
            Download CSV Template
          </Button>

          <div className="space-y-2">
            <Label htmlFor="csvFile" className="text-sm font-medium">Upload CSV File</Label>
            <div className="relative">
              <Input
                id="csvFile"
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                disabled={isProcessing}
              />
              {isProcessing && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-md">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                </div>
              )}
            </div>
          </div>
        </div>

        {csvData.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Processed Records: {csvData.length}</h3>
              <div className="flex gap-2">
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
                      Generate {csvData.length} PDFs
                    </>
                  )}
                </Button>
                <Button onClick={clearData} variant="outline" size="sm">
                  Clear Data
                </Button>
              </div>
            </div>
            <div className="bg-muted rounded-lg p-4 max-h-64 overflow-y-auto">
              <div className="space-y-2">
                {csvData.map((row, index) => (
                  <div key={index} className="bg-background rounded p-3 text-sm">
                    <div className="font-medium">
                      {row.patientName || `Patient ${index + 1}`} (MRN: {row.mrn})
                    </div>
                    <div className="text-muted-foreground text-xs mt-1">
                      SOC: {row.soc} | Cert: {row.certificationStart} - {row.certificationEnd}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PatientConsentCSVUpload;
