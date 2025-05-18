
import { Template, DocumentType, TemplateCategory, TemplateStyle, CustomSection } from "../types";

// Default templates categorized by document type and industry
export const defaultTemplates: Record<DocumentType, Record<TemplateCategory, Template[]>> = {
  proposal: {
    general: [
      {
        id: "proposal-formal",
        name: "Formal Proposal",
        description: "A professional, structured proposal suitable for corporate clients",
        style: "formal",
        sections: [
          { id: "intro", name: "Introduction", required: true },
          { id: "services", name: "Services Offered", required: true },
          { id: "timeline", name: "Timeline", required: true },
          { id: "pricing", name: "Pricing", required: true },
          { id: "next-steps", name: "Next Steps", required: true },
        ],
      },
      {
        id: "proposal-creative",
        name: "Creative Proposal",
        description: "A modern, visually-focused proposal for creative projects",
        style: "creative",
        sections: [
          { id: "vision", name: "Vision", required: true },
          { id: "approach", name: "Creative Approach", required: true },
          { id: "deliverables", name: "Deliverables", required: true },
          { id: "investment", name: "Investment", required: true },
          { id: "collaboration", name: "Collaboration Process", required: false },
        ],
      },
      {
        id: "proposal-casual",
        name: "Casual Proposal",
        description: "A friendly, conversational proposal for smaller projects",
        style: "casual",
        sections: [
          { id: "overview", name: "Project Overview", required: true },
          { id: "work", name: "What I'll Do", required: true },
          { id: "schedule", name: "Schedule", required: true },
          { id: "costs", name: "Costs", required: true },
          { id: "agreement", name: "Simple Agreement", required: false },
        ],
      },
    ],
    tech: [
      {
        id: "proposal-tech",
        name: "Technical Project Proposal",
        description: "Detailed proposal for tech-focused projects",
        style: "technical",
        sections: [
          { id: "executive-summary", name: "Executive Summary", required: true },
          { id: "technical-approach", name: "Technical Approach", required: true },
          { id: "architecture", name: "Proposed Architecture", required: true },
          { id: "implementation", name: "Implementation Plan", required: true },
          { id: "team", name: "Technical Team", required: false },
          { id: "timeline", name: "Timeline", required: true },
          { id: "pricing", name: "Pricing & Licensing", required: true },
        ],
      },
    ],
    legal: [
      {
        id: "proposal-legal",
        name: "Legal Services Proposal",
        description: "Formal proposal for legal services",
        style: "formal",
        sections: [
          { id: "summary", name: "Executive Summary", required: true },
          { id: "legal-background", name: "Legal Background", required: true },
          { id: "services", name: "Services & Approach", required: true },
          { id: "team", name: "Legal Team", required: false },
          { id: "fees", name: "Fee Structure", required: true },
          { id: "terms", name: "Terms & Conditions", required: true },
        ],
      },
    ],
    healthcare: [
      {
        id: "proposal-healthcare",
        name: "Healthcare Proposal",
        description: "Specialized proposal for healthcare projects",
        style: "professional",
        sections: [
          { id: "summary", name: "Executive Summary", required: true },
          { id: "compliance", name: "Compliance & Regulations", required: true },
          { id: "services", name: "Services Description", required: true },
          { id: "implementation", name: "Implementation Approach", required: true },
          { id: "timeline", name: "Project Timeline", required: true },
          { id: "costs", name: "Cost Breakdown", required: true },
        ],
      },
    ],
    // Add missing categories
    freelance: [
      {
        id: "proposal-freelance",
        name: "Freelancer Proposal",
        description: "Tailored proposal for freelance professionals",
        style: "casual",
        sections: [
          { id: "introduction", name: "Introduction", required: true },
          { id: "expertise", name: "Expertise & Experience", required: true },
          { id: "approach", name: "Project Approach", required: true },
          { id: "deliverables", name: "Deliverables", required: true },
          { id: "pricing", name: "Pricing", required: true },
          { id: "terms", name: "Terms & Timeline", required: true },
        ],
      },
    ],
    consulting: [
      {
        id: "proposal-consulting",
        name: "Consulting Proposal",
        description: "Professional proposal for consulting services",
        style: "professional",
        sections: [
          { id: "executive-summary", name: "Executive Summary", required: true },
          { id: "problem-statement", name: "Problem Statement", required: true },
          { id: "methodology", name: "Consulting Methodology", required: true },
          { id: "deliverables", name: "Deliverables", required: true },
          { id: "timeline", name: "Project Timeline", required: true },
          { id: "team", name: "Consulting Team", required: false },
          { id: "investment", name: "Investment", required: true },
          { id: "terms", name: "Terms & Conditions", required: true },
        ],
      },
    ],
  },
  invoice: {
    general: [
      {
        id: "invoice-standard",
        name: "Standard Invoice",
        description: "A clean, professional invoice template",
        style: "formal",
        sections: [
          { id: "business-info", name: "Business Information", required: true },
          { id: "client-info", name: "Client Information", required: true },
          { id: "items", name: "Invoice Items", required: true },
          { id: "totals", name: "Totals", required: true },
          { id: "payment", name: "Payment Information", required: true },
        ],
      },
      {
        id: "invoice-minimal",
        name: "Minimal Invoice",
        description: "A simple, streamlined invoice design",
        style: "minimal",
        sections: [
          { id: "header", name: "Header", required: true },
          { id: "items", name: "Items", required: true },
          { id: "total", name: "Total", required: true },
          { id: "notes", name: "Notes", required: false },
        ],
      },
    ],
    freelance: [
      {
        id: "invoice-freelance",
        name: "Freelancer Invoice",
        description: "Tailored for freelancers with billable hours",
        style: "casual",
        sections: [
          { id: "freelancer-info", name: "Freelancer Information", required: true },
          { id: "client-info", name: "Client Information", required: true },
          { id: "project", name: "Project Details", required: true },
          { id: "hours", name: "Billable Hours", required: true },
          { id: "expenses", name: "Expenses", required: false },
          { id: "totals", name: "Totals", required: true },
          { id: "payment", name: "Payment Information", required: true },
        ],
      },
    ],
    consulting: [
      {
        id: "invoice-consulting",
        name: "Consulting Invoice",
        description: "Specifically designed for consulting services",
        style: "professional",
        sections: [
          { id: "consultant", name: "Consultant Information", required: true },
          { id: "client", name: "Client Information", required: true },
          { id: "services", name: "Consulting Services", required: true },
          { id: "rates", name: "Rates & Hours", required: true },
          { id: "totals", name: "Totals", required: true },
          { id: "terms", name: "Terms & Conditions", required: true },
        ],
      },
    ],
    // Add missing categories
    tech: [
      {
        id: "invoice-tech",
        name: "Tech Services Invoice",
        description: "Specialized invoice for technical services",
        style: "technical",
        sections: [
          { id: "vendor-info", name: "Vendor Information", required: true },
          { id: "client-info", name: "Client Information", required: true },
          { id: "service-details", name: "Service Details", required: true },
          { id: "technical-specs", name: "Technical Specifications", required: false },
          { id: "rates", name: "Service Rates", required: true },
          { id: "totals", name: "Totals & Taxes", required: true },
          { id: "payment-terms", name: "Payment Terms", required: true },
        ],
      },
    ],
    legal: [
      {
        id: "invoice-legal",
        name: "Legal Services Invoice",
        description: "Professional invoice for legal services",
        style: "formal",
        sections: [
          { id: "firm-info", name: "Firm Information", required: true },
          { id: "client-info", name: "Client Information", required: true },
          { id: "matter-info", name: "Matter Information", required: true },
          { id: "services", name: "Services Rendered", required: true },
          { id: "hours", name: "Billable Hours", required: true },
          { id: "expenses", name: "Expenses", required: true },
          { id: "totals", name: "Totals", required: true },
          { id: "payment-terms", name: "Payment Terms", required: true },
        ],
      },
    ],
    healthcare: [
      {
        id: "invoice-healthcare",
        name: "Healthcare Services Invoice",
        description: "Invoice format for healthcare providers",
        style: "professional",
        sections: [
          { id: "provider-info", name: "Provider Information", required: true },
          { id: "patient-info", name: "Patient Information", required: true },
          { id: "service-details", name: "Service Details", required: true },
          { id: "insurance", name: "Insurance Information", required: false },
          { id: "billing-codes", name: "Billing Codes", required: true },
          { id: "totals", name: "Charges & Payments", required: true },
          { id: "balance", name: "Balance Due", required: true },
        ],
      },
    ],
  },
  onboardingEmail: {
    general: [
      {
        id: "onboarding-welcome",
        name: "Welcome Email",
        description: "A warm welcome email for new clients",
        style: "friendly",
        sections: [
          { id: "greeting", name: "Personal Greeting", required: true },
          { id: "overview", name: "Project Overview", required: true },
          { id: "next-steps", name: "Next Steps", required: true },
          { id: "resources", name: "Important Resources", required: false },
          { id: "contact", name: "Contact Information", required: true },
        ],
      },
      {
        id: "onboarding-formal",
        name: "Formal Onboarding",
        description: "A formal onboarding email for corporate clients",
        style: "formal",
        sections: [
          { id: "introduction", name: "Introduction", required: true },
          { id: "project-details", name: "Project Details", required: true },
          { id: "timeline", name: "Project Timeline", required: true },
          { id: "team", name: "Team Introduction", required: false },
          { id: "communication", name: "Communication Protocol", required: true },
          { id: "closing", name: "Closing", required: true },
        ],
      },
    ],
    tech: [
      {
        id: "onboarding-tech",
        name: "Technical Onboarding",
        description: "Onboarding email for technical projects with setup instructions",
        style: "technical",
        sections: [
          { id: "welcome", name: "Welcome", required: true },
          { id: "project-scope", name: "Project Scope", required: true },
          { id: "technical-setup", name: "Technical Setup", required: true },
          { id: "access-credentials", name: "Access & Credentials", required: false },
          { id: "communication-tools", name: "Communication Tools", required: true },
          { id: "next-milestones", name: "Next Milestones", required: true },
        ],
      },
    ],
    // Add missing categories
    legal: [
      {
        id: "onboarding-legal",
        name: "Legal Client Onboarding",
        description: "Professional onboarding email for legal clients",
        style: "formal",
        sections: [
          { id: "welcome", name: "Welcome", required: true },
          { id: "representation", name: "Representation Details", required: true },
          { id: "expectations", name: "Expectations & Process", required: true },
          { id: "documents", name: "Required Documents", required: true },
          { id: "confidentiality", name: "Confidentiality Notice", required: true },
          { id: "contact", name: "Contact Information", required: true },
        ],
      },
    ],
    healthcare: [
      {
        id: "onboarding-healthcare",
        name: "Healthcare Onboarding",
        description: "Onboarding email for healthcare clients",
        style: "professional",
        sections: [
          { id: "welcome", name: "Welcome", required: true },
          { id: "privacy", name: "Privacy Information", required: true },
          { id: "service-details", name: "Service Details", required: true },
          { id: "paperwork", name: "Required Paperwork", required: true },
          { id: "insurance", name: "Insurance Information", required: false },
          { id: "next-steps", name: "Next Steps", required: true },
        ],
      },
    ],
    freelance: [
      {
        id: "onboarding-freelance",
        name: "Freelancer Client Onboarding",
        description: "Friendly onboarding email for freelance clients",
        style: "casual",
        sections: [
          { id: "welcome", name: "Personal Welcome", required: true },
          { id: "project-scope", name: "Project Scope", required: true },
          { id: "process", name: "Work Process", required: true },
          { id: "communication", name: "Communication Channels", required: true },
          { id: "timeline", name: "Timeline", required: true },
          { id: "payment", name: "Payment Details", required: true },
        ],
      },
    ],
    consulting: [
      {
        id: "onboarding-consulting",
        name: "Consulting Client Onboarding",
        description: "Professional onboarding email for consulting clients",
        style: "professional",
        sections: [
          { id: "welcome", name: "Welcome", required: true },
          { id: "engagement", name: "Engagement Overview", required: true },
          { id: "methodology", name: "Consulting Methodology", required: true },
          { id: "deliverables", name: "Deliverables", required: true },
          { id: "team", name: "Team Introduction", required: true },
          { id: "communication", name: "Communication Protocol", required: true },
          { id: "next-steps", name: "Next Steps", required: true },
        ],
      },
    ],
  },
};

