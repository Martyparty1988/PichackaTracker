import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";
import { AppLayout } from "@/components/layout/AppLayout";

type ProtectedRouteProps = {
  path: string;
  component: React.ComponentType;
};

export function ProtectedRoute({
  path,
  component: Component
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  // DEVELOPMENT MODE: Skip authentication check for testing
  return (
    <Route path={path}>
      {() => (
        <AppLayout>
          <Component />
        </AppLayout>
      )}
    </Route>
  );
  
  /* Original authentication logic - uncomment after testing
  return (
    <Route path={path}>
      {() => {
        if (isLoading) {
          return (
            <div className="flex items-center justify-center min-h-screen">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          );
        }

        if (!user) {
          return <Redirect to="/auth" />;
        }

        return (
          <AppLayout>
            <Component />
          </AppLayout>
        );
      }}
    </Route>
  );
  */
}