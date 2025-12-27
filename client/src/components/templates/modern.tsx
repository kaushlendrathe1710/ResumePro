import { ResumeData, CustomSection, getOrderedSections } from "@/lib/schema";
import { MapPin, Mail, Phone, Globe, ExternalLink } from "lucide-react";

interface TemplateProps {
  data: ResumeData;
  color: string;
  font: string;
}

export const ModernTemplate: React.FC<TemplateProps> = ({ data, color, font }) => {
  const fontClass = font === "serif" ? "font-serif" : font === "mono" ? "font-mono" : "font-sans";
  const orderedSections = getOrderedSections(data);
  const visibleSections = orderedSections.filter(s => s.enabled);
  
  const sidebarSectionTypes = ["education", "skills"];
  const sidebarSections = visibleSections.filter(s => 
    sidebarSectionTypes.includes(s.key) || 
    (s.type === "skills" || s.type === "bullets")
  );
  const mainSections = visibleSections.filter(s => 
    !sidebarSectionTypes.includes(s.key) && 
    s.type !== "skills" && s.type !== "bullets"
  );

  const renderSidebarSection = (sectionKey: string, sectionTitle: string, sectionType: string) => {
    if (sectionKey === "education") {
      if (!data.education || data.education.length === 0) return null;
      return (
        <div key={sectionKey} className="space-y-2">
          <h3 className="uppercase tracking-widest text-sm font-semibold text-slate-400 mb-4 border-b border-slate-700 pb-2">Education</h3>
          <div className="space-y-4">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="font-bold text-white" style={{ wordSpacing: "0.05em" }}>{edu.school}</div>
                <div className="text-sm text-slate-300" style={{ wordSpacing: "0.05em" }}>{edu.degree}</div>
                <div className="text-xs text-slate-400 mt-1">{edu.date}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (sectionKey === "skills") {
      if (!data.skills || data.skills.length === 0) return null;
      return (
        <div key={sectionKey} className="space-y-2">
          <h3 className="uppercase tracking-widest text-sm font-semibold text-slate-400 mb-4 border-b border-slate-700 pb-2">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill) => (
              <span key={skill.id} className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300 border border-slate-700" style={{ wordSpacing: "0.05em" }}>
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      );
    }

    const customSection = data.customSections?.find(s => s.key === sectionKey);
    if (!customSection || customSection.items.length === 0) return null;

    return (
      <div key={sectionKey} className="space-y-2">
        <h3 className="uppercase tracking-widest text-sm font-semibold text-slate-400 mb-4 border-b border-slate-700 pb-2">{customSection.title}</h3>
        
        {customSection.type === "skills" && (
          <div className="flex flex-wrap gap-2">
            {customSection.items.map((item: { id: string; name?: string }) => (
              <span key={item.id} className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300 border border-slate-700" style={{ wordSpacing: "0.05em" }}>
                {item.name}
              </span>
            ))}
          </div>
        )}

        {customSection.type === "bullets" && (
          <ul className="space-y-1 text-sm text-slate-300">
            {customSection.items.map((item: { id: string; text?: string }) => (
              <li key={item.id} className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-slate-500 mt-2 shrink-0"></span>
                <span style={{ wordSpacing: "0.05em" }}>{item.text}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  const renderMainSection = (sectionKey: string, sectionTitle: string, sectionType: string) => {
    if (sectionKey === "experience") {
      if (!data.experience || data.experience.length === 0) return null;
      return (
        <section key={sectionKey} className="mb-8">
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
                <div className="flex justify-between items-baseline mb-1 gap-2 flex-wrap">
                  <h3 className="text-lg font-bold text-slate-800">{exp.role}</h3>
                  <span 
                    className="text-sm font-medium px-2 py-0.5 rounded bg-opacity-10 whitespace-nowrap"
                    style={{ color, backgroundColor: `${color}1a` }}
                  >
                    {exp.date}
                  </span>
                </div>
                <div className="text-base font-semibold text-slate-700 mb-2">{exp.company}</div>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line" style={{ wordSpacing: "0.05em" }}>
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      );
    }

    const customSection = data.customSections?.find(s => s.key === sectionKey);
    if (!customSection || customSection.items.length === 0) return null;

    return (
      <section key={sectionKey} className="mb-8">
        <h2 className="text-xl font-bold text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-3">
          <span className="w-8 h-1 block" style={{ backgroundColor: color }}></span>
          {customSection.title}
        </h2>

        {customSection.type === "projects" && (
          <div className="space-y-6">
            {customSection.items.map((item: { id: string; title?: string; description?: string; link?: string; date?: string }) => (
              <div key={item.id} className="relative pl-4 border-l-2 border-slate-100">
                <div 
                  className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full" 
                  style={{ backgroundColor: color }}
                ></div>
                <div className="flex justify-between items-baseline mb-1 gap-2 flex-wrap">
                  <h3 className="text-lg font-bold text-slate-800">{item.title}</h3>
                  {item.date && (
                    <span className="text-sm font-medium px-2 py-0.5 rounded whitespace-nowrap" style={{ color, backgroundColor: `${color}1a` }}>
                      {item.date}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed" style={{ wordSpacing: "0.05em" }}>{item.description}</p>
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
          <div className="space-y-3 text-slate-600 text-sm">
            {customSection.items.map((item: { id: string; content?: string }) => (
              <p key={item.id} className="leading-relaxed" style={{ wordSpacing: "0.05em" }}>{item.content}</p>
            ))}
          </div>
        )}

        {customSection.type === "experience" && (
          <div className="space-y-6">
            {customSection.items.map((item: { id: string; company?: string; role?: string; date?: string; description?: string }) => (
              <div key={item.id} className="relative pl-4 border-l-2 border-slate-100">
                <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }}></div>
                <div className="flex justify-between items-baseline mb-1 gap-2 flex-wrap">
                  <h3 className="text-lg font-bold text-slate-800">{item.role}</h3>
                  <span className="text-sm font-medium px-2 py-0.5 rounded whitespace-nowrap" style={{ color, backgroundColor: `${color}1a` }}>
                    {item.date}
                  </span>
                </div>
                <div className="text-base font-semibold text-slate-700 mb-2">{item.company}</div>
                <p className="text-sm text-slate-600 leading-relaxed" style={{ wordSpacing: "0.05em" }}>{item.description}</p>
              </div>
            ))}
          </div>
        )}

        {customSection.type === "education" && (
          <div className="space-y-4">
            {customSection.items.map((item: { id: string; school?: string; degree?: string; date?: string; description?: string }) => (
              <div key={item.id} className="relative pl-4 border-l-2 border-slate-100">
                <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }}></div>
                <h3 className="text-lg font-bold text-slate-800">{item.school}</h3>
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
    <div className={`w-full h-full bg-white text-slate-800 ${fontClass} min-h-[1100px] shadow-sm`}>
      <div className="flex h-full">
        <div className="w-1/3 text-white p-8 flex flex-col gap-8 print:bg-slate-900 print:text-white" style={{ backgroundColor: '#0f172a' }}>
          <div className="space-y-2">
            <div 
              className="w-24 h-24 rounded-full mb-6 flex items-center justify-center text-2xl font-bold text-white/80"
              style={{ backgroundColor: color }}
            >
              {data.personal.fullName.charAt(0)}
            </div>
            <h3 className="uppercase tracking-widest text-sm font-semibold text-slate-400 mb-4">Contact</h3>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 shrink-0" />
                <span style={{ wordSpacing: "0.05em" }}>{data.personal.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 shrink-0" />
                <span>{data.personal.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 shrink-0" />
                <span style={{ wordSpacing: "0.05em" }}>{data.personal.location}</span>
              </div>
              {data.personal.website && (
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 shrink-0" />
                  <span>{data.personal.website}</span>
                </div>
              )}
            </div>
          </div>

          {sidebarSections.map(section => renderSidebarSection(section.key, section.title, section.type))}
        </div>

        <div className="w-2/3 p-10">
          <header className="mb-10 border-b border-slate-200 pb-8">
            <h1 className="text-4xl font-bold text-slate-900 uppercase tracking-tight mb-2">{data.personal.fullName}</h1>
            <p className="text-xl font-medium tracking-wide" style={{ color }}>{data.personal.title}</p>
            {data.personal.summary && (
              <p className="mt-6 text-slate-600 leading-relaxed text-sm" style={{ wordSpacing: "0.05em" }}>
                {data.personal.summary}
              </p>
            )}
          </header>

          {mainSections.map(section => renderMainSection(section.key, section.title, section.type))}
        </div>
      </div>
    </div>
  );
};