// Available template styles with their CSS configurations
export const templateStyles: Record<TemplateStyle, {
  fontFamily: string;
  headingFont: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  fontSize: string;
  headingSize: string;
}> = {
  formal: {
    fontFamily: "'Times New Roman', serif",
    headingFont: "'Arial', sans-serif",
    primaryColor: "#2c3e50",
    secondaryColor: "#34495e",
    accentColor: "#3498db",
    backgroundColor: "#ffffff",
    fontSize: "11pt",
    headingSize: "16pt",
  },
  creative: {
    fontFamily: "'Montserrat', sans-serif",
    headingFont: "'Playfair Display', serif",
    primaryColor: "#6c5ce7",
    secondaryColor: "#a29bfe",
    accentColor: "#fd79a8",
    backgroundColor: "#f9f9f9",
    fontSize: "12pt",
    headingSize: "18pt",
  },
  casual: {
    fontFamily: "'Open Sans', sans-serif",
    headingFont: "'Poppins', sans-serif",
    primaryColor: "#3a7bd5",
    secondaryColor: "#00d2d3",
    accentColor: "#ffb8b8",
    backgroundColor: "#f5f5f5",
    fontSize: "12pt",
    headingSize: "16pt",
  },
  minimal: {
    fontFamily: "'Roboto', sans-serif",
    headingFont: "'Roboto', sans-serif",
    primaryColor: "#333333",
    secondaryColor: "#555555",
    accentColor: "#777777",
    backgroundColor: "#ffffff",
    fontSize: "10pt",
    headingSize: "14pt",
  },
  technical: {
    fontFamily: "'Roboto Mono', monospace",
    headingFont: "'IBM Plex Sans', sans-serif",
    primaryColor: "#1e272e",
    secondaryColor: "#485460",
    accentColor: "#0abde3",
    backgroundColor: "#f1f2f6",
    fontSize: "11pt",
    headingSize: "15pt",
  },
  professional: {
    fontFamily: "'Lato', sans-serif",
    headingFont: "'Merriweather', serif",
    primaryColor: "#2c3e50",
    secondaryColor: "#34495e",
    accentColor: "#2980b9",
    backgroundColor: "#ecf0f1",
    fontSize: "11pt",
    headingSize: "16pt",
  },
  friendly: {
    fontFamily: "'Nunito', sans-serif",
    headingFont: "'Nunito', sans-serif",
    primaryColor: "#6c5ce7",
    secondaryColor: "#00b894",
    accentColor: "#fdcb6e",
    backgroundColor: "#ffffff",
    fontSize: "12pt",
    headingSize: "16pt",
  },
};

