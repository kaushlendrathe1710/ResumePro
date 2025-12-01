import React from "react";
import { ResumeData } from "@/lib/schema";

interface TemplateProps {
  data: ResumeData;
  color: string;
  font: string;
}

export const MinimalTemplate: React.FC<TemplateProps> = ({ data, color, font }) => {
  const fontClass = font === "serif" ? "font-serif" : font === "mono" ? "font-mono" : "font-sans";

  return (
    <div className={`w-full h-full bg-white text-black ${fontClass} min-h-[1100px] p-16`}>
      <header className="mb-16">
        <h1 className="text-5xl font-light tracking-tight mb-4" style={{ color: color }}>{data.personal.fullName}</h1>
        <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm font-medium uppercase tracking-widest opacity-60">
          <span>{data.personal.title}</span>
          <span>{data.personal.email}</span>
          <span>{data.personal.phone}</span>
          <span>{data.personal.location}</span>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="col-span-4 space-y-12">
          <section>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 opacity-40">Contact</h2>
            <div className="space-y-2 text-sm">
              <p>{data.personal.email}</p>
              <p>{data.personal.phone}</p>
              <p>{data.personal.location}</p>
              <p>{data.personal.website}</p>
            </div>
          </section>

          <section>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 opacity-40">Education</h2>
            <div className="space-y-6">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <div className="font-bold text-sm mb-1">{edu.school}</div>
                  <div className="text-sm opacity-80 mb-1">{edu.degree}</div>
                  <div className="text-xs opacity-50">{edu.date}</div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 opacity-40">Expertise</h2>
            <ul className="space-y-2 text-sm">
              {data.skills.map((skill) => (
                <li key={skill.id} className="border-b border-gray-100 pb-1 mb-1 last:border-0">
                  {skill.name}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Right Column */}
        <div className="col-span-8 space-y-12">
          {data.personal.summary && (
            <section>
               <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 opacity-40">Profile</h2>
               <p className="text-sm leading-7">
                 {data.personal.summary}
               </p>
            </section>
          )}

          <section>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 opacity-40">Experience</h2>
            <div className="space-y-10">
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="text-lg font-normal" style={{ color: color }}>{exp.role}</h3>
                    <span className="text-xs font-medium opacity-40">{exp.date}</span>
                  </div>
                  <div className="text-sm font-bold mb-4 opacity-60 uppercase tracking-wide">{exp.company}</div>
                  <p className="text-sm leading-6 opacity-90 whitespace-pre-line">
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
