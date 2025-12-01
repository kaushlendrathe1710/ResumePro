import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Plus, FileText, LogOut, Loader2, 
  FolderOpen, Download, FileDown, Edit, Trash2,
  LayoutTemplate, User, Clock, Sparkles
} from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UserData {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
}

interface Resume {
  id: string;
  title: string;
  templateId: string;
  data: string;
  createdAt: string;
  updatedAt: string;
}

export default function Dashboard() {
  const [_, setLocation] = useLocation();
  const [user, setUser] = useState<UserData | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("resumes");
  const [deleteResumeId, setDeleteResumeId] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
    fetchResumes();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const data = await response.json();
        if (data.needsRegistration) {
          setLocation("/login");
          return;
        }
        setUser(data.user);
      } else {
        setLocation("/login");
      }
    } catch (error) {
      setLocation("/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchResumes = async () => {
    try {
      const response = await fetch("/api/resumes");
      if (response.ok) {
        const data = await response.json();
        setResumes(data.resumes);
      }
    } catch (error) {
      console.error("Failed to fetch resumes:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.success("Logged out successfully");
      setLocation("/");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  const handleDeleteResume = async (id: string) => {
    try {
      const response = await fetch(`/api/resumes/${id}`, { method: "DELETE" });
      if (response.ok) {
        toast.success("Resume deleted");
        setResumes(resumes.filter(r => r.id !== id));
      } else {
        toast.error("Failed to delete resume");
      }
    } catch (error) {
      toast.error("Failed to delete resume");
    }
    setDeleteResumeId(null);
  };

  const handleDownload = (resumeId: string, format: "pdf" | "docx") => {
    setLocation(`/build?resume=${resumeId}&download=${format}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getTemplateName = (templateId: string) => {
    const parts = templateId.split("-");
    if (parts.length >= 2) {
      return parts[0].charAt(0).toUpperCase() + parts[0].slice(1) + " - " + parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
    }
    return templateId;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const sidebarItems = [
    { id: "resumes", icon: FolderOpen, label: "My Resumes" },
    { id: "downloads", icon: Download, label: "Downloads" },
    { id: "templates", icon: LayoutTemplate, label: "Templates", href: "/templates" },
    { id: "profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 fixed left-0 top-0 h-full z-20 flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20">
              R
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">ResuMake</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map((item) => (
            item.href ? (
              <Link key={item.id} href={item.href}>
                <button
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors text-left"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </Link>
            ) : (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                  activeTab === item.id 
                    ? "bg-primary/10 text-primary font-semibold" 
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <Link href="/templates">
            <Button className="w-full shadow-lg shadow-primary/20" size="lg">
              <Plus className="w-5 h-5 mr-2" /> Create Resume
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="px-8 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {activeTab === "resumes" && "My Resumes"}
                {activeTab === "downloads" && "Download Resumes"}
                {activeTab === "profile" && "Profile Settings"}
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                {activeTab === "resumes" && `${resumes.length} resume${resumes.length !== 1 ? 's' : ''} created`}
                {activeTab === "downloads" && "Download your resumes as PDF or Word"}
                {activeTab === "profile" && "Manage your account settings"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right mr-2">
                <p className="text-sm font-medium text-slate-900">{user?.name || "User"}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        <main className="p-8">
          {activeTab === "resumes" && (
            <>
              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card 
                  className="bg-gradient-to-br from-primary to-blue-600 text-white border-0 hover:shadow-xl transition-shadow cursor-pointer" 
                  onClick={() => setLocation("/templates")}
                  data-testid="card-create-resume"
                >
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Plus className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Create Resume</h3>
                      <p className="text-blue-100 text-sm">Start from 100+ templates</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card 
                  className="bg-gradient-to-br from-emerald-500 to-green-600 text-white border-0 hover:shadow-xl transition-shadow cursor-pointer" 
                  onClick={() => setActiveTab("downloads")}
                  data-testid="card-download-pdf"
                >
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Download className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Download PDF</h3>
                      <p className="text-emerald-100 text-sm">High-quality export</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card 
                  className="bg-gradient-to-br from-violet-500 to-purple-600 text-white border-0 hover:shadow-xl transition-shadow cursor-pointer" 
                  onClick={() => setActiveTab("downloads")}
                  data-testid="card-download-word"
                >
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <FileDown className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Download Word</h3>
                      <p className="text-violet-100 text-sm">Editable .docx format</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Resumes Grid */}
              {resumes.length === 0 ? (
                <Card className="border-dashed border-2 border-slate-300 bg-white">
                  <CardContent className="flex flex-col items-center justify-center py-20">
                    <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
                      <FileText className="w-10 h-10 text-slate-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">No resumes yet</h3>
                    <p className="text-slate-500 mb-8 text-center max-w-md">
                      Get started by creating your first professional resume. Choose from our collection of 100+ templates.
                    </p>
                    <div className="flex gap-4">
                      <Link href="/templates">
                        <Button size="lg" className="shadow-lg shadow-primary/20">
                          <Sparkles className="w-5 h-5 mr-2" /> Create Your First Resume
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {resumes.map((resume) => (
                    <Card key={resume.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden bg-white" data-testid={`card-resume-${resume.id}`}>
                      <div className="aspect-[1/1.2] bg-gradient-to-br from-slate-100 to-slate-50 relative flex items-center justify-center border-b">
                        <FileText className="w-16 h-16 text-slate-300" />
                        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors" />
                      </div>
                      <CardContent className="p-5">
                        <h3 className="font-bold text-slate-900 text-lg mb-1 truncate">{resume.title}</h3>
                        <div className="flex items-center gap-1 text-slate-500 text-sm mb-4">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Updated {new Date(resume.updatedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="default" className="flex-1" asChild>
                            <Link href={`/build?resume=${resume.id}`}>
                              <Edit className="w-4 h-4 mr-2" /> Edit
                            </Link>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleDownload(resume.id, "pdf")}
                            title="Download PDF"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => setDeleteResumeId(resume.id)}
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === "downloads" && (
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5 text-primary" />
                  All Your Resumes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {resumes.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">No resumes to download</h3>
                    <p className="text-slate-500 mb-6">Create your first resume to see it here.</p>
                    <Link href="/templates">
                      <Button>
                        <Plus className="w-4 h-4 mr-2" /> Create Resume
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-50">
                          <TableHead className="font-semibold">Resume Title</TableHead>
                          <TableHead className="font-semibold">Template</TableHead>
                          <TableHead className="font-semibold">Created</TableHead>
                          <TableHead className="font-semibold">Last Updated</TableHead>
                          <TableHead className="font-semibold text-center">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {resumes.map((resume) => (
                          <TableRow key={resume.id} className="hover:bg-slate-50" data-testid={`row-resume-${resume.id}`}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                  <FileText className="w-5 h-5 text-primary" />
                                </div>
                                <span>{resume.title}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                {getTemplateName(resume.templateId)}
                              </span>
                            </TableCell>
                            <TableCell className="text-slate-600">
                              {formatDate(resume.createdAt)}
                            </TableCell>
                            <TableCell className="text-slate-600">
                              {formatDate(resume.updatedAt)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-center gap-2">
                                <Button 
                                  size="sm" 
                                  variant="default"
                                  onClick={() => handleDownload(resume.id, "pdf")}
                                  className="bg-emerald-600 hover:bg-emerald-700"
                                  data-testid={`button-download-pdf-${resume.id}`}
                                >
                                  <Download className="w-4 h-4 mr-1" /> PDF
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="default"
                                  onClick={() => handleDownload(resume.id, "docx")}
                                  className="bg-violet-600 hover:bg-violet-700"
                                  data-testid={`button-download-word-${resume.id}`}
                                >
                                  <FileDown className="w-4 h-4 mr-1" /> Word
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  asChild
                                >
                                  <Link href={`/build?resume=${resume.id}`}>
                                    <Edit className="w-4 h-4" />
                                  </Link>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === "profile" && (
            <div className="max-w-2xl">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary text-3xl font-bold">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{user?.name || "User"}</h3>
                      <p className="text-slate-500">{user?.email}</p>
                      {user?.phone && <p className="text-slate-500">{user?.phone}</p>}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h4 className="font-semibold text-slate-800 mb-4">Account Statistics</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 rounded-xl p-4">
                        <p className="text-3xl font-bold text-primary">{resumes.length}</p>
                        <p className="text-slate-600 text-sm">Resumes Created</p>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-4">
                        <p className="text-3xl font-bold text-emerald-600">100+</p>
                        <p className="text-slate-600 text-sm">Templates Available</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteResumeId} onOpenChange={() => setDeleteResumeId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Resume?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your resume.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700"
              onClick={() => deleteResumeId && handleDeleteResume(deleteResumeId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