// Get all templates for a specific document type
export const getTemplates = (documentType: DocumentType): Template[] => {
  const allTemplates: Template[] = [];
  
  const categoryTemplates = defaultTemplates[documentType];
  if (categoryTemplates) {
    for (const category in categoryTemplates) {
      allTemplates.push(...categoryTemplates[category as TemplateCategory]);
    }
  }
  
  return allTemplates;
};

// Get templates by category for a document type
export const getTemplatesByCategory = (
  documentType: DocumentType,
  category: TemplateCategory
): Template[] => {
  return defaultTemplates[documentType]?.[category] || [];
};

// Get a specific template by ID
export const getTemplateById = (templateId: string): Template | undefined => {
  for (const documentType in defaultTemplates) {
    for (const category in defaultTemplates[documentType as DocumentType]) {
      const template = defaultTemplates[documentType as DocumentType][category as TemplateCategory].find(
        (t) => t.id === templateId
      );
      if (template) {
        return template;
      }
    }
  }
  return undefined;
};

// Generate CSS string based on style configuration
export const generateStyleCSS = (style: TemplateStyle, customStyles?: Record<string, string>): string => {
  const baseStyle = templateStyles[style];
  const mergedStyles = { ...baseStyle, ...(customStyles || {}) };
  
  return `
    font-family: ${mergedStyles.fontFamily};
    color: ${mergedStyles.primaryColor};
    background-color: ${mergedStyles.backgroundColor};
    font-size: ${mergedStyles.fontSize};
    
    h1, h2, h3, h4, h5, h6 {
      font-family: ${mergedStyles.headingFont};
      color: ${mergedStyles.primaryColor};
    }
    
    h1 {
      font-size: ${mergedStyles.headingSize};
      margin-bottom: 1.5rem;
    }
    
    h2 {
      font-size: calc(${mergedStyles.headingSize} - 2pt);
      color: ${mergedStyles.secondaryColor};
    }
    
    a {
      color: ${mergedStyles.accentColor};
    }
    
    hr {
      border-color: ${mergedStyles.secondaryColor};
      opacity: 0.2;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
    }
    
    th {
      background-color: ${mergedStyles.secondaryColor};
      color: ${mergedStyles.backgroundColor};
      padding: 8px;
      text-align: left;
    }
    
    td {
      padding: 8px;
      border-bottom: 1px solid ${mergedStyles.secondaryColor}40;
    }
  `;
};

// Generate a document with custom sections
export const generateCustomDocument = (
  template: Template,
  data: any,
  customSections: CustomSection[]
): string => {
  // Map of section IDs to their content
  const sectionContents: Record<string, string> = {};
  
  // Process each custom section
  customSections.forEach(section => {
    sectionContents[section.id] = section.content;
  });
  
  // Build document based on template sections and custom content
  let document = `# ${data.title || 'Document'}\n\n`;
  
  template.sections.forEach(section => {
    if (sectionContents[section.id]) {
      document += `## ${section.name}\n\n${sectionContents[section.id]}\n\n`;
    } else if (section.required) {
      document += `## ${section.name}\n\n[Required section content missing]\n\n`;
    }
  });
  
  return document;
};
