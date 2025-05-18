
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import ReactMarkdown from 'react-markdown';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Download } from "lucide-react";
import { TemplateStyle } from "../types";
import { generateStyleCSS } from "../utils/templateManager";

interface DocumentViewerProps {
  title: string;
  content: string;
  onClose: () => void;
  onDownload: () => void;
  templateStyle?: TemplateStyle;
  customCSS?: string;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  title,
  content,
  onClose,
  onDownload,
  templateStyle = "formal",
  customCSS = "",
}) => {
  const contentRef = React.useRef<HTMLDivElement>(null);
  
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(content);
    toast.success("Document copied to clipboard!");
  };
  
  const handleDownloadPdf = async () => {
    if (!contentRef.current) return;
    
    try {
      toast.info("Preparing PDF for download...");
      
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: "#ffffff"
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Calculate dimensions to fit the content properly
      const imgWidth = 210; // A4 width in mm (210mm)
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${title.replace(/\s+/g, '-').toLowerCase()}_${Date.now()}.pdf`);
      
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  // Generate CSS based on template style and custom CSS
  const documentStyle = generateStyleCSS(templateStyle);

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <div className="bg-brand-600 p-4 rounded-t-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <Button
            variant="ghost"
            className="text-white hover:bg-brand-700"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
      <CardContent className="p-6">
        <div 
          ref={contentRef} 
          className="prose max-w-none bg-white p-6 border rounded-md mb-6 overflow-auto max-h-[60vh]"
        >
          <style>{documentStyle}</style>
          {customCSS && <style>{customCSS}</style>}
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={handleCopyToClipboard}>
            Copy to Clipboard
          </Button>
          <Button onClick={handleDownloadPdf}>
            <Download className="mr-2 h-4 w-4" />
            Download as PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentViewer;
