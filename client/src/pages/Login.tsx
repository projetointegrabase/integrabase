import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle } from "lucide-react";
import { APP_TITLE, APP_SUBTITLE } from "@/const";

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      // Salvar token no localStorage
      localStorage.setItem("auth_token", data.token);
      // Redirecionar para dashboard
      setLocation("/dashboard");
    },
    onError: (error) => {
      setError(error.message || "Erro ao fazer login");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate({ email, password });
  };

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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loginMutation.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loginMutation.isPending}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Entrando...
              </>
            ) : (
              "Entrar no Sistema"
            )}
          </Button>
        </form>

        <div className="text-center text-xs text-muted-foreground space-y-1">
          <p>Desenvolvido para o Sport Club Internacional</p>
          <p className="text-[10px]">
            Usuários padrão: admin@inter.com, servicosocial@inter.com, pedagogia@inter.com, psico@inter.com, nutri@inter.com
            <br />
            Senha padrão: Inter@2024
          </p>
        </div>
      </Card>
    </div>
  );
}
