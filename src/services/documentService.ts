
import { 
  Proposal, 
  OnboardingEmail, 
  Invoice, 
  Document 
} from "../types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Proposal Services
export const saveProposal = async (proposal: Omit<Proposal, "id" | "createdAt">): Promise<Proposal> => {
  try {
    const { data, error } = await supabase
      .from('proposals')
      .insert({
        user_id: proposal.userId,
        client_name: proposal.clientName,
        project_type: proposal.projectType,
        project_scope: proposal.projectScope,
        price: proposal.price,
        title: proposal.title || `Proposal for ${proposal.clientName}`
      })
      .select()
      .single();
      
    if (error) throw error;
    
    return {
      id: data.id,
      userId: data.user_id,
      clientName: data.client_name,
      projectType: data.project_type,
      projectScope: data.project_scope,
      price: data.price,
      title: data.title,
      createdAt: data.created_at
    };
  } catch (error) {
    console.error("Error saving proposal:", error);
    toast.error("Failed to save proposal");
    throw error;
  }
};

export const getProposals = async (userId: string): Promise<Proposal[]> => {
  try {
    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      userId: item.user_id,
      clientName: item.client_name,
      projectType: item.project_type,
      projectScope: item.project_scope,
      price: item.price,
      title: item.title || `Proposal for ${item.client_name}`,
      createdAt: item.created_at
    }));
  } catch (error) {
    console.error("Error fetching proposals:", error);
    toast.error("Failed to fetch proposals");
    return [];
  }
};

// Onboarding Email Services
export const saveOnboardingEmail = async (email: Omit<OnboardingEmail, "id" | "createdAt">): Promise<OnboardingEmail> => {
  try {
    const { data, error } = await supabase
      .from('onboarding_emails')
      .insert({
        user_id: email.userId,
        client_name: email.clientName,
        onboarding_details: email.onboardingDetails,
        company_name: email.companyName
      })
      .select()
      .single();
      
    if (error) throw error;
    
    return {
      id: data.id,
      userId: data.user_id,
      clientName: data.client_name,
      onboardingDetails: data.onboarding_details,
      companyName: data.company_name,
      createdAt: data.created_at
    };
  } catch (error) {
    console.error("Error saving email:", error);
    toast.error("Failed to save onboarding email");
    throw error;
  }
};

export const getOnboardingEmails = async (userId: string): Promise<OnboardingEmail[]> => {
  try {
    const { data, error } = await supabase
      .from('onboarding_emails')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      userId: item.user_id,
      clientName: item.client_name,
      onboardingDetails: item.onboarding_details,
      companyName: item.company_name,
      createdAt: item.created_at
    }));
  } catch (error) {
    console.error("Error fetching emails:", error);
    toast.error("Failed to fetch onboarding emails");
    return [];
  }
};

// Invoice Services
export const saveInvoice = async (invoice: Omit<Invoice, "id" | "createdAt">): Promise<Invoice> => {
  try {
    // First, create the invoice
    const { data: invoiceData, error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        user_id: invoice.userId,
        client_name: invoice.clientName,
        project_name: invoice.projectName,
        amount_due: invoice.amountDue,
        due_date: invoice.dueDate,
        client_email: invoice.clientDetails.email,
        client_address: invoice.clientDetails.address,
        business_name: invoice.businessDetails.name,
        business_email: invoice.businessDetails.email,
        business_address: invoice.businessDetails.address,
        business_phone: invoice.businessDetails.phone
      })
      .select()
      .single();
      
    if (invoiceError) throw invoiceError;
    
    // Then, add the invoice items
    if (invoice.items && invoice.items.length > 0) {
      const invoiceItems = invoice.items.map(item => ({
        invoice_id: invoiceData.id,
        description: item.description,
        quantity: item.quantity,
        rate: item.rate,
        amount: item.amount
      }));

      const { error: itemsError } = await supabase
        .from('invoice_items')
        .insert(invoiceItems);
        
      if (itemsError) {
        console.error("Error adding invoice items:", itemsError);
        // Proceed anyway, as the main invoice was created
      }
    }
    
    // Return the new invoice with its items
    return {
      id: invoiceData.id,
      userId: invoiceData.user_id,
      clientName: invoiceData.client_name,
      projectName: invoiceData.project_name,
      amountDue: invoiceData.amount_due,
      dueDate: invoiceData.due_date,
      createdAt: invoiceData.created_at,
      businessDetails: {
        name: invoiceData.business_name,
        address: invoiceData.business_address || "",
        phone: invoiceData.business_phone || "",
        email: invoiceData.business_email || ""
      },
      clientDetails: {
        name: invoiceData.client_name,
        address: invoiceData.client_address,
        email: invoiceData.client_email
      },
      items: invoice.items || []
    };
  } catch (error) {
    console.error("Error saving invoice:", error);
    toast.error("Failed to save invoice");
    throw error;
  }
};

