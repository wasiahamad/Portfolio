import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Admin from "@/pages/Admin";
import ProjectDetail from "@/pages/ProjectDetail";
import ProjectsPage from "@/pages/ProjectsPage";
import { analyticsAPI } from "@/lib/api";
import { useEffect } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin" component={Admin} />
      <Route path="/projects" component={ProjectsPage} />
      <Route path="/project/:id" component={ProjectDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();

  useEffect(() => {
    // Avoid tracking admin panel traffic.
    if (location.startsWith("/admin")) return;

    analyticsAPI
      .track({ page: location })
      .catch(() => {
        // Best-effort tracking; ignore errors.
      });
  }, [location]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="portfolio-theme">
      <QueryClientProvider client={queryClient}>
        <Router />
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
