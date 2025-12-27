import { ResumeData, CustomSection, getOrderedSections } from "@/lib/schema";
import { renderCustomSectionContent } from "@/lib/section-renderer";

interface Props {
  data: ResumeData;
  color: string;
  font: "sans" | "serif" | "mono";
}

export function CompactTemplate({ data, color, font }: Props) {
  const fontClass = font === "serif" ? "font-serif" : font === "mono" ? "font-mono" : "font-sans";
  const orderedSections = getOrderedSections(data);
  const visibleSections = orderedSections.filter(s => s.enabled);

  const leftSections = visibleSections.filter(s => s.key === "experience" || s.type === "experience" || s.type === "projects");
  const rightSections = visibleSections.filter(s => s.key !== "experience" && s.type !== "experience" && s.type !== "projects");

  const renderSection = (sectionKey: string) => {
    if (sectionKey === "experience") {
      if (!data.experience || data.experience.length === 0) return null;
      return (
        <div key={sectionKey} className="mb-4">
          <h2 className="text-xs font-bold uppercase mb-2" style={{ color }}>Experience</h2>
          {data.experience.map((exp) => (
            <div key={exp.id} className="mb-2">
              <div className="flex justify-between items-start gap-2 flex-wrap">
                <span className="font-semibold text-gray-900">{exp.role}</span>
                <span className="text-gray-500 text-[9px] whitespace-nowrap">{exp.date}</span>
              </div>
              <p className="text-gray-600">{exp.company}</p>
              {exp.description && <p className="text-gray-500 text-[9px] mt-0.5 whitespace-pre-line" style={{ wordSpacing: "0.05em" }}>{exp.description}</p>}
            </div>
          ))}
        </div>
      );
    }

    if (sectionKey === "education") {
      if (!data.education || data.education.length === 0) return null;
      return (
        <div key={sectionKey} className="mb-4">
          <h2 className="text-xs font-bold uppercase mb-2" style={{ color }}>Education</h2>
          {data.education.map((edu) => (
            <div key={edu.id} className="mb-2">
              <p className="font-semibold text-gray-900" style={{ wordSpacing: "0.05em" }}>{edu.degree}</p>
              <p className="text-gray-600" style={{ wordSpacing: "0.05em" }}>{edu.school}</p>
              <p className="text-gray-500 text-[9px]">{edu.date}</p>
            </div>
          ))}
        </div>
      );
    }

    if (sectionKey === "skills") {
      if (!data.skills || data.skills.length === 0) return null;
      return (
        <div key={sectionKey} className="mb-4">
          <h2 className="text-xs font-bold uppercase mb-2" style={{ color }}>Skills</h2>
          <div className="flex flex-wrap gap-1">
            {data.skills.map((skill) => (
              <span key={skill.id} className="px-1.5 py-0.5 rounded text-[9px]" style={{ backgroundColor: `${color}15`, color, wordSpacing: "0.05em" }}>
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
      <div key={sectionKey} className="mb-4">
        <h2 className="text-xs font-bold uppercase mb-2" style={{ color }}>{customSection.title}</h2>
        {renderCustomSectionContent({ section: customSection, color, variant: "default" })}
      </div>
    );
  };

  return (
    <div className={`w-full h-full bg-white p-6 ${fontClass}`} style={{ fontSize: "10px" }}>
      <div className="flex justify-between items-start mb-4 pb-3 border-b-2 gap-4 flex-wrap" style={{ borderColor: color }}>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{data.personal.fullName || "Your Name"}</h1>
          <p className="text-sm" style={{ color }}>{data.personal.title || "Professional Title"}</p>
        </div>
        <div className="text-right text-xs text-gray-600">
          {data.personal.email && <p>{data.personal.email}</p>}
          {data.personal.phone && <p>{data.personal.phone}</p>}
          {data.personal.location && <p style={{ wordSpacing: "0.05em" }}>{data.personal.location}</p>}
        </div>
      </div>

      {data.personal.summary && (
        <div className="mb-4">
          <p className="text-gray-700 text-xs leading-relaxed" style={{ wordSpacing: "0.05em" }}>{data.personal.summary}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          {leftSections.map(section => renderSection(section.key))}
        </div>
        <div>
          {rightSections.map(section => renderSection(section.key))}
        </div>
      </div>
    </div>
  );
}
