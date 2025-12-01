import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search, LogOut } from "lucide-react";
import { templates, TemplateConfig, allLayouts, LayoutType } from "@/lib/templates";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useState, useMemo, useEffect } from "react";
import { ResumeData } from "@/lib/schema";
import { ModernTemplate } from "@/components/templates/modern";
import { ClassicTemplate } from "@/components/templates/classic";
import { MinimalTemplate } from "@/components/templates/minimal";
import { ExecutiveTemplate } from "@/components/templates/executive";
import { CreativeTemplate } from "@/components/templates/creative";
import { ProfessionalTemplate } from "@/components/templates/professional";
import { ElegantTemplate } from "@/components/templates/elegant";
import { TechTemplate } from "@/components/templates/tech";
import { CorporateTemplate } from "@/components/templates/corporate";
import { AcademicTemplate } from "@/components/templates/academic";
import { SimpleTemplate } from "@/components/templates/simple";
import { BoldTemplate } from "@/components/templates/bold";
import { StylishTemplate } from "@/components/templates/stylish";
import { CompactTemplate } from "@/components/templates/compact";
import { SidebarTemplate } from "@/components/templates/sidebar";
import { TimelineTemplate } from "@/components/templates/timeline";
import { InfographicTemplate } from "@/components/templates/infographic";
import { CleanTemplate } from "@/components/templates/clean";
import { GradientTemplate } from "@/components/templates/gradient";
import { SharpTemplate } from "@/components/templates/sharp";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const previewData: ResumeData = {
  personal: {
    fullName: "Alex Morgan",
    title: "Product Designer",
    email: "alex@example.com",
    phone: "+1 555 0123",
    location: "San Francisco",
    summary: "Creative designer with 6+ years of experience building digital products.",
    website: "alex.design",
  },
  experience: [
    {
      id: "1",
      company: "TechFlow",
      role: "Senior Designer",
      date: "2021-Pres",
      description: "Leading design system initiative and overseeing UX.",
    },
    {
      id: "2",
      company: "Creative Studio",
      role: "UX Designer",
      date: "2018-2021",
      description: "Designed responsive web apps for various clients.",
    },
  ],
  education: [
    {
      id: "1",
      school: "Design Institute",
      degree: "BFA Design",
      date: "2018",
      description: "",
    },
  ],
  skills: [
    { id: "1", name: "UI/UX" },
    { id: "2", name: "Figma" },
    { id: "3", name: "React" },
  ],
};

const MiniPreview = ({ template }: { template: TemplateConfig }) => {
  const props = {
    data: previewData,
    color: template.color,
    font: template.font,
  };

  const renderTemplate = () => {
    switch (template.layout as LayoutType) {
      case "modern": return <ModernTemplate {...props} />;
      case "classic": return <ClassicTemplate {...props} />;
      case "minimal": return <MinimalTemplate {...props} />;
      case "executive": return <ExecutiveTemplate {...props} />;
      case "creative": return <CreativeTemplate {...props} />;
      case "professional": return <ProfessionalTemplate {...props} />;
      case "elegant": return <ElegantTemplate {...props} />;
      case "tech": return <TechTemplate {...props} />;
      case "corporate": return <CorporateTemplate {...props} />;
      case "academic": return <AcademicTemplate {...props} />;
      case "simple": return <SimpleTemplate {...props} />;
      case "bold": return <BoldTemplate {...props} />;
      case "stylish": return <StylishTemplate {...props} />;
      case "compact": return <CompactTemplate {...props} />;
      case "sidebar": return <SidebarTemplate {...props} />;
      case "timeline": return <TimelineTemplate {...props} />;
      case "infographic": return <InfographicTemplate {...props} />;
      case "clean": return <CleanTemplate {...props} />;
      case "gradient": return <GradientTemplate {...props} />;
      case "sharp": return <SharpTemplate {...props} />;
      default: return <ModernTemplate {...props} />;
    }
  };

  return (
    <div className="w-[200%] h-[200%] origin-top-left scale-[0.5] pointer-events-none select-none bg-white overflow-hidden">
      {renderTemplate()}
    </div>
  );
};

export default function Templates() {
  const [_, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        setLocation("/login");
      }
    } catch (error) {
      setLocation("/login");
    }
  };

  const handleSelectTemplate = (id: string) => {
    setLocation(`/build?template=${id}`);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setLocation("/");
  };

  const filteredTemplates = useMemo(() => {
    return templates.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || 
                          t.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "all" || t.layout === category;
      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  const categories = ["all", ...allLayouts];

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900">
                <ArrowLeft className="w-4 h-4 mr-2" /> Dashboard
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-slate-900">Template Gallery</h1>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input 
                placeholder="Search templates..." 
                className="pl-9 bg-slate-100 border-transparent focus:bg-white transition-colors"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            {templates.length}+ Professional Templates
          </h2>
          <p className="text-slate-600">
            Choose from our extensive collection of free, professional resume templates.
            20 unique layouts with 20 color variations each.
          </p>
        </div>

        {/* Category Filter with horizontal scroll */}
        <div className="mb-12">
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex justify-center gap-2 pb-4">
              {categories.map(cat => (
                <Button
                  key={cat}
                  variant={category === cat ? "default" : "outline"}
                  onClick={() => setCategory(cat)}
                  className="capitalize rounded-full shrink-0"
                  size="sm"
                >
                  {cat}
                </Button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.03, 0.3) }}
              className="group relative bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:border-primary/50 transition-all duration-300 cursor-pointer"
              onClick={() => handleSelectTemplate(template.id)}
            >
              <div className="aspect-[1/1.414] bg-slate-100 relative overflow-hidden group-hover:bg-slate-50 transition-colors">
                 <MiniPreview template={template} />

                 <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors flex items-center justify-center z-20">
                   <Button className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl">
                     Use Template
                   </Button>
                 </div>
              </div>

              <div className="p-4 border-t border-slate-100 relative z-30 bg-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900 truncate pr-4">{template.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">{template.description}</p>
                  </div>
                  <div 
                    className="w-4 h-4 rounded-full border border-slate-200 shadow-sm shrink-0" 
                    style={{ backgroundColor: template.color }}
                    title={`Color: ${template.color}`}
                  ></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-500">No templates found matching your criteria.</p>
            <Button variant="link" onClick={() => { setSearch(""); setCategory("all"); }}>
              Clear filters
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
