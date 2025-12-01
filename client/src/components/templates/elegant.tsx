import { ResumeData } from "@/lib/schema";

interface Props {
  data: ResumeData;
  color: string;
  font: "sans" | "serif" | "mono";
}

export function ElegantTemplate({ data, color, font }: Props) {
  const fontClass = font === "serif" ? "font-serif" : font === "mono" ? "font-mono" : "font-sans";

  return (
    <div className={`w-full h-full bg-white p-10 ${fontClass}`} style={{ fontSize: "11px" }}>
      {/* Elegant Header */}
      <div className="text-center mb-8 pb-6 border-b" style={{ borderColor: `${color}40` }}>
        <h1 className="text-4xl font-light tracking-wide text-gray-800 mb-2">{data.personal.fullName || "Your Name"}</h1>
        <p className="text-lg italic mb-4" style={{ color }}>{data.personal.title || "Professional Title"}</p>
        <div className="flex justify-center flex-wrap gap-6 text-xs text-gray-500">
          {data.personal.email && <span>{data.personal.email}</span>}
          {data.personal.phone && <span>{data.personal.phone}</span>}
          {data.personal.location && <span>{data.personal.location}</span>}
        </div>
      </div>

      {/* Summary */}
      {data.personal.summary && (
        <div className="mb-8 text-center max-w-2xl mx-auto">
          <p className="text-gray-600 italic leading-relaxed">{data.personal.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-center text-sm tracking-[0.3em] uppercase mb-4" style={{ color }}>Experience</h2>
          {data.experience.map((exp) => (
            <div key={exp.id} className="mb-5 text-center">
              <h3 className="font-semibold text-gray-800">{exp.role}</h3>
              <p className="text-gray-600 italic">{exp.company} · {exp.date}</p>
              {exp.description && <p className="text-gray-600 mt-2 max-w-lg mx-auto">{exp.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-center text-sm tracking-[0.3em] uppercase mb-4" style={{ color }}>Education</h2>
          {data.education.map((edu) => (
            <div key={edu.id} className="mb-3 text-center">
              <h3 className="font-semibold text-gray-800">{edu.degree}</h3>
              <p className="text-gray-600 italic">{edu.school} · {edu.date}</p>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="text-center">
          <h2 className="text-sm tracking-[0.3em] uppercase mb-3" style={{ color }}>Skills</h2>
          <p className="text-gray-600">
            {data.skills.map((skill) => skill.name).join(" · ")}
          </p>
        </div>
      )}
    </div>
  );
}
