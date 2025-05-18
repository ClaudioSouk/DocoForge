
export type DocumentType = "proposal" | "invoice" | "onboardingEmail";

export type TemplateCategory = "general" | "tech" | "legal" | "healthcare" | "freelance" | "consulting";

export type TemplateStyle = "formal" | "creative" | "casual" | "minimal" | "technical" | "professional" | "friendly";

export interface TemplateSection {
  id: string;
  name: string;
  required: boolean;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  style: TemplateStyle;
  sections: TemplateSection[];
}

export interface CustomSection {
  id: string;
  content: string;
}

export interface TemplateStyleConfig {
  fontFamily: string;
  headingFont: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  fontSize: string;
  headingSize: string;
}

export interface UserTemplate extends Template {
  userId: string;
  createdAt: string;
  isPublic: boolean;
}
