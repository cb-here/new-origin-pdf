import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Download, Copy, Check, AlertTriangle } from 'lucide-react';
import { parseCSVText, generateCSVTemplate, CSVParseResult } from '@/utils/csvParser';
import { toast } from 'sonner';

interface CSVUploadProps {
  onDataParsed: (data) => void;
}

export const CSVUpload: React.FC<CSVUploadProps> = ({ onDataParsed }) => {
  const [csvText, setCsvText] = useState('');
  const [parseResult, setParseResult] = useState<CSVParseResult | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nomnc_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Template downloaded');
  };

  const handleProcessData = () => {
    if (parseResult && parseResult.errors.length === 0) {
      onDataParsed(parseResult.data);
      toast.success('CSV data processed successfully');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>CSV Upload for Bulk NOMNC Forms</CardTitle>
          <CardDescription>
            Upload or paste CSV data to create multiple NOMNC forms at once
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
              placeholder="patient_number,patient_name,effective_date,current_service_type,plan_contact_info,additional_info,sig_patient_or_rep,sig_date"
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
                <h4 className="font-medium">Parsed Data ({parseResult.data.length} rows):</h4>
                <div className="border rounded-md max-h-96 overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className='whitespace-nowrap'>Patient #</TableHead>
                        <TableHead className='whitespace-nowrap'>Patient Name</TableHead>
                        <TableHead className='whitespace-nowrap'>Effective Date</TableHead>
                        <TableHead className='whitespace-nowrap'>Service Type</TableHead>
                        <TableHead className='whitespace-nowrap'>Plan Contact</TableHead>
                        <TableHead className='whitespace-nowrap'>Additional Info</TableHead>
                        <TableHead className='whitespace-nowrap'>Signature</TableHead>
                        <TableHead className='whitespace-nowrap'>Sig Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parseResult.data.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-mono text-sm whitespace-nowrap">{row.patient_number}</TableCell>
                          <TableCell className='whitespace-nowrap'>{row.patient_name}</TableCell>
                          <TableCell className='whitespace-nowrap'>{row.effective_date}</TableCell>
                          <TableCell  className='whitespace-nowrap max-w-[200px] truncate'>{row.current_service_type}</TableCell>
                          <TableCell className="max-w-32 truncate">{row.plan_contact_info}</TableCell>
                          <TableCell className="max-w-32 truncate">{row.additional_info}</TableCell>
                          <TableCell className='whitespace-nowrap'>{row.sig_patient_or_rep}</TableCell>
                          <TableCell>{row.sig_date}</TableCell>
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