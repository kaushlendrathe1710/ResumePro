import { ResumeData, CustomSection, getOrderedSections } from "@/lib/schema";
import { renderCustomSectionContent } from "@/lib/section-renderer";

interface Props {
  data: ResumeData;
  color: string;
  font: "sans" | "serif" | "mono";
}

export function AcademicTemplate({ data, color, font }: Props) {
  const orderedSections = getOrderedSections(data);
  const visibleSections = orderedSections.filter(s => s.enabled);
  const educationFirst = ["education", ...visibleSections.filter(s => s.key !== "education").map(s => s.key)];

  const renderSection = (sectionKey: string) => {
    if (sectionKey === "education") {
      if (!data.education || data.education.length === 0) return null;
      return (
        <div key={sectionKey} className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-3 border-b pb-1" style={{ color, borderColor: color }}>
            Education
          </h2>
          {data.education.map((edu) => (
            <div key={edu.id} className="mb-4">
              <div className="flex justify-between items-start gap-2 flex-wrap">
                <div>
                  <h3 className="font-bold text-gray-900" style={{ wordSpacing: "0.05em" }}>{edu.degree}</h3>
                  <p className="italic text-gray-600" style={{ wordSpacing: "0.05em" }}>{edu.school}</p>
                </div>
                <span className="text-gray-500 text-xs whitespace-nowrap">{edu.date}</span>
              </div>
              {edu.description && <p className="text-gray-600 mt-1 text-sm" style={{ wordSpacing: "0.05em" }}>{edu.description}</p>}
            </div>
          ))}
        </div>
      );
    }

    if (sectionKey === "experience") {
      if (!data.experience || data.experience.length === 0) return null;
      return (
        <div key={sectionKey} className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-3 border-b pb-1" style={{ color, borderColor: color }}>
            Professional Experience
          </h2>
          {data.experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-start gap-2 flex-wrap">
                <div>
                  <h3 className="font-bold text-gray-900">{exp.role}</h3>
                  <p className="italic text-gray-600">{exp.company}</p>
                </div>
                <span className="text-gray-500 text-xs whitespace-nowrap">{exp.date}</span>
              </div>
              {exp.description && <p className="text-gray-600 mt-1 whitespace-pre-line" style={{ wordSpacing: "0.05em" }}>{exp.description}</p>}
            </div>
          ))}
        </div>
      );
    }

    if (sectionKey === "skills") {
      if (!data.skills || data.skills.length === 0) return null;
      return (
        <div key={sectionKey} className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-2 border-b pb-1" style={{ color, borderColor: color }}>
            Technical Skills
          </h2>
          <p className="text-gray-700" style={{ wordSpacing: "0.05em" }}>
            {data.skills.map((skill) => skill.name).join(", ")}
          </p>
        </div>
      );
    }

    const customSection = data.customSections?.find(s => s.key === sectionKey);
    if (!customSection || customSection.items.length === 0) return null;

    return (
      <div key={sectionKey} className="mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wider mb-3 border-b pb-1" style={{ color, borderColor: color }}>
          {customSection.title}
        </h2>
        {renderCustomSectionContent({ section: customSection, color, variant: "default" })}
      </div>
    );
  };

  return (
    <div className="w-full h-full bg-white p-8 font-serif" style={{ fontSize: "11px" }}>
      <div className="text-center mb-6 pb-4 border-b-2 border-gray-300">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">{data.personal.fullName || "Your Name"}</h1>
        <p className="text-lg text-gray-600 italic mb-3">{data.personal.title || "Academic Title"}</p>
        <div className="flex justify-center flex-wrap gap-4 text-xs text-gray-500">
          {data.personal.email && <span>{data.personal.email}</span>}
          {data.personal.phone && <span>|</span>}
          {data.personal.phone && <span>{data.personal.phone}</span>}
          {data.personal.location && <span>|</span>}
          {data.personal.location && <span style={{ wordSpacing: "0.05em" }}>{data.personal.location}</span>}
        </div>
      </div>

      {data.personal.summary && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color }}>Research Interests</h2>
          <p className="text-gray-700 leading-relaxed text-justify" style={{ wordSpacing: "0.05em" }}>{data.personal.summary}</p>
        </div>
      )}

      {educationFirst.map(key => {
        const section = visibleSections.find(s => s.key === key);
        return section ? renderSection(section.key) : null;
      })}
    </div>
  );
}
