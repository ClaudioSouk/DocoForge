
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { BarChart, PieChart, FileText, Users, CreditCard } from "lucide-react";

// Mock data - in a real app, this would come from your backend
const mockUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", joined: "2023-05-12", subscribed: true, plan: "monthly" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", joined: "2023-06-01", subscribed: true, plan: "annual" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", joined: "2023-06-15", subscribed: false, plan: null },
  { id: 4, name: "Alice Brown", email: "alice@example.com", joined: "2023-07-01", subscribed: true, plan: "monthly" },
  { id: 5, name: "Charlie Wilson", email: "charlie@example.com", joined: "2023-07-20", subscribed: false, plan: null }
];

const mockAnalytics = {
  totalUsers: 5,
  subscribedUsers: 3,
  totalRevenue: 147,
  documentsGenerated: {
    proposals: 12,
    emails: 8,
    invoices: 15
  }
};

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState(mockUsers);
  const [analytics, setAnalytics] = useState(mockAnalytics);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // In a real app, check if user has admin role
  useEffect(() => {
    if (user && user.email !== "admin@example.com") {
      toast.error("You don't have permission to access this page");
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleSubscription = (userId: number) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        const subscribed = !u.subscribed;
        return {
          ...u,
          subscribed,
          plan: subscribed ? (u.plan || "monthly") : null
        };
      }
      return u;
    }));
    toast.success("Subscription status updated");
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button variant="outline">Export Data</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-3xl font-bold">{analytics.totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-brand-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Subscribers</p>
                  <p className="text-3xl font-bold">{analytics.subscribedUsers}</p>
                </div>
                <CreditCard className="h-8 w-8 text-brand-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-3xl font-bold">${analytics.totalRevenue}</p>
                </div>
                <BarChart className="h-8 w-8 text-brand-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Documents Generated</p>
                  <p className="text-3xl font-bold">
                    {Object.values(analytics.documentsGenerated).reduce((sum, val) => sum + val, 0)}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-brand-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users">
          <TabsList className="mb-4">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="space-y-4">
            <div className="flex justify-between">
              <Input 
                placeholder="Search users..." 
                className="max-w-sm" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Subscription</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{new Date(user.joined).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${user.subscribed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {user.subscribed ? `Subscribed (${user.plan})` : 'Free'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleToggleSubscription(user.id)}
                          >
                            {user.subscribed ? 'Unsubscribe' : 'Subscribe'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="subscriptions">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Analytics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col h-80 items-center justify-center border rounded-lg p-4">
                    <PieChart className="h-40 w-40 text-brand-600" />
                    <p className="mt-4 text-center font-medium">
                      {analytics.subscribedUsers} out of {analytics.totalUsers} users subscribed ({Math.round(analytics.subscribedUsers / analytics.totalUsers * 100)}%)
                    </p>
                  </div>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="text-lg font-medium">Subscription Plans</h3>
                      <ul className="mt-4 space-y-3">
                        <li className="flex justify-between">
                          <span>Monthly Plan</span>
                          <span className="font-bold">2 users</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Annual Plan</span>
                          <span className="font-bold">1 user</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Free Users</span>
                          <span className="font-bold">2 users</span>
                        </li>
                        <li className="flex justify-between border-t pt-2 mt-2">
                          <span>Monthly Revenue</span>
                          <span className="font-bold">$49</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Document Generation Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <h3 className="text-lg font-medium">Proposals</h3>
                        <p className="text-3xl font-bold mt-2">{analytics.documentsGenerated.proposals}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <h3 className="text-lg font-medium">Onboarding Emails</h3>
                        <p className="text-3xl font-bold mt-2">{analytics.documentsGenerated.emails}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <h3 className="text-lg font-medium">Invoices</h3>
                        <p className="text-3xl font-bold mt-2">{analytics.documentsGenerated.invoices}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
