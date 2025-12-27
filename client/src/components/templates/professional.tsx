import { ResumeData, CustomSection, getOrderedSections } from "@/lib/schema";
import { ExternalLink } from "lucide-react";

interface Props {
  data: ResumeData;
  color: string;
  font: "sans" | "serif" | "mono";
}

export function ProfessionalTemplate({ data, color, font }: Props) {
  const fontClass = font === "serif" ? "font-serif" : font === "mono" ? "font-mono" : "font-sans";
  const orderedSections = getOrderedSections(data);
  const visibleSections = orderedSections.filter(s => s.enabled);

  const renderSection = (sectionKey: string, sectionTitle: string, sectionType: string) => {
    if (sectionKey === "experience") {
      if (!data.experience || data.experience.length === 0) return null;
      return (
        <div key={sectionKey} className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color }}>Experience</h2>
          {data.experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-start mb-1 gap-2 flex-wrap">
                <div>
                  <h3 className="font-bold text-gray-900">{exp.role}</h3>
                  <p className="text-gray-600">{exp.company}</p>
                </div>
                <span className="text-gray-500 text-xs whitespace-nowrap">{exp.date}</span>
              </div>
              {exp.description && (
                <p className="text-gray-600 mt-1 whitespace-pre-line" style={{ wordSpacing: "0.05em" }}>{exp.description}</p>
              )}
            </div>
          ))}
        </div>
      );
    }

    if (sectionKey === "education") {
      if (!data.education || data.education.length === 0) return null;
      return (
        <div key={sectionKey} className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color }}>Education</h2>
          {data.education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between items-start gap-2 flex-wrap">
                <div>
                  <h3 className="font-bold text-gray-900" style={{ wordSpacing: "0.05em" }}>{edu.degree}</h3>
                  <p className="text-gray-600" style={{ wordSpacing: "0.05em" }}>{edu.school}</p>
                </div>
                <span className="text-gray-500 text-xs whitespace-nowrap">{edu.date}</span>
              </div>
              {edu.description && (
                <p className="text-gray-600 mt-1 text-xs" style={{ wordSpacing: "0.05em" }}>{edu.description}</p>
              )}
            </div>
          ))}
        </div>
      );
    }

    if (sectionKey === "skills") {
      if (!data.skills || data.skills.length === 0) return null;
      return (
        <div key={sectionKey} className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color }}>Skills</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill) => (
              <span key={skill.id} className="px-2 py-1 rounded text-xs" style={{ backgroundColor: `${color}15`, color, wordSpacing: "0.05em" }}>
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
      <div key={sectionKey} className="mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color }}>{customSection.title}</h2>

        {customSection.type === "bullets" && (
          <ul className="space-y-1 text-gray-600">
            {customSection.items.map((item: { id: string; text?: string }) => (
              <li key={item.id} className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full mt-2 shrink-0" style={{ backgroundColor: color }}></span>
                <span style={{ wordSpacing: "0.05em" }}>{item.text}</span>
              </li>
            ))}
          </ul>
        )}

        {customSection.type === "skills" && (
          <div className="flex flex-wrap gap-2">
            {customSection.items.map((item: { id: string; name?: string }) => (
              <span key={item.id} className="px-2 py-1 rounded text-xs" style={{ backgroundColor: `${color}15`, color, wordSpacing: "0.05em" }}>
                {item.name}
              </span>
            ))}
          </div>
        )}

        {customSection.type === "projects" && (
          <div className="space-y-3">
            {customSection.items.map((item: { id: string; title?: string; description?: string; link?: string; date?: string }) => (
              <div key={item.id}>
                <div className="flex justify-between items-start mb-1 gap-2 flex-wrap">
                  <h3 className="font-bold text-gray-900">{item.title}</h3>
                  {item.date && <span className="text-gray-500 text-xs whitespace-nowrap">{item.date}</span>}
                </div>
                <p className="text-gray-600" style={{ wordSpacing: "0.05em" }}>{item.description}</p>
                {item.link && (
                  <a href={item.link} className="text-xs flex items-center gap-1 mt-1" style={{ color }}>
                    <ExternalLink className="w-3 h-3" /> {item.link}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {customSection.type === "text" && (
          <div className="space-y-2 text-gray-600">
            {customSection.items.map((item: { id: string; content?: string }) => (
              <p key={item.id} className="leading-relaxed" style={{ wordSpacing: "0.05em" }}>{item.content}</p>
            ))}
          </div>
        )}

        {customSection.type === "experience" && (
          <div className="space-y-3">
            {customSection.items.map((item: { id: string; company?: string; role?: string; date?: string; description?: string }) => (
              <div key={item.id}>
                <div className="flex justify-between items-start mb-1 gap-2 flex-wrap">
                  <div>
                    <h3 className="font-bold text-gray-900">{item.role}</h3>
                    <p className="text-gray-600">{item.company}</p>
                  </div>
                  <span className="text-gray-500 text-xs whitespace-nowrap">{item.date}</span>
                </div>
                <p className="text-gray-600" style={{ wordSpacing: "0.05em" }}>{item.description}</p>
              </div>
            ))}
          </div>
        )}

        {customSection.type === "education" && (
          <div className="space-y-3">
            {customSection.items.map((item: { id: string; school?: string; degree?: string; date?: string; description?: string }) => (
              <div key={item.id}>
                <div className="flex justify-between items-start gap-2 flex-wrap">
                  <div>
                    <h3 className="font-bold text-gray-900" style={{ wordSpacing: "0.05em" }}>{item.degree}</h3>
                    <p className="text-gray-600" style={{ wordSpacing: "0.05em" }}>{item.school}</p>
                  </div>
                  <span className="text-gray-500 text-xs whitespace-nowrap">{item.date}</span>
                </div>
                {item.description && <p className="text-gray-600 mt-1 text-xs" style={{ wordSpacing: "0.05em" }}>{item.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`w-full h-full bg-white p-8 ${fontClass}`} style={{ fontSize: "11px" }}>
      <div className="border-b-4 pb-4 mb-6" style={{ borderColor: color }}>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">{data.personal.fullName || "Your Name"}</h1>
        <p className="text-lg font-medium mb-3" style={{ color }}>{data.personal.title || "Professional Title"}</p>
        <div className="flex flex-wrap gap-4 text-xs text-gray-600">
          {data.personal.email && <span>{data.personal.email}</span>}
          {data.personal.phone && <span>{data.personal.phone}</span>}
          {data.personal.location && <span style={{ wordSpacing: "0.05em" }}>{data.personal.location}</span>}
          {data.personal.website && <span>{data.personal.website}</span>}
        </div>
      </div>

      {data.personal.summary && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color }}>Professional Summary</h2>
          <p className="text-gray-700 leading-relaxed" style={{ wordSpacing: "0.05em" }}>{data.personal.summary}</p>
        </div>
      )}

      {visibleSections.map(section => renderSection(section.key, section.title, section.type))}
    </div>
  );
}
