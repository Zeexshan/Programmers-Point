import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import InquiryForm from "@/pages/InquiryForm";
import PlacementShowcase from "@/pages/PlacementShowcase";
import CourseExplorer from "@/pages/CourseExplorer";
import Login from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminInquiries from "@/pages/admin/Inquiries";
import AdminPlacements from "@/pages/admin/Placements";
import AdminCompanies from "@/pages/admin/Companies";
import AdminTechnologies from "@/pages/admin/Technologies";
import AdminCombinations from "@/pages/admin/Combinations";

function Router() {
  return (
    <Switch>
      {/* Public Pages */}
      <Route path="/" component={Home} />
      <Route path="/inquiry" component={InquiryForm} />
      <Route path="/placements" component={PlacementShowcase} />
      <Route path="/courses" component={CourseExplorer} />
      
      {/* Admin Login */}
      <Route path="/admin/login" component={Login} />
      
      {/* Admin Pages */}
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/inquiries" component={AdminInquiries} />
      <Route path="/admin/placements" component={AdminPlacements} />
      <Route path="/admin/companies" component={AdminCompanies} />
      <Route path="/admin/technologies" component={AdminTechnologies} />
      <Route path="/admin/combinations" component={AdminCombinations} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
