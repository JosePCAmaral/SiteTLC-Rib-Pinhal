-- Registros de doações (pessoa física) e apoios (empresas).
-- Esta tabela é o "extrato" do site: confira sempre com o extrato do banco.
CREATE TABLE IF NOT EXISTS registros (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  tipo           TEXT    NOT NULL CHECK (tipo IN ('doacao', 'apoio')),
  criado_em      TEXT    NOT NULL DEFAULT (datetime('now')),
  -- status: pendente (só registrado) | confirmado (conferido no banco) | cancelado
  status         TEXT    NOT NULL DEFAULT 'pendente',

  -- comuns
  nome           TEXT,              -- pessoa física ou responsável da empresa
  email          TEXT,
  telefone       TEXT,
  valor_centavos INTEGER,           -- doação ou valor estimado do apoio
  mensagem       TEXT,              -- intenção de oração / detalhes do apoio

  -- só doação
  anonimo        INTEGER NOT NULL DEFAULT 0,

  -- só apoio (empresa)
  razao_social   TEXT,
  cnpj           TEXT,
  tipos_apoio    TEXT,              -- ex: "dinheiro, produtos"
  autoriza_logo  INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_registros_criado_em ON registros (criado_em);
CREATE INDEX IF NOT EXISTS idx_registros_tipo ON registros (tipo);
