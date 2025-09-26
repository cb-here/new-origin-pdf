import { Link } from 'react-router-dom';
import { SOCForm } from "@/components/SOCForm";
import { Button } from '@/components/ui/button';
import { FileText, Home } from 'lucide-react';

const Index = () => {
  return (
    <div className="relative">
      <div className="absolute top-4 left-4 z-10">
        <Link to="/">
          <Button variant="outline">
            <Home className="w-4 h-4 mr-2" />
            Form Selection
          </Button>
        </Link>
      </div>
      
      <div className="absolute top-4 right-4 z-10">
        <Link to="/documents">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            View Documents
          </Button>
        </Link>
      </div>
      <SOCForm />
    </div>
  );
};

export default Index;
