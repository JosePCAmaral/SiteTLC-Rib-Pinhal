-- Controle de envios (proteção contra spam/robôs).
-- Guarda apenas um hash irreversível do IP + horário, por no máximo 24h.
-- Nenhum IP real é armazenado.
CREATE TABLE IF NOT EXISTS envios (
  ip_hash   TEXT    NOT NULL,
  criado_em INTEGER NOT NULL  -- milissegundos (Date.now())
);

CREATE INDEX IF NOT EXISTS idx_envios_ip_tempo ON envios (ip_hash, criado_em);
CREATE INDEX IF NOT EXISTS idx_envios_tempo ON envios (criado_em);
