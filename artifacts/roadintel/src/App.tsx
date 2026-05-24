import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import NotFound from "@/pages/not-found";

import RootLayout from "@/components/layout/root-layout";
import AppLayout from "@/components/layout/app-layout";

import Landing from "@/pages/landing";
import LoginPage from "@/pages/LoginPage";
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

function RedirectTo({ path }: { path: string }) {
  const [, setLocation] = useLocation();
  useEffect(() => { setLocation(path); }, [path, setLocation]);
  return null;
}

function ProtectedAppRoute({ path, children }: { path: string; children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  return (
    <Route path={path}>
      {isLoggedIn ? <AppLayout>{children}</AppLayout> : <RedirectTo path="/login" />}
    </Route>
  );
}

function PublicRoute({ path, children }: { path: string; children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  return (
    <Route path={path}>
      {isLoggedIn ? <RedirectTo path="/dashboard" /> : children}
    </Route>
  );
}

function Router() {
  return (
    <Switch>
      <PublicRoute path="/"><RootLayout><Landing /></RootLayout></PublicRoute>
      <PublicRoute path="/login"><RootLayout><LoginPage /></RootLayout></PublicRoute>
      <PublicRoute path="/register"><RootLayout><Register /></RootLayout></PublicRoute>
      <ProtectedAppRoute path="/dashboard"><Dashboard /></ProtectedAppRoute>
      <ProtectedAppRoute path="/complaints"><Complaints /></ProtectedAppRoute>
      <ProtectedAppRoute path="/scan"><Scan /></ProtectedAppRoute>
      <ProtectedAppRoute path="/roads"><Roads /></ProtectedAppRoute>
      <ProtectedAppRoute path="/roads/:id"><RoadDetail /></ProtectedAppRoute>
      <ProtectedAppRoute path="/risk-map"><RiskMap /></ProtectedAppRoute>
      <ProtectedAppRoute path="/spending"><Spending /></ProtectedAppRoute>
      <ProtectedAppRoute path="/sensors"><Sensors /></ProtectedAppRoute>
      <ProtectedAppRoute path="/contractors"><Contractors /></ProtectedAppRoute>
      <ProtectedAppRoute path="/analytics"><Analytics /></ProtectedAppRoute>
      <ProtectedAppRoute path="/settings"><Settings /></ProtectedAppRoute>
      <ProtectedAppRoute path="/sos"><SOS /></ProtectedAppRoute>
      <ProtectedAppRoute path="/assistant"><Assistant /></ProtectedAppRoute>
      <ProtectedAppRoute path="/subscribe"><Subscribe /></ProtectedAppRoute>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </QueryClientProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
