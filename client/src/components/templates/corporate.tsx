import { ResumeData } from "@/lib/schema";

interface Props {
  data: ResumeData;
  color: string;
  font: "sans" | "serif" | "mono";
}

export function CorporateTemplate({ data, color, font }: Props) {
  const fontClass = font === "serif" ? "font-serif" : font === "mono" ? "font-mono" : "font-sans";

  return (
    <div className={`w-full h-full bg-white ${fontClass}`} style={{ fontSize: "11px" }}>
      {/* Corporate Header */}
      <div className="p-6 text-white" style={{ backgroundColor: color }}>
        <h1 className="text-3xl font-bold mb-1">{data.personal.fullName || "Your Name"}</h1>
        <p className="text-lg opacity-90 mb-3">{data.personal.title || "Professional Title"}</p>
        <div className="flex flex-wrap gap-4 text-xs opacity-80">
          {data.personal.email && <span>{data.personal.email}</span>}
          {data.personal.phone && <span>{data.personal.phone}</span>}
          {data.personal.location && <span>{data.personal.location}</span>}
        </div>
      </div>

      <div className="p-6">
        {/* Summary */}
        {data.personal.summary && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-sm font-bold mb-2" style={{ color }}>Executive Summary</h2>
            <p className="text-gray-700">{data.personal.summary}</p>
          </div>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-bold uppercase border-b-2 pb-2 mb-4" style={{ color, borderColor: color }}>
              Professional Experience
            </h2>
            {data.experience.map((exp) => (
              <div key={exp.id} className="mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">{exp.role}</h3>
                    <p className="font-medium" style={{ color }}>{exp.company}</p>
                  </div>
                  <span className="text-gray-500 text-xs bg-gray-100 px-2 py-1 rounded">{exp.date}</span>
                </div>
                {exp.description && <p className="text-gray-600 mt-2">{exp.description}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-bold uppercase border-b-2 pb-2 mb-4" style={{ color, borderColor: color }}>
              Education
            </h2>
            {data.education.map((edu) => (
              <div key={edu.id} className="mb-3 flex justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                  <p className="text-gray-600">{edu.school}</p>
                </div>
                <span className="text-gray-500 text-xs">{edu.date}</span>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <div>
            <h2 className="text-sm font-bold uppercase border-b-2 pb-2 mb-3" style={{ color, borderColor: color }}>
              Core Competencies
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill) => (
                <span key={skill.id} className="px-3 py-1 rounded-full text-xs font-medium text-white" style={{ backgroundColor: color }}>
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
