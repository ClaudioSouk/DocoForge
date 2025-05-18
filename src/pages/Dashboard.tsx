
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Mail, CreditCard, ArrowRight, Trash, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import documentService from "../services/documentService";
import { Document } from "../types";
import { toast } from "sonner";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentDocuments, setRecentDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadRecentDocuments();
    }
  }, [user]);

  const loadRecentDocuments = async () => {
    if (user) {
      try {
        setIsLoading(true);
        const documents = await documentService.getRecentDocuments(user.id);
        setRecentDocuments(documents);
      } catch (error) {
        console.error("Error loading documents:", error);
        toast.error("Failed to load recent documents");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDeleteDocument = async (doc: Document) => {
    try {
      setIsDeleting(doc.id);
      const success = await documentService.deleteDocument(doc.id, doc.type);
      if (success) {
        toast.success(`${doc.title} has been deleted`);
        // Update the recentDocuments state to remove the deleted document
        setRecentDocuments(prevDocs => prevDocs.filter(d => d.id !== doc.id));
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Failed to delete document");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
          <p className="text-gray-600 mt-1">
            Manage and create your professional documents
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Create a Proposal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-4">
                <div className="bg-brand-100 p-3 rounded-lg">
                  <FileText className="h-6 w-6 text-brand-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-4">
                    Create professional proposals for your clients with customized project details
                  </p>
                  <Button
                    variant="outline"
                    className="flex items-center justify-between w-full"
                    onClick={() => navigate("/proposals")}
                  >
                    <span>Create Proposal</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Send Onboarding Email</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-4">
                <div className="bg-brand-100 p-3 rounded-lg">
                  <Mail className="h-6 w-6 text-brand-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-4">
                    Welcome new clients with a professional onboarding email that outlines next steps
                  </p>
                  <Button
                    variant="outline"
                    className="flex items-center justify-between w-full"
                    onClick={() => navigate("/onboarding")}
                  >
                    <span>Create Email</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Generate Invoice</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-4">
                <div className="bg-brand-100 p-3 rounded-lg">
                  <CreditCard className="h-6 w-6 text-brand-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-4">
                    Create professional invoices for your clients with itemized services and payment details
                  </p>
                  <Button
                    variant="outline"
                    className="flex items-center justify-between w-full"
                    onClick={() => navigate("/invoices")}
                  >
                    <span>Create Invoice</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Documents</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-500">Loading documents...</span>
              </div>
            ) : recentDocuments.length > 0 ? (
              <div className="divide-y">
                {recentDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="py-3 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{doc.title}</p>
                      <p className="text-sm text-gray-500">
                        {doc.clientName} • {new Date(doc.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // Navigate to the appropriate page based on document type
                          if (doc.type === "proposal") {
                            navigate("/proposals");
                          } else if (doc.type === "email") {
                            navigate("/onboarding");
                          } else if (doc.type === "invoice") {
                            navigate("/invoices");
                          }
                        }}
                      >
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDeleteDocument(doc)}
                        disabled={isDeleting === doc.id}
                      >
                        {isDeleting === doc.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">You haven't created any documents yet</p>
                <p className="text-gray-400 text-sm mt-1">
                  Get started by creating a proposal, onboarding email, or invoice
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
