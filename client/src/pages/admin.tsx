import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  LogOut, Loader2, Users, FileText, Download, 
  LayoutDashboard, Settings, Shield, Search,
  Trash2, UserPlus, UserMinus, Crown, CreditCard, Plus, Edit, Check
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function PlanForm({ 
  plan, 
  onSave, 
  onCancel 
}: { 
  plan: SubscriptionPlan | null; 
  onSave: (plan: Partial<SubscriptionPlan>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: plan?.name || "",
    price: plan?.price || 0,
    currency: plan?.currency || "INR",
    region: plan?.region || "all",
    stripePriceId: plan?.stripePriceId || "",
    downloadLimit: plan?.downloadLimit || 1,
    validityDays: plan?.validityDays || 0,
    hasWatermark: plan?.hasWatermark ?? true,
    watermarkText: plan?.watermarkText || "Mymegaminds",
    allowWordExport: plan?.allowWordExport ?? false,
    isActive: plan?.isActive ?? true,
    isDefault: plan?.isDefault ?? false,
    sortOrder: plan?.sortOrder || 0,
  });

  const handleSubmit = () => {
    const data: Partial<SubscriptionPlan> = {
      ...formData,
      id: plan?.id,
    };
    onSave(data);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-slate-300 mb-2 block">Plan Name</Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Premium"
            className="bg-slate-700 border-slate-600 text-white"
            data-testid="input-plan-name"
          />
        </div>
        <div>
          <Label className="text-slate-300 mb-2 block">Price</Label>
          <Input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
            className="bg-slate-700 border-slate-600 text-white"
            data-testid="input-plan-price"
          />
        </div>
        <div>
          <Label className="text-slate-300 mb-2 block">Currency</Label>
          <select
            value={formData.currency}
            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
            className="w-full h-9 rounded-md border border-slate-600 bg-slate-700 text-white px-3"
            data-testid="select-plan-currency"
          >
            <option value="INR">INR (Indian Rupee)</option>
            <option value="USD">USD (US Dollar)</option>
            <option value="EUR">EUR (Euro)</option>
            <option value="GBP">GBP (British Pound)</option>
            <option value="AED">AED (UAE Dirham)</option>
          </select>
        </div>
        <div>
          <Label className="text-slate-300 mb-2 block">Region</Label>
          <select
            value={formData.region}
            onChange={(e) => setFormData({ ...formData, region: e.target.value })}
            className="w-full h-9 rounded-md border border-slate-600 bg-slate-700 text-white px-3"
            data-testid="select-plan-region"
          >
            <option value="all">All Regions</option>
            <option value="india">India Only</option>
            <option value="international">International Only</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <Label className="text-slate-300 mb-2 block">Stripe Price ID</Label>
          <Input
            value={formData.stripePriceId}
            onChange={(e) => setFormData({ ...formData, stripePriceId: e.target.value })}
            placeholder="e.g., price_1ABC123xyz (from Stripe Dashboard)"
            className="bg-slate-700 border-slate-600 text-white"
            data-testid="input-stripe-price-id"
          />
        </div>
        <div>
          <Label className="text-slate-300 mb-2 block">Download Limit</Label>
          <Input
            type="number"
            value={formData.downloadLimit}
            onChange={(e) => setFormData({ ...formData, downloadLimit: parseInt(e.target.value) || 1 })}
            className="bg-slate-700 border-slate-600 text-white"
            data-testid="input-plan-downloads"
          />
        </div>
        <div>
          <Label className="text-slate-300 mb-2 block">Validity (days, 0 = lifetime)</Label>
          <Input
            type="number"
            value={formData.validityDays}
            onChange={(e) => setFormData({ ...formData, validityDays: parseInt(e.target.value) || 0 })}
            className="bg-slate-700 border-slate-600 text-white"
            data-testid="input-plan-validity"
          />
        </div>
        <div>
          <Label className="text-slate-300 mb-2 block">Watermark Text</Label>
          <Input
            value={formData.watermarkText}
            onChange={(e) => setFormData({ ...formData, watermarkText: e.target.value })}
            placeholder="e.g., Mymegaminds"
            className="bg-slate-700 border-slate-600 text-white"
            data-testid="input-plan-watermark"
          />
        </div>
        <div>
          <Label className="text-slate-300 mb-2 block">Sort Order</Label>
          <Input
            type="number"
            value={formData.sortOrder}
            onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
            className="bg-slate-700 border-slate-600 text-white"
            data-testid="input-plan-sort"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-6 pt-2">
        <div className="flex items-center gap-2">
          <Switch
            checked={formData.hasWatermark}
            onCheckedChange={(checked) => setFormData({ ...formData, hasWatermark: checked })}
            data-testid="switch-watermark"
          />
          <Label className="text-slate-300">Has Watermark</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={formData.allowWordExport}
            onCheckedChange={(checked) => setFormData({ ...formData, allowWordExport: checked })}
            data-testid="switch-word"
          />
          <Label className="text-slate-300">Allow Word Export</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={formData.isActive}
            onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            data-testid="switch-active"
          />
          <Label className="text-slate-300">Active</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={formData.isDefault}
            onCheckedChange={(checked) => setFormData({ ...formData, isDefault: checked })}
            data-testid="switch-default"
          />
          <Label className="text-slate-300">Default Plan</Label>
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button onClick={handleSubmit} className="bg-emerald-600 hover:bg-emerald-700" data-testid="button-save-plan">
          <Check className="w-4 h-4 mr-2" /> Save Plan
        </Button>
        <Button variant="outline" onClick={onCancel} className="border-slate-600 text-slate-300" data-testid="button-cancel-plan">
          Cancel
        </Button>
      </div>
    </div>
  );
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  region: string;
  downloadLimit: number;
  validityDays: number;
  hasWatermark: boolean;
  watermarkText: string | null;
  allowWordExport: boolean;
  isActive: boolean;
  isDefault: boolean;
  sortOrder: number;
}

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

interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  downloadsUsed: number;
  downloadsRemaining: number;
  startDate: string;
  endDate: string | null;
  isActive: boolean;
  paymentReference: string | null;
  userEmail?: string;
  userName?: string | null;
  planName?: string;
  planPrice?: number;
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
  
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [showNewPlanForm, setShowNewPlanForm] = useState(false);
  const [activateUserId, setActivateUserId] = useState<string | null>(null);
  const [activatePlanId, setActivatePlanId] = useState<string>("");
  const [paymentRef, setPaymentRef] = useState("");
  const [subSearchQuery, setSubSearchQuery] = useState("");
  const [editingSubscription, setEditingSubscription] = useState<UserSubscription | null>(null);
  const [editSubPlanId, setEditSubPlanId] = useState<string>("");
  const [deleteSubId, setDeleteSubId] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      fetchPlans();
      fetchUsers();
      if (activeTab === "overview") {
        fetchStats();
      } else if (activeTab === "subscriptions") {
        fetchSubscriptions();
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

  const fetchPlans = async () => {
    try {
      const response = await fetch("/api/admin/plans");
      if (response.ok) {
        const data = await response.json();
        setPlans(data.plans);
      }
    } catch (error) {
      console.error("Failed to fetch plans:", error);
    }
  };

  const fetchSubscriptions = async () => {
    try {
      const response = await fetch("/api/admin/subscriptions");
      if (response.ok) {
        const data = await response.json();
        setSubscriptions(data.subscriptions);
      }
    } catch (error) {
      console.error("Failed to fetch subscriptions:", error);
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

  const handleSavePlan = async (plan: Partial<SubscriptionPlan>) => {
    try {
      const isNew = !plan.id;
      const url = isNew ? "/api/admin/plans" : `/api/admin/plans/${plan.id}`;
      const method = isNew ? "POST" : "PATCH";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(plan),
      });
      
      if (response.ok) {
        toast.success(isNew ? "Plan created" : "Plan updated");
        fetchPlans();
        setEditingPlan(null);
        setShowNewPlanForm(false);
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to save plan");
      }
    } catch (error) {
      toast.error("Failed to save plan");
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (!confirm("Are you sure you want to delete this plan?")) return;
    
    try {
      const response = await fetch(`/api/admin/plans/${planId}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        toast.success("Plan deleted");
        fetchPlans();
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to delete plan");
      }
    } catch (error) {
      toast.error("Failed to delete plan");
    }
  };

  const handleActivateSubscription = async () => {
    if (!activateUserId || !activatePlanId) {
      toast.error("Please select a plan");
      return;
    }
    
    try {
      const response = await fetch("/api/admin/subscriptions/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: activateUserId,
          planId: activatePlanId,
          paymentReference: paymentRef || undefined,
        }),
      });
      
      if (response.ok) {
        toast.success("Subscription activated");
        fetchSubscriptions();
        setActivateUserId(null);
        setActivatePlanId("");
        setPaymentRef("");
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to activate subscription");
      }
    } catch (error) {
      toast.error("Failed to activate subscription");
    }
  };

  const handleDeactivateSubscription = async (subId: string) => {
    if (!confirm("Are you sure you want to deactivate this subscription?")) return;
    
    try {
      const response = await fetch(`/api/admin/subscriptions/${subId}/deactivate`, {
        method: "POST",
      });
      
      if (response.ok) {
        toast.success("Subscription deactivated");
        fetchSubscriptions();
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to deactivate subscription");
      }
    } catch (error) {
      toast.error("Failed to deactivate subscription");
    }
  };

  const handleEditSubscription = (sub: UserSubscription) => {
    setEditingSubscription(sub);
    setEditSubPlanId(sub.planId);
  };

  const handleUpdateSubscription = async () => {
    if (!editingSubscription || !editSubPlanId) return;
    
    try {
      const response = await fetch(`/api/admin/subscriptions/${editingSubscription.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: editSubPlanId }),
      });
      
      if (response.ok) {
        toast.success("Subscription updated");
        fetchSubscriptions();
        setEditingSubscription(null);
        setEditSubPlanId("");
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to update subscription");
      }
    } catch (error) {
      toast.error("Failed to update subscription");
    }
  };

  const handleDeleteSubscription = async (subId: string) => {
    try {
      const response = await fetch(`/api/admin/subscriptions/${subId}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        toast.success("Subscription deleted");
        fetchSubscriptions();
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to delete subscription");
      }
    } catch (error) {
      toast.error("Failed to delete subscription");
    }
    setDeleteSubId(null);
  };

  const handleCleanupDuplicates = async () => {
    if (!confirm("This will delete all duplicate and inactive subscriptions, keeping only one active subscription per user. Continue?")) return;
    
    try {
      const response = await fetch("/api/admin/subscriptions/cleanup", {
        method: "POST",
      });
      
      if (response.ok) {
        const data = await response.json();
        toast.success(`Cleaned up ${data.deletedCount} duplicate subscriptions`);
        fetchSubscriptions();
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to cleanup subscriptions");
      }
    } catch (error) {
      toast.error("Failed to cleanup subscriptions");
    }
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
    { id: "plans", icon: CreditCard, label: "Subscription Plans", superAdminOnly: true },
    { id: "subscriptions", icon: CreditCard, label: "User Subscriptions" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  const filteredSubscriptions = subscriptions.filter(s => 
    (s.userEmail && s.userEmail.toLowerCase().includes(subSearchQuery.toLowerCase())) ||
    (s.userName && s.userName.toLowerCase().includes(subSearchQuery.toLowerCase())) ||
    (s.planName && s.planName.toLowerCase().includes(subSearchQuery.toLowerCase()))
  );

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
                {activeTab === "plans" && "Subscription Plans"}
                {activeTab === "subscriptions" && "User Subscriptions"}
                {activeTab === "settings" && "Settings"}
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                {activeTab === "overview" && "Monitor your platform statistics"}
                {activeTab === "users" && "View and manage all registered users"}
                {activeTab === "admins" && "Manage admin access and permissions"}
                {activeTab === "plans" && "Create and manage subscription plans"}
                {activeTab === "subscriptions" && "View and activate user subscriptions"}
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

          {activeTab === "plans" && isSuperAdmin && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <Button 
                  onClick={() => setShowNewPlanForm(true)}
                  className="bg-emerald-600 hover:bg-emerald-700"
                  data-testid="button-new-plan"
                >
                  <Plus className="w-4 h-4 mr-2" /> Create New Plan
                </Button>
              </div>

              {(showNewPlanForm || editingPlan) && (
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">
                      {editingPlan ? "Edit Plan" : "Create New Plan"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PlanForm
                      plan={editingPlan}
                      onSave={handleSavePlan}
                      onCancel={() => { setEditingPlan(null); setShowNewPlanForm(false); }}
                    />
                  </CardContent>
                </Card>
              )}

              <div className="grid gap-4">
                {plans.map((plan) => (
                  <Card key={plan.id} className="bg-slate-800 border-slate-700" data-testid={`card-plan-${plan.id}`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                            {plan.isDefault && (
                              <Badge className="bg-emerald-500">Default</Badge>
                            )}
                            {!plan.isActive && (
                              <Badge variant="secondary">Inactive</Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                            <span className="flex items-center gap-1">
                              <span className="text-white font-medium">{plan.price === 0 ? "Free" : `${plan.price} AED`}</span>
                            </span>
                            <span>{plan.downloadLimit} downloads</span>
                            <span>{plan.validityDays === 0 ? "Lifetime" : `${plan.validityDays} days`}</span>
                            <span>{plan.hasWatermark ? `Watermark: "${plan.watermarkText}"` : "No watermark"}</span>
                            <span>{plan.allowWordExport ? "Word export" : "PDF only"}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
                            onClick={() => setEditingPlan(plan)}
                            data-testid={`button-edit-plan-${plan.id}`}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                            onClick={() => handleDeletePlan(plan.id)}
                            data-testid={`button-delete-plan-${plan.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {plans.length === 0 && (
                  <Card className="bg-slate-800 border-slate-700">
                    <CardContent className="p-12 text-center text-slate-400">
                      No subscription plans created yet
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {activeTab === "subscriptions" && (
            <div className="space-y-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="border-b border-slate-700">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-emerald-400" />
                      Active Subscriptions ({filteredSubscriptions.filter(s => s.isActive).length})
                    </CardTitle>
                    <div className="flex items-center gap-3">
                      {isSuperAdmin && (
                        <Button 
                          size="sm"
                          variant="outline"
                          className="border-amber-500 text-amber-400"
                          onClick={handleCleanupDuplicates}
                          data-testid="button-cleanup-duplicates"
                        >
                          <Trash2 className="w-3 h-3 mr-1" /> Cleanup Duplicates
                        </Button>
                      )}
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <Input
                          placeholder="Search subscriptions..."
                          value={subSearchQuery}
                          onChange={(e) => setSubSearchQuery(e.target.value)}
                          className="pl-9 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 w-64"
                          data-testid="input-search-subscriptions"
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700 hover:bg-slate-700/50">
                        <TableHead className="text-slate-300">User</TableHead>
                        <TableHead className="text-slate-300">Plan</TableHead>
                        <TableHead className="text-slate-300">Downloads</TableHead>
                        <TableHead className="text-slate-300">Expires</TableHead>
                        <TableHead className="text-slate-300">Status</TableHead>
                        {isSuperAdmin && <TableHead className="text-slate-300 text-center">Actions</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSubscriptions.map((sub) => (
                        <TableRow key={sub.id} className="border-slate-700 hover:bg-slate-700/50" data-testid={`row-sub-${sub.id}`}>
                          <TableCell>
                            <div>
                              <p className="font-medium text-white">{sub.userName || "No name"}</p>
                              <p className="text-sm text-slate-400">{sub.userEmail}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-white">{sub.planName}</p>
                              <p className="text-sm text-slate-400">{sub.planPrice === 0 ? "Free" : `${sub.planPrice} AED`}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-300">
                            {sub.downloadsUsed} / {sub.downloadsUsed + sub.downloadsRemaining} used
                          </TableCell>
                          <TableCell className="text-slate-400">
                            {sub.endDate ? formatDate(sub.endDate) : "Never"}
                          </TableCell>
                          <TableCell>
                            {sub.isActive ? (
                              <Badge className="bg-emerald-500">Active</Badge>
                            ) : (
                              <Badge variant="secondary">Inactive</Badge>
                            )}
                          </TableCell>
                          {isSuperAdmin && (
                            <TableCell>
                              <div className="flex items-center justify-center gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="border-blue-500 text-blue-400"
                                  onClick={() => handleEditSubscription(sub)}
                                  data-testid={`button-edit-sub-${sub.id}`}
                                >
                                  <Edit className="w-3 h-3 mr-1" /> Edit
                                </Button>
                                {sub.isActive && (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="border-red-500 text-red-400"
                                    onClick={() => handleDeactivateSubscription(sub.id)}
                                    data-testid={`button-deactivate-${sub.id}`}
                                  >
                                    Deactivate
                                  </Button>
                                )}
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="border-red-700 text-red-500"
                                  onClick={() => setDeleteSubId(sub.id)}
                                  data-testid={`button-delete-sub-${sub.id}`}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                      {filteredSubscriptions.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={isSuperAdmin ? 6 : 5} className="text-center py-8 text-slate-400">
                            No subscriptions found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {isSuperAdmin && (
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Plus className="w-5 h-5 text-emerald-400" />
                      Manually Activate Subscription
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-slate-300 mb-2 block">User</Label>
                        <Select 
                          value={activateUserId || ""} 
                          onValueChange={(v) => setActivateUserId(v)}
                        >
                          <SelectTrigger className="bg-slate-700 border-slate-600 text-white" data-testid="select-user">
                            <SelectValue placeholder="Select user" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-700 border-slate-600">
                            {users.map((u) => (
                              <SelectItem key={u.id} value={u.id} className="text-white">
                                {u.email}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-slate-300 mb-2 block">Plan</Label>
                        <Select 
                          value={activatePlanId} 
                          onValueChange={(v) => setActivatePlanId(v)}
                        >
                          <SelectTrigger className="bg-slate-700 border-slate-600 text-white" data-testid="select-plan">
                            <SelectValue placeholder="Select plan" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-700 border-slate-600">
                            {plans.filter(p => p.isActive).map((p) => (
                              <SelectItem key={p.id} value={p.id} className="text-white">
                                {p.name} ({p.price === 0 ? "Free" : `${p.price} AED`})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-slate-300 mb-2 block">Payment Reference (optional)</Label>
                        <Input
                          value={paymentRef}
                          onChange={(e) => setPaymentRef(e.target.value)}
                          placeholder="e.g., Transaction ID"
                          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                          data-testid="input-payment-ref"
                        />
                      </div>
                      <div className="flex items-end">
                        <Button 
                          onClick={handleActivateSubscription}
                          className="bg-emerald-600 hover:bg-emerald-700 w-full"
                          data-testid="button-activate"
                        >
                          <Check className="w-4 h-4 mr-2" /> Activate
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
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

      {/* Edit Subscription Dialog */}
      <Dialog open={!!editingSubscription} onOpenChange={() => setEditingSubscription(null)}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Subscription</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-400 mb-1">User</p>
              <p className="text-white font-medium">{editingSubscription?.userName || editingSubscription?.userEmail}</p>
            </div>
            <div>
              <Label className="text-slate-300 mb-2 block">Change Plan</Label>
              <Select 
                value={editSubPlanId} 
                onValueChange={(v) => setEditSubPlanId(v)}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white" data-testid="select-edit-plan">
                  <SelectValue placeholder="Select plan" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {plans.filter(p => p.isActive).map((p) => (
                    <SelectItem key={p.id} value={p.id} className="text-white">
                      {p.name} ({p.price === 0 ? "Free" : `${p.price} AED`})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleUpdateSubscription} className="bg-emerald-600 hover:bg-emerald-700" data-testid="button-save-sub">
                <Check className="w-4 h-4 mr-2" /> Save Changes
              </Button>
              <Button variant="outline" onClick={() => setEditingSubscription(null)} className="border-slate-600 text-slate-300">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Subscription Confirmation Dialog */}
      <AlertDialog open={!!deleteSubId} onOpenChange={() => setDeleteSubId(null)}>
        <AlertDialogContent className="bg-slate-800 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Subscription?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              This will permanently delete this subscription record. The user will need a new subscription to be activated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-600 text-slate-300 hover:bg-slate-700">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700"
              onClick={() => deleteSubId && handleDeleteSubscription(deleteSubId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
