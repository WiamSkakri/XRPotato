import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet, Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleEmailAuth = (isSignup: boolean) => {
    if (isSignup && !name) {
      toast({ title: "Name required", variant: "destructive" });
      return;
    }
    if (!email || !password) {
      toast({ title: "Email and password required", variant: "destructive" });
      return;
    }
    
    // TODO: Implement Auth0 integration
    toast({
      title: `${isSignup ? "Sign up" : "Login"} with Auth0`,
      description: "Auth0 integration coming soon. For demo, use wallet connect.",
    });
  };

  const handleWalletConnect = () => {
    // TODO: Implement XUMM wallet connection
    toast({
      title: "Connect XUMM Wallet",
      description: "XUMM wallet integration coming soon. Scan QR to connect.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,hsl(var(--accent)/0.1),transparent_50%)]" />
      
      <div className="w-full max-w-md relative">
        <Link to="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2" />
            Back to Home
          </Button>
        </Link>

        <Card className="p-8 backdrop-blur-sm bg-card/95 border-primary/20 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Welcome to XRPotato
            </h1>
            <p className="text-muted-foreground">Sign in to start your read-to-earn journey</p>
          </div>

          <Tabs defaultValue="wallet" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="wallet">
                <Wallet className="w-4 h-4 mr-2" />
                Wallet
              </TabsTrigger>
              <TabsTrigger value="email">
                <Mail className="w-4 h-4 mr-2" />
                Email
              </TabsTrigger>
            </TabsList>

            <TabsContent value="wallet" className="space-y-4">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  Connect your XRPL wallet using XUMM for secure, decentralized authentication.
                </p>
                <Button 
                  variant="wallet" 
                  className="w-full h-12" 
                  onClick={handleWalletConnect}
                >
                  <Wallet className="mr-2" />
                  Connect XUMM Wallet
                </Button>
                <div className="text-xs text-center text-muted-foreground">
                  Don't have a wallet? <a href="https://xumm.app" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Download XUMM</a>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="email" className="space-y-4">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input 
                      id="login-email"
                      type="email" 
                      placeholder="author@university.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input 
                      id="login-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <Button 
                    variant="hero" 
                    className="w-full" 
                    onClick={() => handleEmailAuth(false)}
                  >
                    Login with Auth0
                  </Button>
                </TabsContent>

                <TabsContent value="signup" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input 
                      id="signup-name"
                      placeholder="Dr. Jane Smith"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input 
                      id="signup-email"
                      type="email"
                      placeholder="author@university.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input 
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <Button 
                    variant="hero" 
                    className="w-full"
                    onClick={() => handleEmailAuth(true)}
                  >
                    Create Account
                  </Button>
                </TabsContent>
              </Tabs>

              <div className="text-xs text-center text-muted-foreground">
                Secured by <span className="text-primary font-semibold">Auth0</span>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-center text-muted-foreground">
              By connecting, you agree to XRPotato's Terms of Service and Privacy Policy
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
