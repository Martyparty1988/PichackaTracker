import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import WorkLogs from "@/pages/WorkLogs";
import Finance from "@/pages/Finance";
import Debts from "@/pages/Debts";
import Settings from "@/pages/Settings";
import AuthPage from "@/pages/auth-page";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/lib/protected-route";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={Dashboard} />
      <ProtectedRoute path="/work-logs" component={WorkLogs} />
      <ProtectedRoute path="/finance" component={Finance} />
      <ProtectedRoute path="/debts" component={Debts} />
      <ProtectedRoute path="/settings" component={Settings} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
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
