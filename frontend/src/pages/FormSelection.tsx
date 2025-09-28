import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FileText,
  FileX,
  Users,
  CheckCircle,
  FileSignature,
  MessageSquare,
} from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/all";

const FormSelection = () => {
  const forms = [
    {
      id: "esoc",
      title: "E-SOC Packets",
      description:
        "Electronic Start of Care packets for patient onboarding and documentation",
      route: "/esoc",
      icon: FileText,
      features: [
        "Patient Demographics",
        "Clinical Information",
        "Insurance & Billing",
        "Digital Signatures",
        "Emergency Information",
      ],
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
    },
    {
      id: "nomnc",
      title: "NOMNC Form",
      description:
        "Notice of Medicare Non-Coverage forms for coverage termination notices",
      route: "/nomnc",
      icon: FileX,
      features: [
        "Patient Identification",
        "Coverage End Dates",
        "Service Type Selection",
        "Appeal Information",
        "Digital Signatures",
      ],
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700",
    },
    {
      id: "patient-consent",
      title: "Patient Consent Form",
      description:
        "Collect consent with signatures, or upload CSV for bulk processing",
      route: "/patient-consent",
      icon: FileSignature,
      features: [
        "Left-aligned Steps",
        "Digital Signatures",
        "CSV Bulk Upload",
        "Dashboard View",
      ],
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700",
    },
  ];

  useGSAP(() => {
    const tl = gsap.timeline({
      defaults: {
        ease: "power2.out",
      },
    });
    const titleSplit = new SplitText(".title", { type: "chars, words" });
    const paraSplit = new SplitText(".para", { type: "lines" });

    tl.from(titleSplit.chars, {
      opacity: 0,
      y: 20,
      duration: 0.3,
      stagger: 0.02,
    });

    tl.from(
      paraSplit.lines,
      {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.03,
      },
      "-=0.2"
    );
    tl.fromTo(
      ".form-card",
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.01,
      },
      "-=0.1"
    );

    return () => {
      titleSplit.revert();
      paraSplit.revert();
    };
  }, []);

  return (
    <div className="main-container min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 form-container">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-primary rounded-full">
              <FileText className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="title text-4xl font-bold text-gray-900 mb-4">
            Form Selection Center
          </h1>
          <p className="para text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the appropriate form type for your documentation needs. Each
            form is designed for specific healthcare administration
            requirements.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div id="main-grid" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {forms.map((form) => {
              const IconComponent = form.icon;
              return (
                <Card
                  key={form.id}
                  className={`form-card group hover:shadow-xl transition-all duration-300 border-0 overflow-hidden ${
                    form.id === "patient-consent"
                      ? "lg:col-span-2 lg:max-w-2xl lg:mx-auto"
                      : ""
                  }`}
                >
                  <div className={`h-2 bg-gradient-to-r ${form.color}`} />
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-lg ${form.bgColor} mb-4`}>
                        <IconComponent
                          className={`w-8 h-8 ${form.textColor}`}
                        />
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
                            <span className="text-sm text-gray-600">
                              {feature}
                            </span>
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
                          <IconComponent className="w-5 h-5" />
                          Start {form.title}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-20 md:px-4 px-0">
            <div className="max-w-4xl mx-auto">
              <div className="relative bg-gradient-to-br from-white via-blue-50 to-indigo-100 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-blue-200 dark:bg-blue-900 rounded-full opacity-20 blur-xl"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-indigo-200 dark:bg-indigo-900 rounded-full opacity-30 blur-lg"></div>

                <div className="relative z-10 p-8 md:p-12">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
                          <Users className="w-10 h-10 text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full border-4 border-white dark:border-gray-800"></div>
                      </div>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4 tracking-tight">
                        Need Help Choosing the Right Form?
                      </h3>

                      <div className="space-y-4 mb-6">
                        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                          <span className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-lg">
                            <strong className="font-semibold text-blue-600 dark:text-blue-400">
                              E-SOC Packets
                            </strong>
                          </span>{" "}
                          for new patient admissions and ongoing care
                          documentation
                        </p>

                        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                          <span className="inline-flex items-center gap-1 bg-purple-50 dark:bg-purple-900/30 px-2 py-1 rounded-lg">
                            <strong className="font-semibold text-purple-600 dark:text-purple-400">
                              NOMNC Forms
                            </strong>
                          </span>{" "}
                          when Medicare coverage is ending and patients need
                          official notice
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <Button className="group bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 border-0">
                          <MessageSquare className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                          Contact Support
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormSelection;
