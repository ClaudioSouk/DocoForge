
import React from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

interface SubscriptionPaywallProps {
  onSubscribe: () => void;
}

const SubscriptionPaywall: React.FC<SubscriptionPaywallProps> = ({
  onSubscribe,
}) => {
  const { updateSubscription } = useAuth();
  const navigate = useNavigate();

  const handleStartFreeTrial = () => {
    // In a real app, this would set up a free trial
    updateSubscription(true);
    onSubscribe();
    toast.success("Free trial started! You now have full access to all features.");
    navigate("/dashboard");
  };

  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto p-6 text-center">
      <h2 className="text-3xl font-bold mb-2 text-gray-800">
        Start Your Free Trial
      </h2>
      <p className="text-gray-600 mb-8">
        Try all our professional document generators and automation tools for 7 days.
      </p>

      <div className="w-full max-w-md">
        <Card className="border-2 border-brand-500 rounded-lg p-6 bg-white shadow-md">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold mb-2">7-Day Free Trial</h3>
            <p className="text-sm text-green-600 mb-4">No payment required</p>
          </div>

          <ul className="text-left space-y-3 mb-6">
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span>Access all document generators</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span>Generate unlimited documents</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span>Download as PDF and text</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span>Full access to all features</span>
            </li>
          </ul>

          <Button 
            className="w-full bg-brand-600 hover:bg-brand-700" 
            onClick={handleStartFreeTrial}
          >
            Start Free Trial
          </Button>
        </Card>

        <p className="mt-8 text-sm text-gray-500">
          No credit card required. Start using all features immediately.
        </p>
      </div>
    </div>
  );
};

export default SubscriptionPaywall;
