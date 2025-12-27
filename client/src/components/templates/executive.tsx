import { ResumeData, CustomSection, getOrderedSections } from "@/lib/schema";
import { Mail, Phone, MapPin, Globe, ExternalLink } from "lucide-react";

interface TemplateProps {
  data: ResumeData;
  color: string;
  font: string;
}

export const ExecutiveTemplate: React.FC<TemplateProps> = ({ data, color, font }) => {
  const fontClass = font === "serif" ? "font-serif" : font === "mono" ? "font-mono" : "font-sans";
  const orderedSections = getOrderedSections(data);
  const visibleSections = orderedSections.filter(s => s.enabled);

  const renderSection = (sectionKey: string, sectionTitle: string, sectionType: string) => {
    if (sectionKey === "experience") {
      if (!data.experience || data.experience.length === 0) return null;
      return (
        <section key={sectionKey}>
          <h2 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-slate-200 pb-2" style={{ color }}>
            <span className="w-4 h-4 bg-current block opacity-20"></span>
            Professional Experience
          </h2>
          <div className="space-y-6">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-center mb-2 gap-2 flex-wrap">
                  <h3 className="text-lg font-bold text-slate-900">{exp.role}</h3>
                  <span className="text-sm font-bold bg-slate-100 px-3 py-1 rounded whitespace-nowrap" style={{ color }}>{exp.date}</span>
                </div>
                <div className="text-base font-semibold mb-3 text-slate-500 uppercase tracking-wide">{exp.company}</div>
                <p className="text-slate-700 leading-relaxed whitespace-pre-line" style={{ wordSpacing: "0.05em" }}>
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
        <section key={sectionKey}>
          <h2 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-slate-200 pb-2" style={{ color }}>
            <span className="w-4 h-4 bg-current block opacity-20"></span>
            Education
          </h2>
          <div className="space-y-4">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <h3 className="text-base font-bold text-slate-900">{edu.school}</h3>
                <div className="text-sm text-slate-600 mb-1">{edu.degree}</div>
                <div className="text-xs font-medium text-slate-400">{edu.date}</div>
                {edu.description && (
                  <p className="text-sm text-slate-600 mt-1" style={{ wordSpacing: "0.05em" }}>{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      );
    }

    if (sectionKey === "skills") {
      if (!data.skills || data.skills.length === 0) return null;
      return (
        <section key={sectionKey}>
          <h2 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-slate-200 pb-2" style={{ color }}>
            <span className="w-4 h-4 bg-current block opacity-20"></span>
            Core Competencies
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill) => (
              <span 
                key={skill.id} 
                className="px-3 py-1.5 border text-sm font-medium"
                style={{ borderColor: color, color, wordSpacing: "0.05em" }}
              >
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
      <section key={sectionKey}>
        <h2 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-slate-200 pb-2" style={{ color }}>
          <span className="w-4 h-4 bg-current block opacity-20"></span>
          {customSection.title}
        </h2>
        
        {customSection.type === "bullets" && (
          <ul className="space-y-2 list-disc list-inside text-slate-700">
            {customSection.items.map((item: { id: string; text?: string }) => (
              <li key={item.id} style={{ wordSpacing: "0.05em" }}>{item.text}</li>
            ))}
          </ul>
        )}

        {customSection.type === "skills" && (
          <div className="flex flex-wrap gap-2">
            {customSection.items.map((item: { id: string; name?: string }) => (
              <span 
                key={item.id}
                className="px-3 py-1.5 border text-sm font-medium"
                style={{ borderColor: color, color, wordSpacing: "0.05em" }}
              >
                {item.name}
              </span>
            ))}
          </div>
        )}

        {customSection.type === "projects" && (
          <div className="space-y-4">
            {customSection.items.map((item: { id: string; title?: string; description?: string; link?: string; date?: string }) => (
              <div key={item.id}>
                <div className="flex justify-between items-center mb-1 gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                  {item.date && <span className="text-sm text-slate-500">{item.date}</span>}
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
          <div className="space-y-3 text-slate-700">
            {customSection.items.map((item: { id: string; content?: string }) => (
              <p key={item.id} className="leading-relaxed" style={{ wordSpacing: "0.05em" }}>{item.content}</p>
            ))}
          </div>
        )}

        {customSection.type === "experience" && (
          <div className="space-y-4">
            {customSection.items.map((item: { id: string; company?: string; role?: string; date?: string; description?: string }) => (
              <div key={item.id}>
                <div className="flex justify-between items-center mb-1 gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-slate-900">{item.role}</h3>
                  <span className="text-sm text-slate-500">{item.date}</span>
                </div>
                <div className="text-sm font-semibold mb-2 text-slate-500">{item.company}</div>
                <p className="text-slate-700 text-sm" style={{ wordSpacing: "0.05em" }}>{item.description}</p>
              </div>
            ))}
          </div>
        )}

        {customSection.type === "education" && (
          <div className="space-y-3">
            {customSection.items.map((item: { id: string; school?: string; degree?: string; date?: string; description?: string }) => (
              <div key={item.id}>
                <h3 className="text-base font-bold text-slate-900">{item.school}</h3>
                <div className="text-sm text-slate-600">{item.degree}</div>
                <div className="text-xs text-slate-400">{item.date}</div>
                {item.description && <p className="text-sm text-slate-600 mt-1" style={{ wordSpacing: "0.05em" }}>{item.description}</p>}
              </div>
            ))}
          </div>
        )}
      </section>
    );
  };

  return (
    <div className={`w-full h-full bg-white text-slate-900 ${fontClass} min-h-[1100px] p-12`}>
      <header className="border-b-4 pb-6 mb-8" style={{ borderColor: color }}>
        <div className="flex justify-between items-end gap-4 flex-wrap">
          <div>
            <h1 className="text-5xl font-bold tracking-tight uppercase" style={{ color }}>{data.personal.fullName}</h1>
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

      <div className="space-y-8">
        {data.personal.summary && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color }}>
              <span className="w-4 h-4 bg-current block opacity-20"></span>
              Executive Summary
            </h2>
            <p className="text-slate-700 leading-relaxed text-justify border-l-2 pl-4 border-slate-100" style={{ wordSpacing: "0.05em" }}>
              {data.personal.summary}
            </p>
          </section>
        )}

        {visibleSections.map(section => renderSection(section.key, section.title, section.type))}
      </div>
    </div>
  );
};
