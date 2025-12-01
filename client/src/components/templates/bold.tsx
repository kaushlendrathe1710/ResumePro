import { ResumeData } from "@/lib/schema";

interface Props {
  data: ResumeData;
  color: string;
  font: "sans" | "serif" | "mono";
}

export function BoldTemplate({ data, color, font }: Props) {
  const fontClass = font === "serif" ? "font-serif" : font === "mono" ? "font-mono" : "font-sans";

  return (
    <div className={`w-full h-full bg-white ${fontClass}`} style={{ fontSize: "11px" }}>
      {/* Bold Header */}
      <div className="p-8 pb-6" style={{ backgroundColor: color }}>
        <h1 className="text-4xl font-black text-white tracking-tight">{data.personal.fullName || "YOUR NAME"}</h1>
        <p className="text-xl text-white/80 font-medium mt-1">{data.personal.title || "PROFESSIONAL TITLE"}</p>
      </div>

      <div className="p-8 pt-6">
        {/* Contact */}
        <div className="flex flex-wrap gap-4 text-xs mb-6 pb-4 border-b-2" style={{ borderColor: color }}>
          {data.personal.email && <span className="font-medium">{data.personal.email}</span>}
          {data.personal.phone && <span className="font-medium">{data.personal.phone}</span>}
          {data.personal.location && <span className="font-medium">{data.personal.location}</span>}
        </div>

        {/* Summary */}
        {data.personal.summary && (
          <div className="mb-6">
            <h2 className="text-lg font-black uppercase mb-2" style={{ color }}>About</h2>
            <p className="text-gray-700 leading-relaxed">{data.personal.summary}</p>
          </div>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-black uppercase mb-3" style={{ color }}>Experience</h2>
            {data.experience.map((exp) => (
              <div key={exp.id} className="mb-4 pl-4 border-l-4" style={{ borderColor: color }}>
                <h3 className="font-bold text-gray-900 text-base">{exp.role}</h3>
                <p className="font-semibold text-gray-600">{exp.company}</p>
                <p className="text-xs text-gray-500 mt-1">{exp.date}</p>
                {exp.description && <p className="text-gray-600 mt-2">{exp.description}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-black uppercase mb-3" style={{ color }}>Education</h2>
            {data.education.map((edu) => (
              <div key={edu.id} className="mb-3 pl-4 border-l-4" style={{ borderColor: color }}>
                <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                <p className="text-gray-600">{edu.school} • {edu.date}</p>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <div>
            <h2 className="text-lg font-black uppercase mb-3" style={{ color }}>Skills</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill) => (
                <span key={skill.id} className="px-3 py-1 font-bold text-xs text-white" style={{ backgroundColor: color }}>
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
