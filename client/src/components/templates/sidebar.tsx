import { ResumeData } from "@/lib/schema";

interface Props {
  data: ResumeData;
  color: string;
  font: "sans" | "serif" | "mono";
}

export function SidebarTemplate({ data, color, font }: Props) {
  const fontClass = font === "serif" ? "font-serif" : font === "mono" ? "font-mono" : "font-sans";

  return (
    <div className={`w-full h-full bg-white flex ${fontClass}`} style={{ fontSize: "10px" }}>
      {/* Sidebar */}
      <div className="w-1/3 text-white p-6" style={{ backgroundColor: color }}>
        <div className="mb-6">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold mb-4">
            {(data.personal.fullName || "U").charAt(0)}
          </div>
          <h1 className="text-lg font-bold leading-tight">{data.personal.fullName || "Your Name"}</h1>
          <p className="text-sm opacity-80 mt-1">{data.personal.title || "Professional Title"}</p>
        </div>

        {/* Contact */}
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2 opacity-80">Contact</h2>
          <div className="space-y-1 text-xs opacity-90">
            {data.personal.email && <p>{data.personal.email}</p>}
            {data.personal.phone && <p>{data.personal.phone}</p>}
            {data.personal.location && <p>{data.personal.location}</p>}
            {data.personal.website && <p>{data.personal.website}</p>}
          </div>
        </div>

        {/* Skills */}
        {data.skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-2 opacity-80">Skills</h2>
            <div className="space-y-1">
              {data.skills.map((skill) => (
                <div key={skill.id} className="flex items-center gap-2 text-xs">
                  <span className="w-1.5 h-1.5 bg-white/60 rounded-full"></span>
                  <span className="opacity-90">{skill.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education in sidebar */}
        {data.education.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-2 opacity-80">Education</h2>
            {data.education.map((edu) => (
              <div key={edu.id} className="mb-2 text-xs">
                <p className="font-semibold">{edu.degree}</p>
                <p className="opacity-80">{edu.school}</p>
                <p className="opacity-60">{edu.date}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="w-2/3 p-6">
        {/* Summary */}
        {data.personal.summary && (
          <div className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color }}>Profile</h2>
            <p className="text-gray-700 leading-relaxed">{data.personal.summary}</p>
          </div>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color }}>Experience</h2>
            {data.experience.map((exp) => (
              <div key={exp.id} className="mb-4 pl-3 border-l-2" style={{ borderColor: color }}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">{exp.role}</h3>
                    <p className="text-gray-600">{exp.company}</p>
                  </div>
                  <span className="text-gray-500 text-xs">{exp.date}</span>
                </div>
                {exp.description && <p className="text-gray-600 mt-1 text-xs">{exp.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
