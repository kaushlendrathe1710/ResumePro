import { z } from "zod";

// Section types for different content formats
export const sectionTypes = ["experience", "education", "skills", "projects", "bullets", "text"] as const;
export type SectionType = typeof sectionTypes[number];

// Predefined section keys (built-in sections)
export const defaultSectionKeys = ["experience", "education", "skills"] as const;

// Custom section item schemas based on type
export const experienceItemSchema = z.object({
  id: z.string(),
  company: z.string().min(1, "Company name is required"),
  role: z.string().min(1, "Role is required"),
  date: z.string().min(1, "Date range is required"),
  description: z.string().min(1, "Description is required"),
});

export const educationItemSchema = z.object({
  id: z.string(),
  school: z.string().min(1, "School name is required"),
  degree: z.string().min(1, "Degree is required"),
  date: z.string().min(1, "Date range is required"),
  description: z.string().optional(),
});

export const skillItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Skill name is required"),
});

export const projectItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Project title is required"),
  description: z.string().min(1, "Description is required"),
  link: z.string().url().optional().or(z.literal("")),
  date: z.string().optional(),
});

export const bulletItemSchema = z.object({
  id: z.string(),
  text: z.string().min(1, "Item text is required"),
});

export const textItemSchema = z.object({
  id: z.string(),
  content: z.string().min(1, "Content is required"),
});

// Custom section schema
export const customSectionSchema = z.object({
  id: z.string(),
  key: z.string(),
  title: z.string().min(1, "Section title is required"),
  type: z.enum(sectionTypes),
  enabled: z.boolean().default(true),
  order: z.number(),
  items: z.array(z.union([
    experienceItemSchema,
    educationItemSchema,
    skillItemSchema,
    projectItemSchema,
    bulletItemSchema,
    textItemSchema,
  ])),
});

export type CustomSection = z.infer<typeof customSectionSchema>;
export type ExperienceItem = z.infer<typeof experienceItemSchema>;
export type EducationItem = z.infer<typeof educationItemSchema>;
export type SkillItem = z.infer<typeof skillItemSchema>;
export type ProjectItem = z.infer<typeof projectItemSchema>;
export type BulletItem = z.infer<typeof bulletItemSchema>;
export type TextItem = z.infer<typeof textItemSchema>;

// Main resume schema - now with flexible sections
export const resumeSchema = z.object({
  personal: z.object({
    fullName: z.string().min(1, "Full name is required"),
    title: z.string().min(1, "Professional title is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required"),
    location: z.string().min(1, "Location is required"),
    summary: z.string().optional(),
    website: z.string().url().optional().or(z.literal("")),
  }),
  // Keep legacy fields for backward compatibility
  experience: z.array(experienceItemSchema),
  education: z.array(educationItemSchema),
  skills: z.array(skillItemSchema),
  // New flexible sections system
  customSections: z.array(customSectionSchema).optional(),
  // Section ordering and visibility
  sectionOrder: z.array(z.string()).optional(),
  sectionVisibility: z.record(z.string(), z.boolean()).optional(),
});

export type ResumeData = z.infer<typeof resumeSchema>;

// Helper to get ordered and visible sections
export function getOrderedSections(data: ResumeData): { key: string; title: string; type: SectionType; enabled: boolean }[] {
  const defaultSections = [
    { key: "experience", title: "Experience", type: "experience" as SectionType },
    { key: "education", title: "Education", type: "education" as SectionType },
    { key: "skills", title: "Skills", type: "skills" as SectionType },
  ];
  
  const customSections = (data.customSections || []).map(s => ({
    key: s.key,
    title: s.title,
    type: s.type,
  }));
  
  const allSections = [...defaultSections, ...customSections];
  const order = data.sectionOrder || defaultSections.map(s => s.key);
  const visibility = data.sectionVisibility || {};
  
  // Get sections that are in the order array
  const orderedSections = order
    .map(key => {
      const section = allSections.find(s => s.key === key);
      if (!section) return null;
      return {
        ...section,
        enabled: visibility[key] !== false,
      };
    })
    .filter((s): s is NonNullable<typeof s> => s !== null);
  
  // Append any custom sections that aren't in the order array yet
  const orderedKeys = new Set(order);
  const missingCustomSections = customSections
    .filter(s => !orderedKeys.has(s.key))
    .map(s => ({
      ...s,
      enabled: visibility[s.key] !== false,
    }));
  
  return [...orderedSections, ...missingCustomSections];
}

// Section type labels for UI
export const sectionTypeLabels: Record<SectionType, string> = {
  experience: "Work Experience",
  education: "Education",
  skills: "Skills / Tags",
  projects: "Projects",
  bullets: "Bullet Points",
  text: "Text Paragraph",
};

// Suggested custom sections
export const suggestedSections = [
  { key: "projects", title: "Projects", type: "projects" as SectionType },
  { key: "certifications", title: "Certifications", type: "bullets" as SectionType },
  { key: "languages", title: "Languages", type: "skills" as SectionType },
  { key: "hobbies", title: "Hobbies & Interests", type: "bullets" as SectionType },
  { key: "achievements", title: "Achievements", type: "bullets" as SectionType },
  { key: "publications", title: "Publications", type: "bullets" as SectionType },
  { key: "volunteer", title: "Volunteer Experience", type: "experience" as SectionType },
  { key: "references", title: "References", type: "text" as SectionType },
];

export const defaultResumeData: ResumeData = {
  personal: {
    fullName: "Alex Morgan",
    title: "Senior Product Designer",
    email: "alex@example.com",
    phone: "+1 (555) 012-3456",
    location: "San Francisco, CA",
    summary: "Creative and detail-oriented Product Designer with 6+ years of experience in building user-centric digital products. Passionate about solving complex problems through elegant design solutions. Proven track record of leading design teams and delivering high-impact projects.",
    website: "portfolio.alexmorgan.com",
  },
  experience: [
    {
      id: "1",
      company: "TechFlow Inc.",
      role: "Senior Product Designer",
      date: "2021 - Present",
      description: "Leading the design system initiative and overseeing the UX for the core product suite. Collaborating with cross-functional teams to deliver seamless user experiences. Mentoring junior designers and establishing design best practices.",
    },
    {
      id: "2",
      company: "Creative Studio",
      role: "UX/UI Designer",
      date: "2018 - 2021",
      description: "Designed responsive web applications and mobile interfaces for various clients. Conducted user research and usability testing to inform design decisions. Created interactive prototypes and high-fidelity mockups.",
    },
  ],
  education: [
    {
      id: "1",
      school: "Design Institute of Technology",
      degree: "Bachelor of Fine Arts in Interaction Design",
      date: "2014 - 2018",
      description: "Graduated with Honors. Specialized in Human-Computer Interaction.",
    },
  ],
  skills: [
    { id: "1", name: "UI/UX Design" },
    { id: "2", name: "Figma" },
    { id: "3", name: "Prototyping" },
    { id: "4", name: "User Research" },
    { id: "5", name: "Design Systems" },
    { id: "6", name: "HTML/CSS" },
  ],
  customSections: [],
  sectionOrder: ["experience", "education", "skills"],
  sectionVisibility: {
    experience: true,
    education: true,
    skills: true,
  },
};
