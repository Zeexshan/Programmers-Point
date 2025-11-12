import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Building2,
  Layers,
  Code,
  LogOut,
  Menu,
} from "lucide-react";
import logoUrl from "@assets/logo_1761740236721.png";
import { useState, useEffect } from "react";

function LogoWithFallback({ className, testId }: { className?: string; testId?: string }) {
  const [logoFailed, setLogoFailed] = useState(false);

  if (logoFailed) {
    return (
      <div className={className}>
        <span className="text-xl font-bold text-primary">Programmers Point</span>
      </div>
    );
  }

  return (
    <img 
      src={logoUrl} 
      alt="Admin" 
      className={className}
      data-testid={testId}
      onError={() => setLogoFailed(true)}
    />
  );
}

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/inquiries", icon: Users, label: "Inquiries" },
  { href: "/admin/technologies", icon: Code, label: "Technologies" },
  { href: "/admin/combinations", icon: Layers, label: "Combinations" },
  { href: "/admin/companies", icon: Building2, label: "Companies" },
  { href: "/admin/placements", icon: Briefcase, label: "Placements" },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("adminLoggedIn");
    if (!isLoggedIn && !location.includes("/admin/login")) {
      setLocation("/admin/login");
    }
  }, [location, setLocation]);

  const handleLogout = () => {
    sessionStorage.removeItem("adminLoggedIn");
    setLocation("/admin/login");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="md:hidden bg-card border-b px-4 py-3 flex items-center justify-between">
        <LogoWithFallback className="h-10" />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          data-testid="button-menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed md:sticky top-0 left-0 z-40 w-60 h-screen bg-sidebar border-r transition-transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b hidden md:block">
              <LogoWithFallback className="h-12" testId="img-admin-logo" />
              <p className="text-xs text-muted-foreground mt-2">Admin Panel</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {navItems.map((item) => {
                const isActive = location === item.href || (item.href !== "/admin" && location.startsWith(item.href));
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className="w-full justify-start h-12"
                      data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t">
              <Button
                variant="ghost"
                className="w-full justify-start text-destructive hover:text-destructive h-12"
                onClick={handleLogout}
                data-testid="button-logout"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </Button>
            </div>
          </div>
        </aside>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
