
import React from "react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const Subscription: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Subscription</h1>
          <p className="text-gray-600 mt-1">Your subscription information</p>
        </div>

        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-green-700">
              Free Trial Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-600 mb-4">
              You are currently on a 7-day free trial with full access to all features.
              {user?.subscription?.trialEndsAt && (
                <span>
                  {" "}
                  (Trial ends:{" "}
                  {new Date(user.subscription.trialEndsAt).toLocaleDateString()})
                </span>
              )}
            </p>
            
            <p className="text-sm text-gray-600">
              We hope you enjoy using our app! There are no payment requirements during this trial period.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Access to all document generators (proposals, onboarding emails, invoices)</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Create unlimited documents</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Download all documents as PDF and text</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Access your document history</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Priority customer support</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Subscription;
