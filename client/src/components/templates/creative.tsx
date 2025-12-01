import React from "react";
import { ResumeData } from "@/lib/schema";

interface TemplateProps {
  data: ResumeData;
  color: string;
  font: string;
}

export const CreativeTemplate: React.FC<TemplateProps> = ({ data, color, font }) => {
  const fontClass = font === "serif" ? "font-serif" : font === "mono" ? "font-mono" : "font-sans";

  return (
    <div className={`w-full h-full bg-white text-slate-900 ${fontClass} min-h-[1100px] overflow-hidden relative`}>
      {/* Decorative Background Elements */}
      <div 
        className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full opacity-10 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ backgroundColor: color }}
      ></div>
      <div 
        className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-5 translate-x-1/3 translate-y-1/3 pointer-events-none"
        style={{ backgroundColor: color }}
      ></div>

      <div className="relative z-10 p-12 h-full flex flex-col">
        <header className="mb-12">
          <h1 className="text-6xl font-black tracking-tighter mb-2" style={{ color: color }}>
            {data.personal.fullName.split(' ')[0]}
            <br />
            <span className="text-slate-900">{data.personal.fullName.split(' ').slice(1).join(' ')}</span>
          </h1>
          <div className="flex items-center gap-4 mt-6">
             <span className="text-xl font-medium px-4 py-1 bg-slate-900 text-white inline-block transform -rotate-1">
               {data.personal.title}
             </span>
             <div className="h-px bg-slate-200 flex-1"></div>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-12 flex-1">
          <div className="col-span-4 space-y-10">
             <section className="p-6 rounded-2xl bg-slate-50/80 backdrop-blur-sm border border-slate-100">
               <h3 className="font-bold mb-4 uppercase tracking-wider text-xs text-slate-400">Contact</h3>
               <div className="space-y-3 text-sm font-medium text-slate-700">
                 <div className="break-words">{data.personal.email}</div>
                 <div>{data.personal.phone}</div>
                 <div>{data.personal.location}</div>
                 {data.personal.website && <div className="break-words">{data.personal.website}</div>}
               </div>
             </section>

             <section>
               <h3 className="font-bold mb-4 uppercase tracking-wider text-xs text-slate-400">Skills</h3>
               <div className="flex flex-wrap gap-2">
                 {data.skills.map((skill) => (
                   <span 
                     key={skill.id} 
                     className="px-3 py-1 rounded-full text-sm font-bold text-white"
                     style={{ backgroundColor: color }}
                   >
                     {skill.name}
                   </span>
                 ))}
               </div>
             </section>

             <section>
               <h3 className="font-bold mb-4 uppercase tracking-wider text-xs text-slate-400">Education</h3>
               <div className="space-y-6">
                 {data.education.map((edu) => (
                   <div key={edu.id}>
                     <div className="font-bold text-slate-900">{edu.school}</div>
                     <div className="text-sm text-slate-600">{edu.degree}</div>
                     <div className="text-xs text-slate-400 mt-1">{edu.date}</div>
                   </div>
                 ))}
               </div>
             </section>
          </div>

          <div className="col-span-8 space-y-10">
            {data.personal.summary && (
              <section>
                <p className="text-lg leading-relaxed font-medium text-slate-700">
                  {data.personal.summary}
                </p>
              </section>
            )}

            <section>
              <h2 className="text-2xl font-bold mb-8 flex items-baseline gap-3">
                Experience 
                <span className="h-1 flex-1 bg-slate-100 rounded-full"></span>
              </h2>
              <div className="space-y-10">
                {data.experience.map((exp) => (
                  <div key={exp.id} className="group">
                    <div className="flex justify-between items-start mb-2">
                       <h3 className="text-xl font-bold text-slate-900 group-hover:text-[var(--theme-color)] transition-colors" style={{ ['--theme-color' as any]: color }}>
                         {exp.role}
                       </h3>
                       <span className="text-sm font-mono text-slate-400">{exp.date}</span>
                    </div>
                    <div className="text-md font-semibold text-slate-500 mb-3">{exp.company}</div>
                    <p className="text-slate-600 leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
