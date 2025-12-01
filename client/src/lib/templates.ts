export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  layout: "modern" | "classic" | "minimal" | "executive" | "creative";
  color: string;
  font: "sans" | "serif" | "mono";
  thumbnail?: string;
}

export const templates: TemplateConfig[] = [
  // Modern Layout Variations
  { id: "modern-blue", name: "Modern Blue", description: "Clean and professional with blue accents", layout: "modern", color: "#2563eb", font: "sans" },
  { id: "modern-red", name: "Modern Bold", description: "Stand out with strong red highlights", layout: "modern", color: "#dc2626", font: "sans" },
  { id: "modern-teal", name: "Modern Teal", description: "Fresh and contemporary look", layout: "modern", color: "#0d9488", font: "sans" },
  { id: "modern-purple", name: "Modern Creative", description: "Unique purple tones for creatives", layout: "modern", color: "#7c3aed", font: "sans" },
  
  // Classic Layout Variations
  { id: "classic-serif", name: "Classic Serif", description: "Timeless elegance for traditional roles", layout: "classic", color: "#1e293b", font: "serif" },
  { id: "classic-navy", name: "Executive Navy", description: "Deep navy for a corporate feel", layout: "classic", color: "#172554", font: "serif" },
  { id: "classic-clean", name: "Classic Sans", description: "Traditional layout with modern type", layout: "classic", color: "#334155", font: "sans" },
  { id: "classic-forest", name: "Classic Forest", description: "Subtle green for a natural touch", layout: "classic", color: "#166534", font: "serif" },

  // Minimal Layout Variations
  { id: "minimal-bw", name: "Minimal Mono", description: "High contrast black and white", layout: "minimal", color: "#000000", font: "mono" },
  { id: "minimal-gray", name: "Minimal Slate", description: "Softer dark gray for readability", layout: "minimal", color: "#374151", font: "sans" },
  { id: "minimal-accent", name: "Minimal Pop", description: "Minimalist with a yellow pop", layout: "minimal", color: "#ca8a04", font: "sans" },
  { id: "minimal-indigo", name: "Minimal Indigo", description: "Clean with deep indigo text", layout: "minimal", color: "#3730a3", font: "sans" },

  // Executive Layout Variations
  { id: "executive-gold", name: "Executive Gold", description: "Premium look for senior roles", layout: "executive", color: "#b45309", font: "serif" },
  { id: "executive-slate", name: "Director Slate", description: "Serious and commanding", layout: "executive", color: "#0f172a", font: "sans" },
  { id: "executive-blue", name: "Corporate Blue", description: "Trustworthy and established", layout: "executive", color: "#1e40af", font: "sans" },
  { id: "executive-burgundy", name: "Boardroom Red", description: "Powerful and distinctive", layout: "executive", color: "#7f1d1d", font: "serif" },

  // Creative Layout Variations
  { id: "creative-pink", name: "Creative Blush", description: "Soft and approachable", layout: "creative", color: "#db2777", font: "sans" },
  { id: "creative-orange", name: "Creative Energetic", description: "High energy and warm", layout: "creative", color: "#ea580c", font: "sans" },
  { id: "creative-violet", name: "Creative Ultra", description: "Modern digital aesthetic", layout: "creative", color: "#5b21b6", font: "sans" },
  { id: "creative-lime", name: "Creative Fresh", description: "Stand out from the stack", layout: "creative", color: "#65a30d", font: "mono" },
];
