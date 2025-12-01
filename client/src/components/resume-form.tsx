import React from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { ResumeData } from "@/lib/schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface ResumeFormProps {
  form: UseFormReturn<ResumeData>;
}

export const ResumeForm: React.FC<ResumeFormProps> = ({ form }) => {
  const { register, control, formState: { errors } } = form;

  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({
    control,
    name: "experience",
  });

  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({
    control,
    name: "education",
  });

  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({
    control,
    name: "skills",
  });

  return (
    <div className="h-full overflow-y-auto p-6 bg-slate-50/50">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Resume Details</h2>
          <p className="text-slate-500">Fill in your information to generate your resume.</p>
        </div>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="personal.fullName">Full Name</Label>
                    <Input id="personal.fullName" {...register("personal.fullName")} placeholder="John Doe" />
                    {errors.personal?.fullName && <p className="text-xs text-red-500">{errors.personal.fullName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="personal.title">Job Title</Label>
                    <Input id="personal.title" {...register("personal.title")} placeholder="Software Engineer" />
                    {errors.personal?.title && <p className="text-xs text-red-500">{errors.personal.title.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="personal.email">Email</Label>
                    <Input id="personal.email" {...register("personal.email")} placeholder="john@example.com" />
                    {errors.personal?.email && <p className="text-xs text-red-500">{errors.personal.email.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="personal.phone">Phone</Label>
                    <Input id="personal.phone" {...register("personal.phone")} placeholder="+1 (555) 000-0000" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="personal.location">Location</Label>
                    <Input id="personal.location" {...register("personal.location")} placeholder="New York, NY" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="personal.website">Website (Optional)</Label>
                    <Input id="personal.website" {...register("personal.website")} placeholder="portfolio.com" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="personal.summary">Professional Summary</Label>
                  <Textarea 
                    id="personal.summary" 
                    {...register("personal.summary")} 
                    placeholder="Brief summary of your career and goals..." 
                    className="h-32"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experience" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-4">
              {expFields.map((field, index) => (
                <Card key={field.id} className="relative group">
                  <CardContent className="pt-6 space-y-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeExp(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Company</Label>
                        <Input {...register(`experience.${index}.company`)} placeholder="Company Name" />
                      </div>
                      <div className="space-y-2">
                        <Label>Role</Label>
                        <Input {...register(`experience.${index}.role`)} placeholder="Job Title" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Date Range</Label>
                      <Input {...register(`experience.${index}.date`)} placeholder="Jan 2020 - Present" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea 
                        {...register(`experience.${index}.description`)} 
                        placeholder="Describe your responsibilities and achievements..." 
                        className="h-24"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Button 
                type="button" 
                variant="outline" 
                className="w-full border-dashed border-2 py-8 text-slate-500 hover:text-primary hover:border-primary"
                onClick={() => appendExp({ id: crypto.randomUUID(), company: "", role: "", date: "", description: "" })}
              >
                <Plus className="w-4 h-4 mr-2" /> Add Experience
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="education" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-4">
              {eduFields.map((field, index) => (
                <Card key={field.id} className="relative group">
                  <CardContent className="pt-6 space-y-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeEdu(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>School</Label>
                        <Input {...register(`education.${index}.school`)} placeholder="University Name" />
                      </div>
                      <div className="space-y-2">
                        <Label>Degree</Label>
                        <Input {...register(`education.${index}.degree`)} placeholder="Bachelor's in..." />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Date Range</Label>
                      <Input {...register(`education.${index}.date`)} placeholder="2016 - 2020" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Description (Optional)</Label>
                      <Textarea 
                        {...register(`education.${index}.description`)} 
                        placeholder="Honors, relevant coursework..." 
                        className="h-20"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Button 
                type="button" 
                variant="outline" 
                className="w-full border-dashed border-2 py-8 text-slate-500 hover:text-primary hover:border-primary"
                onClick={() => appendEdu({ id: crypto.randomUUID(), school: "", degree: "", date: "", description: "" })}
              >
                <Plus className="w-4 h-4 mr-2" /> Add Education
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4">
                  {skillFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <Input {...register(`skills.${index}.name`)} placeholder="Skill (e.g. React)" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-slate-400 hover:text-red-500"
                        onClick={() => removeSkill(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="mt-6 w-full border-dashed border-2 text-slate-500 hover:text-primary hover:border-primary"
                  onClick={() => appendSkill({ id: crypto.randomUUID(), name: "" })}
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Skill
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
