import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resumeSchema, defaultResumeData, ResumeData } from "@/lib/schema";
import { ResumeForm } from "@/components/resume-form";
import { ResumePreview } from "@/components/resume-preview";
import { Link, useSearch } from "wouter";
import { ArrowLeft, LayoutTemplate } from "lucide-react";
import { Button } from "@/components/ui/button";
import { templates } from "@/lib/templates";

export default function Builder() {
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const initialTemplateId = searchParams.get("template") || "modern-blue";
  
  const [templateId, setTemplateId] = useState(initialTemplateId);
  
  // Update local state if URL param changes (though usually we want to control it here)
  useEffect(() => {
    const paramTemplate = searchParams.get("template");
    if (paramTemplate && templates.some(t => t.id === paramTemplate)) {
      setTemplateId(paramTemplate);
    }
  }, [searchString]);

  const form = useForm<ResumeData>({
    resolver: zodResolver(resumeSchema),
    defaultValues: defaultResumeData,
    mode: "onChange"
  });

  const formData = form.watch();

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <header className="h-14 border-b px-6 flex items-center justify-between bg-white z-10 shrink-0">
         <div className="flex items-center gap-4">
           <Link href="/templates">
             <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900">
               <ArrowLeft className="w-4 h-4 mr-2" /> Change Template
             </Button>
           </Link>
           <div className="h-6 w-px bg-slate-200"></div>
           <h1 className="font-semibold text-slate-900 hidden sm:block">Untitled Resume</h1>
         </div>
         
         <div className="flex items-center gap-2 text-sm text-slate-500">
           <span className="hidden md:inline">Changes saved automatically</span>
         </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel: Form */}
        <div className="w-full lg:w-1/2 h-full border-r border-slate-200 bg-slate-50">
           <ResumeForm form={form} />
        </div>

        {/* Right Panel: Preview */}
        <div className="hidden lg:block lg:w-1/2 h-full bg-slate-900">
           <ResumePreview 
             data={formData} 
             templateId={templateId} 
             onTemplateChange={setTemplateId} 
           />
        </div>
      </main>
    </div>
  );
}
