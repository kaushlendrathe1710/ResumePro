import { z } from "zod";

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
  experience: z.array(
    z.object({
      id: z.string(),
      company: z.string().min(1, "Company name is required"),
      role: z.string().min(1, "Role is required"),
      date: z.string().min(1, "Date range is required"),
      description: z.string().min(1, "Description is required"),
    })
  ),
  education: z.array(
    z.object({
      id: z.string(),
      school: z.string().min(1, "School name is required"),
      degree: z.string().min(1, "Degree is required"),
      date: z.string().min(1, "Date range is required"),
      description: z.string().optional(),
    })
  ),
  skills: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1, "Skill name is required"),
    })
  ),
});

export type ResumeData = z.infer<typeof resumeSchema>;

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
};
