import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Documents from "./pages/Documents";
import NOMNC from "./pages/NOMNC";
import FormSelection from "./pages/FormSelection";
import PatientConsent from "./pages/PatientConsent";
import NotFound from "./pages/NotFound";
import { ScrollTrigger, SplitText } from "gsap/all";
import gsap from "gsap";
import { SOCFieldsProvider } from "./contexts/SOCFieldsContext";
import { NOMNCFieldsProvider } from "./contexts/NOMNCFieldsContext";
import { PatientConsentFieldsProvider } from "./contexts/PatientConsentFieldsContext";

gsap.registerPlugin(ScrollTrigger, SplitText)

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SOCFieldsProvider>
      <NOMNCFieldsProvider>
        <PatientConsentFieldsProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Layout>
                <Routes>
                  <Route path="/" element={<FormSelection />} />
                  <Route path="/esoc" element={<Index />} />
                  <Route path="/documents" element={<Documents />} />
                  <Route path="/nomnc" element={<NOMNC />} />
                  <Route path="/patient-consent" element={<PatientConsent />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </BrowserRouter>
          </TooltipProvider>
        </PatientConsentFieldsProvider>
      </NOMNCFieldsProvider>
    </SOCFieldsProvider>
  </QueryClientProvider>
);

export default App;
