import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, FileX, Home, Clock, Users, CheckCircle, FileSignature } from 'lucide-react';

const FormSelection = () => {
  const forms = [
    {
      id: 'esoc',
      title: 'E-SOC Packets',
      description: 'Electronic Start of Care packets for patient onboarding and documentation',
      route: '/esoc',
      icon: FileText,
      features: [
        'Patient Demographics',
        'Clinical Information', 
        'Insurance & Billing',
        'Digital Signatures',
        'Emergency Information'
      ],
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      id: 'nomnc',
      title: 'NOMNC Form',
      description: 'Notice of Medicare Non-Coverage forms for coverage termination notices',
      route: '/nomnc',
      icon: FileX,
      features: [
        'Patient Identification',
        'Coverage End Dates',
        'Service Type Selection',
        'Appeal Information',
        'Digital Signatures'
      ],
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700'
    },
    {
      id: 'patient-consent',
      title: 'Patient Consent Form',
      description: 'Collect consent with signatures, or upload CSV for bulk processing',
      route: '/patient-consent',
      icon: FileSignature,
      features: [
        'Left-aligned Steps',
        'Digital Signatures',
        'CSV Bulk Upload',
        'Dashboard View'
      ],
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="absolute top-4 left-4 z-10">
        <Link to="/documents">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            View Documents
          </Button>
        </Link>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-primary rounded-full">
              <FileText className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Form Selection Center
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the appropriate form type for your documentation needs. 
            Each form is designed for specific healthcare administration requirements.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {forms.map((form) => {
              const IconComponent = form.icon;
              return (
                <Card key={form.id} className="group hover:shadow-xl transition-all duration-300 border-0 overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${form.color}`} />
                  
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-lg ${form.bgColor} mb-4`}>
                        <IconComponent className={`w-8 h-8 ${form.textColor}`} />
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>10-15 min</span>
                      </div>
                    </div>
                    
                    <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors">
                      {form.title}
                    </CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {form.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
                        Key Features
                      </h4>
                      <div className="space-y-2">
                        {form.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm text-gray-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <Link to={form.route}>
                        <Button 
                          className={`w-full bg-gradient-to-r ${form.color} hover:shadow-lg transition-all duration-200 text-white border-0`}
                          size="lg"
                        >
                          <IconComponent className="w-5 h-5 mr-2" />
                          Start {form.title}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Card className="max-w-2xl mx-auto bg-muted/30">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2">Need Help Choosing?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Use <strong>E-SOC Packets</strong> for new patient admissions and ongoing care documentation. 
                  Use <strong>NOMNC Forms</strong> when Medicare coverage is ending and patients need official notice.
                </p>
                <Button variant="outline" size="sm">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormSelection;