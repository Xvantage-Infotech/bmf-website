import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Layout Components
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import MobileBottomNav from "@/components/Layout/MobileBottomNav";

// Pages
import Home from "@/pages/Home";
import FarmDetail from "@/pages/FarmDetail";
import OwnerDashboard from "@/pages/OwnerDashboard";
import HappyCustomers from "@/pages/HappyCustomers";
import Contact from "@/pages/Contact";
import HowItWorks from "@/pages/HowItWorks";
import PropertyRegistration from "@/pages/PropertyRegistration";
import TermsOfService from "@/pages/TermsOfService";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import FAQ from "@/pages/FAQ";
import NotFound from "@/pages/not-found";

// Floating WhatsApp Button
import { MessageCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useResponsive } from "@/hooks/useResponsive";

function FloatingWhatsApp() {
  const { isMobile } = useResponsive();
  
  if (!isMobile) return null;

  return (
    <Button
      size="icon"
      className="fixed bottom-20 right-6 w-14 h-14 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all hover:scale-110 z-40"
      onClick={() => window.open('https://wa.me/919876543210', '_blank')}
    >
      <MessageCircle className="w-6 h-6" />
    </Button>
  );
}

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/farm/:id" component={FarmDetail} />
          <Route path="/owner" component={OwnerDashboard} />
          <Route path="/owner/*" component={OwnerDashboard} />
          <Route path="/owner/register" component={PropertyRegistration} />
          
          {/* New Pages */}
          <Route path="/customers" component={HappyCustomers} />
          <Route path="/contact" component={Contact} />
          <Route path="/how-it-works" component={HowItWorks} />
          
          {/* Legal Pages */}
          <Route path="/terms" component={TermsOfService} />
          <Route path="/privacy" component={PrivacyPolicy} />
          <Route path="/faq" component={FAQ} />
          
          {/* Additional routes */}
          <Route path="/farms" component={() => <Home />} />
          <Route path="/search" component={() => <Home />} />
          <Route path="/saved" component={() => <div className="container mx-auto py-16 text-center"><h1 className="text-2xl font-bold">Saved Farms</h1><p className="text-neutral-600 mt-2">Coming soon...</p></div>} />
          <Route path="/profile" component={() => <div className="container mx-auto py-16 text-center"><h1 className="text-2xl font-bold">User Profile</h1><p className="text-neutral-600 mt-2">Coming soon...</p></div>} />
          
          {/* Fallback to 404 */}
          <Route component={NotFound} />
        </Switch>
      </main>

      <Footer />
      <MobileBottomNav />
      <FloatingWhatsApp />
    </div>
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
