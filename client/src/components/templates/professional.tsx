import { ResumeData } from "@/lib/schema";

interface Props {
  data: ResumeData;
  color: string;
  font: "sans" | "serif" | "mono";
}

export function ProfessionalTemplate({ data, color, font }: Props) {
  const fontClass = font === "serif" ? "font-serif" : font === "mono" ? "font-mono" : "font-sans";

  return (
    <div className={`w-full h-full bg-white p-8 ${fontClass}`} style={{ fontSize: "11px" }}>
      {/* Header with accent bar */}
      <div className="border-b-4 pb-4 mb-6" style={{ borderColor: color }}>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">{data.personal.fullName || "Your Name"}</h1>
        <p className="text-lg font-medium mb-3" style={{ color }}>{data.personal.title || "Professional Title"}</p>
        <div className="flex flex-wrap gap-4 text-xs text-gray-600">
          {data.personal.email && <span>{data.personal.email}</span>}
          {data.personal.phone && <span>{data.personal.phone}</span>}
          {data.personal.location && <span>{data.personal.location}</span>}
          {data.personal.website && <span>{data.personal.website}</span>}
        </div>
      </div>

      {/* Summary */}
      {data.personal.summary && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color }}>Professional Summary</h2>
          <p className="text-gray-700 leading-relaxed">{data.personal.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color }}>Experience</h2>
          {data.experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="font-bold text-gray-900">{exp.role}</h3>
                  <p className="text-gray-600">{exp.company}</p>
                </div>
                <span className="text-gray-500 text-xs">{exp.date}</span>
              </div>
              {exp.description && <p className="text-gray-600 mt-1">{exp.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color }}>Education</h2>
          {data.education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                  <p className="text-gray-600">{edu.school}</p>
                </div>
                <span className="text-gray-500 text-xs">{edu.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color }}>Skills</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill) => (
              <span key={skill.id} className="px-2 py-1 rounded text-xs" style={{ backgroundColor: `${color}15`, color }}>
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
