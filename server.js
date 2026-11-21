const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const ARQUIVO_DADOS = path.join(__dirname, 'dados.json');

// Middlewares
app.use(express.json());
app.use(cors()); // Permite que o cliente acesse a API de outra origem/porta

// Dados iniciais caso o dados.json ainda não exista
const jogosPadrao = [
    { id: 1, titulo: 'Cyberpunk Adventure', preco: 199.90, categoria: 'RPG', estoque: 10 },
    { id: 2, titulo: 'Space Strategy 2077', preco: 149.90, categoria: 'Estratégia', estoque: 15 },
    { id: 3, titulo: 'Pixel Platformer', preco: 49.90, categoria: 'Indie', estoque: 25 },
    { id: 4, titulo: 'Bluezao simulator', preco: 4.20, categoria: 'Indie', estoque: 67 }
];

let estado = {
    jogos: jogosPadrao,
    carrinhos: {}, // Mapeia usuarioId -> [ { jogoId, quantidade } ]
    pedidos: []
};

function carregarEstado() {
    if (fs.existsSync(ARQUIVO_DADOS)) {
        const conteudo = fs.readFileSync(ARQUIVO_DADOS, 'utf-8');
        estado = JSON.parse(conteudo);
    } else {
        salvarEstado();
    }
}

function salvarEstado() {
    fs.writeFileSync(ARQUIVO_DADOS, JSON.stringify(estado, null, 2), 'utf-8');
}

// Carrega dados salvos (ou cria o dados.json na primeira execução)
carregarEstado();

// ROTAS DA API REST

// 1. Listar todos os jogos disponíveis no catálogo
app.get('/api/jogos', (req, res) => {
    res.json(estado.jogos);
});

// 2. Buscar detalhes de um jogo específico
app.get('/api/jogos/:id', (req, res) => {
    const jogo = estado.jogos.find(j => j.id === parseInt(req.params.id));
    if (!jogo) return res.status(404).json({ erro: 'Jogo não encontrado' });
    res.json(jogo);
});

// 3. Adicionar jogo ao carrinho de um usuário
app.post('/api/carrinho', (req, res) => {
    const { usuarioId, jogoId } = req.body;

    const jogo = estado.jogos.find(j => j.id === jogoId);
    if (!jogo) return res.status(404).json({ erro: 'Jogo não encontrado' });
    if (jogo.estoque <= 0) return res.status(400).json({ erro: 'Jogo fora de estoque' });

    if (!estado.carrinhos[usuarioId]) {
        estado.carrinhos[usuarioId] = [];
    }

    const itemExistente = estado.carrinhos[usuarioId].find(item => item.jogoId === jogoId);
    const quantidadeAtual = itemExistente ? itemExistente.quantidade : 0;

    if (quantidadeAtual + 1 > jogo.estoque) {
        return res.status(400).json({
            erro: `Estoque insuficiente para "${jogo.titulo}". Estoque máximo disponível: ${jogo.estoque}`
        });
    }

    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        estado.carrinhos[usuarioId].push({ jogoId, quantidade: 1 });
    }

    salvarEstado();
    res.json({ mensagem: 'Jogo adicionado ao carrinho', carrinho: estado.carrinhos[usuarioId] });
});

// 4. Visualizar o carrinho do usuário
app.get('/api/carrinho/:usuarioId', (req, res) => {
    const usuarioId = req.params.usuarioId;
    const itensCarrinho = estado.carrinhos[usuarioId] || [];

    // Enriquecer os dados com as informações completas dos jogos
    const itensDetalhados = itensCarrinho.map(item => {
        const jogo = estado.jogos.find(j => j.id === item.jogoId);
        return { ...jogo, quantidade: item.quantidade };
    });

    const valorTotal = itensDetalhados.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);

    res.json({ itens: itensDetalhados, valorTotal });
});

// Alterar quantidade de um item no carrinho (+1 ou -1)
app.patch('/api/carrinho/item', (req, res) => {
    const { usuarioId, jogoId, delta } = req.body;

    const itensCarrinho = estado.carrinhos[usuarioId];
    if (!itensCarrinho) {
        return res.status(404).json({ erro: 'Carrinho não encontrado' });
    }

    const index = itensCarrinho.findIndex(item => item.jogoId === jogoId);
    if (index === -1) {
        return res.status(404).json({ erro: 'Item não está no carrinho' });
    }

    const jogo = estado.jogos.find(j => j.id === jogoId);
    if (!jogo) {
        return res.status(404).json({ erro: 'Jogo não encontrado' });
    }

    const novaQuantidade = itensCarrinho[index].quantidade + delta;

    if (novaQuantidade > jogo.estoque) {
        return res.status(400).json({
            erro: `Estoque insuficiente para "${jogo.titulo}". Estoque máximo disponível: ${jogo.estoque}`
        });
    }

    if (novaQuantidade <= 0) {
        itensCarrinho.splice(index, 1);
    } else {
        itensCarrinho[index].quantidade = novaQuantidade;
    }

    salvarEstado();
    res.json({ mensagem: 'Quantidade atualizada', carrinho: itensCarrinho });
});

// Remover um item específico do carrinho
app.delete('/api/carrinho/:usuarioId/:jogoId', (req, res) => {
    const { usuarioId, jogoId } = req.params;
    const idNumerico = parseInt(jogoId);

    const itensCarrinho = estado.carrinhos[usuarioId];
    if (!itensCarrinho) {
        return res.status(404).json({ erro: 'Carrinho não encontrado' });
    }

    const index = itensCarrinho.findIndex(item => item.jogoId === idNumerico);
    if (index === -1) {
        return res.status(404).json({ erro: 'Item não está no carrinho' });
    }

    itensCarrinho.splice(index, 1);
    salvarEstado();
    res.json({ mensagem: 'Item removido do carrinho', carrinho: itensCarrinho });
});

// 5. Finalizar Compra (Checkout)
app.post('/api/checkout', (req, res) => {
    const { usuarioId } = req.body;
    const itensCarrinho = estado.carrinhos[usuarioId];

    if (!itensCarrinho || itensCarrinho.length === 0) {
        return res.status(400).json({ erro: 'Carrinho vazio' });
    }

    // Valida todo o carrinho antes de dar baixa no estoque
    for (let item of itensCarrinho) {
        const jogo = estado.jogos.find(j => j.id === item.jogoId);
        if (!jogo) {
            return res.status(404).json({ erro: `Jogo ID ${item.jogoId} não encontrado` });
        }
        if (item.quantidade > jogo.estoque) {
            return res.status(400).json({
                erro: `Estoque insuficiente para "${jogo.titulo}". Estoque máximo disponível: ${jogo.estoque}`
            });
        }
    }

    // Processar baixa no estoque e gerar pedido
    for (let item of itensCarrinho) {
        const jogo = estado.jogos.find(j => j.id === item.jogoId);
        if (jogo) {
            jogo.estoque -= item.quantidade;
        }
    }

    const novoPedido = {
        id: estado.pedidos.length + 1,
        usuarioId,
        itens: [...itensCarrinho],
        data: new Date()
    };

    estado.pedidos.push(novoPedido);
    estado.carrinhos[usuarioId] = []; // Limpa o carrinho

    salvarEstado();
    res.status(201).json({ mensagem: 'Compra realizada com sucesso!', pedido: novoPedido });
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor da Loja rodando em http://localhost:${PORT}`);
});