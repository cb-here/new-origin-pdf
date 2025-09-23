import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PenTool, Trash2, Download } from 'lucide-react';
import { toast } from 'sonner';

interface DigitalSignatureProps {
  onSignatureChange: (signatureData: string) => void;
  title?: string;
  required?: boolean;
  prefillName?: string;
  allowTypedSignature?: boolean;
}

export const DigitalSignature: React.FC<DigitalSignatureProps> = ({
  onSignatureChange,
  title = "Digital Signature",
  required = false,
  prefillName = "",
  allowTypedSignature = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [signatureMode, setSignatureMode] = useState<'draw' | 'type'>('type'); // Default to type mode
  const [typedSignature, setTypedSignature] = useState(prefillName);

  // Update typed signature when prefillName changes
  useEffect(() => {
    if (prefillName && prefillName !== typedSignature) {
      setTypedSignature(prefillName);
    }
  }, [prefillName, typedSignature]);

  // Auto-generate signature when prefillName is provided and in type mode
  useEffect(() => {
    if (prefillName && signatureMode === 'type' && prefillName.trim() && !hasSignature) {
      const timer = setTimeout(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Set signature style with professional signature font
        ctx.font = '36px "Dancing Script", cursive';
        ctx.fillStyle = 'hsl(var(--signature-stroke))';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Draw typed signature centered (accounting for device pixel ratio)
        const rect = canvas.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        ctx.fillText(prefillName, centerX, centerY);
        
        setHasSignature(true);
        const signatureData = canvas.toDataURL('image/png');
        onSignatureChange(signatureData);

        console.log('Auto-Generated Typed Signature:', {
          timestamp: new Date().toISOString(),
          signatureTitle: title,
          signatureText: prefillName,
          base64Data: signatureData,
          readableFormat: {
            type: 'typed-auto',
            text: prefillName,
            size: Math.round(signatureData.length * 0.75),
            hasContent: true
          }
        });
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [prefillName, signatureMode, hasSignature, title, onSignatureChange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Set drawing properties
    ctx.strokeStyle = 'hsl(var(--signature-stroke))';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    
    setIsDrawing(false);
    setHasSignature(true);
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Convert to base64 and notify parent
    const signatureData = canvas.toDataURL('image/png');
    onSignatureChange(signatureData);
    
    // Log readable format to console as requested
    console.log('Digital Signature Captured:', {
      timestamp: new Date().toISOString(),
      signatureTitle: title,
      base64Data: signatureData,
      readableFormat: {
        type: 'image/png',
        size: Math.round(signatureData.length * 0.75), // Approximate size in bytes
        dimensions: `${canvas.width}x${canvas.height}`,
        hasContent: hasSignature
      }
    });

    toast.success('Signature captured successfully!');
  };

  const generateTypedSignature = () => {
    if (!typedSignature.trim()) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set signature style with professional signature font
    ctx.font = '36px "Dancing Script", cursive';
    ctx.fillStyle = 'hsl(var(--signature-stroke))';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Draw typed signature centered (accounting for device pixel ratio)
    const rect = canvas.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    ctx.fillText(typedSignature, centerX, centerY);
    
    setHasSignature(true);
    const signatureData = canvas.toDataURL('image/png');
    onSignatureChange(signatureData);

    console.log('Typed Signature Generated:', {
      timestamp: new Date().toISOString(),
      signatureTitle: title,
      signatureText: typedSignature,
      base64Data: signatureData,
      readableFormat: {
        type: 'typed',
        text: typedSignature,
        size: Math.round(signatureData.length * 0.75),
        hasContent: true
      }
    });

    toast.success('Typed signature generated!');
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    setTypedSignature(prefillName);
    onSignatureChange('');
    
    toast.info('Signature cleared');
  };

  const downloadSignature = () => {
    if (!hasSignature) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `signature-${title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    
    toast.success('Signature downloaded!');
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <PenTool className="h-5 w-5 text-primary" />
          {title}
          {required && <span className="text-destructive">*</span>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {allowTypedSignature && (
          <div className="flex gap-2 mb-4">
            <Button
              variant={signatureMode === 'draw' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSignatureMode('draw')}
            >
              Draw Signature
            </Button>
            <Button
              variant={signatureMode === 'type' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSignatureMode('type')}
            >
              Type Signature
            </Button>
          </div>
        )}

        {signatureMode === 'type' && allowTypedSignature && (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="typedSignature">Type your signature</Label>
              <Input
                id="typedSignature"
                value={typedSignature}
                onChange={(e) => setTypedSignature(e.target.value)}
                placeholder="Enter your full name"
                className="text-lg"
              />
            </div>
            <Button 
              onClick={generateTypedSignature}
              disabled={!typedSignature.trim()}
              className="w-full"
            >
              Generate Signature
            </Button>
          </div>
        )}

        <div className="relative">
          <canvas
            ref={canvasRef}
            className={`w-full h-40 border-2 border-dashed border-[hsl(var(--signature-border))] bg-[hsl(var(--signature-bg))] rounded-lg touch-none ${
              signatureMode === 'draw' ? 'cursor-crosshair' : 'cursor-default'
            }`}
            onMouseDown={signatureMode === 'draw' ? startDrawing : undefined}
            onMouseMove={signatureMode === 'draw' ? draw : undefined}
            onMouseUp={signatureMode === 'draw' ? stopDrawing : undefined}
            onMouseLeave={signatureMode === 'draw' ? stopDrawing : undefined}
            onTouchStart={signatureMode === 'draw' ? startDrawing : undefined}
            onTouchMove={signatureMode === 'draw' ? draw : undefined}
            onTouchEnd={signatureMode === 'draw' ? stopDrawing : undefined}
          />
          {!hasSignature && signatureMode === 'draw' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-muted-foreground text-sm">Sign here</p>
            </div>
          )}
        </div>
        
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={clearSignature}
            disabled={!hasSignature}
          >
            <Trash2 className="h-4 w-4" />
            Clear
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={downloadSignature}
            disabled={!hasSignature}
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};