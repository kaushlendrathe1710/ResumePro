import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resumeSchema, defaultResumeData, ResumeData } from "@/lib/schema";
import { ResumeForm } from "@/components/resume-form";
import { ResumePreview } from "@/components/resume-preview";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Builder() {
  const [template, setTemplate] = useState("modern");
  
  const form = useForm<ResumeData>({
    resolver: zodResolver(resumeSchema),
    defaultValues: defaultResumeData,
    mode: "onChange"
  });

  // We watch the form data to pass it to the preview in real-time
  const formData = form.watch();

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <header className="h-14 border-b px-6 flex items-center justify-between bg-white z-10 shrink-0">
         <div className="flex items-center gap-4">
           <Link href="/">
             <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900">
               <ArrowLeft className="w-4 h-4 mr-2" /> Back
             </Button>
           </Link>
           <div className="h-6 w-px bg-slate-200"></div>
           <h1 className="font-semibold text-slate-900">Untitled Resume</h1>
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

        {/* Right Panel: Preview (Hidden on mobile, toggleable in real app but side-by-side for desktop) */}
        <div className="hidden lg:block lg:w-1/2 h-full bg-slate-900">
           <ResumePreview 
             data={formData} 
             template={template} 
             onTemplateChange={setTemplate} 
           />
        </div>
      </main>
    </div>
  );
}
