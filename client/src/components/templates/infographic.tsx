import { ResumeData, CustomSection, getOrderedSections } from "@/lib/schema";
import { renderCustomSectionContent } from "@/lib/section-renderer";

interface Props {
  data: ResumeData;
  color: string;
  font: "sans" | "serif" | "mono";
}

export function InfographicTemplate({ data, color, font }: Props) {
  const fontClass = font === "serif" ? "font-serif" : font === "mono" ? "font-mono" : "font-sans";
  const orderedSections = getOrderedSections(data);
  const visibleSections = orderedSections.filter(s => s.enabled);

  const customSectionsCount = data.customSections?.filter(s => 
    visibleSections.some(vs => vs.key === s.key)
  ).length || 0;

  const renderSection = (sectionKey: string) => {
    if (sectionKey === "experience") {
      if (!data.experience || data.experience.length === 0) return null;
      return (
        <div key={sectionKey} className="bg-white p-4 rounded-lg shadow-sm mb-4">
          <h2 className="text-xs font-bold uppercase mb-3" style={{ color }}>Experience</h2>
          {data.experience.map((exp) => (
            <div key={exp.id} className="mb-3 flex gap-3">
              <div className="w-1 rounded" style={{ backgroundColor: color }}></div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">{exp.role}</h3>
                <p className="text-gray-600">{exp.company} - {exp.date}</p>
                {exp.description && <p className="text-gray-500 text-xs mt-1 whitespace-pre-line" style={{ wordSpacing: "0.05em" }}>{exp.description}</p>}
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (sectionKey === "education") {
      if (!data.education || data.education.length === 0) return null;
      return (
        <div key={sectionKey} className="bg-white p-4 rounded-lg shadow-sm mb-4">
          <h2 className="text-xs font-bold uppercase mb-3" style={{ color }}>Education</h2>
          {data.education.map((edu) => (
            <div key={edu.id} className="mb-2">
              <h3 className="font-bold text-gray-900" style={{ wordSpacing: "0.05em" }}>{edu.degree}</h3>
              <p className="text-gray-600 text-xs" style={{ wordSpacing: "0.05em" }}>{edu.school} - {edu.date}</p>
            </div>
          ))}
        </div>
      );
    }

    if (sectionKey === "skills") {
      if (!data.skills || data.skills.length === 0) return null;
      return (
        <div key={sectionKey} className="bg-white p-4 rounded-lg shadow-sm mb-4">
          <h2 className="text-xs font-bold uppercase mb-3" style={{ color }}>Skills</h2>
          <div className="grid grid-cols-2 gap-2">
            {data.skills.map((skill, idx) => (
              <div key={skill.id} className="flex items-center gap-2">
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ backgroundColor: color, width: `${75 + (idx % 4) * 5}%` }}></div>
                </div>
                <span className="text-[9px] text-gray-600 whitespace-nowrap" style={{ wordSpacing: "0.05em" }}>{skill.name}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    const customSection = data.customSections?.find(s => s.key === sectionKey);
    if (!customSection || customSection.items.length === 0) return null;

    return (
      <div key={sectionKey} className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <h2 className="text-xs font-bold uppercase mb-3" style={{ color }}>{customSection.title}</h2>
        {renderCustomSectionContent({ section: customSection, color, variant: "default" })}
      </div>
    );
  };

  return (
    <div className={`w-full h-full bg-gray-100 ${fontClass}`} style={{ fontSize: "10px" }}>
      <div className="p-6 text-white" style={{ backgroundColor: color }}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center text-2xl font-bold">
            {(data.personal.fullName || "U").charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{data.personal.fullName || "Your Name"}</h1>
            <p className="opacity-80">{data.personal.title || "Professional Title"}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex gap-2 mb-6 flex-wrap">
          {data.personal.email && (
            <div className="bg-white px-3 py-2 rounded-lg shadow-sm flex-1 text-center min-w-[100px]">
              <p className="text-[9px] text-gray-500 uppercase">Email</p>
              <p className="text-xs font-medium text-gray-800 truncate">{data.personal.email}</p>
            </div>
          )}
          {data.personal.phone && (
            <div className="bg-white px-3 py-2 rounded-lg shadow-sm flex-1 text-center min-w-[100px]">
              <p className="text-[9px] text-gray-500 uppercase">Phone</p>
              <p className="text-xs font-medium text-gray-800">{data.personal.phone}</p>
            </div>
          )}
          {data.personal.location && (
            <div className="bg-white px-3 py-2 rounded-lg shadow-sm flex-1 text-center min-w-[100px]">
              <p className="text-[9px] text-gray-500 uppercase">Location</p>
              <p className="text-xs font-medium text-gray-800" style={{ wordSpacing: "0.05em" }}>{data.personal.location}</p>
            </div>
          )}
        </div>

        {data.personal.summary && (
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <p className="text-gray-700 text-center" style={{ wordSpacing: "0.05em" }}>{data.personal.summary}</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white p-3 rounded-lg shadow-sm text-center">
            <p className="text-2xl font-bold" style={{ color }}>{data.experience?.length || 0}</p>
            <p className="text-[9px] text-gray-500 uppercase">Positions</p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm text-center">
            <p className="text-2xl font-bold" style={{ color }}>{data.education?.length || 0}</p>
            <p className="text-[9px] text-gray-500 uppercase">Degrees</p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm text-center">
            <p className="text-2xl font-bold" style={{ color }}>{(data.skills?.length || 0) + customSectionsCount}</p>
            <p className="text-[9px] text-gray-500 uppercase">Skills</p>
          </div>
        </div>

        {visibleSections.map(section => renderSection(section.key))}
      </div>
    </div>
  );
}
