import { ResumeData } from "@/lib/schema";

interface Props {
  data: ResumeData;
  color: string;
  font: "sans" | "serif" | "mono";
}

export function StylishTemplate({ data, color, font }: Props) {
  const fontClass = font === "serif" ? "font-serif" : font === "mono" ? "font-mono" : "font-sans";

  return (
    <div className={`w-full h-full bg-gray-50 ${fontClass}`} style={{ fontSize: "11px" }}>
      {/* Stylish Header */}
      <div className="p-8 bg-white border-b-4" style={{ borderColor: color }}>
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold" style={{ backgroundColor: color }}>
            {(data.personal.fullName || "U").charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{data.personal.fullName || "Your Name"}</h1>
            <p className="text-lg" style={{ color }}>{data.personal.title || "Professional Title"}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 mt-4 text-xs text-gray-500">
          {data.personal.email && <span>{data.personal.email}</span>}
          {data.personal.phone && <span>{data.personal.phone}</span>}
          {data.personal.location && <span>{data.personal.location}</span>}
        </div>
      </div>

      <div className="p-8">
        {/* Summary */}
        {data.personal.summary && (
          <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
            <p className="text-gray-700 italic leading-relaxed">"{data.personal.summary}"</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            {/* Experience */}
            {data.experience.length > 0 && (
              <div className="mb-6">
                <h2 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-8 h-1 rounded" style={{ backgroundColor: color }}></span>
                  Experience
                </h2>
                {data.experience.map((exp) => (
                  <div key={exp.id} className="mb-4 bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-gray-900">{exp.role}</h3>
                      <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: `${color}20`, color }}>{exp.date}</span>
                    </div>
                    <p className="text-gray-600 text-sm">{exp.company}</p>
                    {exp.description && <p className="text-gray-500 mt-2 text-xs">{exp.description}</p>}
                  </div>
                ))}
              </div>
            )}

            {/* Education */}
            {data.education.length > 0 && (
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-8 h-1 rounded" style={{ backgroundColor: color }}></span>
                  Education
                </h2>
                {data.education.map((edu) => (
                  <div key={edu.id} className="mb-3 bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                    <p className="text-gray-600 text-sm">{edu.school} • {edu.date}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="col-span-1">
            {data.skills.length > 0 && (
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color }}>Skills</h2>
                <div className="space-y-2">
                  {data.skills.map((skill) => (
                    <div key={skill.id} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></span>
                      <span className="text-gray-700 text-xs">{skill.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