export const getInvoices = async (userId: string): Promise<Invoice[]> => {
  try {
    // First get all invoices
    const { data: invoicesData, error: invoicesError } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (invoicesError) throw invoicesError;
    
    // Get all invoice items
    const invoiceIds = invoicesData.map(invoice => invoice.id);
    
    let itemsData: any[] = [];
    if (invoiceIds.length > 0) {
      const { data, error: itemsError } = await supabase
        .from('invoice_items')
        .select('*')
        .in('invoice_id', invoiceIds);
        
      if (itemsError) throw itemsError;
      
      itemsData = data || [];
    }
    
    // Construct the full invoices with their items
    return invoicesData.map(invoice => {
      const invoiceItems = itemsData
        .filter(item => item.invoice_id === invoice.id)
        .map(item => ({
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
          amount: item.amount
        }));
      
      return {
        id: invoice.id,
        userId: invoice.user_id,
        clientName: invoice.client_name,
        projectName: invoice.project_name,
        amountDue: invoice.amount_due,
        dueDate: invoice.due_date,
        createdAt: invoice.created_at,
        businessDetails: {
          name: invoice.business_name,
          address: invoice.business_address || "",
          phone: invoice.business_phone || "",
          email: invoice.business_email || ""
        },
        clientDetails: {
          name: invoice.client_name,
          address: invoice.client_address,
          email: invoice.client_email
        },
        items: invoiceItems
      };
    });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    toast.error("Failed to fetch invoices");
    return [];
  }
};

export const getRecentDocuments = async (userId: string, limit = 5): Promise<Document[]> => {
  try {
    // Get recent proposals
    const { data: proposals } = await supabase
      .from('proposals')
      .select('id, client_name, title, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    // Get recent emails
    const { data: emails } = await supabase
      .from('onboarding_emails')
      .select('id, client_name, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    // Get recent invoices
    const { data: invoices } = await supabase
      .from('invoices')
      .select('id, client_name, project_name, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    const proposalDocs = (proposals || []).map(item => ({
      id: item.id,
      type: "proposal" as const,
      title: item.title || `Proposal for ${item.client_name}`,
      clientName: item.client_name,
      createdAt: item.created_at,
      userId
    }));

    const emailDocs = (emails || []).map(item => ({
      id: item.id,
      type: "email" as const,
      title: `Welcome Email for ${item.client_name}`,
      clientName: item.client_name,
      createdAt: item.created_at,
      userId
    }));

    const invoiceDocs = (invoices || []).map(item => ({
      id: item.id,
      type: "invoice" as const,
      title: `Invoice for ${item.project_name}`,
      clientName: item.client_name,
      createdAt: item.created_at,
      userId
    }));

    // Combine all documents and sort by created_at
    return [...proposalDocs, ...emailDocs, ...invoiceDocs]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  } catch (error) {
    console.error("Error fetching recent documents:", error);
    toast.error("Failed to fetch recent documents");
    return [];
  }
};

// Delete a document
export const deleteDocument = async (id: string, type: string): Promise<boolean> => {
  try {
    let tableName: 'proposals' | 'onboarding_emails' | 'invoices';
    
    switch (type) {
      case 'proposal':
        tableName = 'proposals';
        break;
      case 'email':
        tableName = 'onboarding_emails';
        break;
      case 'invoice':
        tableName = 'invoices';
        // Also delete related invoice items
        await supabase
          .from('invoice_items')
          .delete()
          .eq('invoice_id', id);
        break;
      default:
        throw new Error(`Unknown document type: ${type}`);
    }
    
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error(`Error deleting ${type}:`, error);
    toast.error(`Failed to delete ${type}`);
    return false;
  }
};

export const documentService = {
  saveProposal,
  getProposals,
  saveOnboardingEmail,
  getOnboardingEmails,
  saveInvoice,
  getInvoices,
  getRecentDocuments,
  deleteDocument,
};

export default documentService;
