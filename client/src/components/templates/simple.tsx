import { ResumeData } from "@/lib/schema";

interface Props {
  data: ResumeData;
  color: string;
  font: "sans" | "serif" | "mono";
}

export function SimpleTemplate({ data, color, font }: Props) {
  const fontClass = font === "serif" ? "font-serif" : font === "mono" ? "font-mono" : "font-sans";

  return (
    <div className={`w-full h-full bg-white p-8 ${fontClass}`} style={{ fontSize: "11px" }}>
      {/* Simple Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{data.personal.fullName || "Your Name"}</h1>
        <p className="text-gray-600 mt-1">{data.personal.title || "Professional Title"}</p>
        <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
          {data.personal.email && <span>{data.personal.email}</span>}
          {data.personal.phone && <span>•</span>}
          {data.personal.phone && <span>{data.personal.phone}</span>}
          {data.personal.location && <span>•</span>}
          {data.personal.location && <span>{data.personal.location}</span>}
        </div>
      </div>

      {/* Summary */}
      {data.personal.summary && (
        <div className="mb-5">
          <p className="text-gray-700">{data.personal.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wide mb-3 pb-1 border-b" style={{ color }}>Experience</h2>
          {data.experience.map((exp) => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-900">{exp.role}</span>
                <span className="text-gray-500 text-xs">{exp.date}</span>
              </div>
              <p className="text-gray-600">{exp.company}</p>
              {exp.description && <p className="text-gray-500 mt-1 text-xs">{exp.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wide mb-3 pb-1 border-b" style={{ color }}>Education</h2>
          {data.education.map((edu) => (
            <div key={edu.id} className="mb-2">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-900">{edu.degree}</span>
                <span className="text-gray-500 text-xs">{edu.date}</span>
              </div>
              <p className="text-gray-600">{edu.school}</p>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wide mb-2 pb-1 border-b" style={{ color }}>Skills</h2>
          <p className="text-gray-700 text-xs">{data.skills.map((skill) => skill.name).join(" • ")}</p>
        </div>
      )}
    </div>
  );
}
