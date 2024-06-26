import {db} from './database';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

function getPedidos() {
  fetchApiData('pedidos', insertPedidosFromAPI);
}

function insertPedidosFromAPI(products) {
  db.transaction(tx => {
    tx.executeSql('DELETE FROM pedidos', []);

    products.forEach(product => {
      const {
        id,
        idProduto,
        quantidade,
        idUsuario,
        create_at,
        update_at,
        delete_at,
      } = product;

      tx.executeSql(
        'INSERT INTO pedidos (id, idProduto, quantidade, idUsuario, create_at, update_at, delete_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id, idProduto, quantidade, idUsuario, create_at, update_at, delete_at],
      );
    });
  });
}

function fetchApiData(endpoint, handleApiResponse) {
  axios
    .get(`https://appdist.qml.ao/${endpoint}`)
    .then(handleApiResponse)
    .catch(handleApiError);
}

function handleApiResponse(response) {
  if (response.status === 200) {
    const data = response.data;
    // Implemente a lógica para processar os dados da API
    if (endpoint === 'pedidos') {
      insertPedidosFromAPI(data);
    } else {
      insertProductsFromAPI(data);
    }
    console.log(`Sucesso ${endpoint}!`);
  } else {
    handleApiError(
      `Erro ao obter dados da API. Status da resposta: ${response.status}`,
    );
  }
}

function handleApiError(error) {
  console.error('Erro ao obter dados da API:', error);
}

function selectCartItemsForDatabase() {
  db.transaction(tx => {
    tx.executeSql('SELECT * FROM carrinho', [], (_, {rows}) => {
      const data = rows._array;

      if (data.length > 0) {
        sendToApiData(data);
      }
    });
  });
}

async function sendToApiData(products) {
  for (const product of products) {
    try {
      const response = await axios.post(
        'https://appdist.qml.ao/addProdutoCarrinho',
        product,
      );

      if (response.status === 200) {
        console.log('Produtos da API atualizados com sucesso!');
      } else {
        console.error('Erro ao enviar produtos para a API:', response.data);
      }
    } catch (error) {
      console.error('Erro ao enviar produtos para a API:', error);
    }
  }
}

const getCategorias = async () => {
  try {
    const response = await axios.get('');
  } catch (err) {}
};

const insertProdutosFromAPI = products => {
  db.transaction(tx => {
    // Limpa a tabela produtos antes de inserir novos dados
    tx.executeSql(
      'DELETE FROM produtos',
      [],
      () => {
        console.log('Tabela produtos limpa com sucesso.');
      },
      (tx, error) => {
        console.error('Erro ao limpar tabela produtos: ', error);
      },
    );

    products.forEach(product => {
      const {
        id,
        nome,
        preco,
        descricao,
        detalhes,
        categoria,
        subcategoria,
        imagem_principal,
        imagens,
        videos,
        wish_list,
        create_at,
        update_at,
        delete_at,
      } = product;

      tx.executeSql(
        `INSERT INTO produtos 
        (id, nome, preco, descricao, detalhes, categoria, subcategoria, imagem_principal, imagens, videos, wish_list, create_at, update_at, delete_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          nome,
          preco,
          descricao,
          detalhes,
          categoria,
          subcategoria,
          imagem_principal,
          imagens,
          videos,
          wish_list,
          create_at,
          update_at,
          delete_at,
        ],
        () => {
          console.log(`Produto ${nome} inserido com sucesso.`);
        },
        (tx, error) => {
          console.error(`Erro ao inserir produto ${nome}: `, error);
        },
      );
    });
  });
};

// Função para buscar produtos da API e inseri-los na base de dados
const getProdutos = async () => {
  try {
    const response = await axios.get('https://appdist.qml.ao/produtos');

    if (response.status === 200) {
      const data = response.data; // Ajuste conforme a estrutura da resposta da API
      insertProdutosFromAPI(data);
    } else {
      console.error('Erro ao buscar produtos da API: ', response.statusText);
    }
  } catch (error) {
    console.error('Erro ao buscar produtos da API: ', error);
  }
};

// getPedidos();
selectCartItemsForDatabase();

export {getProdutos, selectCartItemsForDatabase};
