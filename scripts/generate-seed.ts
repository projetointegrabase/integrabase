import bcrypt from "bcryptjs";

const password = "Inter@2024";
const saltRounds = 10;

async function generateHash() {
  const hash = await bcrypt.hash(password, saltRounds);
  console.log(`Password: ${password}`);
  console.log(`Hash: ${hash}`);
  
  // Generate SQL
  const now = Date.now();
  const users = [
    { email: 'admin@inter.com', name: 'Administrador', role: 'admin', sector: 'admin' },
    { email: 'servicosocial@inter.com', name: 'Serviço Social', role: 'assistente_social', sector: 'servico_social' },
    { email: 'pedagogia@inter.com', name: 'Pedagogia', role: 'pedagogo', sector: 'pedagogia' },
    { email: 'psico@inter.com', name: 'Psicologia', role: 'psicologo', sector: 'psicologia' },
    { email: 'nutri@inter.com', name: 'Nutrição', role: 'nutricionista', sector: 'nutricao' },
  ];
  
  console.log('\n-- Seed SQL:');
  for (const user of users) {
    console.log(`
INSERT INTO users (email, passwordHash, name, role, sector, isActive, createdAt, updatedAt, lastSignedIn)
VALUES ('${user.email}', '${hash}', '${user.name}', '${user.role}', '${user.sector}', 1, ${now}, ${now}, ${now});
`);
  }
}

generateHash();
