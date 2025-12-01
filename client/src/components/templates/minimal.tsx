import React from "react";
import { ResumeData } from "@/lib/schema";

interface TemplateProps {
  data: ResumeData;
}

export const MinimalTemplate: React.FC<TemplateProps> = ({ data }) => {
  return (
    <div className="w-full h-full bg-white text-black font-sans min-h-[1100px] p-16">
      <header className="mb-16">
        <h1 className="text-5xl font-light tracking-tight mb-4 text-black">{data.personal.fullName}</h1>
        <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm font-medium text-gray-500 uppercase tracking-widest">
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
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 text-gray-400">Contact</h2>
            <div className="space-y-2 text-sm">
              <p>{data.personal.email}</p>
              <p>{data.personal.phone}</p>
              <p>{data.personal.location}</p>
              <p>{data.personal.website}</p>
            </div>
          </section>

          <section>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 text-gray-400">Education</h2>
            <div className="space-y-6">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <div className="font-bold text-sm mb-1">{edu.school}</div>
                  <div className="text-sm text-gray-600 mb-1">{edu.degree}</div>
                  <div className="text-xs text-gray-400">{edu.date}</div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 text-gray-400">Expertise</h2>
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
               <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 text-gray-400">Profile</h2>
               <p className="text-sm leading-7 text-gray-800">
                 {data.personal.summary}
               </p>
            </section>
          )}

          <section>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 text-gray-400">Experience</h2>
            <div className="space-y-10">
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="text-lg font-normal">{exp.role}</h3>
                    <span className="text-xs font-medium text-gray-400">{exp.date}</span>
                  </div>
                  <div className="text-sm font-bold mb-4 text-gray-600 uppercase tracking-wide">{exp.company}</div>
                  <p className="text-sm leading-6 text-gray-700 whitespace-pre-line">
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
