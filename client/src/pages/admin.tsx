import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  LogOut, Loader2, Users, FileText, Download, 
  LayoutDashboard, Settings, Shield, Search,
  Trash2, UserPlus, UserMinus, Crown
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
import { Badge } from "@/components/ui/badge";

interface UserData {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: string;
}

interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: string;
  createdAt: string;
}

interface Stats {
  totalUsers: number;
  totalResumes: number;
  totalDownloads: number;
  newUsersToday: number;
}

export default function AdminDashboard() {
  const [_, setLocation] = useLocation();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [promoteUserId, setPromoteUserId] = useState<string | null>(null);
  const [demoteUserId, setDemoteUserId] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      if (activeTab === "overview") {
        fetchStats();
      } else if (activeTab === "users" || activeTab === "admins") {
        fetchUsers();
      }
    }
  }, [activeTab, user]);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const data = await response.json();
        if (!data.isAdmin) {
          toast.error("Access denied. Admin privileges required.");
          setLocation("/dashboard");
          return;
        }
        setUser(data.user);
        fetchStats();
      } else {
        setLocation("/login");
      }
    } catch (error) {
      setLocation("/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
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

  const handleDeleteUser = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (response.ok) {
        toast.success("User deleted successfully");
        setUsers(users.filter(u => u.id !== id));
        fetchStats();
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to delete user");
      }
    } catch (error) {
      toast.error("Failed to delete user");
    }
    setDeleteUserId(null);
  };

  const handlePromoteUser = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/users/${id}/promote`, { method: "POST" });
      if (response.ok) {
        toast.success("User promoted to admin");
        fetchUsers();
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to promote user");
      }
    } catch (error) {
      toast.error("Failed to promote user");
    }
    setPromoteUserId(null);
  };

  const handleDemoteUser = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/users/${id}/demote`, { method: "POST" });
      if (response.ok) {
        toast.success("Admin demoted to user");
        fetchUsers();
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to demote admin");
      }
    } catch (error) {
      toast.error("Failed to demote admin");
    }
    setDemoteUserId(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const regularUsers = filteredUsers.filter(u => u.role === "user");
  const adminUsers = filteredUsers.filter(u => u.role === "admin" || u.role === "superadmin");

  const isSuperAdmin = user?.role === "superadmin";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const sidebarItems = [
    { id: "overview", icon: LayoutDashboard, label: "Dashboard" },
    { id: "users", icon: Users, label: "Users" },
    { id: "admins", icon: Shield, label: "Admins", superAdminOnly: true },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "superadmin":
        return <Badge className="bg-amber-500 text-white"><Crown className="w-3 h-3 mr-1" /> Super Admin</Badge>;
      case "admin":
        return <Badge className="bg-blue-500 text-white"><Shield className="w-3 h-3 mr-1" /> Admin</Badge>;
      default:
        return <Badge variant="secondary">User</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 border-r border-slate-700 fixed left-0 top-0 h-full z-20 flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white">Admin</span>
              <p className="text-xs text-slate-400">Control Panel</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map((item) => {
            if (item.superAdminOnly && !isSuperAdmin) return null;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                  activeTab === item.id 
                    ? "bg-amber-500/20 text-amber-400 font-semibold" 
                    : "text-slate-400 hover:bg-slate-700 hover:text-white"
                }`}
                data-testid={`nav-${item.id}`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <Link href="/dashboard">
            <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white">
              <FileText className="w-4 h-4 mr-2" /> User Dashboard
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Top Bar */}
        <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
          <div className="px-8 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {activeTab === "overview" && "Dashboard Overview"}
                {activeTab === "users" && "User Management"}
                {activeTab === "admins" && "Admin Management"}
                {activeTab === "settings" && "Settings"}
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                {activeTab === "overview" && "Monitor your platform statistics"}
                {activeTab === "users" && "View and manage all registered users"}
                {activeTab === "admins" && "Manage admin access and permissions"}
                {activeTab === "settings" && "Configure system settings"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right mr-2">
                <p className="text-sm font-medium text-white">{user?.name || "Admin"}</p>
                <p className="text-xs text-slate-400">{user?.role === "superadmin" ? "Super Admin" : "Admin"}</p>
              </div>
              <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-400 font-bold">
                {user?.name?.charAt(0).toUpperCase() || "A"}
              </div>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        <main className="p-8">
          {activeTab === "overview" && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-white">{stats?.totalUsers || 0}</p>
                        <p className="text-slate-400 text-sm">Total Users</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-white">{stats?.totalResumes || 0}</p>
                        <p className="text-slate-400 text-sm">Resumes Created</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center">
                        <Download className="w-6 h-6 text-violet-400" />
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-white">{stats?.totalDownloads || 0}</p>
                        <p className="text-slate-400 text-sm">Total Downloads</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                        <UserPlus className="w-6 h-6 text-amber-400" />
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-white">{stats?.newUsersToday || 0}</p>
                        <p className="text-slate-400 text-sm">New Today</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card 
                  className="bg-gradient-to-br from-blue-600 to-blue-700 border-0 cursor-pointer hover:shadow-xl transition-shadow"
                  onClick={() => setActiveTab("users")}
                  data-testid="card-manage-users"
                >
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                      <Users className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Manage Users</h3>
                      <p className="text-blue-100">View, search, and manage user accounts</p>
                    </div>
                  </CardContent>
                </Card>

                {isSuperAdmin && (
                  <Card 
                    className="bg-gradient-to-br from-amber-500 to-amber-600 border-0 cursor-pointer hover:shadow-xl transition-shadow"
                    onClick={() => setActiveTab("admins")}
                    data-testid="card-manage-admins"
                  >
                    <CardContent className="p-6 flex items-center gap-4">
                      <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                        <Shield className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">Manage Admins</h3>
                        <p className="text-amber-100">Promote or demote admin access</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </>
          )}

          {activeTab === "users" && (
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="border-b border-slate-700">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    All Users ({regularUsers.length})
                  </CardTitle>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <Input
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 w-64"
                      data-testid="input-search-users"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700 hover:bg-slate-700/50">
                      <TableHead className="text-slate-300">User</TableHead>
                      <TableHead className="text-slate-300">Phone</TableHead>
                      <TableHead className="text-slate-300">Role</TableHead>
                      <TableHead className="text-slate-300">Joined</TableHead>
                      {isSuperAdmin && <TableHead className="text-slate-300 text-center">Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {regularUsers.map((u) => (
                      <TableRow key={u.id} className="border-slate-700 hover:bg-slate-700/50" data-testid={`row-user-${u.id}`}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center text-white font-medium">
                              {u.name?.charAt(0).toUpperCase() || u.email.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-white">{u.name || "No name"}</p>
                              <p className="text-sm text-slate-400">{u.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-300">{u.phone || "-"}</TableCell>
                        <TableCell>{getRoleBadge(u.role)}</TableCell>
                        <TableCell className="text-slate-400">{formatDate(u.createdAt)}</TableCell>
                        {isSuperAdmin && (
                          <TableCell>
                            <div className="flex items-center justify-center gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
                                onClick={() => setPromoteUserId(u.id)}
                                data-testid={`button-promote-${u.id}`}
                              >
                                <UserPlus className="w-4 h-4 mr-1" /> Promote
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                                onClick={() => setDeleteUserId(u.id)}
                                data-testid={`button-delete-${u.id}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                    {regularUsers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={isSuperAdmin ? 5 : 4} className="text-center py-8 text-slate-400">
                          No users found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {activeTab === "admins" && isSuperAdmin && (
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="border-b border-slate-700">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-amber-400" />
                    Admin Users ({adminUsers.length})
                  </CardTitle>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <Input
                      placeholder="Search admins..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 w-64"
                      data-testid="input-search-admins"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700 hover:bg-slate-700/50">
                      <TableHead className="text-slate-300">Admin</TableHead>
                      <TableHead className="text-slate-300">Phone</TableHead>
                      <TableHead className="text-slate-300">Role</TableHead>
                      <TableHead className="text-slate-300">Joined</TableHead>
                      <TableHead className="text-slate-300 text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adminUsers.map((u) => (
                      <TableRow key={u.id} className="border-slate-700 hover:bg-slate-700/50" data-testid={`row-admin-${u.id}`}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${u.role === "superadmin" ? "bg-amber-500" : "bg-blue-500"}`}>
                              {u.name?.charAt(0).toUpperCase() || u.email.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-white">{u.name || "No name"}</p>
                              <p className="text-sm text-slate-400">{u.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-300">{u.phone || "-"}</TableCell>
                        <TableCell>{getRoleBadge(u.role)}</TableCell>
                        <TableCell className="text-slate-400">{formatDate(u.createdAt)}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            {u.role === "admin" && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="border-amber-500 text-amber-400 hover:bg-amber-500 hover:text-white"
                                onClick={() => setDemoteUserId(u.id)}
                                data-testid={`button-demote-${u.id}`}
                              >
                                <UserMinus className="w-4 h-4 mr-1" /> Demote
                              </Button>
                            )}
                            {u.role === "superadmin" && (
                              <span className="text-slate-500 text-sm italic">Protected</span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {adminUsers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-slate-400">
                          No admins found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {activeTab === "settings" && (
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">System Settings</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-400">
                <div className="space-y-6">
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <h3 className="font-medium text-white mb-2">Email Configuration</h3>
                    <p className="text-sm">SMTP is configured for OTP delivery.</p>
                  </div>
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <h3 className="font-medium text-white mb-2">Templates</h3>
                    <p className="text-sm">400 templates available (20 layouts × 20 colors)</p>
                  </div>
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <h3 className="font-medium text-white mb-2">Database</h3>
                    <p className="text-sm">PostgreSQL (Neon) connected</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
        <AlertDialogContent className="bg-slate-800 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete User?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              This action cannot be undone. This will permanently delete the user and all their resumes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-600 text-slate-300 hover:bg-slate-700">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700"
              onClick={() => deleteUserId && handleDeleteUser(deleteUserId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Promote Confirmation Dialog */}
      <AlertDialog open={!!promoteUserId} onOpenChange={() => setPromoteUserId(null)}>
        <AlertDialogContent className="bg-slate-800 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Promote to Admin?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              This user will gain admin access and can view all users and statistics.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-600 text-slate-300 hover:bg-slate-700">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => promoteUserId && handlePromoteUser(promoteUserId)}
            >
              Promote
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Demote Confirmation Dialog */}
      <AlertDialog open={!!demoteUserId} onOpenChange={() => setDemoteUserId(null)}>
        <AlertDialogContent className="bg-slate-800 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Demote Admin?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              This admin will lose their privileges and become a regular user.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-600 text-slate-300 hover:bg-slate-700">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-amber-600 hover:bg-amber-700"
              onClick={() => demoteUserId && handleDemoteUser(demoteUserId)}
            >
              Demote
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
