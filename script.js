// =======================================================
// VARIÁVEIS GLOBAIS
// =======================================================
let carrinho = []; // Array que armazenará os itens do carrinho

// =======================================================
// 1. MANIPULAÇÃO DO CARRINHO (Adicionar Itens)
// =======================================================

// Função para adicionar um item ao carrinho
function adicionarAoCarrinho(nomeItem, precoItem) {
    const itemExistente = carrinho.find(item => item.nome === nomeItem);

    if (itemExistente) {
        // Se o item já existe, apenas aumenta a quantidade
        itemExistente.quantidade++;
    } else {
        // Caso contrário, adiciona o novo item
        carrinho.push({
            nome: nomeItem,
            preco: precoItem,
            quantidade: 1
        });
    }

    // Atualiza o feedback visual do carrinho
    atualizarStatusCarrinho();
}

// Função para calcular e exibir o total do carrinho
function atualizarStatusCarrinho() {
    const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
    const valorTotal = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
    
    // Alerta visual no console para debug
    console.log("Carrinho Atual:", carrinho);
    console.log(`Total de Itens: ${totalItens}, Valor Total: R$ ${valorTotal.toFixed(2)}`);

    // Feedback visual (poderia ser um pop-up ou um ícone de carrinho no header)
    const btnCta = document.querySelector('.btn-cta');
    if (totalItens > 0) {
        btnCta.textContent = `VER CARRINHO (${totalItens} itens) - R$ ${valorTotal.toFixed(2).replace('.', ',')}`;
        btnCta.style.backgroundColor = '#4CAF50'; // Verde de sucesso
    } else {
        btnCta.textContent = 'PEDIR AGORA!';
        btnCta.style.backgroundColor = 'var(--amarelo-secundario)'; // Volta para a cor original
    }
}

// Adiciona "event listeners" a todos os botões "Adicionar" do cardápio
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (event) => {
        const card = event.target.closest('.card');
        
        // Pega as informações do item do HTML
        const nome = card.querySelector('h4').textContent;
        // Pega o preço, remove "R$", "," e converte para número
        const precoTexto = card.querySelector('.preco').textContent.replace('R$', '').trim().replace(',', '.');
        const preco = parseFloat(precoTexto);

        if (isNaN(preco)) {
            console.error(`Erro: Não foi possível obter o preço para o item ${nome}`);
            return;
        }

        adicionarAoCarrinho(nome, preco);
        
        // Feedback visual rápido no botão
        event.target.textContent = "Adicionado!";
        setTimeout(() => {
            event.target.textContent = "Adicionar";
        }, 800);
    });
});


// =======================================================
// 2. PROCESSAMENTO DO FORMULÁRIO DE PEDIDO
// =======================================================

document.getElementById('form-pedido').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    const nome = document.getElementById('nome').value.trim();
    const endereco = document.getElementById('endereco').value.trim();
    const itensTextArea = document.getElementById('itens');
    let itensPedido;

    // Se houver itens no carrinho, preenche o textarea automaticamente
    if (carrinho.length > 0) {
        itensPedido = carrinho.map(item => 
            `${item.quantidade}x ${item.nome} (R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')})`
        ).join('\n');
        
        // Atualiza o textarea (opcional)
        itensTextArea.value = itensPedido;
    } else {
        // Pega o texto inserido manualmente pelo usuário
        itensPedido = itensTextArea.value.trim();
    }
    
    // Validação básica
    if (nome === '' || endereco === '' || itensPedido === '') {
        alert('Por favor, preencha todos os campos do formulário para finalizar seu pedido.');
        return;
    }

    // Cria a mensagem para o WhatsApp (ou outro sistema de backend)
    const mensagemWhatsApp = `
Olá, sou o(a) ${nome}, e quero fazer um pedido:
Endereço: ${endereco}

--- ITENS DO PEDIDO ---
${itensPedido}
---

*Valor total (estimado): R$ ${carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0).toFixed(2).replace('.', ',')}*
`;

    // Simula o envio (você usaria AJAX para um backend real)
    console.log("--- PEDIDO ENVIADO ---");
    console.log(mensagemWhatsApp);
    
    // Feedback para o usuário e reset
    alert(`Pedido de ${nome} recebido com sucesso!\nVerifique o console para a mensagem de WhatsApp simulada.`);
    
    // Limpa o carrinho e o formulário
    carrinho = [];
    atualizarStatusCarrinho();
    this.reset();
});

// Inicializa o status do carrinho ao carregar a página
document.addEventListener('DOMContentLoaded', atualizarStatusCarrinho);
