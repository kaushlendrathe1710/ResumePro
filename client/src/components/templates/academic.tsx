import { ResumeData } from "@/lib/schema";

interface Props {
  data: ResumeData;
  color: string;
  font: "sans" | "serif" | "mono";
}

export function AcademicTemplate({ data, color, font }: Props) {
  return (
    <div className="w-full h-full bg-white p-8 font-serif" style={{ fontSize: "11px" }}>
      {/* Academic Header */}
      <div className="text-center mb-6 pb-4 border-b-2 border-gray-300">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">{data.personal.fullName || "Your Name"}</h1>
        <p className="text-lg text-gray-600 italic mb-3">{data.personal.title || "Academic Title"}</p>
        <div className="flex justify-center flex-wrap gap-4 text-xs text-gray-500">
          {data.personal.email && <span>{data.personal.email}</span>}
          {data.personal.phone && <span>|</span>}
          {data.personal.phone && <span>{data.personal.phone}</span>}
          {data.personal.location && <span>|</span>}
          {data.personal.location && <span>{data.personal.location}</span>}
        </div>
      </div>

      {/* Research Interests / Summary */}
      {data.personal.summary && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color }}>Research Interests</h2>
          <p className="text-gray-700 leading-relaxed text-justify">{data.personal.summary}</p>
        </div>
      )}

      {/* Education - First for academic CV */}
      {data.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-3 border-b pb-1" style={{ color, borderColor: color }}>
            Education
          </h2>
          {data.education.map((edu) => (
            <div key={edu.id} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                  <p className="italic text-gray-600">{edu.school}</p>
                </div>
                <span className="text-gray-500 text-xs">{edu.date}</span>
              </div>
              {edu.description && <p className="text-gray-600 mt-1 text-sm">{edu.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-3 border-b pb-1" style={{ color, borderColor: color }}>
            Professional Experience
          </h2>
          {data.experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900">{exp.role}</h3>
                  <p className="italic text-gray-600">{exp.company}</p>
                </div>
                <span className="text-gray-500 text-xs">{exp.date}</span>
              </div>
              {exp.description && <p className="text-gray-600 mt-1">{exp.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider mb-2 border-b pb-1" style={{ color, borderColor: color }}>
            Technical Skills
          </h2>
          <p className="text-gray-700">
            {data.skills.map((skill) => skill.name).join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}
