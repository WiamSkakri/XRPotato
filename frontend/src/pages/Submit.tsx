import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    Upload,
    FileText,
    CheckCircle2,
    ArrowLeft,
    Loader2
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const Submit = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        abstract: "",
        keywords: "",
        coAuthors: "",
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.type !== "application/pdf") {
                toast({
                    title: "Invalid file type",
                    description: "Please upload a PDF file",
                    variant: "destructive"
                });
                return;
            }
            setFile(selectedFile);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file) {
            toast({
                title: "No file selected",
                description: "Please upload a PDF of your paper",
                variant: "destructive"
            });
            return;
        }

        if (!formData.title || !formData.abstract) {
            toast({
                title: "Missing required fields",
                description: "Please fill in title and abstract",
                variant: "destructive"
            });
            return;
        }

        setIsUploading(true);

        // Simulate upload process
        setTimeout(() => {
            setIsUploading(false);
            toast({
                title: "Paper submitted successfully! 🎉",
                description: "Your paper will be uploaded to IPFS and S3. Processing will begin shortly.",
            });

            // TODO: Implement actual IPFS upload and backend API call
            console.log("Would upload:", {
                file,
                ...formData,
                hash: "SHA256..." // Would compute actual hash
            });
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border bg-card/50 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-4">
                    <Link to="/dashboard">
                        <Button variant="ghost">
                            <ArrowLeft className="mr-2" />
                            Back to Dashboard
                        </Button>
                    </Link>
                </div>
            </header>

            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Submit New Paper
                    </h1>
                    <p className="text-muted-foreground">
                        Upload your research to IPFS and start earning from every read
                    </p>
                </div>

                {/* Workflow Steps */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <Card className="p-4 border-primary bg-primary/5">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                                1
                            </div>
                            <div className="text-sm font-medium">Upload</div>
                        </div>
                    </Card>
                    <Card className="p-4 opacity-50">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-bold">
                                2
                            </div>
                            <div className="text-sm">Review Process</div>
                        </div>
                    </Card>
                    <Card className="p-4 opacity-50">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-bold">
                                3
                            </div>
                            <div className="text-sm">NFT Minting</div>
                        </div>
                    </Card>
                    <Card className="p-4 opacity-50">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-bold">
                                4
                            </div>
                            <div className="text-sm">Earn from Reads</div>
                        </div>
                    </Card>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* PDF Upload */}
                    <Card className="p-6">
                        <Label className="text-lg font-semibold mb-4 block">Paper PDF</Label>
                        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                            {file ? (
                                <div className="space-y-4">
                                    <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
                                    <div>
                                        <p className="font-medium">{file.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setFile(null)}
                                    >
                                        Change File
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <FileText className="w-12 h-12 text-muted-foreground mx-auto" />
                                    <div>
                                        <Label htmlFor="file-upload" className="cursor-pointer">
                                            <span className="text-primary hover:underline font-medium">
                                                Click to upload
                                            </span>{" "}
                                            or drag and drop
                                        </Label>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            PDF up to 20MB
                                        </p>
                                    </div>
                                    <Input
                                        id="file-upload"
                                        type="file"
                                        accept=".pdf"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Metadata */}
                    <Card className="p-6 space-y-4">
                        <h3 className="text-lg font-semibold">Paper Details</h3>

                        <div className="space-y-2">
                            <Label htmlFor="title">Title *</Label>
                            <Input
                                id="title"
                                placeholder="Enter your paper title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="abstract">Abstract *</Label>
                            <Textarea
                                id="abstract"
                                placeholder="Provide a concise summary of your research..."
                                rows={6}
                                value={formData.abstract}
                                onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="keywords">Keywords</Label>
                            <Input
                                id="keywords"
                                placeholder="quantum biology, entanglement, coherence (comma-separated)"
                                value={formData.keywords}
                                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="coAuthors">Co-Authors</Label>
                            <Input
                                id="coAuthors"
                                placeholder="Dr. John Doe, Dr. Jane Smith (comma-separated)"
                                value={formData.coAuthors}
                                onChange={(e) => setFormData({ ...formData, coAuthors: e.target.value })}
                            />
                        </div>
                    </Card>

                    {/* Revenue Model Info */}
                    <Card className="p-6 bg-accent/5 border-accent/20">
                        <h3 className="text-lg font-semibold mb-3">Revenue Split (Default)</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <Badge variant="outline" className="mb-2">60%</Badge>
                                <p className="text-sm text-muted-foreground">Authors</p>
                            </div>
                            <div className="text-center">
                                <Badge variant="outline" className="mb-2">20%</Badge>
                                <p className="text-sm text-muted-foreground">Journal</p>
                            </div>
                            <div className="text-center">
                                <Badge variant="outline" className="mb-2">15%</Badge>
                                <p className="text-sm text-muted-foreground">Reviewers</p>
                            </div>
                            <div className="text-center">
                                <Badge variant="outline" className="mb-2">5%</Badge>
                                <p className="text-sm text-muted-foreground">Platform</p>
                            </div>
                        </div>
                    </Card>

                    {/* Submit */}
                    <div className="flex gap-4">
                        <Button
                            type="submit"
                            variant="hero"
                            className="flex-1"
                            disabled={isUploading}
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="mr-2 animate-spin" />
                                    Uploading to IPFS...
                                </>
                            ) : (
                                <>
                                    <Upload className="mr-2" />
                                    Submit Paper
                                </>
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            asChild
                        >
                            <Link to="/dashboard">Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Submit;
