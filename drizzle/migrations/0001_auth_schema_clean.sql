DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  passwordHash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'assistente_social' CHECK(role IN ('admin', 'psicologo', 'pedagogo', 'assistente_social', 'nutricionista', 'medico')),
  sector TEXT NOT NULL DEFAULT 'servico_social' CHECK(sector IN ('admin', 'psicologia', 'pedagogia', 'servico_social', 'nutricao', 'medicina')),
  isActive INTEGER NOT NULL DEFAULT 1,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL,
  lastSignedIn INTEGER NOT NULL
);
