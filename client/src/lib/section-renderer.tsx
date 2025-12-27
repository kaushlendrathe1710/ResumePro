import { ResumeData, CustomSection } from "@/lib/schema";
import { ExternalLink } from "lucide-react";

interface SectionRendererProps {
  section: CustomSection;
  color: string;
  variant?: "default" | "sidebar" | "timeline";
}

export function renderCustomSectionContent({ section, color, variant = "default" }: SectionRendererProps) {
  const wordSpacing = { wordSpacing: "0.05em" };

  if (section.type === "bullets") {
    return (
      <ul className={variant === "sidebar" ? "space-y-1 text-sm" : "space-y-2"}>
        {section.items.map((item: { id: string; text?: string }) => (
          <li key={item.id} className="flex items-start gap-2">
            <span 
              className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" 
              style={{ backgroundColor: variant === "sidebar" ? "currentColor" : color }}
            />
            <span style={wordSpacing}>{item.text}</span>
          </li>
        ))}
      </ul>
    );
  }

  if (section.type === "skills") {
    return (
      <div className="flex flex-wrap gap-2">
        {section.items.map((item: { id: string; name?: string }) => (
          <span 
            key={item.id}
            className={variant === "sidebar" 
              ? "px-2 py-1 bg-slate-800 rounded text-xs text-slate-300 border border-slate-700"
              : "px-3 py-1.5 border text-sm font-medium"
            }
            style={variant === "sidebar" ? wordSpacing : { borderColor: color, color, ...wordSpacing }}
          >
            {item.name}
          </span>
        ))}
      </div>
    );
  }

  if (section.type === "projects") {
    return (
      <div className={variant === "timeline" ? "space-y-6" : "space-y-4"}>
        {section.items.map((item: { id: string; title?: string; description?: string; link?: string; date?: string }) => (
          <div key={item.id} className={variant === "timeline" ? "relative pl-4 border-l-2 border-slate-100" : ""}>
            {variant === "timeline" && (
              <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
            )}
            <div className="flex justify-between items-baseline mb-1 gap-2 flex-wrap">
              <h3 className="font-bold text-slate-900">{item.title}</h3>
              {item.date && <span className="text-sm text-slate-500 whitespace-nowrap">{item.date}</span>}
            </div>
            <p className="text-slate-700 text-sm" style={wordSpacing}>{item.description}</p>
            {item.link && (
              <a href={item.link} className="text-sm flex items-center gap-1 mt-1" style={{ color }}>
                <ExternalLink className="w-3 h-3" /> {item.link}
              </a>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (section.type === "text") {
    return (
      <div className="space-y-3 text-slate-700">
        {section.items.map((item: { id: string; content?: string }) => (
          <p key={item.id} className="leading-relaxed" style={wordSpacing}>{item.content}</p>
        ))}
      </div>
    );
  }

  if (section.type === "experience") {
    return (
      <div className={variant === "timeline" ? "space-y-6" : "space-y-4"}>
        {section.items.map((item: { id: string; company?: string; role?: string; date?: string; description?: string }) => (
          <div key={item.id} className={variant === "timeline" ? "relative pl-4 border-l-2 border-slate-100" : ""}>
            {variant === "timeline" && (
              <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
            )}
            <div className="flex justify-between items-baseline mb-1 gap-2 flex-wrap">
              <h3 className="font-bold text-slate-900">{item.role}</h3>
              <span className="text-sm text-slate-500 whitespace-nowrap">{item.date}</span>
            </div>
            <div className="text-sm font-semibold mb-2 text-slate-500">{item.company}</div>
            <p className="text-slate-700 text-sm" style={wordSpacing}>{item.description}</p>
          </div>
        ))}
      </div>
    );
  }

  if (section.type === "education") {
    return (
      <div className="space-y-3">
        {section.items.map((item: { id: string; school?: string; degree?: string; date?: string; description?: string }) => (
          <div key={item.id}>
            <h3 className="font-bold text-slate-900" style={wordSpacing}>{item.school}</h3>
            <div className="text-sm text-slate-600" style={wordSpacing}>{item.degree}</div>
            <div className="text-xs text-slate-400">{item.date}</div>
            {item.description && <p className="text-sm text-slate-600 mt-1" style={wordSpacing}>{item.description}</p>}
          </div>
        ))}
      </div>
    );
  }

  return null;
}

export function getVisibleSections(data: ResumeData) {
  const sectionOrder = data.sectionOrder || ["experience", "education", "skills"];
  const sectionVisibility = data.sectionVisibility || { experience: true, education: true, skills: true };
  
  const defaultSections = [
    { key: "experience", title: "Experience", type: "experience" as const },
    { key: "education", title: "Education", type: "education" as const },
    { key: "skills", title: "Skills", type: "skills" as const },
  ];

  return sectionOrder
    .filter(key => sectionVisibility[key] !== false)
    .map(key => {
      const defaultSection = defaultSections.find(s => s.key === key);
      if (defaultSection) return defaultSection;
      
      const customSection = data.customSections?.find(s => s.key === key);
      if (customSection) {
        return { key: customSection.key, title: customSection.title, type: customSection.type };
      }
      return null;
    })
    .filter((s): s is NonNullable<typeof s> => s !== null);
}
