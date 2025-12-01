import { ResumeData } from "@/lib/schema";

interface Props {
  data: ResumeData;
  color: string;
  font: "sans" | "serif" | "mono";
}

export function GradientTemplate({ data, color, font }: Props) {
  const fontClass = font === "serif" ? "font-serif" : font === "mono" ? "font-mono" : "font-sans";
  const lighterColor = color + "40";

  return (
    <div className={`w-full h-full bg-white ${fontClass}`} style={{ fontSize: "11px" }}>
      {/* Gradient Header */}
      <div 
        className="p-8 text-white"
        style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)` }}
      >
        <h1 className="text-3xl font-bold mb-1">{data.personal.fullName || "Your Name"}</h1>
        <p className="text-lg opacity-90 mb-4">{data.personal.title || "Professional Title"}</p>
        <div className="flex flex-wrap gap-4 text-xs opacity-80">
          {data.personal.email && <span>{data.personal.email}</span>}
          {data.personal.phone && <span>{data.personal.phone}</span>}
          {data.personal.location && <span>{data.personal.location}</span>}
        </div>
      </div>

      <div className="p-8">
        {/* Summary */}
        {data.personal.summary && (
          <div 
            className="mb-6 p-4 rounded-lg"
            style={{ background: `linear-gradient(135deg, ${lighterColor} 0%, transparent 100%)` }}
          >
            <p className="text-gray-700">{data.personal.summary}</p>
          </div>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-8 h-1 rounded" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}></span>
              Experience
            </h2>
            {data.experience.map((exp) => (
              <div key={exp.id} className="mb-4 pl-4 border-l-2" style={{ borderColor: color }}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">{exp.role}</h3>
                    <p className="text-gray-600" style={{ color }}>{exp.company}</p>
                  </div>
                  <span className="text-xs text-gray-500 px-2 py-1 rounded" style={{ backgroundColor: lighterColor }}>{exp.date}</span>
                </div>
                {exp.description && <p className="text-gray-600 mt-1 text-sm">{exp.description}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-8 h-1 rounded" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}></span>
              Education
            </h2>
            {data.education.map((edu) => (
              <div key={edu.id} className="mb-3">
                <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                <p className="text-gray-600">{edu.school} • {edu.date}</p>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-8 h-1 rounded" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}></span>
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill) => (
                <span 
                  key={skill.id} 
                  className="px-3 py-1 rounded-full text-xs font-medium text-white"
                  style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}bb 100%)` }}
                >
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
