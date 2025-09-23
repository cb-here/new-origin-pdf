import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download, Edit, ArrowLeft } from 'lucide-react';

// Dummy data for demonstration
const documentData = [
  {
    id: 1,
    patientName: 'John Smith',
    socDate: '2024-01-15',
    mrn: 'MRN001234',
    clinicianName: 'Dr. Sarah Johnson',
    status: 'Signed',
    createdAt: '2024-01-15 10:30 AM',
    completedAt: '2024-01-15 11:45 AM'
  },
  {
    id: 2,
    patientName: 'Mary Davis',
    socDate: '2024-01-14',
    mrn: 'MRN005678',
    clinicianName: 'Dr. Michael Brown',
    status: 'Pending',
    createdAt: '2024-01-14 2:15 PM',
    completedAt: null
  },
  {
    id: 3,
    patientName: 'Robert Wilson',
    socDate: '2024-01-13',
    mrn: 'MRN009876',
    clinicianName: 'Dr. Emily Chen',
    status: 'Signed',
    createdAt: '2024-01-13 9:00 AM',
    completedAt: '2024-01-13 10:20 AM'
  },
  {
    id: 4,
    patientName: 'Lisa Anderson',
    socDate: '2024-01-12',
    mrn: 'MRN543210',
    clinicianName: 'Dr. James Miller',
    status: 'Draft',
    createdAt: '2024-01-12 3:45 PM',
    completedAt: null
  }
];

const Documents = () => {
  const handleDownload = (id: number, patientName: string) => {
    console.log(`Downloading document for ${patientName} (ID: ${id})`);
    // Dummy download action
  };

  const handleEdit = (id: number, patientName: string) => {
    console.log(`Editing document for ${patientName} (ID: ${id})`);
    // Dummy edit action
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Signed':
        return 'default';
      case 'Pending':
        return 'secondary';
      case 'Draft':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Form
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Document Management</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>SOC Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>SOC Date</TableHead>
                    <TableHead>MRN</TableHead>
                    <TableHead>Clinician</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documentData.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.patientName}</TableCell>
                      <TableCell>{doc.socDate}</TableCell>
                      <TableCell>{doc.mrn}</TableCell>
                      <TableCell>{doc.clinicianName}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(doc.status)}>
                          {doc.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{doc.createdAt}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {doc.completedAt || 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(doc.id, doc.patientName)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(doc.id, doc.patientName)}
                            disabled={doc.status === 'Draft'}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Documents;