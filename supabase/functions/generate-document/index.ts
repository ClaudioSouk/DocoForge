
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Function to call OpenAI API
async function callOpenAI(prompt: string, documentType: string): Promise<string> {
  try {
    if (!OPENAI_API_KEY) {
      throw new Error("OpenAI API key is not configured in environment variables");
    }
    
    console.log("Calling OpenAI API with prompt:", prompt);
    
    // Create a more detailed system message based on document type
    let systemMessage = "You are an expert business document writer with 20 years of experience. Create professional, persuasive, and concise documents in markdown format that are clear, compelling, and actionable. Focus only on delivering substantial, valuable content without any filler text, generic placeholders, or text like '[Your Name]' or '[Insert text here]'. Every sentence should provide specific value. If information for a section is missing, keep it minimal rather than creating generic content.";
    
    // Add document-specific instructions
    if (documentType === "proposal") {
      systemMessage += " For proposals: Focus on demonstrating a clear understanding of client needs, articulating specific value propositions, and providing concrete next steps. Avoid generic claims and focus on quantifiable benefits where possible. Be direct and concise while maintaining professionalism. Never create placeholder text - if information is missing, omit that section entirely.";
    } else if (documentType === "email") {
      systemMessage += " For emails: Be direct, warm and specific with your communication. Each paragraph should contain only essential information. Avoid pleasantries that don't add value. Get to the point quickly while maintaining a professional tone. Never include placeholder text - if a signature field is empty, use a simple closing instead.";
    } else if (documentType === "invoice") {
      systemMessage += " For invoices: Create clear, structured documents with precise language about services rendered and payment terms. Eliminate any unnecessary text or explanations. Never include placeholder text - ensure all fields are filled with actual data or minimal appropriate content.";
    }
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { 
            role: "system", 
            content: systemMessage
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.3, // Lower temperature for more consistent, focused output
        max_tokens: 2500
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      console.error("OpenAI API error:", data.error);
      
      // Special handling for quota exceeded errors
      if (data.error.type === "insufficient_quota" || 
          data.error.message?.includes("exceeded your current quota")) {
        throw new Error("API quota exceeded. Please check your OpenAI account billing settings or try again later.");
      }
      
      throw new Error(`OpenAI API error: ${data.error.message}`);
    }
    
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    throw error;
  }
}

// Fallback function to generate simple content when API fails
function generateFallbackContent(documentType: string, promptData: any): string {
  try {
    // Extract basic info from the prompt
    const data = promptData || {};
    let content = "";
    
    if (documentType === "proposal") {
      content = `# Proposal for ${data.clientName || "Client"}

## Project Overview
${data.projectType ? `Project Type: ${data.projectType}` : ""}
${data.projectScope ? `\n\n${data.projectScope}` : ""}

## Pricing
${data.price ? `Estimated Cost: ${data.price}` : "Pricing to be determined"}

## Next Steps
Please review this proposal and let us know if you have any questions.

${data.authorName ? `\n\n${data.authorName}` : ""}
${data.authorPosition ? `\n${data.authorPosition}` : ""}
${data.companyName ? `\n${data.companyName}` : ""}
`;
    } else if (documentType === "email") {
      content = `# Welcome Email

Dear ${data.clientName || "Client"},

Thank you for choosing our services. We're excited to work with you!

${data.onboardingDetails || ""}

Best regards,
${data.authorName || ""}
${data.authorPosition ? `\n${data.authorPosition}` : ""}
${data.companyName ? `\n${data.companyName}` : ""}
`;
    } else if (documentType === "invoice") {
      content = `# Invoice

**Client:** ${data.clientName || "Client"}
**Project:** ${data.projectName || "Project"}
**Amount Due:** ${data.amountDue ? `$${data.amountDue}` : "$0.00"}
**Due Date:** ${data.dueDate || "Upon receipt"}

Thank you for your business!

${data.authorName ? `\n\n${data.authorName}` : ""}
${data.authorPosition ? `\n${data.authorPosition}` : ""}
${data.businessDetails?.name ? `\n${data.businessDetails.name}` : ""}
`;
    } else {
      content = "# Document\n\nContent could not be generated at this time. Please try again later.";
    }
    
    return content;
  } catch (error) {
    console.error("Error in fallback content generation:", error);
    return "# Document\n\nContent could not be generated at this time. Please try again later.";
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, documentType, promptData } = await req.json();
    
    if (!prompt || !documentType) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: prompt and documentType" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Received request for document type:", documentType);
    console.log("With prompt data:", JSON.stringify(promptData));

    try {
      const generatedContent = await callOpenAI(prompt, documentType);
      console.log("Successfully generated content with OpenAI");
      
      return new Response(
        JSON.stringify({ content: generatedContent }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error("OpenAI generation failed, using fallback:", error.message);
      
      // If it's a quota error, use fallback content
      if (error.message?.includes("quota exceeded") || error.message?.includes("insufficient_quota")) {
        const fallbackContent = generateFallbackContent(documentType, promptData);
        
        return new Response(
          JSON.stringify({ 
            content: fallbackContent, 
            warning: "Generated using fallback system due to API limits. For full functionality, please check your OpenAI API quota."
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // For other errors, throw to be caught by outer catch
      throw error;
    }
  } catch (error) {
    console.error("Error in generate-document function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
