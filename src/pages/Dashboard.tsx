import { useEffect, useState } from "react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  TrendingUp, 
  Users, 
  Coins, 
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  Wallet,
  Loader2
} from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { API_URL } from "@/config";

interface Paper {
  id: string;
  title: string;
  abstract: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const Dashboard = () => {
//auth
const{
    user,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout
  } = useAuth0();

  console.log("User:", user);
  console.log("Is Authenticated:", isAuthenticated);
  console.log("Is Loading:", isLoading);

  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
 

  // Fetch papers from backend
  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const response = await fetch(`${API_URL}/api/papers`);
        if (!response.ok) {
          throw new Error('Failed to fetch papers');
        }
        const data = await response.json();
        setPapers(data.papers || []);
      } catch (error) {
        toast({
          title: "Error loading papers",
          description: error instanceof Error ? error.message : "Please try again later",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, []);

  // Fetch papers from backend
  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/dbuser/${user?.sub}`);
        if (!response.ok) {
          //throw new Error('Failed to fetch papers');
        }
        const data = await response.json();
        console.log("exists", data);
      } catch (error) {
        toast({
          title: "Error loading papers",
          description: error instanceof Error ? error.message : "Please try again later",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, []);

  // Calculate stats from real data
  const stats = {
    papers: { 
      total: papers.length, 
      published: papers.filter(p => p.status === 'published').length, 
      inReview: papers.filter(p => p.status === 'under_review').length 
    },
    earnings: { total: 245.50, thisMonth: 42.30 }, // TODO: Get from backend
    reads: { total: 847, thisWeek: 23 }, // TODO: Get from backend
    citations: 12 // TODO: Get from backend
  };

  const getStatusColor = (status: string) => {
    const upperStatus = status.toUpperCase();
    switch (upperStatus) {
      case "PUBLISHED": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "UNDER_REVIEW": 
      case "SUBMITTED": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "DRAFT": return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      case "ACCEPTED": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "REJECTED": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return "1 day ago";
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                XRPotato
              </h1>
            </Link>
            <div className="flex items-center gap-4">
              <Button variant="wallet" size="sm">
                <Wallet className="mr-2 w-4 h-4" />
                rXXX...4a2b
              </Button>
              <Button onClick={() => logout({ 
                logoutParams: { returnTo: window.location.origin } 
              })}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, Dr. Maria! 👋</h2>
          <p className="text-muted-foreground">Track your publications, earnings, and impact.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <FileText className="w-8 h-8 text-primary" />
              <Badge variant="outline">{stats.papers.published} Published</Badge>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.papers.total}</div>
            <div className="text-sm text-muted-foreground">Total Papers</div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <Coins className="w-8 h-8 text-accent" />
              <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                +${stats.earnings.thisMonth} this month
              </Badge>
            </div>
            <div className="text-3xl font-bold mb-1">${stats.earnings.total}</div>
            <div className="text-sm text-muted-foreground">Total Earnings (XRP)</div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-primary-glow" />
              <Badge variant="outline">{stats.reads.thisWeek} this week</Badge>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.reads.total}</div>
            <div className="text-sm text-muted-foreground">Total Reads</div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-secondary" />
              <ArrowUpRight className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.citations}</div>
            <div className="text-sm text-muted-foreground">Citations</div>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="papers" className="space-y-6">
          <TabsList>
            <TabsTrigger value="papers">My Papers</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="papers" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-semibold">Your Papers</h3>
              <Button variant="hero" asChild>
                <Link to="/submit">Submit New Paper</Link>
              </Button>
            </div>

            {loading ? (
              <Card className="p-8 text-center">
                <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
                <p className="text-muted-foreground">Loading your papers...</p>
              </Card>
            ) : papers.length === 0 ? (
              <Card className="p-8 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No papers yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start by submitting your first research paper
                </p>
                <Button variant="hero" asChild>
                  <Link to="/submit">Submit Paper</Link>
                </Button>
              </Card>
            ) : (
              papers.map((paper) => (
                <Card key={paper.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-xl font-semibold">{paper.title}</h4>
                        <Badge className={getStatusColor(paper.status)}>
                          {paper.status.replace(/_/g, " ").toUpperCase()}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {paper.abstract}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Created {formatDate(paper.created_at)}
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          0 reads {/* TODO: Track reads */}
                        </span>
                      </div>
                    </div>

                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            <Card className="p-8 text-center">
              <CheckCircle2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No pending reviews</h3>
              <p className="text-muted-foreground">
                You'll see review invitations here when editors assign papers to you.
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Earnings Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">From reads</span>
                    <span className="font-semibold">$215.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">From citations</span>
                    <span className="font-semibold">$30.50</span>
                  </div>
                  <div className="h-px bg-border my-2" />
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-accent">${stats.earnings.total}</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Impact Metrics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Read completion rate</span>
                    <span className="font-semibold">87%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Avg. read time</span>
                    <span className="font-semibold">12 min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Reputation score</span>
                    <span className="font-semibold text-primary">94/100</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
