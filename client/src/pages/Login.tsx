import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle } from "lucide-react";
import { APP_TITLE, APP_SUBTITLE } from "@/const";
import { mockLogin, saveAuthToken } from "@/_core/auth-mock";

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = mockLogin(email, password);
    
    if (user) {
      saveAuthToken(user);
      setLocation("/dashboard");
    } else {
      setError("Email ou senha incorretos");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-2xl p-12 space-y-8 bg-white shadow-lg">
        {/* Logos no topo */}
        <div className="flex items-center justify-center gap-8 mb-8">
          <img 
            src="/logo-internacional.png" 
            alt="Sport Club Internacional" 
            className="h-24 w-24 object-contain"
          />
          <div className="h-20 w-px bg-gray-300" />
          <img 
            src="/logo-servico-social.png" 
            alt="Serviço Social - Base & Profissional" 
            className="h-24 w-auto object-contain"
          />
        </div>

        {/* Título */}
        <div className="text-center space-y-3">
          <h1 className="text-2xl font-bold text-[#C8102E]">{APP_TITLE}</h1>
          <p className="text-sm text-gray-600">{APP_SUBTITLE}</p>
        </div>

        {/* Descrição */}
        <div className="text-center">
          <p className="text-sm text-gray-500 leading-relaxed">
            Sistema de acompanhamento psicossocial para atletas<br />
            em transição da base para o profissional
          </p>
        </div>

        {/* Formulário de Login */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="h-11"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-12 bg-[#C8102E] hover:bg-[#A00D24] text-white font-medium text-base"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Entrando...
              </>
            ) : (
              "Entrar no Sistema"
            )}
          </Button>
        </form>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 pt-4">
          <p>Desenvolvido para o Sport Club Internacional</p>
        </div>
      </Card>
    </div>
  );
}
