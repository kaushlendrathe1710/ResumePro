import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, FileText, LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
}

interface Resume {
  id: string;
  title: string;
  templateId: string;
  updatedAt: string;
}

export default function Dashboard() {
  const [_, setLocation] = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    fetchResumes();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const data = await response.json();
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/20">
              R
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">ResuMake</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Resumes</h1>
            <p className="text-slate-600 mt-1">Manage and create your professional resumes</p>
          </div>
          <Link href="/templates">
            <Button size="lg" className="shadow-lg shadow-primary/20">
              <Plus className="w-5 h-5 mr-2" /> Create New Resume
            </Button>
          </Link>
        </div>

        {resumes.length === 0 ? (
          <Card className="border-dashed border-2 border-slate-300 bg-slate-50">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileText className="w-16 h-16 text-slate-400 mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No resumes yet</h3>
              <p className="text-slate-500 mb-6 text-center max-w-md">
                Get started by creating your first professional resume. Choose from 100+ templates.
              </p>
              <Link href="/templates">
                <Button>
                  <Plus className="w-4 h-4 mr-2" /> Create Your First Resume
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <Card key={resume.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="aspect-[1/1.414] bg-slate-100 rounded mb-4 flex items-center justify-center">
                    <FileText className="w-12 h-12 text-slate-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">{resume.title}</h3>
                  <p className="text-sm text-slate-500">
                    Updated {new Date(resume.updatedAt).toLocaleDateString()}
                  </p>
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <Link href={`/build?resume=${resume.id}`}>Edit Resume</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
