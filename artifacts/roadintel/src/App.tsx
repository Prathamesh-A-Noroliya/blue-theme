import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/context/LanguageContext";
import NotFound from "@/pages/not-found";

import RootLayout from "@/components/layout/root-layout";
import AppLayout from "@/components/layout/app-layout";

import Landing from "@/pages/landing";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Dashboard from "@/pages/dashboard";
import Complaints from "@/pages/complaints";
import Scan from "@/pages/scan";
import Roads from "@/pages/roads";
import RoadDetail from "@/pages/road-detail";
import RiskMap from "@/pages/risk-map";
import Spending from "@/pages/spending";
import Sensors from "@/pages/sensors";
import Contractors from "@/pages/contractors";
import Analytics from "@/pages/analytics";
import Settings from "@/pages/settings";
import SOS from "@/pages/sos";
import Assistant from "@/pages/assistant";
import Subscribe from "@/pages/subscribe";

const queryClient = new QueryClient();

function AppRoute({ path, children }: { path: string; children: React.ReactNode }) {
  return <Route path={path}><AppLayout>{children}</AppLayout></Route>;
}

function Router() {
  return (
    <Switch>
      <Route path="/"><RootLayout><Landing /></RootLayout></Route>
      <Route path="/login"><RootLayout><Login /></RootLayout></Route>
      <Route path="/register"><RootLayout><Register /></RootLayout></Route>
      <AppRoute path="/dashboard"><Dashboard /></AppRoute>
      <AppRoute path="/complaints"><Complaints /></AppRoute>
      <AppRoute path="/scan"><Scan /></AppRoute>
      <AppRoute path="/roads"><Roads /></AppRoute>
      <AppRoute path="/roads/:id"><RoadDetail /></AppRoute>
      <AppRoute path="/risk-map"><RiskMap /></AppRoute>
      <AppRoute path="/spending"><Spending /></AppRoute>
      <AppRoute path="/sensors"><Sensors /></AppRoute>
      <AppRoute path="/contractors"><Contractors /></AppRoute>
      <AppRoute path="/analytics"><Analytics /></AppRoute>
      <AppRoute path="/settings"><Settings /></AppRoute>
      <AppRoute path="/sos"><SOS /></AppRoute>
      <AppRoute path="/assistant"><Assistant /></AppRoute>
      <AppRoute path="/subscribe"><Subscribe /></AppRoute>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider defaultTheme="dark" storageKey="roadintel-theme">
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
