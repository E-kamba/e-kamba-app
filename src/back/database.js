import * as SQLite from 'expo-sqlite';

// Abre ou cria o banco de dados
const db = SQLite.openDatabase('multstoreapp.db');

// Constantes para os nomes das tabelas e colunas
const TABLE_PRODUTOS = 'produtos';
const TABLE_PEDIDOS = 'pedidos';
const TABLE_NOTIFICACAO = 'notificacao';

// Função para criar as tabelas do banco de dados
const setupDatabaseTables = () => {
  db.transaction(tx => {
    // Cria a tabela de produtos
    createProductsTable(tx);

    // Cria a tabela de pedidos
    createPedidosTable(tx);

    // Cria a tabela de notificação
    createNotificacaoTable(tx);
  });
};

const createProductsTable = tx => {
  tx.executeSql(
    `CREATE TABLE IF NOT EXISTS ${TABLE_PRODUTOS} (
      id INTEGER PRIMARY KEY,
      nome TEXT NOT NULL,
      preco INTEGER NOT NULL,
      descricao TEXT,
      detalhes TEXT,
      categoria INTEGER NOT NULL,
      subcategoria INTEGER NOT NULL,
      imagem_principal TEXT NOT NULL,
      imagens TEXT,
      videos TEXT,
      wish_list INTEGER NOT NULL,
      create_at TEXT NOT NULL,
      update_at TEXT,
      delete_at TEXT
    )`,
    [],
    () =>
      console.log(`Tabela ${TABLE_PRODUTOS} criada com sucesso ou já existe.`),
    (_, error) =>
      console.error(`Erro ao criar tabela ${TABLE_PRODUTOS}:`, error),
  );
};

// Cria a tabela de pedidos
const createPedidosTable = tx => {
  tx.executeSql(
    `CREATE TABLE IF NOT EXISTS ${TABLE_PEDIDOS} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      idProduto INTEGER NOT NULL,
      quantidade INTEGER NOT NULL,
      idUsuario INTEGER NOT NULL,
      create_at DATETIME,
      update_at DATETIME,
      delete_at DATETIME
    )`,
    [],
    () =>
      console.log(`Tabela ${TABLE_PEDIDOS} criada com sucesso ou já existe.`),
    (_, error) =>
      console.error(`Erro ao criar tabela ${TABLE_PEDIDOS}:`, error),
  );
};

// Cria a tabela de notificação
const createNotificacaoTable = tx => {
  tx.executeSql(
    `CREATE TABLE IF NOT EXISTS ${TABLE_NOTIFICACAO} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      estado INTEGER NOT NULL,
      conteudo TEXT,
      create_at DATETIME,
      update_at DATETIME,
      delete_at DATETIME
    )`,
    [],
    () =>
      console.log(
        `Tabela ${TABLE_NOTIFICACAO} criada com sucesso ou já existe.`,
      ),
    (_, error) =>
      console.error(`Erro ao criar tabela ${TABLE_NOTIFICACAO}:`, error),
  );
};

export {db, setupDatabaseTables};
