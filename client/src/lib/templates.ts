export type LayoutType = 
  | "modern" | "classic" | "minimal" | "executive" | "creative"
  | "professional" | "elegant" | "tech" | "corporate" | "academic"
  | "simple" | "bold" | "stylish" | "compact" | "sidebar"
  | "timeline" | "infographic" | "clean" | "gradient" | "sharp";

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  layout: LayoutType;
  color: string;
  font: "sans" | "serif" | "mono";
  thumbnail?: string;
}

// 20 color options
const colors = [
  { name: "Blue", value: "#2563eb" },
  { name: "Red", value: "#dc2626" },
  { name: "Teal", value: "#0d9488" },
  { name: "Purple", value: "#7c3aed" },
  { name: "Navy", value: "#172554" },
  { name: "Green", value: "#166534" },
  { name: "Black", value: "#000000" },
  { name: "Slate", value: "#334155" },
  { name: "Orange", value: "#ea580c" },
  { name: "Pink", value: "#db2777" },
  { name: "Indigo", value: "#3730a3" },
  { name: "Burgundy", value: "#7f1d1d" },
  { name: "Gold", value: "#b45309" },
  { name: "Emerald", value: "#059669" },
  { name: "Rose", value: "#e11d48" },
  { name: "Cyan", value: "#0891b2" },
  { name: "Violet", value: "#5b21b6" },
  { name: "Amber", value: "#d97706" },
  { name: "Fuchsia", value: "#a21caf" },
  { name: "Sky", value: "#0284c7" }
];

// 20 layout options with descriptions
const layoutConfigs: { layout: LayoutType; description: string; font: "sans" | "serif" | "mono" }[] = [
  { layout: "modern", description: "Clean professional design with", font: "sans" },
  { layout: "classic", description: "Timeless serif layout with", font: "serif" },
  { layout: "minimal", description: "High contrast minimalist design in", font: "sans" },
  { layout: "executive", description: "Commanding executive layout in", font: "sans" },
  { layout: "creative", description: "Bold creative layout using", font: "sans" },
  { layout: "professional", description: "Polished professional style with", font: "sans" },
  { layout: "elegant", description: "Sophisticated elegant design in", font: "serif" },
  { layout: "tech", description: "Modern tech-focused layout with", font: "mono" },
  { layout: "corporate", description: "Business corporate style in", font: "sans" },
  { layout: "academic", description: "Scholarly academic format with", font: "serif" },
  { layout: "simple", description: "Clean and simple layout in", font: "sans" },
  { layout: "bold", description: "Strong bold statement design in", font: "sans" },
  { layout: "stylish", description: "Trendy stylish layout with", font: "sans" },
  { layout: "compact", description: "Space-efficient compact design in", font: "sans" },
  { layout: "sidebar", description: "Two-column sidebar layout with", font: "sans" },
  { layout: "timeline", description: "Timeline-based experience layout in", font: "sans" },
  { layout: "infographic", description: "Visual infographic style with", font: "sans" },
  { layout: "clean", description: "Ultra-clean whitespace design in", font: "sans" },
  { layout: "gradient", description: "Modern gradient accent design with", font: "sans" },
  { layout: "sharp", description: "Sharp angular design in", font: "sans" },
];

const generateTemplates = (): TemplateConfig[] => {
  const temps: TemplateConfig[] = [];

  layoutConfigs.forEach((config) => {
    colors.forEach((color) => {
      temps.push({
        id: `${config.layout}-${color.name.toLowerCase()}`,
        name: `${config.layout.charAt(0).toUpperCase() + config.layout.slice(1)} ${color.name}`,
        description: `${config.description} ${color.name} accents`,
        layout: config.layout,
        color: color.value,
        font: config.font
      });
    });
  });

  return temps;
};

export const templates: TemplateConfig[] = generateTemplates();

// Get all unique layouts for filtering
export const allLayouts = layoutConfigs.map(c => c.layout);
