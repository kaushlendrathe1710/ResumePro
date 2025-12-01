import React, { useRef } from "react";
import { ResumeData } from "@/lib/schema";
import { ModernTemplate } from "./templates/modern";
import { ClassicTemplate } from "./templates/classic";
import { MinimalTemplate } from "./templates/minimal";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { Printer, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ResumePreviewProps {
  data: ResumeData;
  template: string;
  onTemplateChange: (value: string) => void;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data, template, onTemplateChange }) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${data.personal.fullName.replace(/\s+/g, '_')}_Resume`,
  });

  const renderTemplate = () => {
    switch (template) {
      case "modern":
        return <ModernTemplate data={data} />;
      case "classic":
        return <ClassicTemplate data={data} />;
      case "minimal":
        return <MinimalTemplate data={data} />;
      default:
        return <ModernTemplate data={data} />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-800 border-l border-slate-700">
      <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900 text-white">
        <div className="flex items-center gap-4">
           <span className="text-sm font-medium text-slate-400">Template:</span>
           <Select value={template} onValueChange={onTemplateChange}>
             <SelectTrigger className="w-[180px] bg-slate-800 border-slate-600 text-white">
               <SelectValue placeholder="Select Template" />
             </SelectTrigger>
             <SelectContent>
               <SelectItem value="modern">Modern Professional</SelectItem>
               <SelectItem value="classic">Classic Serif</SelectItem>
               <SelectItem value="minimal">Clean Minimalist</SelectItem>
             </SelectContent>
           </Select>
        </div>

        <Button 
          onClick={() => handlePrint()} 
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20"
        >
          <Download className="w-4 h-4 mr-2" /> Download PDF
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-slate-800">
        <div className="relative shadow-2xl transform transition-transform origin-top scale-[0.85] md:scale-[0.6] lg:scale-[0.8] xl:scale-[0.9] 2xl:scale-100">
           {/* Print Wrapper */}
           <div ref={printRef} className="bg-white w-[210mm] min-h-[297mm] shadow-white/5">
             {renderTemplate()}
           </div>
        </div>
      </div>
    </div>
  );
};
