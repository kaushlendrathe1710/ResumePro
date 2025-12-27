import { ResumeData, CustomSection, getOrderedSections } from "@/lib/schema";
import { renderCustomSectionContent } from "@/lib/section-renderer";

interface Props {
  data: ResumeData;
  color: string;
  font: "sans" | "serif" | "mono";
}

export function TechTemplate({ data, color, font }: Props) {
  const orderedSections = getOrderedSections(data);
  const visibleSections = orderedSections.filter(s => s.enabled);

  const renderSection = (sectionKey: string) => {
    if (sectionKey === "experience") {
      if (!data.experience || data.experience.length === 0) return null;
      return (
        <div key={sectionKey} className="mb-6">
          <h2 className="text-sm mb-3" style={{ color }}>{`<Experience />`}</h2>
          {data.experience.map((exp) => (
            <div key={exp.id} className="mb-4 pl-4 border-l border-gray-700">
              <div className="flex justify-between gap-2 flex-wrap">
                <span className="font-bold text-white">{exp.role}</span>
                <span className="text-gray-500 whitespace-nowrap">{exp.date}</span>
              </div>
              <p className="text-gray-400">{exp.company}</p>
              {exp.description && <p className="text-gray-500 mt-1 whitespace-pre-line" style={{ wordSpacing: "0.05em" }}>{exp.description}</p>}
            </div>
          ))}
        </div>
      );
    }

    if (sectionKey === "education") {
      if (!data.education || data.education.length === 0) return null;
      return (
        <div key={sectionKey} className="mb-6">
          <h2 className="text-sm mb-3" style={{ color }}>{`<Education />`}</h2>
          {data.education.map((edu) => (
            <div key={edu.id} className="mb-2 pl-4">
              <span className="text-white" style={{ wordSpacing: "0.05em" }}>{edu.degree}</span>
              <span className="text-gray-500"> @ {edu.school} ({edu.date})</span>
            </div>
          ))}
        </div>
      );
    }

    if (sectionKey === "skills") {
      if (!data.skills || data.skills.length === 0) return null;
      return (
        <div key={sectionKey} className="mb-6">
          <h2 className="text-sm mb-2" style={{ color }}>{`<Skills />`}</h2>
          <div className="flex flex-wrap gap-2 pl-4">
            {data.skills.map((skill) => (
              <span key={skill.id} className="px-2 py-1 bg-gray-800 rounded text-xs" style={{ color, wordSpacing: "0.05em" }}>
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
        <h2 className="text-sm mb-3" style={{ color }}>{`<${customSection.title.replace(/\s/g, '')} />`}</h2>
        <div className="pl-4">
          {renderCustomSectionContent({ section: customSection, color, variant: "default" })}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full bg-gray-900 text-gray-100 p-8 font-mono" style={{ fontSize: "10px" }}>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span style={{ color }}>$</span>
          <h1 className="text-2xl font-bold">{data.personal.fullName || "Your Name"}</h1>
        </div>
        <p className="ml-4 mb-2" style={{ color }}>{data.personal.title || "// Professional Title"}</p>
        <div className="ml-4 flex flex-wrap gap-4 text-xs text-gray-400">
          {data.personal.email && <span>email: {data.personal.email}</span>}
          {data.personal.phone && <span>phone: {data.personal.phone}</span>}
          {data.personal.location && <span style={{ wordSpacing: "0.05em" }}>loc: {data.personal.location}</span>}
        </div>
      </div>

      {data.personal.summary && (
        <div className="mb-6 p-3 bg-gray-800 rounded border-l-2" style={{ borderColor: color }}>
          <p className="text-gray-300" style={{ wordSpacing: "0.05em" }}>{`/* ${data.personal.summary} */`}</p>
        </div>
      )}

      {visibleSections.map(section => renderSection(section.key))}
    </div>
  );
}
