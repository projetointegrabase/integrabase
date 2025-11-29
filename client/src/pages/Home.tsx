import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { APP_TITLE, APP_SUBTITLE } from "@/const";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // Redirecionar para dashboard se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated && user) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, user, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Tela de login
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl p-8 space-y-6">
        {/* Logos no topo */}
        <div className="flex items-center justify-center gap-8 mb-6">
          <img 
            src="/logo-internacional.png" 
            alt="Sport Club Internacional" 
            className="h-24 w-24 object-contain"
          />
          <div className="h-20 w-px bg-border" />
          <img 
            src="/logo-servico-social.png" 
            alt="Serviço Social - Base & Profissional" 
            className="h-24 w-auto object-contain"
          />
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-primary">{APP_TITLE}</h1>
          <p className="text-sm text-muted-foreground">{APP_SUBTITLE}</p>
        </div>

        <div className="space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            Sistema de acompanhamento psicossocial para atletas em transição da base para o profissional.
          </p>

          <Button
            onClick={() => window.location.href = "#"}
            className="w-full"
            size="lg"
          >
            Entrar no Sistema
          </Button>
        </div>

        <div className="text-center text-xs text-muted-foreground">
          <p>Desenvolvido para o Sport Club Internacional</p>
        </div>
      </Card>
    </div>
  );
}
