import { useEffect, useState } from "react";
import { useAuth } from "../api/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Auth() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);

  // ------------------------
  // Redirect if already logged in
  // ------------------------
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSigningIn(true);

    try {
      await login(username, password);
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setIsSigningIn(false);
    }
  };

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo & Title */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Hostel Management</h1>
          <p className="text-muted-foreground">Sign in to access the dashboard</p>
        </div>

        {/* Card */}
        <Card className="border-border/50 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Sign in</CardTitle>
            <CardDescription>Use your credentials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive" className="py-2">
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="admin@gmail.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isSigningIn}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isSigningIn}
                />
              </div>

              <Button type="submit" className="w-full h-11" disabled={isSigningIn}>
                {isSigningIn ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Contact your administrator if you need access
        </p>
      </div>
    </div>
  );
}
