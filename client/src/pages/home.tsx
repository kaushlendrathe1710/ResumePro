import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, CheckCircle, Sparkles, Download } from "lucide-react";
import generatedImage from '@assets/generated_images/minimalist_workspace_with_laptop_showing_resume_builder.png';
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/20">
            R
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">ResuMake</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-primary transition-colors">Features</a>
          <a href="#templates" className="hover:text-primary transition-colors">Templates</a>
          <a href="#" className="hover:text-primary transition-colors">About</a>
        </div>
        <Link href="/build">
          <Button className="rounded-full px-6" size="lg">Create Resume</Button>
        </Link>
      </nav>

      <main>
        <section className="container mx-auto px-6 py-20 lg:py-32 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="lg:w-1/2 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold tracking-wide">
              <Sparkles className="w-4 h-4" />
              <span>AI-Enhanced Resume Builder</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1]">
              Build your professional story <span className="text-primary">in minutes</span>.
            </h1>
            
            <p className="text-xl text-slate-600 leading-relaxed max-w-xl">
              Create a polished, professional resume that stands out. No login required initially. Choose from a variety of crafted templates and download instantly.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/build">
                <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all hover:-translate-y-1">
                  Build My Resume <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full border-2">
                View Templates
              </Button>
            </div>
            
            <div className="pt-8 flex items-center gap-8 text-slate-500 text-sm font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Free to try</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>No signup required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Instant PDF download</span>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-violet-100 rounded-full blur-3xl opacity-50 -z-10 transform scale-90"></div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative z-10 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-slate-900/5"
            >
              <img 
                src={generatedImage} 
                alt="Resume Builder Interface" 
                className="w-full h-auto object-cover"
              />
            </motion.div>
            
            {/* Floating Cards */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-slate-100 flex items-center gap-3 max-w-xs z-20"
            >
               <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                 <Download className="w-5 h-5" />
               </div>
               <div>
                 <div className="text-sm font-bold text-slate-900">Instant Export</div>
                 <div className="text-xs text-slate-500">Download as PDF in one click</div>
               </div>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-20 bg-slate-50">
          <div className="container mx-auto px-6">
             <div className="text-center max-w-3xl mx-auto mb-16">
               <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything you need to get hired</h2>
               <p className="text-slate-600 text-lg">Our builder is designed to help you create a resume that passes ATS scanners and catches recruiters' eyes.</p>
             </div>
             
             <div className="grid md:grid-cols-3 gap-8">
               {[
                 { title: "Professional Templates", desc: "Choose from a variety of recruiter-approved templates designed for every industry.", icon: FileText },
                 { title: "Real-time Preview", desc: "See your changes instantly as you type. No more guessing how your resume will look.", icon: Sparkles },
                 { title: "Easy PDF Export", desc: "Download your resume in high-quality PDF format ready for job applications.", icon: Download }
               ].map((feature, i) => (
                 <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                   <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-primary mb-6">
                     <feature.icon className="w-6 h-6" />
                   </div>
                   <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                   <p className="text-slate-600 leading-relaxed">
                     {feature.desc}
                   </p>
                 </div>
               ))}
             </div>
          </div>
        </section>
      </main>
    </div>
  );
}
