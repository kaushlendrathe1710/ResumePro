import React from "react";
import { ResumeData } from "@/lib/schema";
import { Mail, Phone, MapPin, Globe } from "lucide-react";

interface TemplateProps {
  data: ResumeData;
  color: string;
  font: string;
}

export const ExecutiveTemplate: React.FC<TemplateProps> = ({ data, color, font }) => {
  const fontClass = font === "serif" ? "font-serif" : font === "mono" ? "font-mono" : "font-sans";

  return (
    <div className={`w-full h-full bg-white text-slate-900 ${fontClass} min-h-[1100px] p-12`}>
      <header className="border-b-4 pb-6 mb-8" style={{ borderColor: color }}>
        <div className="flex justify-between items-end">
          <div>
             <h1 className="text-5xl font-bold tracking-tight uppercase" style={{ color: color }}>{data.personal.fullName}</h1>
             <p className="text-xl font-medium mt-2 text-slate-600 tracking-widest uppercase">{data.personal.title}</p>
          </div>
          <div className="text-right text-sm text-slate-600 space-y-1">
            <div className="flex items-center justify-end gap-2">
              <span>{data.personal.email}</span>
              <Mail className="w-3 h-3" />
            </div>
            <div className="flex items-center justify-end gap-2">
              <span>{data.personal.phone}</span>
              <Phone className="w-3 h-3" />
            </div>
            <div className="flex items-center justify-end gap-2">
              <span>{data.personal.location}</span>
              <MapPin className="w-3 h-3" />
            </div>
            {data.personal.website && (
              <div className="flex items-center justify-end gap-2">
                <span>{data.personal.website}</span>
                <Globe className="w-3 h-3" />
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8">
        {data.personal.summary && (
          <section>
             <h2 className="text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: color }}>
               <span className="w-4 h-4 bg-current block opacity-20"></span>
               Executive Summary
             </h2>
             <p className="text-slate-700 leading-relaxed text-justify border-l-2 pl-4 border-slate-100">
               {data.personal.summary}
             </p>
          </section>
        )}

        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-slate-200 pb-2" style={{ color: color }}>
             <span className="w-4 h-4 bg-current block opacity-20"></span>
             Professional Experience
          </h2>
          <div className="space-y-8">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold text-slate-900">{exp.role}</h3>
                  <span className="text-sm font-bold bg-slate-100 px-3 py-1 rounded" style={{ color: color }}>{exp.date}</span>
                </div>
                <div className="text-base font-semibold mb-3 text-slate-500 uppercase tracking-wide">{exp.company}</div>
                <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-2 gap-12">
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-slate-200 pb-2" style={{ color: color }}>
              <span className="w-4 h-4 bg-current block opacity-20"></span>
              Education
            </h2>
            <div className="space-y-6">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <h3 className="text-base font-bold text-slate-900">{edu.school}</h3>
                  <div className="text-sm text-slate-600 mb-1">{edu.degree}</div>
                  <div className="text-xs font-medium text-slate-400">{edu.date}</div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-slate-200 pb-2" style={{ color: color }}>
              <span className="w-4 h-4 bg-current block opacity-20"></span>
              Core Competencies
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill) => (
                <span 
                  key={skill.id} 
                  className="px-3 py-1.5 border text-sm font-medium"
                  style={{ borderColor: color, color: color }}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
