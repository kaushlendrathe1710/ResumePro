import React, { useRef, useState, useEffect } from "react";
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
import { Download, Palette, FileDown, Crown, AlertCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { exportToWord } from "@/lib/docx-export";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface SubscriptionInfo {
  hasSubscription: boolean;
  subscription?: {
    id: string;
    planName: string;
    downloadsRemaining: number;
    hasWatermark: boolean;
    allowWordExport: boolean;
  };
  defaultPlan?: {
    id: string;
    name: string;
    downloadLimit: number;
    hasWatermark: boolean;
    allowWordExport: boolean;
  };
  expired?: boolean;
}

const WatermarkOverlay: React.FC = () => (
  <div 
    className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden print:flex"
    style={{ zIndex: 100 }}
  >
    <div 
      className="absolute text-gray-300 text-6xl font-bold transform -rotate-45 opacity-30 whitespace-nowrap select-none"
      style={{ 
        textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
        letterSpacing: '0.5em'
      }}
    >
      Mymegaminds
    </div>
  </div>
);

interface ResumePreviewProps {
  data: ResumeData;
  templateId: string;
  onTemplateChange: (value: string) => void;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data, templateId, onTemplateChange }) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [pendingDownloadFormat, setPendingDownloadFormat] = useState<"pdf" | "docx" | null>(null);
  
  const selectedTemplate = templates.find(t => t.id === templateId) || templates[0];

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const response = await fetch("/api/subscription");
      if (response.ok) {
        const subData = await response.json();
        setSubscription(subData);
      }
    } catch (error) {
      console.error("Failed to fetch subscription:", error);
    }
  };

  const hasWatermark = () => {
    if (subscription?.hasSubscription && subscription.subscription) {
      return subscription.subscription.hasWatermark;
    }
    return subscription?.defaultPlan?.hasWatermark ?? true;
  };

  const canDownload = () => {
    if (subscription?.hasSubscription && subscription.subscription) {
      return subscription.subscription.downloadsRemaining > 0;
    }
    if (subscription?.defaultPlan) {
      return subscription.defaultPlan.downloadLimit > 0;
    }
    return false;
  };

  const canExportWord = () => {
    if (subscription?.hasSubscription && subscription.subscription) {
      return subscription.subscription.allowWordExport;
    }
    return subscription?.defaultPlan?.allowWordExport ?? false;
  };

  const getDownloadsRemaining = () => {
    if (subscription?.hasSubscription && subscription.subscription) {
      return subscription.subscription.downloadsRemaining;
    }
    return subscription?.defaultPlan?.downloadLimit ?? 0;
  };

  const recordDownload = async (format: "pdf" | "docx") => {
    try {
      const response = await fetch("/api/subscription/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ format })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Download failed");
      }
      await fetchSubscription();
      return true;
    } catch (error) {
      console.error("Failed to record download:", error);
      throw error;
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${data.personal.fullName.replace(/\s+/g, '_')}_Resume`,
    onAfterPrint: () => {
      if (pendingDownloadFormat === "pdf") {
        toast.success("PDF download completed!");
        setPendingDownloadFormat(null);
      }
    },
  });

  const handlePdfDownload = async () => {
    if (!canDownload()) {
      toast.error("No downloads remaining. Please upgrade your plan.");
      return;
    }
    
    setIsDownloading(true);
    setPendingDownloadFormat("pdf");
    try {
      await recordDownload("pdf");
      handlePrint();
    } catch (error: any) {
      toast.error(error.message || "Download failed. Please try again.");
      setPendingDownloadFormat(null);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleWordExport = async () => {
    if (!canExportWord()) {
      toast.error("Word export is not available on your plan. Please upgrade.");
      return;
    }
    if (!canDownload()) {
      toast.error("No downloads remaining. Please upgrade your plan.");
      return;
    }
    
    setIsDownloading(true);
    try {
      await recordDownload("docx");
      await exportToWord(data);
      toast.success("Word document downloaded!");
    } catch (error: any) {
      toast.error(error.message || "Download failed. Please try again.");
    } finally {
      setIsDownloading(false);
    }
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

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm mr-2">
            {subscription && (
              <>
                <Badge variant="outline" className="bg-slate-800 border-slate-600 text-slate-300">
                  <Download className="w-3 h-3 mr-1" />
                  {getDownloadsRemaining()} left
                </Badge>
                {hasWatermark() && (
                  <Badge variant="outline" className="bg-amber-500/20 border-amber-500/50 text-amber-400">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Watermark
                  </Badge>
                )}
              </>
            )}
          </div>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="secondary"
                onClick={handleWordExport} 
                disabled={isDownloading || !canExportWord() || !canDownload()}
                className={`bg-slate-700 hover:bg-slate-600 text-white border border-slate-600 ${
                  (!canExportWord() || !canDownload()) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                data-testid="button-download-word"
              >
                <FileDown className="w-4 h-4 mr-2" /> Word
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {!canExportWord() ? (
                <p>Word export requires Premium plan</p>
              ) : !canDownload() ? (
                <p>No downloads remaining</p>
              ) : (
                <p>Download editable Word document</p>
              )}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={handlePdfDownload}
                disabled={isDownloading || !canDownload()}
                className={`bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20 ${
                  !canDownload() ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                data-testid="button-download-pdf"
              >
                <Download className="w-4 h-4 mr-2" /> PDF
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {!canDownload() ? (
                <p>No downloads remaining. Upgrade your plan.</p>
              ) : hasWatermark() ? (
                <p>Download PDF with watermark</p>
              ) : (
                <p>Download print-ready PDF</p>
              )}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center bg-slate-800">
        <div className="relative shadow-2xl transform transition-transform origin-top scale-[0.5] sm:scale-[0.6] md:scale-[0.7] lg:scale-[0.8] xl:scale-[0.9] 2xl:scale-100">
           {/* Print Wrapper */}
           <div ref={printRef} className="bg-white w-[210mm] min-h-[297mm] shadow-white/5 relative">
             {renderTemplate()}
             {hasWatermark() && <WatermarkOverlay />}
           </div>
        </div>
      </div>
    </div>
  );
};
