
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useMobile } from "../hooks/useMobile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Home, FileText, Mail, Settings, Users } from "lucide-react";

// Modified NavigationLink component to properly use href for Link component
const NavigationLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<typeof Link> & { active: boolean }
>(({ className, children, active, ...props }, ref) => (
  <Link
    ref={ref}
    className={cn(
      "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
      active ? "bg-accent text-accent-foreground" : "text-muted-foreground",
      className
    )}
    {...props}
  >
    {children}
  </Link>
));
NavigationLink.displayName = "NavigationLink";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const isMobile = useMobile();
  const navigate = useNavigate();
  const location = useLocation();

  // Is this an admin user? In a real app, check for admin role
  const isAdmin = user && user.email === "admin@example.com";

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b">
        <div className="container flex items-center h-16">
          <Link to="/dashboard" className="mr-auto text-lg font-semibold">
            DocumentForge
          </Link>
          {user && (
            <div className="flex items-center space-x-4">
              {!isMobile && (
                <>
                  <span>{user.email}</span>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              )}
              {isMobile && (
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              )}
            </div>
          )}
        </div>
      </header>
      
      <div className="flex-1 flex">
        {!isMobile && (
          <aside className="w-60 bg-white border-r flex-shrink-0 p-4">
            <div className="space-y-1">
              <NavigationLink to="/dashboard" active={location.pathname === "/dashboard"}>
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </NavigationLink>
              <NavigationLink to="/proposals" active={location.pathname === "/proposals"}>
                <FileText className="mr-2 h-4 w-4" />
                Proposals
              </NavigationLink>
              <NavigationLink to="/onboarding" active={location.pathname === "/onboarding"}>
                <Mail className="mr-2 h-4 w-4" />
                Onboarding Emails
              </NavigationLink>
              <NavigationLink to="/invoices" active={location.pathname === "/invoices"}>
                <Settings className="mr-2 h-4 w-4" />
                Invoices
              </NavigationLink>
              
              {isAdmin && (
                <NavigationLink to="/admin" active={location.pathname === "/admin"}>
                  <Users className="mr-2 h-4 w-4" />
                  Admin Dashboard
                </NavigationLink>
              )}
            </div>
          </aside>
        )}
        <main className="flex-1 p-6">{children}</main>
      </div>
      
      {isMobile && (
        <nav className="bg-white border-t py-2">
          <div className="container flex justify-around items-center">
            <Link
              to="/dashboard"
              className={`flex flex-col items-center px-3 py-1 ${
                location.pathname === "/dashboard" ? "text-brand-600" : "text-gray-500"
              }`}
            >
              <Home className="h-5 w-5" />
              <span className="text-xs mt-1">Home</span>
            </Link>
            <Link
              to="/proposals"
              className={`flex flex-col items-center px-3 py-1 ${
                location.pathname === "/proposals" ? "text-brand-600" : "text-gray-500"
              }`}
            >
              <FileText className="h-5 w-5" />
              <span className="text-xs mt-1">Proposals</span>
            </Link>
            <Link
              to="/onboarding"
              className={`flex flex-col items-center px-3 py-1 ${
                location.pathname === "/onboarding" ? "text-brand-600" : "text-gray-500"
              }`}
            >
              <Mail className="h-5 w-5" />
              <span className="text-xs mt-1">Onboarding</span>
            </Link>
            <Link
              to="/invoices"
              className={`flex flex-col items-center px-3 py-1 ${
                location.pathname === "/invoices" ? "text-brand-600" : "text-gray-500"
              }`}
            >
              <Settings className="h-5 w-5" />
              <span className="text-xs mt-1">Invoices</span>
            </Link>
            
            {isAdmin && (
              <Link
                to="/admin"
                className={`flex flex-col items-center px-3 py-1 ${
                  location.pathname === "/admin" ? "text-brand-600" : "text-gray-500"
                }`}
              >
                <Users className="h-5 w-5" />
                <span className="text-xs mt-1">Admin</span>
              </Link>
            )}
          </div>
        </nav>
      )}
    </div>
  );
};

export default Layout;
