import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SECTORS, APP_TITLE } from "@/const";
import { LogOut, User } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<string>(user?.sector || "servico_social");

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  // Determinar quais abas o usuário pode ver
  const visibleTabs =
    user?.role === "admin"
      ? [...SECTORS, { id: "admin", label: "Admin", icon: "⚙️" }]
      : SECTORS.filter((s) => s.id === user?.sector);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">{APP_TITLE}</h1>
              <p className="text-sm text-muted-foreground">
                Sport Club Internacional
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm">
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-muted-foreground">{user?.email}</p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navegação de Abas */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex gap-1">
            {visibleTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === "servico_social" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Serviço Social</h2>
              <p className="text-muted-foreground">
                Acompanhamento psicossocial de atletas em transição
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    Ficha de Acompanhamento Social
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Avaliação completa da situação social, familiar e
                    educacional do atleta
                  </p>
                </div>
                <Button className="w-full">Novo Formulário</Button>
              </Card>

              <Card className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    Formulário de Feedback Familiar
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Percepção da família sobre a transição e bem-estar do
                    atleta
                  </p>
                </div>
                <Button className="w-full">Novo Formulário</Button>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Formulários Recentes
              </h3>
              <p className="text-sm text-muted-foreground">
                Nenhum formulário preenchido ainda.
              </p>
            </Card>
          </div>
        )}

        {activeTab === "psicologia" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Psicologia</h2>
              <p className="text-muted-foreground">
                Avaliação psicológica e bem-estar dos atletas
              </p>
            </div>

            <Card className="p-8 text-center space-y-4">
              <div className="text-6xl">🧠</div>
              <div>
                <h3 className="text-lg font-semibold">Em Breve</h3>
                <p className="text-sm text-muted-foreground">
                  Formulários de avaliação psicológica estarão disponíveis em
                  breve.
                </p>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "pedagogia" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Pedagogia</h2>
              <p className="text-muted-foreground">
                Acompanhamento acadêmico e educacional
              </p>
            </div>

            <Card className="p-8 text-center space-y-4">
              <div className="text-6xl">📚</div>
              <div>
                <h3 className="text-lg font-semibold">Em Breve</h3>
                <p className="text-sm text-muted-foreground">
                  Formulários de desempenho acadêmico estarão disponíveis em
                  breve.
                </p>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "nutricao" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Nutrição</h2>
              <p className="text-muted-foreground">
                Avaliação nutricional e orientação alimentar
              </p>
            </div>

            <Card className="p-8 text-center space-y-4">
              <div className="text-6xl">🥗</div>
              <div>
                <h3 className="text-lg font-semibold">Em Breve</h3>
                <p className="text-sm text-muted-foreground">
                  Formulários de avaliação nutricional estarão disponíveis em
                  breve.
                </p>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "medicina" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Medicina</h2>
              <p className="text-muted-foreground">
                Avaliação médica e acompanhamento de saúde
              </p>
            </div>

            <Card className="p-8 text-center space-y-4">
              <div className="text-6xl">⚕️</div>
              <div>
                <h3 className="text-lg font-semibold">Em Breve</h3>
                <p className="text-sm text-muted-foreground">
                  Formulários de avaliação médica estarão disponíveis em breve.
                </p>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "admin" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Dashboard Administrativo
              </h2>
              <p className="text-muted-foreground">
                Relatórios, análises e gestão do sistema
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-2">Atletas</h3>
                <p className="text-3xl font-bold text-primary">0</p>
                <p className="text-sm text-muted-foreground">
                  Atletas cadastrados
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-2">Formulários</h3>
                <p className="text-3xl font-bold text-primary">0</p>
                <p className="text-sm text-muted-foreground">
                  Formulários preenchidos
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-2">Usuários</h3>
                <p className="text-3xl font-bold text-primary">1</p>
                <p className="text-sm text-muted-foreground">
                  Profissionais ativos
                </p>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Relatórios e Análises
              </h3>
              <p className="text-sm text-muted-foreground">
                Funcionalidades de análise de dados estarão disponíveis na Fase
                2.
              </p>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
