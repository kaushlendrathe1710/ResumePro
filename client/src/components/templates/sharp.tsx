import { ResumeData } from "@/lib/schema";

interface Props {
  data: ResumeData;
  color: string;
  font: "sans" | "serif" | "mono";
}

export function SharpTemplate({ data, color, font }: Props) {
  const fontClass = font === "serif" ? "font-serif" : font === "mono" ? "font-mono" : "font-sans";

  return (
    <div className={`w-full h-full bg-white ${fontClass}`} style={{ fontSize: "11px" }}>
      {/* Sharp Header */}
      <div className="relative">
        <div className="p-8 pb-12" style={{ backgroundColor: color }}>
          <h1 className="text-3xl font-black text-white tracking-tight">{data.personal.fullName || "YOUR NAME"}</h1>
          <p className="text-lg text-white/80 font-medium">{data.personal.title || "Professional Title"}</p>
        </div>
        <div 
          className="absolute bottom-0 left-0 right-0 h-8"
          style={{ 
            background: `linear-gradient(135deg, ${color} 50%, white 50%)`,
          }}
        ></div>
      </div>

      <div className="p-8 pt-4">
        {/* Contact */}
        <div className="flex flex-wrap gap-4 text-xs text-gray-600 mb-6">
          {data.personal.email && <span className="flex items-center gap-1"><span style={{ color }}>▪</span> {data.personal.email}</span>}
          {data.personal.phone && <span className="flex items-center gap-1"><span style={{ color }}>▪</span> {data.personal.phone}</span>}
          {data.personal.location && <span className="flex items-center gap-1"><span style={{ color }}>▪</span> {data.personal.location}</span>}
        </div>

        {/* Summary */}
        {data.personal.summary && (
          <div className="mb-6 p-4 bg-gray-50" style={{ borderLeft: `4px solid ${color}` }}>
            <p className="text-gray-700">{data.personal.summary}</p>
          </div>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-black uppercase mb-4 flex items-center gap-2">
              <span className="w-3 h-3" style={{ backgroundColor: color }}></span>
              Experience
            </h2>
            {data.experience.map((exp) => (
              <div key={exp.id} className="mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">{exp.role}</h3>
                    <p style={{ color }}>{exp.company}</p>
                  </div>
                  <span className="text-xs text-white px-2 py-1" style={{ backgroundColor: color }}>{exp.date}</span>
                </div>
                {exp.description && <p className="text-gray-600 mt-2">{exp.description}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-black uppercase mb-4 flex items-center gap-2">
              <span className="w-3 h-3" style={{ backgroundColor: color }}></span>
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
            <h2 className="text-sm font-black uppercase mb-3 flex items-center gap-2">
              <span className="w-3 h-3" style={{ backgroundColor: color }}></span>
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill) => (
                <span key={skill.id} className="px-3 py-1 text-xs font-bold" style={{ backgroundColor: `${color}15`, color }}>
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
