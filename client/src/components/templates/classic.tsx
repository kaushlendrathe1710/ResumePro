import React from "react";
import { ResumeData } from "@/lib/schema";

interface TemplateProps {
  data: ResumeData;
}

export const ClassicTemplate: React.FC<TemplateProps> = ({ data }) => {
  return (
    <div className="w-full h-full bg-white text-slate-900 font-serif min-h-[1100px] p-12">
      <header className="text-center border-b-2 border-slate-900 pb-6 mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2 font-serif tracking-wide">{data.personal.fullName}</h1>
        <p className="text-lg text-slate-600 italic mb-4 font-sans">{data.personal.title}</p>
        
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
          <h2 className="text-lg font-bold uppercase tracking-widest border-b border-slate-300 mb-4 pb-1 font-sans">Professional Summary</h2>
          <p className="text-slate-700 leading-relaxed text-justify">
            {data.personal.summary}
          </p>
        </section>
      )}

      <section className="mb-8">
        <h2 className="text-lg font-bold uppercase tracking-widest border-b border-slate-300 mb-4 pb-1 font-sans">Experience</h2>
        <div className="space-y-6">
          {data.experience.map((exp) => (
            <div key={exp.id}>
              <div className="flex justify-between items-baseline mb-1 font-sans">
                <h3 className="text-base font-bold text-slate-900">{exp.company}</h3>
                <span className="text-sm text-slate-600 italic">{exp.date}</span>
              </div>
              <div className="text-slate-800 font-semibold mb-2 italic">{exp.role}</div>
              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                {exp.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold uppercase tracking-widest border-b border-slate-300 mb-4 pb-1 font-sans">Education</h2>
        <div className="space-y-4">
          {data.education.map((edu) => (
            <div key={edu.id}>
              <div className="flex justify-between items-baseline mb-1 font-sans">
                <h3 className="text-base font-bold text-slate-900">{edu.school}</h3>
                <span className="text-sm text-slate-600 italic">{edu.date}</span>
              </div>
              <div className="text-slate-800 font-semibold italic">{edu.degree}</div>
              {edu.description && <p className="text-slate-600 text-sm mt-1">{edu.description}</p>}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold uppercase tracking-widest border-b border-slate-300 mb-4 pb-1 font-sans">Skills</h2>
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
