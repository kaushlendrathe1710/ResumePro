import { ResumeData, CustomSection, getOrderedSections } from "@/lib/schema";
import { renderCustomSectionContent } from "@/lib/section-renderer";

interface Props {
  data: ResumeData;
  color: string;
  font: "sans" | "serif" | "mono";
}

export function SimpleTemplate({ data, color, font }: Props) {
  const fontClass = font === "serif" ? "font-serif" : font === "mono" ? "font-mono" : "font-sans";
  const orderedSections = getOrderedSections(data);
  const visibleSections = orderedSections.filter(s => s.enabled);

  const renderSection = (sectionKey: string) => {
    if (sectionKey === "experience") {
      if (!data.experience || data.experience.length === 0) return null;
      return (
        <div key={sectionKey} className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wide mb-3 pb-1 border-b" style={{ color }}>Experience</h2>
          {data.experience.map((exp) => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between gap-2 flex-wrap">
                <span className="font-semibold text-gray-900">{exp.role}</span>
                <span className="text-gray-500 text-xs whitespace-nowrap">{exp.date}</span>
              </div>
              <p className="text-gray-600">{exp.company}</p>
              {exp.description && (
                <p className="text-gray-500 mt-1 text-xs whitespace-pre-line" style={{ wordSpacing: "0.05em" }}>{exp.description}</p>
              )}
            </div>
          ))}
        </div>
      );
    }

    if (sectionKey === "education") {
      if (!data.education || data.education.length === 0) return null;
      return (
        <div key={sectionKey} className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wide mb-3 pb-1 border-b" style={{ color }}>Education</h2>
          {data.education.map((edu) => (
            <div key={edu.id} className="mb-2">
              <div className="flex justify-between gap-2 flex-wrap">
                <span className="font-semibold text-gray-900" style={{ wordSpacing: "0.05em" }}>{edu.degree}</span>
                <span className="text-gray-500 text-xs whitespace-nowrap">{edu.date}</span>
              </div>
              <p className="text-gray-600" style={{ wordSpacing: "0.05em" }}>{edu.school}</p>
            </div>
          ))}
        </div>
      );
    }

    if (sectionKey === "skills") {
      if (!data.skills || data.skills.length === 0) return null;
      return (
        <div key={sectionKey} className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wide mb-2 pb-1 border-b" style={{ color }}>Skills</h2>
          <p className="text-gray-700 text-xs" style={{ wordSpacing: "0.05em" }}>
            {data.skills.map((skill) => skill.name).join(" • ")}
          </p>
        </div>
      );
    }

    const customSection = data.customSections?.find(s => s.key === sectionKey);
    if (!customSection || customSection.items.length === 0) return null;

    return (
      <div key={sectionKey} className="mb-5">
        <h2 className="text-xs font-bold uppercase tracking-wide mb-3 pb-1 border-b" style={{ color }}>{customSection.title}</h2>
        {renderCustomSectionContent({ section: customSection, color, variant: "default" })}
      </div>
    );
  };

  return (
    <div className={`w-full h-full bg-white p-8 ${fontClass}`} style={{ fontSize: "11px" }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{data.personal.fullName || "Your Name"}</h1>
        <p className="text-gray-600 mt-1">{data.personal.title || "Professional Title"}</p>
        <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
          {data.personal.email && <span>{data.personal.email}</span>}
          {data.personal.phone && <span>•</span>}
          {data.personal.phone && <span>{data.personal.phone}</span>}
          {data.personal.location && <span>•</span>}
          {data.personal.location && <span style={{ wordSpacing: "0.05em" }}>{data.personal.location}</span>}
        </div>
      </div>

      {data.personal.summary && (
        <div className="mb-5">
          <p className="text-gray-700" style={{ wordSpacing: "0.05em" }}>{data.personal.summary}</p>
        </div>
      )}

      {visibleSections.map(section => renderSection(section.key))}
    </div>
  );
}
