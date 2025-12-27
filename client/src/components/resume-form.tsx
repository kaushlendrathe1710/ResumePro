import { UseFormReturn, useFieldArray } from "react-hook-form";
import { ResumeData, CustomSection, suggestedSections, sectionTypeLabels, SectionType } from "@/lib/schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GripVertical, Eye, EyeOff, ChevronUp, ChevronDown, Settings2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";

interface ResumeFormProps {
  form: UseFormReturn<ResumeData>;
}

export const ResumeForm: React.FC<ResumeFormProps> = ({ form }) => {
  const { register, control, formState: { errors }, watch, setValue, getValues } = form;
  const [addSectionOpen, setAddSectionOpen] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newSectionType, setNewSectionType] = useState<SectionType>("bullets");

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

  const { fields: customSectionFields, append: appendCustomSection, remove: removeCustomSection, update: updateCustomSection } = useFieldArray({
    control,
    name: "customSections",
  });

  const sectionOrder = watch("sectionOrder") || ["experience", "education", "skills"];
  const sectionVisibility = watch("sectionVisibility") || { experience: true, education: true, skills: true };
  const customSections = watch("customSections") || [];

  const toggleSectionVisibility = (key: string) => {
    const current = sectionVisibility[key] !== false;
    setValue("sectionVisibility", { ...sectionVisibility, [key]: !current });
  };

  const moveSection = (key: string, direction: "up" | "down") => {
    const order = [...sectionOrder];
    const index = order.indexOf(key);
    if (index === -1) return;
    
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= order.length) return;
    
    [order[index], order[newIndex]] = [order[newIndex], order[index]];
    setValue("sectionOrder", order);
  };

  const addCustomSection = () => {
    if (!newSectionTitle.trim()) return;
    
    const key = `custom_${Date.now()}`;
    const newSection: CustomSection = {
      id: crypto.randomUUID(),
      key,
      title: newSectionTitle,
      type: newSectionType,
      enabled: true,
      order: customSections.length,
      items: [],
    };
    
    appendCustomSection(newSection);
    setValue("sectionOrder", [...sectionOrder, key]);
    setValue("sectionVisibility", { ...sectionVisibility, [key]: true });
    setNewSectionTitle("");
    setNewSectionType("bullets");
    setAddSectionOpen(false);
  };

  const addSuggestedSection = (suggestion: typeof suggestedSections[0]) => {
    if (sectionOrder.includes(suggestion.key)) return;
    
    const newSection: CustomSection = {
      id: crypto.randomUUID(),
      key: suggestion.key,
      title: suggestion.title,
      type: suggestion.type,
      enabled: true,
      order: customSections.length,
      items: [],
    };
    
    appendCustomSection(newSection);
    setValue("sectionOrder", [...sectionOrder, suggestion.key]);
    setValue("sectionVisibility", { ...sectionVisibility, [suggestion.key]: true });
  };

  const removeSection = (key: string) => {
    const index = customSections.findIndex((s: CustomSection) => s.key === key);
    if (index !== -1) {
      removeCustomSection(index);
    }
    setValue("sectionOrder", sectionOrder.filter((k: string) => k !== key));
    const newVisibility = { ...sectionVisibility };
    delete newVisibility[key];
    setValue("sectionVisibility", newVisibility);
  };

  const getSectionTitle = (key: string) => {
    if (key === "experience") return "Experience";
    if (key === "education") return "Education";
    if (key === "skills") return "Skills";
    const custom = customSections.find((s: CustomSection) => s.key === key);
    return custom?.title || key;
  };

  const isBuiltInSection = (key: string) => ["experience", "education", "skills"].includes(key);

  const addItemToCustomSection = (sectionIndex: number, type: SectionType) => {
    const section = customSections[sectionIndex];
    const newItem = type === "projects"
      ? { id: crypto.randomUUID(), title: "", description: "", link: "", date: "" }
      : type === "bullets"
      ? { id: crypto.randomUUID(), text: "" }
      : type === "skills"
      ? { id: crypto.randomUUID(), name: "" }
      : type === "text"
      ? { id: crypto.randomUUID(), content: "" }
      : type === "experience"
      ? { id: crypto.randomUUID(), company: "", role: "", date: "", description: "" }
      : { id: crypto.randomUUID(), school: "", degree: "", date: "", description: "" };
    
    updateCustomSection(sectionIndex, {
      ...section,
      items: [...section.items, newItem],
    });
  };

  const updateCustomSectionItem = (sectionIndex: number, itemIndex: number, field: string, value: string) => {
    const section = customSections[sectionIndex];
    const newItems = [...section.items];
    newItems[itemIndex] = { ...newItems[itemIndex], [field]: value };
    updateCustomSection(sectionIndex, { ...section, items: newItems });
  };

  const removeCustomSectionItem = (sectionIndex: number, itemIndex: number) => {
    const section = customSections[sectionIndex];
    const newItems = section.items.filter((_: unknown, i: number) => i !== itemIndex);
    updateCustomSection(sectionIndex, { ...section, items: newItems });
  };

  return (
    <div className="h-full overflow-y-auto p-6 bg-slate-50/50">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Resume Details</h2>
          <p className="text-slate-500">Fill in your information to generate your resume.</p>
        </div>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="personal" data-testid="tab-personal">Personal</TabsTrigger>
            <TabsTrigger value="experience" data-testid="tab-experience">Experience</TabsTrigger>
            <TabsTrigger value="education" data-testid="tab-education">Education</TabsTrigger>
            <TabsTrigger value="skills" data-testid="tab-skills">Skills</TabsTrigger>
            <TabsTrigger value="sections" data-testid="tab-sections">
              <Settings2 className="w-4 h-4 mr-1" /> Sections
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="personal.fullName">Full Name</Label>
                    <Input id="personal.fullName" {...register("personal.fullName")} placeholder="John Doe" data-testid="input-fullname" />
                    {errors.personal?.fullName && <p className="text-xs text-red-500">{errors.personal.fullName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="personal.title">Job Title</Label>
                    <Input id="personal.title" {...register("personal.title")} placeholder="Software Engineer" data-testid="input-title" />
                    {errors.personal?.title && <p className="text-xs text-red-500">{errors.personal.title.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="personal.email">Email</Label>
                    <Input id="personal.email" {...register("personal.email")} placeholder="john@example.com" data-testid="input-email" />
                    {errors.personal?.email && <p className="text-xs text-red-500">{errors.personal.email.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="personal.phone">Phone</Label>
                    <Input id="personal.phone" {...register("personal.phone")} placeholder="+1 (555) 000-0000" data-testid="input-phone" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="personal.location">Location</Label>
                    <Input id="personal.location" {...register("personal.location")} placeholder="New York, NY" data-testid="input-location" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="personal.website">Website (Optional)</Label>
                    <Input id="personal.website" {...register("personal.website")} placeholder="portfolio.com" data-testid="input-website" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="personal.summary">Professional Summary</Label>
                  <Textarea 
                    id="personal.summary" 
                    {...register("personal.summary")} 
                    placeholder="Brief summary of your career and goals..." 
                    className="h-32"
                    data-testid="input-summary"
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
                      data-testid={`button-remove-exp-${index}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Company</Label>
                        <Input {...register(`experience.${index}.company`)} placeholder="Company Name" data-testid={`input-exp-company-${index}`} />
                      </div>
                      <div className="space-y-2">
                        <Label>Role</Label>
                        <Input {...register(`experience.${index}.role`)} placeholder="Job Title" data-testid={`input-exp-role-${index}`} />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Date Range</Label>
                      <Input {...register(`experience.${index}.date`)} placeholder="Jan 2020 - Present" data-testid={`input-exp-date-${index}`} />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea 
                        {...register(`experience.${index}.description`)} 
                        placeholder="Describe your responsibilities and achievements..." 
                        className="h-24"
                        data-testid={`input-exp-description-${index}`}
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
                data-testid="button-add-experience"
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
                      data-testid={`button-remove-edu-${index}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>School</Label>
                        <Input {...register(`education.${index}.school`)} placeholder="University Name" data-testid={`input-edu-school-${index}`} />
                      </div>
                      <div className="space-y-2">
                        <Label>Degree</Label>
                        <Input {...register(`education.${index}.degree`)} placeholder="Bachelor's in..." data-testid={`input-edu-degree-${index}`} />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Date Range</Label>
                      <Input {...register(`education.${index}.date`)} placeholder="2016 - 2020" data-testid={`input-edu-date-${index}`} />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Description (Optional)</Label>
                      <Textarea 
                        {...register(`education.${index}.description`)} 
                        placeholder="Honors, relevant coursework..." 
                        className="h-20"
                        data-testid={`input-edu-description-${index}`}
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
                data-testid="button-add-education"
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
                      <Input {...register(`skills.${index}.name`)} placeholder="Skill (e.g. React)" data-testid={`input-skill-${index}`} />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-slate-400 hover:text-red-500"
                        onClick={() => removeSkill(index)}
                        data-testid={`button-remove-skill-${index}`}
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
                  data-testid="button-add-skill"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Skill
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sections" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Section Manager</CardTitle>
                <p className="text-sm text-muted-foreground">Reorder, show/hide, or add custom sections to your resume.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {sectionOrder.map((key: string, index: number) => (
                  <div 
                    key={key}
                    className="flex items-center justify-between gap-2 p-3 bg-slate-50 rounded-md border"
                    data-testid={`section-item-${key}`}
                  >
                    <div className="flex items-center gap-3">
                      <GripVertical className="w-4 h-4 text-slate-400" />
                      <span className="font-medium">{getSectionTitle(key)}</span>
                      {!isBuiltInSection(key) && (
                        <Badge variant="secondary" className="text-xs">Custom</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => moveSection(key, "up")}
                        disabled={index === 0}
                        data-testid={`button-move-up-${key}`}
                      >
                        <ChevronUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => moveSection(key, "down")}
                        disabled={index === sectionOrder.length - 1}
                        data-testid={`button-move-down-${key}`}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleSectionVisibility(key)}
                        data-testid={`button-toggle-${key}`}
                      >
                        {sectionVisibility[key] !== false ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-slate-400" />
                        )}
                      </Button>
                      {!isBuiltInSection(key) && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSection(key)}
                          className="text-red-500 hover:text-red-700"
                          data-testid={`button-remove-section-${key}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Add Sections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {suggestedSections
                    .filter(s => !sectionOrder.includes(s.key))
                    .map(suggestion => (
                      <Button
                        key={suggestion.key}
                        variant="outline"
                        size="sm"
                        onClick={() => addSuggestedSection(suggestion)}
                        data-testid={`button-add-suggested-${suggestion.key}`}
                      >
                        <Plus className="w-3 h-3 mr-1" /> {suggestion.title}
                      </Button>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Dialog open={addSectionOpen} onOpenChange={setAddSectionOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full border-dashed border-2" data-testid="button-add-custom-section">
                  <Plus className="w-4 h-4 mr-2" /> Add Custom Section
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Custom Section</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Section Title</Label>
                    <Input 
                      value={newSectionTitle}
                      onChange={(e) => setNewSectionTitle(e.target.value)}
                      placeholder="e.g., Volunteer Work"
                      data-testid="input-new-section-title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Section Type</Label>
                    <Select value={newSectionType} onValueChange={(v) => setNewSectionType(v as SectionType)}>
                      <SelectTrigger data-testid="select-section-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bullets">Bullet Points</SelectItem>
                        <SelectItem value="skills">Skills / Tags</SelectItem>
                        <SelectItem value="projects">Projects</SelectItem>
                        <SelectItem value="experience">Work Experience Style</SelectItem>
                        <SelectItem value="education">Education Style</SelectItem>
                        <SelectItem value="text">Text Paragraph</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={addCustomSection} data-testid="button-confirm-add-section">
                    Add Section
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {customSections.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Edit Custom Sections</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {customSections.map((section: CustomSection, sectionIndex: number) => (
                    <div key={section.id} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{section.title}</h4>
                        <Badge variant="outline">{sectionTypeLabels[section.type]}</Badge>
                      </div>
                      
                      {section.type === "bullets" && (
                        <div className="space-y-2">
                          {section.items.map((item: { id: string; text?: string }, itemIndex: number) => (
                            <div key={item.id} className="flex items-center gap-2">
                              <Input 
                                value={item.text || ""}
                                onChange={(e) => updateCustomSectionItem(sectionIndex, itemIndex, "text", e.target.value)}
                                placeholder="Enter bullet point..."
                                data-testid={`input-custom-bullet-${sectionIndex}-${itemIndex}`}
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeCustomSectionItem(sectionIndex, itemIndex)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addItemToCustomSection(sectionIndex, "bullets")}
                            data-testid={`button-add-bullet-${sectionIndex}`}
                          >
                            <Plus className="w-3 h-3 mr-1" /> Add Item
                          </Button>
                        </div>
                      )}

                      {section.type === "skills" && (
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-2">
                            {section.items.map((item: { id: string; name?: string }, itemIndex: number) => (
                              <div key={item.id} className="flex items-center gap-1">
                                <Input 
                                  value={item.name || ""}
                                  onChange={(e) => updateCustomSectionItem(sectionIndex, itemIndex, "name", e.target.value)}
                                  placeholder="Tag..."
                                  className="w-32"
                                  data-testid={`input-custom-skill-${sectionIndex}-${itemIndex}`}
                                />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeCustomSectionItem(sectionIndex, itemIndex)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addItemToCustomSection(sectionIndex, "skills")}
                            data-testid={`button-add-tag-${sectionIndex}`}
                          >
                            <Plus className="w-3 h-3 mr-1" /> Add Tag
                          </Button>
                        </div>
                      )}

                      {section.type === "projects" && (
                        <div className="space-y-4">
                          {section.items.map((item: { id: string; title?: string; description?: string; link?: string; date?: string }, itemIndex: number) => (
                            <Card key={item.id} className="relative group">
                              <CardContent className="pt-4 space-y-3">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100"
                                  onClick={() => removeCustomSectionItem(sectionIndex, itemIndex)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                                <div className="grid grid-cols-2 gap-3">
                                  <Input 
                                    value={item.title || ""}
                                    onChange={(e) => updateCustomSectionItem(sectionIndex, itemIndex, "title", e.target.value)}
                                    placeholder="Project Title"
                                    data-testid={`input-project-title-${sectionIndex}-${itemIndex}`}
                                  />
                                  <Input 
                                    value={item.date || ""}
                                    onChange={(e) => updateCustomSectionItem(sectionIndex, itemIndex, "date", e.target.value)}
                                    placeholder="Date"
                                  />
                                </div>
                                <Textarea 
                                  value={item.description || ""}
                                  onChange={(e) => updateCustomSectionItem(sectionIndex, itemIndex, "description", e.target.value)}
                                  placeholder="Project description..."
                                  className="h-16"
                                />
                                <Input 
                                  value={item.link || ""}
                                  onChange={(e) => updateCustomSectionItem(sectionIndex, itemIndex, "link", e.target.value)}
                                  placeholder="Project URL (optional)"
                                />
                              </CardContent>
                            </Card>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addItemToCustomSection(sectionIndex, "projects")}
                            data-testid={`button-add-project-${sectionIndex}`}
                          >
                            <Plus className="w-3 h-3 mr-1" /> Add Project
                          </Button>
                        </div>
                      )}

                      {section.type === "text" && (
                        <div className="space-y-2">
                          {section.items.map((item: { id: string; content?: string }, itemIndex: number) => (
                            <div key={item.id} className="flex items-start gap-2">
                              <Textarea 
                                value={item.content || ""}
                                onChange={(e) => updateCustomSectionItem(sectionIndex, itemIndex, "content", e.target.value)}
                                placeholder="Enter text content..."
                                className="h-24"
                                data-testid={`input-custom-text-${sectionIndex}-${itemIndex}`}
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeCustomSectionItem(sectionIndex, itemIndex)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addItemToCustomSection(sectionIndex, "text")}
                            data-testid={`button-add-text-${sectionIndex}`}
                          >
                            <Plus className="w-3 h-3 mr-1" /> Add Paragraph
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
