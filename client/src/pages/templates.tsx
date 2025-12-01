import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check } from "lucide-react";
import { templates } from "@/lib/templates";
import { motion } from "framer-motion";
import { useLocation } from "wouter";

export default function Templates() {
  const [_, setLocation] = useLocation();

  const handleSelectTemplate = (id: string) => {
    setLocation(`/build?template=${id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-slate-900">Choose a Template</h1>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Professional Resume Templates</h2>
          <p className="text-slate-600">
            Select from our collection of 20+ professionally designed templates. 
            Each template is optimized for ATS compatibility and readability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {templates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
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
                    <h3 className="font-bold text-slate-900">{template.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">{template.description}</p>
                  </div>
                  <div 
                    className="w-4 h-4 rounded-full border border-slate-200 shadow-sm" 
                    style={{ backgroundColor: template.color }}
                    title={`Color: ${template.color}`}
                  ></div>
                </div>
                <div className="mt-3 flex gap-2">
                  <span className="text-[10px] font-medium uppercase tracking-wider px-2 py-1 bg-slate-100 text-slate-600 rounded">
                    {template.layout}
                  </span>
                  <span className="text-[10px] font-medium uppercase tracking-wider px-2 py-1 bg-slate-100 text-slate-600 rounded">
                    {template.font}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
