import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import WorkLogs from "@/pages/WorkLogs";
import Finance from "@/pages/Finance";
import Debts from "@/pages/Debts";
import Settings from "@/pages/Settings";
import Login from "@/pages/Login";
import { useAuth } from "@/components/auth/AuthProvider";
import { AppLayout } from "@/components/layout/AppLayout";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-gray">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Login />;
  }
  
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/work-logs" component={WorkLogs} />
        <Route path="/finance" component={Finance} />
        <Route path="/debts" component={Debts} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <>
      <Router />
      <Toaster />
    </>
  );
}

export default App;
