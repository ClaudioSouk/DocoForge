import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { saveOnboardingEmail, getOnboardingEmails } from "../services/documentService";
import { generateOnboardingEmail } from "../utils/documentGenerator";
import { OnboardingEmail } from "../types";
import DocumentViewer from "../components/DocumentViewer";
import SubscriptionPaywall from "../components/SubscriptionPaywall";

const OnboardingEmailGenerator: React.FC = () => {
  const { user } = useAuth();
  const [clientName, setClientName] = useState("");
  const [onboardingDetails, setOnboardingDetails] = useState("");
  const [companyName, setCompanyName] = useState(user?.company || "");
  const [authorName, setAuthorName] = useState(user?.name || "");
  const [authorPosition, setAuthorPosition] = useState("");
  const [authorEmail, setAuthorEmail] = useState(user?.email || "");
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [emails, setEmails] = useState<OnboardingEmail[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<OnboardingEmail | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadEmails();
      setCompanyName(user.company || "");
      setAuthorName(user.name || "");
      setAuthorEmail(user.email || "");
    }
  }, [user]);

  const loadEmails = async () => {
    if (user) {
      try {
        setIsLoading(true);
        const userEmails = await getOnboardingEmails(user.id);
        setEmails(userEmails);
      } catch (error) {
        console.error("Error loading emails:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleGenerate = async () => {
    if (!user?.subscribed) {
      toast.error("Please subscribe to generate onboarding emails");
      return;
    }

    try {
      setIsLoading(true);
      const currentDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
      
      const emailData = {
        clientName,
        onboardingDetails,
        companyName,
        authorName,
        authorPosition,
        authorEmail,
        currentDate,
        userId: user.id,
      };

      // Use await here to properly handle the promise
      const content = await generateOnboardingEmail(emailData);
      const savedEmail = await saveOnboardingEmail(emailData);
      
      setGeneratedEmail(content);
      setShowPreview(true);
      setSelectedEmail(savedEmail);
      setEmails(prevEmails => [...prevEmails, savedEmail]);
      toast.success("Onboarding email generated successfully!");
    } catch (error) {
      console.error("Error generating email:", error);
      toast.error("Failed to generate onboarding email");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewEmail = async (email: OnboardingEmail) => {
    setSelectedEmail(email);
    try {
      // Include author information when regenerating content
      const currentDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
      
      // Use await here to properly handle the promise
      const content = await generateOnboardingEmail({
        ...email,
        authorName,
        authorPosition,
        authorEmail,
        currentDate
      });
      
      setGeneratedEmail(content);
      setShowPreview(true);
    } catch (error) {
      console.error("Error viewing email:", error);
      toast.error("Failed to load email content");
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedEmail], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `onboarding-email-${clientName}-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Onboarding email downloaded!");
  };

  const resetForm = () => {
    setClientName("");
    setOnboardingDetails("");
  };

  if (!user?.subscribed && emails.length === 0) {
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
          <h1 className="text-3xl font-bold">Onboarding Email Generator</h1>
          <p className="text-gray-600 mt-1">
            Create professional welcome emails for your new clients
          </p>
        </div>

        {showPreview ? (
          <DocumentViewer
            title={`Welcome Email for ${selectedEmail?.clientName}`}
            content={generatedEmail}
            onClose={() => setShowPreview(false)}
            onDownload={handleDownload}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Onboarding Email</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientName">Client Name</Label>
                    <Input
                      id="clientName"
                      placeholder="Enter client name"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="onboardingDetails">
                      Project Details & Milestones
                    </Label>
                    <Textarea
                      id="onboardingDetails"
                      placeholder="Describe the project details and key milestones..."
                      className="min-h-32"
                      value={onboardingDetails}
                      onChange={(e) => setOnboardingDetails(e.target.value)}
                    />
                  </div>
                  
                  <div className="border-t pt-4 mt-4">
                    <h3 className="font-medium mb-3">Your Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Your Company Name</Label>
                        <Input
                          id="companyName"
                          placeholder="Your company name"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="authorName">Your Full Name</Label>
                        <Input
                          id="authorName"
                          placeholder="Your full name"
                          value={authorName}
                          onChange={(e) => setAuthorName(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="authorPosition">Your Position</Label>
                        <Input
                          id="authorPosition"
                          placeholder="CEO, Project Manager, etc."
                          value={authorPosition}
                          onChange={(e) => setAuthorPosition(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="authorEmail">Your Email</Label>
                        <Input
                          id="authorEmail"
                          placeholder="you@example.com"
                          value={authorEmail}
                          onChange={(e) => setAuthorEmail(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={resetForm}>
                      Reset
                    </Button>
                    <Button onClick={handleGenerate} disabled={isLoading}>
                      {isLoading ? "Generating..." : "Generate Email"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {emails.length > 0 && (
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Emails</CardTitle>
                  </CardHeader>
                  <CardContent className="max-h-96 overflow-y-auto">
                    <div className="space-y-4">
                      {emails.map((email) => (
                        <Card
                          key={email.id}
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => handleViewEmail(email)}
                        >
                          <CardContent className="p-4">
                            <h3 className="font-medium">
                              Welcome: {email.clientName}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Company: {email.companyName}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              {new Date(email.createdAt).toLocaleDateString()}
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

export default OnboardingEmailGenerator;
