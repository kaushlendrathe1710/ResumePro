export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  layout: "modern" | "classic" | "minimal" | "executive" | "creative";
  color: string;
  font: "sans" | "serif" | "mono";
  thumbnail?: string;
}

// Helper to generate variations
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

const layouts = ["modern", "classic", "minimal", "executive", "creative"] as const;
const fonts = ["sans", "serif", "mono"] as const;

const generateTemplates = (): TemplateConfig[] => {
  const temps: TemplateConfig[] = [];
  let count = 0;

  // Hand-picked curated list to ensure quality over just random combos
  // Modern - Clean, Professional
  colors.forEach((color) => {
    temps.push({
      id: `modern-${color.name.toLowerCase()}`,
      name: `Modern ${color.name}`,
      description: `Clean professional design with ${color.name} accents`,
      layout: "modern",
      color: color.value,
      font: "sans"
    });
  });

  // Classic - Traditional, Timeless
  colors.forEach((color) => {
    temps.push({
      id: `classic-${color.name.toLowerCase()}`,
      name: `Classic ${color.name}`,
      description: `Timeless serif layout with ${color.name} headers`,
      layout: "classic",
      color: color.value,
      font: "serif"
    });
  });

  // Minimal - Stark, High Contrast
  colors.forEach((color) => {
    temps.push({
      id: `minimal-${color.name.toLowerCase()}`,
      name: `Minimal ${color.name}`,
      description: `High contrast minimalist design in ${color.name}`,
      layout: "minimal",
      color: color.value,
      font: "sans"
    });
  });

  // Executive - Bold, Commanding
  colors.forEach((color) => {
    temps.push({
      id: `executive-${color.name.toLowerCase()}`,
      name: `Executive ${color.name}`,
      description: `Commanding executive layout in ${color.name}`,
      layout: "executive",
      color: color.value,
      font: "sans"
    });
  });

  // Creative - Unique, Bold
  colors.forEach((color) => {
    temps.push({
      id: `creative-${color.name.toLowerCase()}`,
      name: `Creative ${color.name}`,
      description: `Bold creative layout using ${color.name}`,
      layout: "creative",
      color: color.value,
      font: "sans"
    });
  });

  return temps;
};

export const templates: TemplateConfig[] = generateTemplates();
