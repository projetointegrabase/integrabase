import { useAuth } from "@/_core/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // Redirecionar para dashboard se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated && user) {
      setLocation("/dashboard");
    } else if (!loading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, user, loading, setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
