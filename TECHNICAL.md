
# DocuGenius - Technical Documentation

This document provides detailed technical information about the DocuGenius SaaS platform for developers, contributors, and technical stakeholders.

## 🏗️ Architecture Overview

DocuGenius is built as a single-page application (SPA) using modern web technologies:

- **Frontend**: React with TypeScript
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **Build Tool**: Vite
- **State Management**: React Context API + TanStack Query
- **Routing**: React Router
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Edge Functions**: Supabase Edge Functions for secure document generation
- **AI Integration**: OpenAI API (via secure edge functions)

## 🧩 Core Components

### 1. Authentication System

The authentication system uses Supabase Auth for user management. The implementation can be found in `src/context/AuthContext.tsx`, which provides:

- User registration with email/password
- Login/logout functionality
- Session persistence
- User profile management
- Subscription status tracking

The AuthContext exposes these capabilities through a custom hook (`useAuth`) that can be imported throughout the application.

### 2. Document Generation Engine

The document generation system consists of two main parts:

1. **Client-side Utilities** (`src/utils/documentGenerator.ts`):
   - Prepares document data from form inputs
   - Creates tailored prompts for AI document generation
   - Securely calls edge functions for AI-powered content
   - Handles response parsing and error management

2. **Edge Functions** (`supabase/functions/generate-document/`):
   - Securely stores API keys in environment variables
   - Makes authenticated API calls to OpenAI
   - Processes prompts and returns formatted document content
   - Implements proper error handling and logging

The system supports three document types:
- **Proposals**: Professional project proposals with standardized sections
- **Onboarding Emails**: Client welcome emails with project details
- **Invoices**: Detailed invoices with itemization and business information

### 3. Document Storage and Database

Document storage is implemented through Supabase PostgreSQL database service (`src/services/documentService.ts`) which provides:

- Document creation and storage in Supabase tables
- Retrieval by user ID with Row Level Security (RLS)
- Recent documents list generation
- Document deletion with appropriate access controls

The database schema includes tables for proposals, onboarding emails, invoices, and invoice items, all secured with Row Level Security (RLS) policies to ensure users can only access their own data.

### 4. User Interface Components

The UI is built with reusable components:

- **Layout Component**: Provides consistent navigation and structure (`src/components/Layout.tsx`)
- **Document Viewer**: Renders and allows interaction with generated documents (`src/components/DocumentViewer.tsx`)
- **Subscription Paywall**: Manages access to premium features (`src/components/SubscriptionPaywall.tsx`)

### 5. Page Components

The application is organized into page components representing different sections:

- Dashboard (`src/pages/Dashboard.tsx`)
- Proposal Generator (`src/pages/Proposals.tsx`)
- Onboarding Email Generator (`src/pages/Onboarding.tsx`)
- Invoice Generator (`src/pages/Invoices.tsx`)
- Subscription Management (`src/pages/Subscription.tsx`)

## 📊 Data Models

The application uses several core data models defined in `src/types/index.ts`:

### User Model
```typescript
interface User {
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
```

### Document Models
```typescript
interface Proposal {
  id: string;
  clientName: string;
  projectType: string;
  projectScope: string;
  price: number;
  userId: string;
  createdAt: string;
  title?: string;
  clientBackground?: string;
  projectGoals?: string;
  deliverables?: string;
  timeline?: string;
  paymentTerms?: string;
}

interface OnboardingEmail {
  id: string;
  clientName: string;
  onboardingDetails: string;
  companyName: string;
  userId: string;
  createdAt: string;
}

interface Invoice {
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
}
```

## 🔒 Security Implementation

### Authentication Security

- Authentication is handled by Supabase Auth service
- Passwords are never stored in plaintext
- Auth token management is handled by Supabase
- Auth state is properly cleaned up during logout

### API Key Security

- OpenAI API key is stored as a Supabase Edge Function secret
- No API keys are exposed in client-side code
- All API calls to external services are made exclusively through edge functions
- Proper error handling prevents leaking sensitive information

### Database Security

- Row Level Security (RLS) policies ensure users can only access their own data
- Separate tables for different document types with appropriate relationships
- Database operations are secured with user context from auth
- All queries are authenticated with the user's session

## 🚀 Deployment Considerations

For production deployment:

1. Set up proper environment variables for API keys in Supabase Edge Functions
2. Configure CORS for API endpoints
3. Implement rate limiting for document generation
4. Set up database backups for Supabase data
5. Configure proper Row Level Security (RLS) policies for all tables
6. Ensure OpenAI API keys have appropriate usage limits configured

## 🔄 Future Enhancement Considerations

Technical enhancements planned for future releases:

1. Addition of PDF export capabilities with custom styling
2. Email integration for sending documents directly
3. Analytics dashboard for document usage metrics
4. Multi-user team accounts with document sharing
5. Real-time collaboration features with Supabase Realtime
6. GPT-based document improvement suggestions

## 📚 Developer Resources

- React documentation: https://react.dev/
- Tailwind CSS: https://tailwindcss.com/
- shadcn/ui: https://ui.shadcn.com/
- Supabase: https://supabase.com/docs
- React Router: https://reactrouter.com/
- TanStack Query: https://tanstack.com/query/latest/
- OpenAI API: https://platform.openai.com/docs/api-reference
