import { ResumeData } from "@/lib/schema";

interface Props {
  data: ResumeData;
  color: string;
  font: "sans" | "serif" | "mono";
}

export function CleanTemplate({ data, color, font }: Props) {
  const fontClass = font === "serif" ? "font-serif" : font === "mono" ? "font-mono" : "font-sans";

  return (
    <div className={`w-full h-full bg-white p-10 ${fontClass}`} style={{ fontSize: "11px" }}>
      {/* Clean Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-light text-gray-800 tracking-wide">{data.personal.fullName || "Your Name"}</h1>
        <div className="w-16 h-1 mt-3 mb-4" style={{ backgroundColor: color }}></div>
        <p className="text-lg text-gray-500">{data.personal.title || "Professional Title"}</p>
        <div className="flex gap-6 mt-4 text-xs text-gray-400">
          {data.personal.email && <span>{data.personal.email}</span>}
          {data.personal.phone && <span>{data.personal.phone}</span>}
          {data.personal.location && <span>{data.personal.location}</span>}
        </div>
      </div>

      {/* Summary */}
      {data.personal.summary && (
        <div className="mb-10">
          <p className="text-gray-600 leading-relaxed max-w-2xl">{data.personal.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-6">Experience</h2>
          {data.experience.map((exp) => (
            <div key={exp.id} className="mb-6">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="text-lg font-medium text-gray-800">{exp.role}</h3>
                <span className="text-xs text-gray-400">{exp.date}</span>
              </div>
              <p className="text-gray-500 mb-2" style={{ color }}>{exp.company}</p>
              {exp.description && <p className="text-gray-600 text-sm">{exp.description}</p>}
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-10">
        {/* Education */}
        {data.education.length > 0 && (
          <div>
            <h2 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-4">Education</h2>
            {data.education.map((edu) => (
              <div key={edu.id} className="mb-3">
                <h3 className="font-medium text-gray-800">{edu.degree}</h3>
                <p className="text-gray-500">{edu.school}</p>
                <p className="text-xs text-gray-400">{edu.date}</p>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <div>
            <h2 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-4">Skills</h2>
            <div className="space-y-2">
              {data.skills.map((skill) => (
                <p key={skill.id} className="text-gray-600">{skill.name}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
