import React, { useRef } from "react";
import { ResumeData } from "@/lib/schema";
import { templates, LayoutType } from "@/lib/templates";
import { ModernTemplate } from "./templates/modern";
import { ClassicTemplate } from "./templates/classic";
import { MinimalTemplate } from "./templates/minimal";
import { ExecutiveTemplate } from "./templates/executive";
import { CreativeTemplate } from "./templates/creative";
import { ProfessionalTemplate } from "./templates/professional";
import { ElegantTemplate } from "./templates/elegant";
import { TechTemplate } from "./templates/tech";
import { CorporateTemplate } from "./templates/corporate";
import { AcademicTemplate } from "./templates/academic";
import { SimpleTemplate } from "./templates/simple";
import { BoldTemplate } from "./templates/bold";
import { StylishTemplate } from "./templates/stylish";
import { CompactTemplate } from "./templates/compact";
import { SidebarTemplate } from "./templates/sidebar";
import { TimelineTemplate } from "./templates/timeline";
import { InfographicTemplate } from "./templates/infographic";
import { CleanTemplate } from "./templates/clean";
import { GradientTemplate } from "./templates/gradient";
import { SharpTemplate } from "./templates/sharp";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { Download, Palette, FileDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { exportToWord } from "@/lib/docx-export";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ResumePreviewProps {
  data: ResumeData;
  templateId: string;
  onTemplateChange: (value: string) => void;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data, templateId, onTemplateChange }) => {
  const printRef = useRef<HTMLDivElement>(null);
  
  const selectedTemplate = templates.find(t => t.id === templateId) || templates[0];

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${data.personal.fullName.replace(/\s+/g, '_')}_Resume`,
  });

  const handleWordExport = async () => {
    await exportToWord(data);
  };

  const renderTemplate = () => {
    const props = {
      data,
      color: selectedTemplate.color,
      font: selectedTemplate.font
    };

    switch (selectedTemplate.layout as LayoutType) {
      case "modern":
        return <ModernTemplate {...props} />;
      case "classic":
        return <ClassicTemplate {...props} />;
      case "minimal":
        return <MinimalTemplate {...props} />;
      case "executive":
        return <ExecutiveTemplate {...props} />;
      case "creative":
        return <CreativeTemplate {...props} />;
      case "professional":
        return <ProfessionalTemplate {...props} />;
      case "elegant":
        return <ElegantTemplate {...props} />;
      case "tech":
        return <TechTemplate {...props} />;
      case "corporate":
        return <CorporateTemplate {...props} />;
      case "academic":
        return <AcademicTemplate {...props} />;
      case "simple":
        return <SimpleTemplate {...props} />;
      case "bold":
        return <BoldTemplate {...props} />;
      case "stylish":
        return <StylishTemplate {...props} />;
      case "compact":
        return <CompactTemplate {...props} />;
      case "sidebar":
        return <SidebarTemplate {...props} />;
      case "timeline":
        return <TimelineTemplate {...props} />;
      case "infographic":
        return <InfographicTemplate {...props} />;
      case "clean":
        return <CleanTemplate {...props} />;
      case "gradient":
        return <GradientTemplate {...props} />;
      case "sharp":
        return <SharpTemplate {...props} />;
      default:
        return <ModernTemplate {...props} />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-800 border-l border-slate-700">
      <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900 text-white flex-wrap gap-4">
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 text-sm font-medium text-slate-400 hidden lg:flex">
             <Palette className="w-4 h-4" />
             <span className="hidden xl:inline">Template:</span>
           </div>
           <Select value={templateId} onValueChange={onTemplateChange}>
             <SelectTrigger className="w-[180px] md:w-[240px] bg-slate-800 border-slate-600 text-white">
               <SelectValue placeholder="Select Template" />
             </SelectTrigger>
             <SelectContent className="max-h-[400px]">
               {templates.map(t => (
                 <SelectItem key={t.id} value={t.id}>
                   <div className="flex items-center gap-2">
                     <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: t.color }}></div>
                     <span className="truncate">{t.name}</span>
                   </div>
                 </SelectItem>
               ))}
             </SelectContent>
           </Select>
        </div>

        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="secondary"
                onClick={handleWordExport} 
                className="bg-slate-700 hover:bg-slate-600 text-white border border-slate-600"
              >
                <FileDown className="w-4 h-4 mr-2" /> Word
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Download editable Word document</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={() => handlePrint()} 
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20"
              >
                <Download className="w-4 h-4 mr-2" /> PDF
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Download print-ready PDF</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center bg-slate-800">
        <div className="relative shadow-2xl transform transition-transform origin-top scale-[0.5] sm:scale-[0.6] md:scale-[0.7] lg:scale-[0.8] xl:scale-[0.9] 2xl:scale-100">
           {/* Print Wrapper */}
           <div ref={printRef} className="bg-white w-[210mm] min-h-[297mm] shadow-white/5">
             {renderTemplate()}
           </div>
        </div>
      </div>
    </div>
  );
};
