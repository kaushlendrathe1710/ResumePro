import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, LogIn, Loader2, CheckCircle, User, Phone } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Login() {
  const [_, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<"email" | "otp" | "register">("email");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Check your email for the login code!");
        setStep("otp");
      } else {
        toast.error(data.error || "Failed to send OTP");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otp }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.needsRegistration) {
          toast.success("OTP verified! Please complete your registration.");
          setStep("register");
        } else {
          toast.success("Login successful!");
          setLocation("/dashboard");
        }
      } else {
        toast.error(data.error || "Invalid code");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/complete-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Registration complete! Welcome to ResuMake.");
        setLocation("/dashboard");
      } else {
        toast.error(data.error || "Failed to complete registration");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-violet-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-primary/20">
              R
            </div>
            <span className="text-3xl font-bold tracking-tight text-slate-900">ResuMake</span>
          </div>
          <p className="text-slate-600">Create professional resumes in minutes</p>
        </div>

        <Card className="shadow-xl border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {step === "email" && (
                <>
                  <Mail className="w-5 h-5 text-primary" />
                  Sign in with Email
                </>
              )}
              {step === "otp" && (
                <>
                  <CheckCircle className="w-5 h-5 text-primary" />
                  Enter Verification Code
                </>
              )}
              {step === "register" && (
                <>
                  <User className="w-5 h-5 text-primary" />
                  Complete Your Profile
                </>
              )}
            </CardTitle>
            <CardDescription>
              {step === "email" && "We'll send you a secure login code"}
              {step === "otp" && `Code sent to ${email}`}
              {step === "register" && "Tell us a bit about yourself"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === "email" && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    data-testid="input-email"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                  data-testid="button-send-otp"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Send Login Code
                    </>
                  )}
                </Button>
              </form>
            )}
            
            {step === "otp" && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">6-Digit Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    required
                    disabled={loading}
                    maxLength={6}
                    className="text-center text-2xl tracking-widest font-mono"
                    data-testid="input-otp"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading || otp.length !== 6}
                  data-testid="button-verify-otp"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 mr-2" />
                      Verify & Continue
                    </>
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="w-full" 
                  onClick={() => setStep("email")}
                  disabled={loading}
                >
                  Use a different email
                </Button>
              </form>
            )}

            {step === "register" && (
              <form onSubmit={handleCompleteRegistration} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={loading}
                      className="pl-10"
                      data-testid="input-name"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Mobile Number (with country code)</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 555 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      disabled={loading}
                      className="pl-10"
                      data-testid="input-phone"
                    />
                  </div>
                  <p className="text-xs text-slate-500">Include your country code (e.g., +1, +91, +44)</p>
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading || name.length < 2 || phone.length < 10}
                  data-testid="button-complete-registration"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Completing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Complete Registration
                    </>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-sm text-slate-500 mt-6">
          {step === "email" && "No password needed. We'll send you a secure one-time code."}
          {step === "otp" && "The code will expire in 10 minutes."}
          {step === "register" && "This information helps us personalize your experience."}
        </p>
      </div>
    </div>
  );
}
