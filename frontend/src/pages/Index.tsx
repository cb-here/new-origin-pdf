import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SOCForm } from "@/components/SOCForm";
import {
  Card, CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, File } from "lucide-react";
import Documents from "./Documents";

const Index = () => {
  const location = useLocation();
  const [mode, setMode] = useState<"single" | "bulk" | "dashboard">("single");

  useEffect(() => {
    // Switch to single tab when edit mode is triggered from Documents
    if (location.state?.editMode) {
      setMode("single");
    }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 pt-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">SOC Forms</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create and manage Start of Care (SOC) forms with comprehensive
            patient information and digital signatures.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Tabs
            value={mode}
            onValueChange={(value) => {
              setMode(value as "single" | "bulk" | "dashboard");
            }}
            className="mb-8"
          >
            <TabsList className="grid w-full grid-cols-2 max-w-lg mx-auto">
              <TabsTrigger value="single" className="flex items-center gap-2">
                <File className="w-4 h-4" />
                SOC Form
              </TabsTrigger>

              <TabsTrigger
                value="dashboard"
                className="flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Dashboard
              </TabsTrigger>
            </TabsList>

            <TabsContent value="single" className="mt-8">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <File className="w-5 h-5" />
                    SOC Form
                  </CardTitle>
                  <CardDescription>
                    Create a comprehensive Start of Care form for an individual
                    patient.
                  </CardDescription>
                </CardHeader>
              </Card>
              <SOCForm />
            </TabsContent>

            <TabsContent value="dashboard" className="mt-8">
              <Documents />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
