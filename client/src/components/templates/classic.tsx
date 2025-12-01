import React from "react";
import { ResumeData } from "@/lib/schema";

interface TemplateProps {
  data: ResumeData;
  color: string;
  font: string;
}

export const ClassicTemplate: React.FC<TemplateProps> = ({ data, color, font }) => {
  const fontClass = font === "serif" ? "font-serif" : font === "mono" ? "font-mono" : "font-sans";

  return (
    <div className={`w-full h-full bg-white text-slate-900 ${fontClass} min-h-[1100px] p-12`}>
      <header className="text-center border-b-2 pb-6 mb-8" style={{ borderColor: color }}>
        <h1 className="text-4xl font-bold text-slate-900 mb-2 tracking-wide">{data.personal.fullName}</h1>
        <p className="text-lg italic mb-4 opacity-80" style={{ color: color }}>{data.personal.title}</p>
        
        <div className="flex justify-center gap-4 text-sm text-slate-600 font-sans">
          <span>{data.personal.email}</span>
          <span>|</span>
          <span>{data.personal.phone}</span>
          <span>|</span>
          <span>{data.personal.location}</span>
          {data.personal.website && (
            <>
              <span>|</span>
              <span>{data.personal.website}</span>
            </>
          )}
        </div>
      </header>

      {data.personal.summary && (
        <section className="mb-8">
          <h2 className="text-lg font-bold uppercase tracking-widest border-b border-slate-300 mb-4 pb-1 font-sans" style={{ color: color }}>Professional Summary</h2>
          <p className="text-slate-700 leading-relaxed text-justify">
            {data.personal.summary}
          </p>
        </section>
      )}

      <section className="mb-8">
        <h2 className="text-lg font-bold uppercase tracking-widest border-b border-slate-300 mb-4 pb-1 font-sans" style={{ color: color }}>Experience</h2>
        <div className="space-y-6">
          {data.experience.map((exp) => (
            <div key={exp.id}>
              <div className="flex justify-between items-baseline mb-1 font-sans">
                <h3 className="text-base font-bold text-slate-900">{exp.company}</h3>
                <span className="text-sm text-slate-600 italic">{exp.date}</span>
              </div>
              <div className="font-semibold mb-2 italic" style={{ color: color }}>{exp.role}</div>
              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                {exp.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold uppercase tracking-widest border-b border-slate-300 mb-4 pb-1 font-sans" style={{ color: color }}>Education</h2>
        <div className="space-y-4">
          {data.education.map((edu) => (
            <div key={edu.id}>
              <div className="flex justify-between items-baseline mb-1 font-sans">
                <h3 className="text-base font-bold text-slate-900">{edu.school}</h3>
                <span className="text-sm text-slate-600 italic">{edu.date}</span>
              </div>
              <div className="font-semibold italic" style={{ color: color }}>{edu.degree}</div>
              {edu.description && <p className="text-slate-600 text-sm mt-1">{edu.description}</p>}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold uppercase tracking-widest border-b border-slate-300 mb-4 pb-1 font-sans" style={{ color: color }}>Skills</h2>
        <div className="flex flex-wrap gap-x-6 gap-y-2 font-sans text-sm">
          {data.skills.map((skill) => (
            <span key={skill.id} className="text-slate-800 relative pl-3 before:content-['•'] before:absolute before:left-0 before:text-slate-400">
              {skill.name}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
};
