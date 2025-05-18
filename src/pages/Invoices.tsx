import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { saveInvoice, getInvoices } from "../services/documentService";
import { generateInvoice } from "../utils/documentGenerator";
import { Invoice } from "../types";
import DocumentViewer from "../components/DocumentViewer";
import { X, Plus, Loader2 } from "lucide-react";

const InvoiceGenerator: React.FC = () => {
  const { user } = useAuth();
  const [clientName, setClientName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [amountDue, setAmountDue] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [businessName, setBusinessName] = useState(user?.company || "");
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [businessEmail, setBusinessEmail] = useState(user?.email || "");
  const [clientAddress, setClientAddress] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [items, setItems] = useState([
    { description: "", quantity: 1, rate: 0, amount: 0 },
  ]);
  const [generatedInvoice, setGeneratedInvoice] = useState("");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadInvoices();
      setBusinessName(user.company || "");
      setBusinessEmail(user.email || "");
    }
  }, [user]);

  const loadInvoices = async () => {
    if (user) {
      try {
        setIsLoading(true);
        const userInvoices = await getInvoices(user.id);
        setInvoices(userInvoices);
      } catch (error) {
        console.error("Error loading invoices:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const updateItem = (index: number, field: string, value: string | number) => {
    const newItems = [...items];
    
    if (field === 'quantity' || field === 'rate') {
      const numericValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
      newItems[index][field as 'quantity' | 'rate'] = numericValue;
      // Recalculate amount
      newItems[index].amount = newItems[index].quantity * newItems[index].rate;
    } else {
      newItems[index][field as 'description'] = value as string;
    }
    
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, rate: 0, amount: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      const newItems = [...items];
      newItems.splice(index, 1);
      setItems(newItems);
    }
  };

  const calculateTotalAmount = () => {
    return items.reduce((total, item) => total + item.amount, 0);
  };

  const handleGenerate = async () => {
    const totalAmount = calculateTotalAmount();
    if (totalAmount <= 0) {
      toast.error("Invoice amount must be greater than zero");
      return;
    }

    try {
      setIsLoading(true);
      const invoiceData: Omit<Invoice, "id" | "createdAt"> = {
        clientName,
        projectName,
        amountDue: totalAmount,
        dueDate,
        userId: user?.id || "",
        businessDetails: {
          name: businessName,
          address: businessAddress,
          phone: businessPhone,
          email: businessEmail,
        },
        clientDetails: {
          name: clientName,
          address: clientAddress,
          email: clientEmail,
        },
        items,
      };

      // Fix: await the promise before setting state
      const content = await generateInvoice(invoiceData as Invoice);
      const savedInvoice = await saveInvoice(invoiceData);
      
      setGeneratedInvoice(content);
      setShowPreview(true);
      setSelectedInvoice(savedInvoice);
      setInvoices(prevInvoices => [...prevInvoices, savedInvoice]);
      toast.success("Invoice generated successfully!");
    } catch (error) {
      console.error("Error generating invoice:", error);
      toast.error("Failed to generate invoice");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    // The PDF generation logic is now handled in DocumentViewer component
    toast.success("Preparing your invoice PDF...");
  };

  const handleViewInvoice = async (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    // Fix: await the promise before setting state
    const content = await generateInvoice(invoice);
    setGeneratedInvoice(content);
    setShowPreview(true);
  };

  const resetForm = () => {
    setClientName("");
    setProjectName("");
    setAmountDue("");
    setDueDate("");
    setClientAddress("");
    setClientEmail("");
    setItems([{ description: "", quantity: 1, rate: 0, amount: 0 }]);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Invoice Generator</h1>
          <p className="text-gray-600 mt-1">
            Create professional invoices for your clients
          </p>
        </div>

        {showPreview ? (
          <DocumentViewer
            title={`Invoice for ${selectedInvoice?.projectName}`}
            content={generatedInvoice}
            onClose={() => setShowPreview(false)}
            onDownload={handleDownload}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Invoice</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Your Details</h3>
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="businessName">Business Name</Label>
                          <Input
                            id="businessName"
                            placeholder="Your business name"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="businessAddress">
                            Business Address
                          </Label>
                          <Input
                            id="businessAddress"
                            placeholder="Your address"
                            value={businessAddress}
                            onChange={(e) => setBusinessAddress(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="businessPhone">Business Phone</Label>
                          <Input
                            id="businessPhone"
                            placeholder="Your phone number"
                            value={businessPhone}
                            onChange={(e) => setBusinessPhone(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="businessEmail">Business Email</Label>
                          <Input
                            id="businessEmail"
                            type="email"
                            placeholder="Your email"
                            value={businessEmail}
                            onChange={(e) => setBusinessEmail(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-3">
                        Client Details
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="clientName">Client Name</Label>
                          <Input
                            id="clientName"
                            placeholder="Client name"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="clientAddress">Client Address</Label>
                          <Input
                            id="clientAddress"
                            placeholder="Client address"
                            value={clientAddress}
                            onChange={(e) => setClientAddress(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="clientEmail">Client Email</Label>
                          <Input
                            id="clientEmail"
                            type="email"
                            placeholder="Client email"
                            value={clientEmail}
                            onChange={(e) => setClientEmail(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="projectName">Project Name</Label>
                          <Input
                            id="projectName"
                            placeholder="Name of project"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Items</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addItem}
                        className="flex items-center gap-1"
                      >
                        <Plus className="h-4 w-4" /> Add Item
                      </Button>
                    </div>

                    <div className="grid grid-cols-12 gap-x-2 font-medium text-sm text-gray-600 pb-1">
                      <div className="col-span-5">Description</div>
                      <div className="col-span-2">Quantity</div>
                      <div className="col-span-2">Rate</div>
                      <div className="col-span-2">Amount</div>
                      <div className="col-span-1"></div>
                    </div>

                    {items.map((item, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-12 gap-2 items-center"
                      >
                        <div className="col-span-5">
                          <Input
                            placeholder="Item description"
                            value={item.description}
                            onChange={(e) =>
                              updateItem(index, "description", e.target.value)
                            }
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              updateItem(index, "quantity", e.target.value)
                            }
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.rate}
                            onChange={(e) =>
                              updateItem(index, "rate", e.target.value)
                            }
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            readOnly
                            value={item.amount}
                          />
                        </div>
                        <div className="col-span-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(index)}
                            disabled={items.length <= 1}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    <div className="flex justify-between border-t border-gray-200 pt-3">
                      <div className="font-medium">Total Amount:</div>
                      <div className="font-bold">
                        $
                        {calculateTotalAmount().toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={resetForm}>
                      Reset
                    </Button>
                    <Button onClick={handleGenerate} disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        "Generate Invoice"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {invoices.length > 0 && (
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Invoices</CardTitle>
                  </CardHeader>
                  <CardContent className="max-h-96 overflow-y-auto">
                    <div className="space-y-4">
                      {isLoading ? (
                        <div className="flex items-center justify-center py-6">
                          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                          <span className="ml-2 text-gray-500">Loading invoices...</span>
                        </div>
                      ) : (
                        invoices.map((invoice) => (
                          <Card
                            key={invoice.id}
                            className="cursor-pointer hover:bg-gray-50"
                            onClick={() => handleViewInvoice(invoice)}
                          >
                            <CardContent className="p-4">
                              <h3 className="font-medium">
                                {invoice.projectName}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {invoice.clientName}
                              </p>
                              <p className="text-sm font-medium">
                                $
                                {invoice.amountDue.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </p>
                              <p className="text-xs text-gray-400 mt-2">
                                Due: {new Date(invoice.dueDate).toLocaleDateString()}
                              </p>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default InvoiceGenerator;
