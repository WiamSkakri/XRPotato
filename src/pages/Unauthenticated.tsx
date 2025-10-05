import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen, Coins, Shield, Users, Zap, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const Unauthenticated = () => {

const{
    user,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout
  } = useAuth0();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <h1>UNAUTHENTICATED</h1>
      <section className="relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary-glow)/0.15),transparent_50%)]" />
        
        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge variant="outline" className="px-4 py-2 text-sm border-primary/30">
              <Zap className="w-3 h-3 mr-2 inline" />
              Built on XRPL Testnet
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
                XRPotato
              </span>
              <br />
              <span className="text-foreground">Read-to-Earn Publishing</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Revolutionary academic publishing where authors earn from every read, 
              reviewers get compensated fairly, and knowledge flows freely on the blockchain.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
              onClick={() => loginWithRedirect()}
              >
                  JOIN XRPotato
              </Button>
            
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground text-lg">
            A complete academic workflow powered by XRPL blockchain
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Submit & Review</h3>
            <p className="text-muted-foreground">
              Upload your paper to IPFS, get assigned reviewers, and track the peer review process transparently.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-accent-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">NFT Publication</h3>
            <p className="text-muted-foreground">
              Published papers are minted as XLS-20 NFTs with immutable version history and DOI registration.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-glow to-primary flex items-center justify-center mb-4">
              <Coins className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Earn from Reads</h3>
            <p className="text-muted-foreground">
              Every read triggers micropayments split between authors (60%), journal (20%), reviewers (15%), platform (5%).
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-secondary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Fair Compensation</h3>
            <p className="text-muted-foreground">
              Reviewers are paid via XRPL escrow. Quality reviews increase reputation and future earning potential.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent/80 to-accent flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-accent-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-Time Analytics</h3>
            <p className="text-muted-foreground">
              Track reads, citations, revenue, and impact metrics. All transactions verifiable on XRPL testnet explorer.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Instant Settlement</h3>
            <p className="text-muted-foreground">
              Micropayments settle in 3-5 seconds on XRPL. No waiting months for publication royalties.
            </p>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">1,247</div>
              <div className="text-muted-foreground">Papers Submitted</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-accent mb-2">892</div>
              <div className="text-muted-foreground">NFTs Minted</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary-glow mb-2">15.2K</div>
              <div className="text-muted-foreground">Total Reads</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-accent mb-2">$8.4K</div>
              <div className="text-muted-foreground">Earned (XRP)</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="p-12 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to revolutionize academic publishing?
            </h2>
            <p className="text-lg text-muted-foreground">
              Join authors, reviewers, and journals building the future of open science on XRPL.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
              onClick={() => loginWithRedirect()}>
            Login / Sign Up
              </Button>
         
            </div>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="mb-2">XRPotato - Built on XRPL Testnet</p>
          <p className="text-sm">Hackathon MVP • All transactions verifiable on-chain</p>
        </div>
      </footer>
    </div>
  );
};

export default Unauthenticated;
