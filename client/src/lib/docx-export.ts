import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from "docx";
import { ResumeData } from "./schema";
import { saveAs } from "file-saver";

export const exportToWord = async (data: ResumeData) => {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Header - Name and Title
          new Paragraph({
            text: data.personal.fullName,
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: data.personal.title,
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),

          // Contact Info
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [
              new TextRun({ text: `${data.personal.email} | ${data.personal.phone} | ${data.personal.location}` }),
              ...(data.personal.website ? [new TextRun({ text: ` | ${data.personal.website}` })] : []),
            ],
          }),

          // Summary
          ...(data.personal.summary ? [
            new Paragraph({
              text: "Professional Summary",
              heading: HeadingLevel.HEADING_1,
              border: {
                bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 },
              },
              spacing: { before: 400, after: 200 },
            }),
            new Paragraph({
              text: data.personal.summary,
              spacing: { after: 400 },
            }),
          ] : []),

          // Experience
          new Paragraph({
            text: "Experience",
            heading: HeadingLevel.HEADING_1,
            border: {
              bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 },
            },
            spacing: { before: 400, after: 200 },
          }),
          ...data.experience.flatMap((exp) => [
            new Paragraph({
              children: [
                new TextRun({ text: exp.role, bold: true, size: 24 }),
                new TextRun({ text: ` at ${exp.company}`, bold: true }),
              ],
              spacing: { before: 200 },
            }),
            new Paragraph({
              text: exp.date,
              alignment: AlignmentType.RIGHT,
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: exp.description,
              spacing: { after: 300 },
            }),
          ]),

          // Education
          new Paragraph({
            text: "Education",
            heading: HeadingLevel.HEADING_1,
            border: {
              bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 },
            },
            spacing: { before: 400, after: 200 },
          }),
          ...data.education.flatMap((edu) => [
            new Paragraph({
              children: [
                new TextRun({ text: edu.school, bold: true, size: 24 }),
              ],
              spacing: { before: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: edu.degree }),
                new TextRun({ text: ` - ${edu.date}`, bold: false }),
              ],
              spacing: { after: 100 },
            }),
            ...(edu.description ? [new Paragraph({ text: edu.description, spacing: { after: 300 } })] : []),
          ]),

          // Skills
          new Paragraph({
            text: "Skills",
            heading: HeadingLevel.HEADING_1,
            border: {
              bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 },
            },
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            text: data.skills.map((s) => s.name).join(", "),
            spacing: { after: 400 },
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${data.personal.fullName.replace(/\s+/g, "_")}_Resume.docx`);
};
