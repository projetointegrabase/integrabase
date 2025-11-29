-- Seed inicial de usuários
-- Senha para todos: Inter@2024

INSERT INTO users (email, passwordHash, name, role, sector, isActive, createdAt, updatedAt, lastSignedIn)
VALUES ('admin@inter.com', '$2b$10$dmScbFC32..QmKCIbUyI1.tPoBim7rVxp42KKRFi977VLxEVkb0g6', 'Administrador', 'admin', 'admin', 1, 1764421498497, 1764421498497, 1764421498497);

INSERT INTO users (email, passwordHash, name, role, sector, isActive, createdAt, updatedAt, lastSignedIn)
VALUES ('servicosocial@inter.com', '$2b$10$dmScbFC32..QmKCIbUyI1.tPoBim7rVxp42KKRFi977VLxEVkb0g6', 'Serviço Social', 'assistente_social', 'servico_social', 1, 1764421498497, 1764421498497, 1764421498497);

INSERT INTO users (email, passwordHash, name, role, sector, isActive, createdAt, updatedAt, lastSignedIn)
VALUES ('pedagogia@inter.com', '$2b$10$dmScbFC32..QmKCIbUyI1.tPoBim7rVxp42KKRFi977VLxEVkb0g6', 'Pedagogia', 'pedagogo', 'pedagogia', 1, 1764421498497, 1764421498497, 1764421498497);

INSERT INTO users (email, passwordHash, name, role, sector, isActive, createdAt, updatedAt, lastSignedIn)
VALUES ('psico@inter.com', '$2b$10$dmScbFC32..QmKCIbUyI1.tPoBim7rVxp42KKRFi977VLxEVkb0g6', 'Psicologia', 'psicologo', 'psicologia', 1, 1764421498497, 1764421498497, 1764421498497);

INSERT INTO users (email, passwordHash, name, role, sector, isActive, createdAt, updatedAt, lastSignedIn)
VALUES ('nutri@inter.com', '$2b$10$dmScbFC32..QmKCIbUyI1.tPoBim7rVxp42KKRFi977VLxEVkb0g6', 'Nutrição', 'nutricionista', 'nutricao', 1, 1764421498497, 1764421498497, 1764421498497);
