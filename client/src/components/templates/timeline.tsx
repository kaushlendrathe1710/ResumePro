import { ResumeData } from "@/lib/schema";

interface Props {
  data: ResumeData;
  color: string;
  font: "sans" | "serif" | "mono";
}

export function TimelineTemplate({ data, color, font }: Props) {
  const fontClass = font === "serif" ? "font-serif" : font === "mono" ? "font-mono" : "font-sans";

  return (
    <div className={`w-full h-full bg-white p-8 ${fontClass}`} style={{ fontSize: "11px" }}>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{data.personal.fullName || "Your Name"}</h1>
        <p className="text-lg mt-1" style={{ color }}>{data.personal.title || "Professional Title"}</p>
        <div className="flex justify-center flex-wrap gap-4 mt-3 text-xs text-gray-500">
          {data.personal.email && <span>{data.personal.email}</span>}
          {data.personal.phone && <span>|</span>}
          {data.personal.phone && <span>{data.personal.phone}</span>}
          {data.personal.location && <span>|</span>}
          {data.personal.location && <span>{data.personal.location}</span>}
        </div>
      </div>

      {/* Summary */}
      {data.personal.summary && (
        <div className="mb-6 text-center max-w-xl mx-auto">
          <p className="text-gray-600">{data.personal.summary}</p>
        </div>
      )}

      {/* Timeline Experience */}
      {data.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-4 text-center" style={{ color }}>Career Timeline</h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5" style={{ backgroundColor: `${color}30` }}></div>
            {data.experience.map((exp, index) => (
              <div key={exp.id} className={`relative flex items-center mb-4 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-6' : 'text-left pl-6'}`}>
                  <h3 className="font-bold text-gray-900">{exp.role}</h3>
                  <p className="text-gray-600">{exp.company}</p>
                  {exp.description && <p className="text-gray-500 text-xs mt-1">{exp.description}</p>}
                </div>
                <div className="w-2/12 flex justify-center">
                  <div className="w-4 h-4 rounded-full border-2 bg-white z-10" style={{ borderColor: color, backgroundColor: color }}></div>
                </div>
                <div className={`w-5/12 ${index % 2 === 0 ? 'text-left pl-6' : 'text-right pr-6'}`}>
                  <span className="text-xs font-medium px-2 py-1 rounded" style={{ backgroundColor: `${color}15`, color }}>{exp.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education & Skills */}
      <div className="grid grid-cols-2 gap-6 mt-6">
        {data.education.length > 0 && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color }}>Education</h2>
            {data.education.map((edu) => (
              <div key={edu.id} className="mb-2">
                <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                <p className="text-gray-600 text-xs">{edu.school} • {edu.date}</p>
              </div>
            ))}
          </div>
        )}

        {data.skills.length > 0 && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color }}>Skills</h2>
            <div className="flex flex-wrap gap-1">
              {data.skills.map((skill) => (
                <span key={skill.id} className="px-2 py-1 rounded text-xs" style={{ backgroundColor: `${color}15`, color }}>
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
