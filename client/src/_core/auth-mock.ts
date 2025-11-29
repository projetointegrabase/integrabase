// Sistema de autenticação mock (simulado) para testes sem backend

export interface MockUser {
  id: number;
  email: string;
  name: string;
  role: string;
  sector: string;
}

const MOCK_USERS: MockUser[] = [
  { id: 1, email: "admin@inter.com", name: "Administrador", role: "admin", sector: "admin" },
  { id: 2, email: "servicosocial@inter.com", name: "Serviço Social", role: "assistente_social", sector: "servico_social" },
  { id: 3, email: "pedagogia@inter.com", name: "Pedagogia", role: "pedagogo", sector: "pedagogia" },
  { id: 4, email: "psico@inter.com", name: "Psicologia", role: "psicologo", sector: "psicologia" },
  { id: 5, email: "nutri@inter.com", name: "Nutrição", role: "nutricionista", sector: "nutricao" },
];

const MOCK_PASSWORD = "Inter@2024";

export function mockLogin(email: string, password: string): MockUser | null {
  if (password !== MOCK_PASSWORD) {
    return null;
  }
  
  const user = MOCK_USERS.find(u => u.email === email);
  return user || null;
}

export function saveAuthToken(user: MockUser): void {
  localStorage.setItem("mock_user", JSON.stringify(user));
  localStorage.setItem("mock_token", `mock_token_${user.id}`);
}

export function getAuthToken(): string | null {
  return localStorage.getItem("mock_token");
}

export function getCurrentUser(): MockUser | null {
  const userStr = localStorage.getItem("mock_user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export function logout(): void {
  localStorage.removeItem("mock_user");
  localStorage.removeItem("mock_token");
}
