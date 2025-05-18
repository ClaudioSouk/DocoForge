import { Proposal, OnboardingEmail, Invoice } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Function to call our secure Supabase edge function
async function generateContent(prompt: string, documentType: string, promptData?: any): Promise<{ content: string; warning?: string }> {
  try {
    console.log(`Generating ${documentType} with data:`, promptData);
    
    const { data, error } = await supabase.functions.invoke('generate-document', {
      body: { prompt, documentType, promptData }
    });

    if (error) {
      console.error("Supabase function error:", error);
      throw new Error(`Error generating document: ${error.message}`);
    }
    
    // Check if there's a warning message to display
    if (data.warning) {
      toast.warning(data.warning);
    }
    
    return {
      content: data.content,
      warning: data.warning
    };
  } catch (error) {
    console.error("Error generating document:", error);
    throw error;
  }
}

export const generateProposal = async (data: any): Promise<string> => {
  const { 
    clientName, 
    projectType, 
    projectScope, 
    price,
    clientBackground = "",
    projectGoals = "",
    deliverables = "",
    timeline = "",
    paymentTerms = "",
    uniqueSellingPoints = "",
    competitiveAdvantages = "",
    clientChallenges = "",
    proposedSolution = "",
    socialProof = "",
    authorName = "",
    authorPosition = "",
    companyName = "",
    currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric", 
      month: "long", 
      day: "numeric"
    }),
    contactEmail = "",
    contactPhone = ""
  } = data;
  
  const formattedPrice = typeof price === 'number' ? 
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price) : price;

  console.log("Generating proposal with data:", {
    clientName,
    projectType,
    projectScope,
    price: formattedPrice,
    clientBackground,
    projectGoals,
    deliverables,
    timeline,
    paymentTerms,
    uniqueSellingPoints,
    competitiveAdvantages,
    clientChallenges,
    proposedSolution,
    socialProof,
    authorName,
    authorPosition,
    companyName,
    currentDate,
    contactEmail,
    contactPhone
  });

  // Create a detailed and focused prompt for OpenAI that emphasizes concrete details
  const prompt = `
Create a professional, concise business proposal without any filler content. Use only the information provided below, and if information is missing for a section, keep it brief rather than inventing details. Do not add any placeholders like "[Your name]" or "[Insert text here]" - only use the actual provided values.

AUTHOR INFORMATION:
- Author Name: ${authorName}
- Position/Title: ${authorPosition}
- Company Name: ${companyName}
- Contact Email: ${contactEmail}
- Contact Phone: ${contactPhone}
- Date: ${currentDate}

CLIENT INFORMATION:
- Client Name: ${clientName}
- Client Background: ${clientBackground}
- Client Challenges: ${clientChallenges}

PROJECT DETAILS:
- Project Type: ${projectType}
- Project Goals: ${projectGoals}
- Proposed Solution: ${proposedSolution}
- Scope of Work: ${projectScope}
- Specific Deliverables: ${deliverables}
- Timeline: ${timeline}
- Price: ${formattedPrice}
- Payment Terms: ${paymentTerms}

VALUE PROPOSITION:
- Unique Selling Points: ${uniqueSellingPoints}
- Competitive Advantages: ${competitiveAdvantages}
- Social Proof/Testimonials: ${socialProof}

FORMAT REQUIREMENTS:
1. Use clean, professional markdown formatting
2. Be extremely concise but precise - eliminate all unnecessary words
3. Include only sections with substantive content
4. Focus on specific client benefits backed by concrete details
5. Use persuasive but professional language without fluff
6. Include a clear call-to-action at the end
7. Do not include any placeholder or generic text - if information is missing, don't make up content
8. Never add placeholders like "[Your name]" or "[Insert text here]" - if a field is empty, either omit it or use minimal content

The proposal should be immediately ready for presentation to the client with no additional editing required.
`;

  // Pass the original data to use as fallback if needed
  const result = await generateContent(prompt, "proposal", {
    clientName,
    projectType,
    projectScope,
    price,
    clientBackground,
    projectGoals,
    deliverables,
    timeline,
    paymentTerms,
    uniqueSellingPoints,
    competitiveAdvantages,
    clientChallenges,
    proposedSolution,
    socialProof,
    authorName,
    authorPosition,
    companyName,
    currentDate,
    contactEmail,
    contactPhone
  });

  return result.content;
};

export const generateOnboardingEmail = async (data: Pick<OnboardingEmail, "clientName" | "onboardingDetails" | "companyName"> & { 
  authorName?: string; 
  authorPosition?: string;
  authorEmail?: string;
  currentDate?: string;
}): Promise<string> => {
  const { 
    clientName, 
    onboardingDetails, 
    companyName,
    authorName = "",
    authorPosition = "",
    authorEmail = "",
    currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric", 
      month: "long", 
      day: "numeric"
    })
  } = data;

  const prompt = `
Create a professional, concise onboarding email without any filler content for:

Client Name: ${clientName}
Company Name: ${companyName}
Project Details: ${onboardingDetails}
Author Name: ${authorName}
Author Position: ${authorPosition}
Author Email: ${authorEmail}
Date: ${currentDate}

The email should include:
- A brief, direct welcome message
- Specific next steps based on the provided details
- Only include links or resources section if specifically mentioned in the project details
- A professional but concise closing

Be concrete and specific. Don't add generic placeholders or filler content - if specific information is missing, keep that section brief and to the point rather than adding vague generalities. Never use placeholders like "[Your name]" or "[Insert text here]".
`;

  // Pass the original data to use as fallback if needed
  const result = await generateContent(prompt, "email", {
    clientName,
    onboardingDetails,
    companyName,
    authorName,
    authorPosition,
    authorEmail,
    currentDate
  });

  return result.content;
};

export const generateInvoice = async (data: Invoice): Promise<string> => {
  const { 
    clientName, 
    projectName, 
    amountDue, 
    dueDate, 
    businessDetails, 
    clientDetails, 
    items,
    // Use the properties with default values if they don't exist
    authorName = "",
    authorPosition = "",
    currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric", 
      month: "long", 
      day: "numeric"
    })
  } = data;
  
  // Calculate subtotal
  const subtotal = items.reduce((total, item) => total + item.amount, 0);
  const formattedSubtotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(subtotal);

  // Generate itemized list for the prompt
  const itemsList = items.map(item => 
    `- Description: ${item.description}, Quantity: ${item.quantity}, Rate: ${item.rate}, Amount: ${item.amount}`
  ).join("\n");

  const prompt = `
Create a professional, concise invoice without any filler content or placeholders:

Created By:
- Name: ${authorName}
- Position: ${authorPosition} 
- Date Created: ${currentDate}

Business:
- Name: ${businessDetails.name}
- Address: ${businessDetails.address}
- Phone: ${businessDetails.phone}
- Email: ${businessDetails.email}

Client:
- Name: ${clientName}
- Address: ${clientDetails.address || "N/A"}
- Email: ${clientDetails.email || "N/A"}

Project: ${projectName}
Invoice Date: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
Due Date: ${new Date(dueDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })}

Items:
${itemsList}

Subtotal: ${formattedSubtotal}
Total Amount Due: ${new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amountDue)}

Format as a clean, structured invoice with only essential information. Use clear payment instructions. No generic placeholder text or unnecessary explanations. Never use placeholders like "[Your name]" or "[Insert text here]".
`;

  // Pass the original data to use as fallback if needed
  const result = await generateContent(prompt, "invoice", {
    clientName,
    projectName,
    amountDue,
    dueDate,
    businessDetails,
    clientDetails,
    items,
    authorName,
    authorPosition,
    currentDate
  });

  return result.content;
};
