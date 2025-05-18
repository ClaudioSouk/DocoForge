
export interface User {
  id: string;
  name: string;
  email: string;
  company?: string;
  subscribed: boolean;
  subscription?: {
    status: "active" | "canceled" | "trial";
    plan: "monthly" | "annual";
    trialEndsAt?: string;
  };
}

export interface Proposal {
  id: string;
  clientName: string;
  projectType: string;
  projectScope: string;
  price: number;
  userId: string;
  createdAt: string;
  title?: string;
  // Fields for detailed proposals
  clientBackground?: string;
  projectGoals?: string;
  deliverables?: string;
  timeline?: string;
  paymentTerms?: string;
  // New fields for enhanced persuasive proposals
  uniqueSellingPoints?: string;
  competitiveAdvantages?: string;
  clientChallenges?: string;
  proposedSolution?: string;
  socialProof?: string;
}

export interface OnboardingEmail {
  id: string;
  clientName: string;
  onboardingDetails: string;
  companyName: string;
  userId: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  clientName: string;
  projectName: string;
  amountDue: number;
  dueDate: string;
  userId: string;
  createdAt: string;
  businessDetails: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
  clientDetails: {
    name: string;
    address?: string;
    email?: string;
  };
  items: {
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }[];
  // Adding the missing properties that are used in documentGenerator.ts
  authorName?: string;
  authorPosition?: string;
  currentDate?: string;
}

export interface Document {
  id: string;
  type: "proposal" | "email" | "invoice";
  title: string;
  clientName: string;
  createdAt: string;
  userId: string;
}

// Export template types
export * from './template';
