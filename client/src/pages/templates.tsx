import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search, Filter } from "lucide-react";
import { templates, TemplateConfig } from "@/lib/templates";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";

export default function Templates() {
  const [_, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");

  const handleSelectTemplate = (id: string) => {
    setLocation(`/build?template=${id}`);
  };

  const filteredTemplates = useMemo(() => {
    return templates.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || 
                          t.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "all" || t.layout === category;
      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  const categories = ["all", "modern", "classic", "minimal", "executive", "creative"];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
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
            Available in PDF and Word formats.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map(cat => (
            <Button
              key={cat}
              variant={category === cat ? "default" : "outline"}
              onClick={() => setCategory(cat)}
              className="capitalize rounded-full"
              size="sm"
            >
              {cat}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.05, 0.5) }} // Cap stagger delay
              className="group relative bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:border-primary/50 transition-all duration-300 cursor-pointer"
              onClick={() => handleSelectTemplate(template.id)}
            >
              {/* Preview Mockup Area */}
              <div className="aspect-[1/1.414] bg-slate-100 relative overflow-hidden group-hover:bg-slate-50 transition-colors">
                 {/* Abstract representation of the template */}
                 <div className="absolute inset-4 bg-white shadow-sm rounded flex flex-col overflow-hidden pointer-events-none select-none transform group-hover:scale-[1.02] transition-transform duration-500">
                   {/* Header */}
                   <div className="h-16 w-full flex flex-col justify-center px-4 gap-1" style={{ 
                     backgroundColor: template.layout === 'modern' ? '#f8fafc' : 
                                      template.layout === 'executive' ? 'white' : 
                                      template.layout === 'creative' ? 'white' : 'white',
                     borderBottom: template.layout === 'executive' ? `2px solid ${template.color}` : 'none',
                     borderLeft: template.layout === 'modern' ? `4px solid ${template.color}` : 'none'
                   }}>
                      <div className="h-2 w-1/2 rounded-full bg-slate-800" style={{ color: template.color }}></div>
                      <div className="h-1.5 w-1/3 rounded-full bg-slate-400"></div>
                   </div>
                   
                   {/* Body */}
                   <div className="flex-1 flex">
                     {template.layout === 'modern' && (
                       <div className="w-1/3 bg-slate-900 h-full"></div>
                     )}
                     <div className="flex-1 p-3 space-y-3">
                        <div className="space-y-1">
                          <div className="h-1.5 w-16 bg-slate-200 rounded"></div>
                          <div className="h-1 w-full bg-slate-100 rounded"></div>
                          <div className="h-1 w-full bg-slate-100 rounded"></div>
                        </div>
                        <div className="space-y-1">
                          <div className="h-1.5 w-16 bg-slate-200 rounded"></div>
                          <div className="h-1 w-full bg-slate-100 rounded"></div>
                          <div className="h-1 w-full bg-slate-100 rounded"></div>
                        </div>
                     </div>
                   </div>
                 </div>

                 {/* Overlay on Hover */}
                 <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors flex items-center justify-center">
                   <Button className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl">
                     Use Template
                   </Button>
                 </div>
              </div>

              <div className="p-4 border-t border-slate-100">
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
      </main>
    </div>
  );
}
