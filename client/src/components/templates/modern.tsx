import React from "react";
import { ResumeData } from "@/lib/schema";
import { MapPin, Mail, Phone, Globe } from "lucide-react";

interface TemplateProps {
  data: ResumeData;
  color: string;
  font: string;
}

export const ModernTemplate: React.FC<TemplateProps> = ({ data, color, font }) => {
  const fontClass = font === "serif" ? "font-serif" : font === "mono" ? "font-mono" : "font-sans";
  
  return (
    <div className={`w-full h-full bg-white text-slate-800 ${fontClass} min-h-[1100px] shadow-sm`}>
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-1/3 text-white p-8 flex flex-col gap-8 print:bg-slate-900 print:text-white" style={{ backgroundColor: '#0f172a' }}>
          <div className="space-y-2">
             {/* Avatar placeholder */}
             <div 
               className="w-24 h-24 rounded-full mb-6 flex items-center justify-center text-2xl font-bold text-white/80"
               style={{ backgroundColor: color }}
             >
                {data.personal.fullName.charAt(0)}
             </div>
             <h3 className="uppercase tracking-widest text-sm font-semibold text-slate-400 mb-4">Contact</h3>
             <div className="space-y-3 text-sm text-slate-300">
               <div className="flex items-center gap-3">
                 <Mail className="w-4 h-4" />
                 <span>{data.personal.email}</span>
               </div>
               <div className="flex items-center gap-3">
                 <Phone className="w-4 h-4" />
                 <span>{data.personal.phone}</span>
               </div>
               <div className="flex items-center gap-3">
                 <MapPin className="w-4 h-4" />
                 <span>{data.personal.location}</span>
               </div>
               {data.personal.website && (
                 <div className="flex items-center gap-3">
                   <Globe className="w-4 h-4" />
                   <span>{data.personal.website}</span>
                 </div>
               )}
             </div>
          </div>

          <div className="space-y-2">
            <h3 className="uppercase tracking-widest text-sm font-semibold text-slate-400 mb-4 border-b border-slate-700 pb-2">Education</h3>
            <div className="space-y-4">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <div className="font-bold text-white">{edu.school}</div>
                  <div className="text-sm text-slate-300">{edu.degree}</div>
                  <div className="text-xs text-slate-400 mt-1">{edu.date}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="uppercase tracking-widest text-sm font-semibold text-slate-400 mb-4 border-b border-slate-700 pb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill) => (
                <span key={skill.id} className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300 border border-slate-700">
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-2/3 p-10">
          <header className="mb-10 border-b border-slate-200 pb-8">
            <h1 className="text-4xl font-bold text-slate-900 uppercase tracking-tight mb-2">{data.personal.fullName}</h1>
            <p className="text-xl font-medium tracking-wide" style={{ color: color }}>{data.personal.title}</p>
            {data.personal.summary && (
               <p className="mt-6 text-slate-600 leading-relaxed text-sm">
                 {data.personal.summary}
               </p>
            )}
          </header>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-3">
              <span className="w-8 h-1 block" style={{ backgroundColor: color }}></span>
              Experience
            </h2>
            <div className="space-y-8">
              {data.experience.map((exp) => (
                <div key={exp.id} className="relative pl-4 border-l-2 border-slate-100">
                  <div 
                    className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full" 
                    style={{ backgroundColor: color }}
                  ></div>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-lg font-bold text-slate-800">{exp.role}</h3>
                    <span 
                      className="text-sm font-medium px-2 py-0.5 rounded bg-opacity-10"
                      style={{ color: color, backgroundColor: `${color}1a` }}
                    >
                      {exp.date}
                    </span>
                  </div>
                  <div className="text-base font-semibold text-slate-700 mb-2">{exp.company}</div>
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
