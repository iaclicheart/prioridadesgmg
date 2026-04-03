CREATE TABLE priorities (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  checked BOOLEAN DEFAULT false,
  order_index INTEGER NOT NULL
);

-- Habilita o "Tempo Real" para essa tabela
ALTER PUBLICATION supabase_realtime ADD TABLE priorities;
