import { ResumeData, CustomSection, getOrderedSections } from "@/lib/schema";
import { renderCustomSectionContent } from "@/lib/section-renderer";

interface Props {
  data: ResumeData;
  color: string;
  font: "sans" | "serif" | "mono";
}

export function ElegantTemplate({ data, color, font }: Props) {
  const fontClass = font === "serif" ? "font-serif" : font === "mono" ? "font-mono" : "font-sans";
  const orderedSections = getOrderedSections(data);
  const visibleSections = orderedSections.filter(s => s.enabled);

  const renderSection = (sectionKey: string) => {
    if (sectionKey === "experience") {
      if (!data.experience || data.experience.length === 0) return null;
      return (
        <div key={sectionKey} className="mb-8">
          <h2 className="text-center text-sm tracking-[0.3em] uppercase mb-4" style={{ color }}>Experience</h2>
          {data.experience.map((exp) => (
            <div key={exp.id} className="mb-5 text-center">
              <h3 className="font-semibold text-gray-800">{exp.role}</h3>
              <p className="text-gray-600 italic">{exp.company} - {exp.date}</p>
              {exp.description && <p className="text-gray-600 mt-2 max-w-lg mx-auto" style={{ wordSpacing: "0.05em" }}>{exp.description}</p>}
            </div>
          ))}
        </div>
      );
    }

    if (sectionKey === "education") {
      if (!data.education || data.education.length === 0) return null;
      return (
        <div key={sectionKey} className="mb-8">
          <h2 className="text-center text-sm tracking-[0.3em] uppercase mb-4" style={{ color }}>Education</h2>
          {data.education.map((edu) => (
            <div key={edu.id} className="mb-3 text-center">
              <h3 className="font-semibold text-gray-800" style={{ wordSpacing: "0.05em" }}>{edu.degree}</h3>
              <p className="text-gray-600 italic" style={{ wordSpacing: "0.05em" }}>{edu.school} - {edu.date}</p>
            </div>
          ))}
        </div>
      );
    }

    if (sectionKey === "skills") {
      if (!data.skills || data.skills.length === 0) return null;
      return (
        <div key={sectionKey} className="text-center mb-8">
          <h2 className="text-sm tracking-[0.3em] uppercase mb-3" style={{ color }}>Skills</h2>
          <p className="text-gray-600" style={{ wordSpacing: "0.05em" }}>
            {data.skills.map((skill) => skill.name).join(" - ")}
          </p>
        </div>
      );
    }

    const customSection = data.customSections?.find(s => s.key === sectionKey);
    if (!customSection || customSection.items.length === 0) return null;

    return (
      <div key={sectionKey} className="mb-8 text-center">
        <h2 className="text-sm tracking-[0.3em] uppercase mb-4" style={{ color }}>{customSection.title}</h2>
        <div className="max-w-lg mx-auto">
          {renderCustomSectionContent({ section: customSection, color, variant: "default" })}
        </div>
      </div>
    );
  };

  return (
    <div className={`w-full h-full bg-white p-10 ${fontClass}`} style={{ fontSize: "11px" }}>
      <div className="text-center mb-8 pb-6 border-b" style={{ borderColor: `${color}40` }}>
        <h1 className="text-4xl font-light tracking-wide text-gray-800 mb-2">{data.personal.fullName || "Your Name"}</h1>
        <p className="text-lg italic mb-4" style={{ color }}>{data.personal.title || "Professional Title"}</p>
        <div className="flex justify-center flex-wrap gap-6 text-xs text-gray-500">
          {data.personal.email && <span>{data.personal.email}</span>}
          {data.personal.phone && <span>{data.personal.phone}</span>}
          {data.personal.location && <span style={{ wordSpacing: "0.05em" }}>{data.personal.location}</span>}
        </div>
      </div>

      {data.personal.summary && (
        <div className="mb-8 text-center max-w-2xl mx-auto">
          <p className="text-gray-600 italic leading-relaxed" style={{ wordSpacing: "0.05em" }}>{data.personal.summary}</p>
        </div>
      )}

      {visibleSections.map(section => renderSection(section.key))}
    </div>
  );
}
