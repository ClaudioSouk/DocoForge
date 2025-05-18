import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { saveProposal, getProposals } from "../services/documentService";
import { generateProposal } from "../utils/documentGenerator";
import { Proposal, Template, CustomSection, TemplateStyle } from "../types";
import DocumentViewer from "../components/DocumentViewer";
import SubscriptionPaywall from "../components/SubscriptionPaywall";
import StyleCustomizer from "../components/StyleCustomizer";
import { Info, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";

const ProposalGenerator: React.FC = () => {
  const { user } = useAuth();
  const [generatedProposal, setGeneratedProposal] = useState("");
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [templateStyle, setTemplateStyle] = useState<TemplateStyle>("formal");
  const [customCSS, setCustomCSS] = useState("");
  const [activeTab, setActiveTab] = useState("clientInfo");
  
  useEffect(() => {
    if (user) {
      loadProposals();
    }
  }, [user]);

  const loadProposals = async () => {
    if (user) {
      try {
        setIsLoading(true);
        const userProposals = await getProposals(user.id);
        setProposals(userProposals);
      } catch (error) {
        console.error("Error loading proposals:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const form = useForm({
    defaultValues: {
      // Client Information
      clientName: "",
      clientBackground: "",
      clientChallenges: "",
      
      // Project Details
      projectType: "",
      projectScope: "",
      projectGoals: "",
      proposedSolution: "",
      deliverables: "",
      timeline: "",
      price: "",
      paymentTerms: "50% upfront, 50% upon completion",
      
      // Value Proposition
      uniqueSellingPoints: "",
      competitiveAdvantages: "",
      socialProof: "",
      
      // Author Information
      authorName: user?.name || "",
      authorPosition: "",
      companyName: user?.company || "",
      contactEmail: user?.email || "",
      contactPhone: ""
    }
  });

  const handleGenerate = async (formData: any) => {
    if (!user?.subscribed) {
      toast.error("Please subscribe to generate proposals");
      return;
    }

    const priceNumber = parseFloat(formData.price);
    if (isNaN(priceNumber)) {
      toast.error("Please enter a valid price");
      return;
    }

    try {
      setIsLoading(true);
      console.log("Generating proposal with form data:", formData);
      
      const proposalData = {
        ...formData,
        price: priceNumber,
        userId: user.id,
        title: `Proposal for ${formData.clientName} - ${formData.projectType}`,
        currentDate: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric"
        })
      };

      // First generate the content with all the data
      const content = await generateProposal(proposalData);
      
      // Then save the proposal to the database
      const savedProposal = await saveProposal(proposalData);
      
      setGeneratedProposal(content);
      setShowPreview(true);
      setSelectedProposal(savedProposal);
      setProposals(prevProposals => [...prevProposals, savedProposal]);
      toast.success("Proposal generated successfully!");
    } catch (error) {
      console.error("Error generating proposal:", error);
      toast.error(`Failed to generate proposal: ${error.message || "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    // In a real app, this would generate a PDF
    const element = document.createElement("a");
    const file = new Blob([generatedProposal], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `proposal-${form.getValues().clientName}-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Proposal downloaded!");
  };

  const handleViewProposal = async (proposal: Proposal) => {
    setSelectedProposal(proposal);
    try {
      setIsLoading(true);
      // Pass all available fields to generateProposal
      const content = await generateProposal({
        ...proposal,
        // Add any additional fields with defaults
        clientBackground: proposal.clientBackground || "",
        projectGoals: proposal.projectGoals || "",
        deliverables: proposal.deliverables || "",
        timeline: proposal.timeline || "",
        paymentTerms: proposal.paymentTerms || "50% upfront, 50% upon completion",
        uniqueSellingPoints: proposal.uniqueSellingPoints || "",
        competitiveAdvantages: proposal.competitiveAdvantages || "",
        clientChallenges: proposal.clientChallenges || "",
        proposedSolution: proposal.proposedSolution || "",
        socialProof: proposal.socialProof || ""
      });
      setGeneratedProposal(content);
      setShowPreview(true);
    } catch (error) {
      console.error("Error viewing proposal:", error);
      toast.error("Failed to load proposal content");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    form.reset();
    setCustomCSS("");
  };

  const handleStyleChange = (style: TemplateStyle, css: string) => {
    setTemplateStyle(style);
    setCustomCSS(css);
  };

  const nextTab = () => {
    if (activeTab === "clientInfo") setActiveTab("projectDetails");
    else if (activeTab === "projectDetails") setActiveTab("valueProposition");
    else if (activeTab === "valueProposition") setActiveTab("authorInfo");
    else if (activeTab === "authorInfo") setActiveTab("styling");
  };

  const prevTab = () => {
    if (activeTab === "styling") setActiveTab("authorInfo");
    else if (activeTab === "authorInfo") setActiveTab("valueProposition");
    else if (activeTab === "valueProposition") setActiveTab("projectDetails");
    else if (activeTab === "projectDetails") setActiveTab("clientInfo");
  };

  if (!user?.subscribed && proposals.length === 0) {
    return (
      <Layout>
        <SubscriptionPaywall onSubscribe={() => {}} />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Proposal Generator</h1>
          <p className="text-gray-600 mt-1">
            Create professional, AI-powered proposals that win clients
          </p>
        </div>

        {showPreview ? (
          <DocumentViewer
            title={`Proposal for ${selectedProposal?.clientName}`}
            content={generatedProposal}
            onClose={() => setShowPreview(false)}
            onDownload={handleDownload}
            templateStyle={templateStyle}
            customCSS={customCSS}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Create Professional Proposal</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleGenerate)} className="space-y-6">
                      <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-5">
                          <TabsTrigger value="clientInfo" className="flex-1">
                            <span className="hidden sm:inline">Client Info</span>
                            <span className="sm:hidden">1</span>
                          </TabsTrigger>
                          <TabsTrigger value="projectDetails" className="flex-1">
                            <span className="hidden sm:inline">Project</span>
                            <span className="sm:hidden">2</span>
                          </TabsTrigger>
                          <TabsTrigger value="valueProposition" className="flex-1">
                            <span className="hidden sm:inline">Value</span>
                            <span className="sm:hidden">3</span>
                          </TabsTrigger>
                          <TabsTrigger value="authorInfo" className="flex-1">
                            <span className="hidden sm:inline">Author</span>
                            <span className="sm:hidden">4</span>
                          </TabsTrigger>
                          <TabsTrigger value="styling" className="flex-1">
                            <span className="hidden sm:inline">Styling</span>
                            <span className="sm:hidden">5</span>
                          </TabsTrigger>
                        </TabsList>
                        
                        {/* Tab 1: Client Information */}
                        <TabsContent value="clientInfo" className="space-y-4 pt-4">
                          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
                            <div className="flex items-start">
                              <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                              <p className="text-sm text-blue-700">
                                Understanding your client is the foundation of a great proposal. The more details you provide about their business and challenges, the more personalized and persuasive your proposal will be.
                              </p>
                            </div>
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="clientName"
                            render={({ field }) => (
                              <FormItem className="space-y-1">
                                <FormLabel>Client Name <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                  <Input placeholder="ABC Corporation" {...field} />
                                </FormControl>
                                <FormDescription>
                                  The company or person you're making the proposal for
                                </FormDescription>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="clientBackground"
                            render={({ field }) => (
                              <FormItem className="space-y-1">
                                <FormLabel>Client Background</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Briefly describe your client's business, industry, size, and how long they've been established..."
                                    className="min-h-20"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Context about the client that demonstrates you understand their business
                                </FormDescription>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="clientChallenges"
                            render={({ field }) => (
                              <FormItem className="space-y-1">
                                <FormLabel>Client Challenges</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="What specific problems or pain points is the client trying to solve?"
                                    className="min-h-20"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Clearly identifying challenges shows you understand their needs
                                </FormDescription>
                              </FormItem>
                            )}
                          />
                          
                          <div className="flex justify-end">
                            <Button type="button" onClick={nextTab} className="flex items-center">
                              Next: Project Details <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </TabsContent>
                        
                        {/* Tab 2: Project Details */}
                        <TabsContent value="projectDetails" className="space-y-4 pt-4">
                          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
                            <div className="flex items-start">
                              <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                              <p className="text-sm text-blue-700">
                                Be specific about what you'll deliver, when, and for how much. Clear project details lead to fewer misunderstandings and smoother projects.
                              </p>
                            </div>
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="projectType"
                            render={({ field }) => (
                              <FormItem className="space-y-1">
                                <FormLabel>Project Type <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                  <Input placeholder="Website Redesign, Marketing Campaign, etc." {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="projectGoals"
                            render={({ field }) => (
                              <FormItem className="space-y-1">
                                <FormLabel>Project Goals</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="What specific outcomes will this project achieve?"
                                    className="min-h-20"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  List measurable objectives the client can expect
                                </FormDescription>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="proposedSolution"
                            render={({ field }) => (
                              <FormItem className="space-y-1">
                                <FormLabel>Proposed Solution</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="How will your services solve the client's challenges?"
                                    className="min-h-20"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Describe your approach to addressing their needs
                                </FormDescription>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="projectScope"
                            render={({ field }) => (
                              <FormItem className="space-y-1">
                                <FormLabel>Project Scope <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Describe what is (and isn't) included in this project..."
                                    className="min-h-20"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Define boundaries to avoid scope creep later
                                </FormDescription>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="deliverables"
                            render={({ field }) => (
                              <FormItem className="space-y-1">
                                <FormLabel>Deliverables</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="List the specific items the client will receive..."
                                    className="min-h-20"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Be specific about what they'll receive (e.g., "5-page website with contact form")
                                </FormDescription>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="timeline"
                            render={({ field }) => (
                              <FormItem className="space-y-1">
                                <FormLabel>Timeline</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Key milestones and their dates..."
                                    className="min-h-20"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Break down the project into phases with specific timeframes
                                </FormDescription>
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="price"
                              render={({ field }) => (
                                <FormItem className="space-y-1">
                                  <FormLabel>Total Price ($) <span className="text-red-500">*</span></FormLabel>
                                  <FormControl>
                                    <Input type="number" placeholder="5000" {...field} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="paymentTerms"
                              render={({ field }) => (
                                <FormItem className="space-y-1">
                                  <FormLabel>Payment Terms</FormLabel>
                                  <FormControl>
                                    <Input placeholder="50% upfront, 50% upon completion" {...field} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="flex justify-between">
                            <Button type="button" variant="outline" onClick={prevTab}>
                              Back
                            </Button>
                            <Button type="button" onClick={nextTab} className="flex items-center">
                              Next: Value Proposition <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </TabsContent>
                        
                        {/* Tab 3: Value Proposition */}
                        <TabsContent value="valueProposition" className="space-y-4 pt-4">
                          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
                            <div className="flex items-start">
                              <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                              <p className="text-sm text-blue-700">
                                Why should the client choose you? This section helps persuade the client that you're the right choice by highlighting your unique strengths.
                              </p>
                            </div>
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="uniqueSellingPoints"
                            render={({ field }) => (
                              <FormItem className="space-y-1">
                                <FormLabel>Unique Selling Points</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="What makes your approach or service special?"
                                    className="min-h-20"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Highlight what distinguishes you from competitors
                                </FormDescription>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="competitiveAdvantages"
                            render={({ field }) => (
                              <FormItem className="space-y-1">
                                <FormLabel>Competitive Advantages</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Why are you better positioned to deliver results than others?"
                                    className="min-h-20"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Focus on benefits to the client, not just features
                                </FormDescription>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="socialProof"
                            render={({ field }) => (
                              <FormItem className="space-y-1">
                                <FormLabel>Social Proof & Testimonials</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Add relevant testimonials or case studies from similar clients..."
                                    className="min-h-20"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Evidence from past clients builds confidence
                                </FormDescription>
                              </FormItem>
                            )}
                          />
                          
                          <div className="flex justify-between">
                            <Button type="button" variant="outline" onClick={prevTab}>
                              Back
                            </Button>
                            <Button type="button" onClick={nextTab} className="flex items-center">
                              Next: Author Info <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </TabsContent>
                        
                        {/* Tab 4: Author Information */}
                        <TabsContent value="authorInfo" className="space-y-4 pt-4">
                          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
                            <div className="flex items-start">
                              <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                              <p className="text-sm text-blue-700">
                                Adding your personal and company information ensures the proposal looks professional and eliminates placeholder text like "[Your Name]" from the final document.
                              </p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="authorName"
                              render={({ field }) => (
                                <FormItem className="space-y-1">
                                  <FormLabel>Your Full Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="John Smith" {...field} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="authorPosition"
                              render={({ field }) => (
                                <FormItem className="space-y-1">
                                  <FormLabel>Your Position/Title</FormLabel>
                                  <FormControl>
                                    <Input placeholder="CEO, Consultant, etc." {...field} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="companyName"
                              render={({ field }) => (
                                <FormItem className="space-y-1">
                                  <FormLabel>Your Company Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Your Company Inc." {...field} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="contactEmail"
                              render={({ field }) => (
                                <FormItem className="space-y-1">
                                  <FormLabel>Contact Email</FormLabel>
                                  <FormControl>
                                    <Input type="email" placeholder="you@example.com" {...field} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="contactPhone"
                              render={({ field }) => (
                                <FormItem className="space-y-1">
                                  <FormLabel>Contact Phone</FormLabel>
                                  <FormControl>
                                    <Input placeholder="(555) 123-4567" {...field} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="flex justify-between">
                            <Button type="button" variant="outline" onClick={prevTab}>
                              Back
                            </Button>
                            <Button type="button" onClick={nextTab} className="flex items-center">
                              Next: Styling <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </TabsContent>
                        
                        {/* Tab 5: Styling */}
                        <TabsContent value="styling" className="pt-4">
                          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
                            <div className="flex items-start">
                              <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                              <p className="text-sm text-blue-700">
                                Choose a style that matches your brand and the client's expectations. Professional styling adds credibility to your proposal.
                              </p>
                            </div>
                          </div>
                          
                          <StyleCustomizer
                            initialStyle={templateStyle}
                            onChange={handleStyleChange}
                          />
                          
                          <div className="flex justify-between mt-6">
                            <Button type="button" variant="outline" onClick={prevTab}>
                              Back
                            </Button>
                            <div className="space-x-2">
                              <Button type="button" variant="outline" onClick={resetForm}>
                                Reset All
                              </Button>
                              <Button 
                                type="submit" 
                                className="bg-green-600 hover:bg-green-700"
                                disabled={isLoading || !form.formState.isValid}
                              >
                                {isLoading ? "Generating..." : "Generate Proposal"}
                              </Button>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                      
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-muted-foreground">
                            {activeTab === "clientInfo" && "Step 1 of 5: Client Information"}
                            {activeTab === "projectDetails" && "Step 2 of 5: Project Details"}
                            {activeTab === "valueProposition" && "Step 3 of 5: Value Proposition"}
                            {activeTab === "authorInfo" && "Step 4 of 5: Author Information"}
                            {activeTab === "styling" && "Step 5 of 5: Styling & Generate"}
                          </div>
                          <div className="flex items-center">
                            <CheckCircle2 className={`h-4 w-4 mr-1 ${form.getValues().clientName ? "text-green-500" : "text-gray-300"}`} />
                            <CheckCircle2 className={`h-4 w-4 mr-1 ${form.getValues().projectType && form.getValues().projectScope ? "text-green-500" : "text-gray-300"}`} />
                            <CheckCircle2 className={`h-4 w-4 mr-1 ${form.getValues().price ? "text-green-500" : "text-gray-300"}`} />
                            <CheckCircle2 className={`h-4 w-4 mr-1 ${form.getValues().authorName ? "text-green-500" : "text-gray-300"}`} />
                            <CheckCircle2 className={`h-4 w-4 ${templateStyle !== "formal" ? "text-green-500" : "text-gray-300"}`} />
                          </div>
                        </div>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            {/* Recent Proposals Section */}
            {proposals.length > 0 && (
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Proposals</CardTitle>
                  </CardHeader>
                  <CardContent className="max-h-96 overflow-y-auto">
                    <div className="space-y-4">
                      {proposals.map((proposal) => (
                        <Card
                          key={proposal.id}
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => handleViewProposal(proposal)}
                        >
                          <CardContent className="p-4">
                            <h3 className="font-medium">
                              {proposal.clientName}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {proposal.projectType}
                            </p>
                            <p className="text-sm text-gray-500">
                              ${proposal.price?.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              {new Date(proposal.createdAt).toLocaleDateString()}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProposalGenerator;
