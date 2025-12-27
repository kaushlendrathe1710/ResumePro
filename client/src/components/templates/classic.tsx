import { ResumeData, CustomSection, getOrderedSections } from "@/lib/schema";
import { ExternalLink } from "lucide-react";

interface TemplateProps {
  data: ResumeData;
  color: string;
  font: string;
}

export const ClassicTemplate: React.FC<TemplateProps> = ({ data, color, font }) => {
  const fontClass = font === "serif" ? "font-serif" : font === "mono" ? "font-mono" : "font-sans";
  const orderedSections = getOrderedSections(data);
  const visibleSections = orderedSections.filter(s => s.enabled);

  const renderSection = (sectionKey: string, sectionTitle: string, sectionType: string) => {
    if (sectionKey === "experience") {
      if (!data.experience || data.experience.length === 0) return null;
      return (
        <section key={sectionKey} className="mb-8">
          <h2 className="text-lg font-bold uppercase tracking-widest border-b border-slate-300 mb-4 pb-1 font-sans" style={{ color }}>Experience</h2>
          <div className="space-y-6">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1 font-sans gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-slate-900">{exp.company}</h3>
                  <span className="text-sm text-slate-600 italic whitespace-nowrap">{exp.date}</span>
                </div>
                <div className="font-semibold mb-2 italic" style={{ color }}>{exp.role}</div>
                <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line" style={{ wordSpacing: "0.05em" }}>
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      );
    }

    if (sectionKey === "education") {
      if (!data.education || data.education.length === 0) return null;
      return (
        <section key={sectionKey} className="mb-8">
          <h2 className="text-lg font-bold uppercase tracking-widest border-b border-slate-300 mb-4 pb-1 font-sans" style={{ color }}>Education</h2>
          <div className="space-y-4">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline mb-1 font-sans gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-slate-900" style={{ wordSpacing: "0.05em" }}>{edu.school}</h3>
                  <span className="text-sm text-slate-600 italic whitespace-nowrap">{edu.date}</span>
                </div>
                <div className="font-semibold italic" style={{ color, wordSpacing: "0.05em" }}>{edu.degree}</div>
                {edu.description && <p className="text-slate-600 text-sm mt-1" style={{ wordSpacing: "0.05em" }}>{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      );
    }

    if (sectionKey === "skills") {
      if (!data.skills || data.skills.length === 0) return null;
      return (
        <section key={sectionKey} className="mb-8">
          <h2 className="text-lg font-bold uppercase tracking-widest border-b border-slate-300 mb-4 pb-1 font-sans" style={{ color }}>Skills</h2>
          <div className="flex flex-wrap gap-x-6 gap-y-2 font-sans text-sm">
            {data.skills.map((skill) => (
              <span key={skill.id} className="text-slate-800 relative pl-3 before:content-[''] before:absolute before:left-0 before:text-slate-400" style={{ wordSpacing: "0.05em" }}>
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      );
    }

    const customSection = data.customSections?.find(s => s.key === sectionKey);
    if (!customSection || customSection.items.length === 0) return null;

    return (
      <section key={sectionKey} className="mb-8">
        <h2 className="text-lg font-bold uppercase tracking-widest border-b border-slate-300 mb-4 pb-1 font-sans" style={{ color }}>{customSection.title}</h2>

        {customSection.type === "bullets" && (
          <ul className="space-y-2 text-slate-700 text-sm">
            {customSection.items.map((item: { id: string; text?: string }) => (
              <li key={item.id} className="relative pl-3 before:content-[''] before:absolute before:left-0 before:text-slate-400" style={{ wordSpacing: "0.05em" }}>
                {item.text}
              </li>
            ))}
          </ul>
        )}

        {customSection.type === "skills" && (
          <div className="flex flex-wrap gap-x-6 gap-y-2 font-sans text-sm">
            {customSection.items.map((item: { id: string; name?: string }) => (
              <span key={item.id} className="text-slate-800 relative pl-3 before:content-[''] before:absolute before:left-0 before:text-slate-400" style={{ wordSpacing: "0.05em" }}>
                {item.name}
              </span>
            ))}
          </div>
        )}

        {customSection.type === "projects" && (
          <div className="space-y-4">
            {customSection.items.map((item: { id: string; title?: string; description?: string; link?: string; date?: string }) => (
              <div key={item.id}>
                <div className="flex justify-between items-baseline mb-1 font-sans gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                  {item.date && <span className="text-sm text-slate-600 italic whitespace-nowrap">{item.date}</span>}
                </div>
                <p className="text-slate-700 text-sm" style={{ wordSpacing: "0.05em" }}>{item.description}</p>
                {item.link && (
                  <a href={item.link} className="text-sm flex items-center gap-1 mt-1" style={{ color }}>
                    <ExternalLink className="w-3 h-3" /> {item.link}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {customSection.type === "text" && (
          <div className="space-y-3 text-slate-700 text-sm">
            {customSection.items.map((item: { id: string; content?: string }) => (
              <p key={item.id} className="leading-relaxed" style={{ wordSpacing: "0.05em" }}>{item.content}</p>
            ))}
          </div>
        )}

        {customSection.type === "experience" && (
          <div className="space-y-4">
            {customSection.items.map((item: { id: string; company?: string; role?: string; date?: string; description?: string }) => (
              <div key={item.id}>
                <div className="flex justify-between items-baseline mb-1 font-sans gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-slate-900">{item.company}</h3>
                  <span className="text-sm text-slate-600 italic whitespace-nowrap">{item.date}</span>
                </div>
                <div className="font-semibold mb-2 italic" style={{ color }}>{item.role}</div>
                <p className="text-slate-700 text-sm" style={{ wordSpacing: "0.05em" }}>{item.description}</p>
              </div>
            ))}
          </div>
        )}

        {customSection.type === "education" && (
          <div className="space-y-4">
            {customSection.items.map((item: { id: string; school?: string; degree?: string; date?: string; description?: string }) => (
              <div key={item.id}>
                <div className="flex justify-between items-baseline mb-1 font-sans gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-slate-900" style={{ wordSpacing: "0.05em" }}>{item.school}</h3>
                  <span className="text-sm text-slate-600 italic whitespace-nowrap">{item.date}</span>
                </div>
                <div className="font-semibold italic" style={{ color, wordSpacing: "0.05em" }}>{item.degree}</div>
                {item.description && <p className="text-slate-600 text-sm mt-1" style={{ wordSpacing: "0.05em" }}>{item.description}</p>}
              </div>
            ))}
          </div>
        )}
      </section>
    );
  };

  return (
    <div className={`w-full h-full bg-white text-slate-900 ${fontClass} min-h-[1100px] p-12`}>
      <header className="text-center border-b-2 pb-6 mb-8" style={{ borderColor: color }}>
        <h1 className="text-4xl font-bold text-slate-900 mb-2 tracking-wide">{data.personal.fullName}</h1>
        <p className="text-lg italic mb-4 opacity-80" style={{ color }}>{data.personal.title}</p>
        
        <div className="flex justify-center gap-4 text-sm text-slate-600 font-sans flex-wrap">
          <span>{data.personal.email}</span>
          <span>|</span>
          <span>{data.personal.phone}</span>
          <span>|</span>
          <span style={{ wordSpacing: "0.05em" }}>{data.personal.location}</span>
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
          <h2 className="text-lg font-bold uppercase tracking-widest border-b border-slate-300 mb-4 pb-1 font-sans" style={{ color }}>Professional Summary</h2>
          <p className="text-slate-700 leading-relaxed text-justify" style={{ wordSpacing: "0.05em" }}>
            {data.personal.summary}
          </p>
        </section>
      )}

      {visibleSections.map(section => renderSection(section.key, section.title, section.type))}
    </div>
  );
};
