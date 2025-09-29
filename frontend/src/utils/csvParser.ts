import { NOMNCFormData } from '@/types/nomnc';

export interface CSVParseResult {
  data: Partial<NOMNCFormData>[];
  errors: string[];
}

export const parseCSVText = (csvText: string): CSVParseResult => {
  const lines = csvText.trim().split('\n');
  const errors: string[] = [];
  const data: Partial<NOMNCFormData>[] = [];

  if (lines.length < 2) {
    errors.push('CSV must contain at least a header row and one data row');
    return { data, errors };
  }

  // Expected headers
  const expectedHeaders = [
    'patient_number',
    'patient_name', 
    'effective_date',
    'current_service_type',
    'plan_contact_info',
    'additional_info',
    'sig_patient_or_rep',
    'sig_date'
  ];

  // Parse header
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  
  // Validate headers
  const missingHeaders = expectedHeaders.filter(h => !headers.includes(h));
  if (missingHeaders.length > 0) {
    errors.push(`Missing required headers: ${missingHeaders.join(', ')}`);
  }

  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    
    if (values.length !== headers.length) {
      errors.push(`Row ${i + 1}: Expected ${headers.length} columns, got ${values.length}`);
      continue;
    }

    const rowData: Partial<NOMNCFormData> = {};
    
    headers.forEach((header, index) => {
      if (expectedHeaders.includes(header)) {
        rowData[header as keyof NOMNCFormData] = values[index];
      }
    });

    // Validate required fields
    const requiredFields = ['patient_number', 'patient_name', 'effective_date', 'current_service_type'];
    const missingFields = requiredFields.filter(field => !rowData[field as keyof NOMNCFormData]);
    
    if (missingFields.length > 0) {
      errors.push(`Row ${i + 1}: Missing required fields: ${missingFields.join(', ')}`);
    }

    data.push(rowData);
  }

  return { data, errors };
};

export const generateCSVTemplate = (): string => {
  const headers = [
    'patient_number',
    'patient_name',
    'effective_date',
    'current_service_type', 
    'plan_contact_info',
    'additional_info',
    'sig_patient_or_rep',
    'sig_date'
  ];

  const sampleRow = [
    'P12345',
    'John Doe',
    '12/31/2024',
    'Home Health Care',
    'ABC Health Plan 555-0123 support@abchealth.com',
    'Additional notes here',
    'John Doe',
    '12/15/2024'
  ];

  return [headers.join(','), sampleRow.join(',')].join('\n');
};