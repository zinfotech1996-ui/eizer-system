import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useAuth } from "@/_core/hooks/useAuth";
import PublicHome from "./pages/PublicHome";
import PublicAbout from "./pages/PublicAbout";
import PublicHowItWorks from "./pages/PublicHowItWorks";
import PublicSupport from "./pages/PublicSupport";
import PublicContact from "./pages/PublicContact";
import AdminDashboard from "./pages/AdminDashboard";
import AdminFundraisers from "./pages/AdminFundraisers";
import AdminMachines from "./pages/AdminMachines";
import AdminRedemptions from "./pages/AdminRedemptions";
import FundraiserDashboard from "./pages/FundraiserDashboard";
import FundraiserMachines from "./pages/FundraiserMachines";
import FundraiserRedemptions from "./pages/FundraiserRedemptions";
import AuthPage from "./pages/AuthPage";

function ProtectedRoute({ component: Component, requiredRole }: { component: React.ComponentType; requiredRole?: string }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!isAuthenticated) return <NotFound />;
  if (requiredRole && user?.role !== requiredRole) return <NotFound />;

  return <Component />;
}

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={PublicHome} />
      <Route path={"/about"} component={PublicAbout} />
      <Route path={"/how-it-works"} component={PublicHowItWorks} />
      <Route path={"/support"} component={PublicSupport} />
      <Route path={"/contact"} component={PublicContact} />
      <Route path={"/auth"} component={AuthPage} />
      
      {/* Admin Routes */}
      <Route path={"/admin"} component={() => <ProtectedRoute component={AdminDashboard} requiredRole="admin" />} />
      <Route path={"/admin/fundraisers"} component={() => <ProtectedRoute component={AdminFundraisers} requiredRole="admin" />} />
      <Route path={"/admin/machines"} component={() => <ProtectedRoute component={AdminMachines} requiredRole="admin" />} />
      <Route path={"/admin/redemptions"} component={() => <ProtectedRoute component={AdminRedemptions} requiredRole="admin" />} />
      
      {/* Fundraiser Routes */}
      <Route path={"/fundraiser"} component={() => <ProtectedRoute component={FundraiserDashboard} requiredRole="user" />} />
      <Route path={"/fundraiser/machines"} component={() => <ProtectedRoute component={FundraiserMachines} requiredRole="user" />} />
      <Route path={"/fundraiser/redemptions"} component={() => <ProtectedRoute component={FundraiserRedemptions} requiredRole="user" />} />
      
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
