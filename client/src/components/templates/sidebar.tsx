import { ResumeData, CustomSection, getOrderedSections } from "@/lib/schema";
import { renderCustomSectionContent } from "@/lib/section-renderer";

interface Props {
  data: ResumeData;
  color: string;
  font: "sans" | "serif" | "mono";
}

export function SidebarTemplate({ data, color, font }: Props) {
  const fontClass = font === "serif" ? "font-serif" : font === "mono" ? "font-mono" : "font-sans";
  const orderedSections = getOrderedSections(data);
  const visibleSections = orderedSections.filter(s => s.enabled);

  const sidebarSectionKeys = ["education", "skills"];
  const sidebarSections = visibleSections.filter(s => 
    sidebarSectionKeys.includes(s.key) || s.type === "skills" || s.type === "bullets"
  );
  const mainSections = visibleSections.filter(s => 
    !sidebarSectionKeys.includes(s.key) && s.type !== "skills" && s.type !== "bullets"
  );

  const renderSidebarSection = (sectionKey: string) => {
    if (sectionKey === "skills") {
      if (!data.skills || data.skills.length === 0) return null;
      return (
        <div key={sectionKey} className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2 opacity-80">Skills</h2>
          <div className="space-y-1">
            {data.skills.map((skill) => (
              <div key={skill.id} className="flex items-center gap-2 text-xs">
                <span className="w-1.5 h-1.5 bg-white/60 rounded-full"></span>
                <span className="opacity-90" style={{ wordSpacing: "0.05em" }}>{skill.name}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (sectionKey === "education") {
      if (!data.education || data.education.length === 0) return null;
      return (
        <div key={sectionKey} className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2 opacity-80">Education</h2>
          {data.education.map((edu) => (
            <div key={edu.id} className="mb-2 text-xs">
              <p className="font-semibold" style={{ wordSpacing: "0.05em" }}>{edu.degree}</p>
              <p className="opacity-80" style={{ wordSpacing: "0.05em" }}>{edu.school}</p>
              <p className="opacity-60">{edu.date}</p>
            </div>
          ))}
        </div>
      );
    }

    const customSection = data.customSections?.find(s => s.key === sectionKey);
    if (!customSection || customSection.items.length === 0) return null;

    return (
      <div key={sectionKey} className="mb-6">
        <h2 className="text-xs font-bold uppercase tracking-wider mb-2 opacity-80">{customSection.title}</h2>
        <div className="text-xs opacity-90">
          {renderCustomSectionContent({ section: customSection, color: "white", variant: "default" })}
        </div>
      </div>
    );
  };

  const renderMainSection = (sectionKey: string) => {
    if (sectionKey === "experience") {
      if (!data.experience || data.experience.length === 0) return null;
      return (
        <div key={sectionKey} className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color }}>Experience</h2>
          {data.experience.map((exp) => (
            <div key={exp.id} className="mb-4 pl-3 border-l-2" style={{ borderColor: color }}>
              <div className="flex justify-between items-start gap-2 flex-wrap">
                <div>
                  <h3 className="font-bold text-gray-900">{exp.role}</h3>
                  <p className="text-gray-600">{exp.company}</p>
                </div>
                <span className="text-gray-500 text-xs whitespace-nowrap">{exp.date}</span>
              </div>
              {exp.description && <p className="text-gray-600 mt-1 text-xs whitespace-pre-line" style={{ wordSpacing: "0.05em" }}>{exp.description}</p>}
            </div>
          ))}
        </div>
      );
    }

    const customSection = data.customSections?.find(s => s.key === sectionKey);
    if (!customSection || customSection.items.length === 0) return null;

    return (
      <div key={sectionKey} className="mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color }}>{customSection.title}</h2>
        {renderCustomSectionContent({ section: customSection, color, variant: "default" })}
      </div>
    );
  };

  return (
    <div className={`w-full h-full bg-white flex ${fontClass}`} style={{ fontSize: "10px" }}>
      <div className="w-1/3 text-white p-6" style={{ backgroundColor: color }}>
        <div className="mb-6">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold mb-4">
            {(data.personal.fullName || "U").charAt(0)}
          </div>
          <h1 className="text-lg font-bold leading-tight">{data.personal.fullName || "Your Name"}</h1>
          <p className="text-sm opacity-80 mt-1">{data.personal.title || "Professional Title"}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2 opacity-80">Contact</h2>
          <div className="space-y-1 text-xs opacity-90">
            {data.personal.email && <p>{data.personal.email}</p>}
            {data.personal.phone && <p>{data.personal.phone}</p>}
            {data.personal.location && <p style={{ wordSpacing: "0.05em" }}>{data.personal.location}</p>}
            {data.personal.website && <p>{data.personal.website}</p>}
          </div>
        </div>

        {sidebarSections.map(section => renderSidebarSection(section.key))}
      </div>

      <div className="w-2/3 p-6">
        {data.personal.summary && (
          <div className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color }}>Profile</h2>
            <p className="text-gray-700 leading-relaxed" style={{ wordSpacing: "0.05em" }}>{data.personal.summary}</p>
          </div>
        )}

        {mainSections.map(section => renderMainSection(section.key))}
      </div>
    </div>
  );
}
