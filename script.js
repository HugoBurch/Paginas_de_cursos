

// =============================================================================
// SEÇÃO 1: CARRINHO LATERAL - Sistema de compras
// =============================================================================

// Array global que armazena os itens adicionados ao carrinho
let cart = [];

// Seleciona o elemento ícone do carrinho (clicar abre o painel)
const cartIcon = document.getElementById('cart-icon');
// Seleciona o painel lateral do carrinho
const cartSidebar = document.getElementById('cart-sidebar');
// Seleciona o botão X para fechar o carrinho
const closeCartBtn = document.getElementById('close-cart');
// Seleciona o botão "Fechar" do carrinho
const btnFecharCarrinho = document.getElementById('btn-fechar-carrinho');

// ====== ABRE O CARRINHO AO CLICAR NO ÍCONE ======
if (cartIcon) {
    cartIcon.addEventListener('click', (e) => {
        // Para a propagação do clique para não fechar logo em seguida
        e.stopPropagation();
        // Adiciona a classe 'active' que move o painel para a tela (CSS)
        cartSidebar.classList.add('active');
    });
}

// ====== FECHA O CARRINHO AO CLICAR NO BOTÃO X ======
if (closeCartBtn) {
    closeCartBtn.addEventListener('click', (e) => {
        // Para a propagação
        e.stopPropagation();
        // Remove a classe 'active' que move o painel para fora da tela
        cartSidebar.classList.remove('active');
    });
}

// ====== FECHA O CARRINHO AO CLICAR NO BOTÃO "FECHAR" ======
if (btnFecharCarrinho) {
    btnFecharCarrinho.addEventListener('click', (e) => {
        // Para a propagação
        e.stopPropagation();
        // Remove a classe 'active'
        cartSidebar.classList.remove('active');
    });
}

// ====== FECHA O CARRINHO AO CLICAR FORA DO PAINEL ======
// Escuta todos os cliques na página
document.addEventListener('click', (e) => {
    // Verifica se:
    // - O carrinho existe
    // - O ícone existe
    // - O clique NÃO foi dentro do painel (.contains)
    // - O clique NÃO foi no ícone
    if (
        cartSidebar &&
        cartIcon &&
        !cartSidebar.contains(e.target) &&
        !cartIcon.contains(e.target)
    ) {
        // Se tudo verdadeiro, fecha o carrinho
        cartSidebar.classList.remove('active');
    }
});

// ====== IMPEDE QUE CLIQUES DENTRO DO CARRINHO FECHEM ELE ======
if (cartSidebar) {
    cartSidebar.addEventListener('click', (e) => {
        // Para a propagação do clique para não fechar o carrinho
        e.stopPropagation();
    });
}

// =============================================================================
// FUNÇÃO: ADICIONAR ITEM AO CARRINHO
// =============================================================================
// Recebe um objeto curso com {nome, preco}
function addToCart(curso) {
    // Procura se o curso já existe no carrinho
    const itemExistente = cart.find(item => item.nome === curso.nome);
    
    // Se já existe, mostra um alerta e retorna sem adicionar
    if (itemExistente) {
        alert('Este curso já está no carrinho');
        return;
    }
    
    // Se não existe, adiciona o curso ao array do carrinho
    cart.push({
        nome: curso.nome,
        preco: curso.preco
    });
    
    // Atualiza a exibição do carrinho na tela
    updateCart();
    // Abre o painel do carrinho automaticamente
    if (cartSidebar) cartSidebar.classList.add('active');
}

// =============================================================================
// FUNÇÃO: ATUALIZAR CARRINHO (renderiza a lista de itens e total)
// =============================================================================
function updateCart() {
    // Seleciona o elemento onde os itens vão aparecer
    const cartItems = document.getElementById('cart-items');
    // Seleciona o elemento onde o total vai aparecer
    const cartTotal = document.getElementById('cart-total');

    // Se não encontrar esses elementos, sai da função
    if (!cartItems || !cartTotal) return;

    // Limpa o HTML anterior para refazer tudo
    cartItems.innerHTML = '';
    // Inicializa a variável que soma o total de preços
    let total = 0;

    // ====== SE O CARRINHO ESTÁ VAZIO ======
    if (cart.length === 0) {
        // Mostra mensagem de carrinho vazio
        cartItems.innerHTML =
            '<p style="text-align: center; color: #999; padding: 20px;">Seu carrinho está vazio</p>';
        // Fecha o painel automaticamente
        if (cartSidebar) cartSidebar.classList.remove('active');
    } else {
        // ====== SE TEM ITENS NO CARRINHO ======
        // Para cada item do array cart:
        cart.forEach((item, index) => {
            // Soma o preço do item ao total
            total += item.preco;
            
            // Cria o HTML do item e adiciona ao painel
            cartItems.innerHTML += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.nome}</h4>
                        <p class="cart-item-price">R$ ${item.preco.toFixed(2)}</p>
                    </div>
                    <!-- Botão com a posição do item (index) armazenada em data-index -->
                    <button class="cart-item-remove" data-index="${index}">✕</button>
                </div>
            `;
        });
    }

    // Atualiza o total na tela com 2 casas decimais
    cartTotal.textContent = `R$ ${total.toFixed(2)}`;
    
    // ====== ADICIONA OUVINTES NOS BOTÕES DE REMOVER ======
    // Seleciona TODOS os botões de remover criados acima
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Para a propagação para não fechar o carrinho
            e.stopPropagation();
            // Pega o índice do item a remover do atributo data-index
            const index = parseInt(e.target.dataset.index);
            // Chama a função de remover passando o índice
            removeFromCart(index);
        });
    });
}

// =============================================================================
// FUNÇÃO: REMOVER ITEM DO CARRINHO
// =============================================================================
// Recebe o índice (posição) do item a remover
function removeFromCart(index) {
    // Remove 1 item na posição indicada pelo índice
    // splice(posição, quantidade)
    cart.splice(index, 1);
    // Atualiza a exibição do carrinho
    updateCart();
}

// =============================================================================
// SEÇÃO 2: CATÁLOGO DE CURSOS - Criação dos cards
// =============================================================================

// =============================================================================
// FUNÇÃO: CONSTRUIR CARD DO CATÁLOGO
// =============================================================================
// Recebe um objeto curso com {titulo, preco, horas, nivel, detalhes, imagem, descricao}
function buildCatalogCard(curso) {
    // Cria uma nova div que será o card
    const card = document.createElement('div');
    // Adiciona as classes CSS para estilização
    card.className = 'card catalog-card';

    // ====== VALIDAÇÃO E PREPARAÇÃO DE DADOS ======
    // Se o preço é um número, usa ele; senão usa 0
    const preco = typeof curso.preco === 'number' ? curso.preco : 0;
    // Tenta usar 'carga_horaria', se não tiver usa 'horas', se não tiver usa ''
    const horas = curso.carga_horaria ?? curso.horas ?? '';
    // Pega o nível do curso ou vazio
    const nivel = curso.nivel ?? '';
    
    // ====== MONTA A LINHA DE META (Horas - Nível) ======
    // Se tem horas E nível, mostra "360 horas - Intermediário"
    // Se não, mostra a descrição do curso
    const meta =
        horas !== '' && nivel !== ''
            ? `${horas} horas - ${nivel}`
            : curso.descricao ?? '';

    // ====== PEGA OS DETALHES DO CURSO ======
    // Prioriza 'detalhes', se não tiver usa 'descricao'
    const detalhes = curso.detalhes ?? curso.descricao ?? '';
    
    // ====== CRIA O BLOCO DE IMAGEM ======
    // Se tem imagem, cria um bloco com a imagem
    // Se não tem, cria um bloco vazio escurecido
    const thumbBlock = curso.imagem
        ? `<div class="catalog-card__thumb"><img src="${curso.imagem}" alt="${curso.titulo}"></div>`
        : `<div class="catalog-card__thumb catalog-card__thumb--empty" aria-hidden="true"></div>`;

    // ====== MONTA O HTML COMPLETO DO CARD ======
    // O card tem DUAS partes:
    // 1) .catalog-card__body - informação básica visível o tempo todo
    // 2) .card-detalhes - overlay com mais informações (visível quando clica)
    card.innerHTML = `
        <div class="catalog-card__body">
            ${thumbBlock}
            <h3 class="catalog-card__title">${curso.titulo}</h3>
            <p class="catalog-card__meta">${meta}</p>
            <!-- Botão que abre o overlay de detalhes -->
            <button type="button" class="btn-comprar--catalog btn-abrir-detalhes">
                COMPRAR
            </button>
        </div>
        <!-- Overlay com detalhes (fica por cima do card quando clica) -->
        <div class="card-detalhes">
            <!-- Botão X para fechar o overlay -->
            <button type="button" class="close-detalhes" aria-label="Fechar detalhes">&times;</button>
            <h3>${curso.titulo}</h3>
            <p>${detalhes}</p>
            <p class="card-detalhes__preco"><strong>R$ ${preco.toFixed(2)}</strong></p>
            <!-- Botão com nome e preço armazenados em data-* -->
            <button type="button" class="btn-comprar" data-nome="${curso.titulo}" data-preco="${preco}">
                Adicionar ao carrinho
            </button>
        </div>
    `;

    // Retorna o card pronto para ser adicionado ao DOM
    return card;
}

// =============================================================================
// SEÇÃO 3: CARREGAMENTO INICIAL - Fetch do JSON e renderização
// =============================================================================

// ====== REQUISITA O ARQUIVO CURSOS.JSON ======
fetch('cursos.json')
    // ====== PRIMEIRA ETAPA: RECEBE A RESPOSTA ======
    .then((response) => {
        // Se a resposta não foi OK (erro 404, 500, etc.), lança um erro
        if (!response.ok) throw new Error('Erro ao carregar cursos.json');
        // Se foi OK, converte a resposta em JSON
        return response.json();
    })
    // ====== SEGUNDA ETAPA: PROCESSA OS DADOS ======
    .then((data) => {
        // ====== 1. DEFINE A IMAGEM DO BANNER PRINCIPAL ======
        const heroImg = document.getElementById('hero-img');
        // Se tem curso principal e tem elemento hero-img
        if (data.cursoPrincipal && heroImg) {
            // Define a src da imagem
            heroImg.src = data.cursoPrincipal.imagem;
        }

        // ====== 3. SELECIONA O CONTAINER DOS CARDS ======
        const container = document.getElementById('cards-container');
        // Se não encontrar o container, mostra erro e retorna
        if (!container) {
            console.error('Container não encontrado!');
            return;
        }

        // Limpa o container
        container.innerHTML = '';

        // ====== 4. RENDERIZA AS CATEGORIAS E CARDS ======
        const categorias = data.categorias;
        
        // Se tem categorias no JSON
        if (categorias && categorias.length) {
            // Para cada categoria:
            categorias.forEach((cat) => {
                // Cria um div para a categoria
                const block = document.createElement('div');
                block.className = 'catalog-category';
                block.innerHTML = `
                    <h2 class="catalog-category__title">${cat.nome}</h2>
                    <!-- Linha decorativa horizontal -->
                    <div class="catalog-category__rule" aria-hidden="true"></div>
                    <!-- Grid onde os cards vão ficar -->
                    <div class="catalog-grid"></div>
                `;
                
                // Seleciona o grid dentro do bloco da categoria
                const grid = block.querySelector('.catalog-grid');
                
                // Para cada curso da categoria:
                (cat.cursos || []).forEach((curso) => {
                    // Cria o card chamando a função buildCatalogCard
                    // e adiciona ao grid
                    grid.appendChild(buildCatalogCard(curso));
                });
                
                // Adiciona toda a categoria ao container principal
                container.appendChild(block);
            });
        } 
        // Se não tem categorias, mas tem um array de cursos simples:
        else if (data.cursos && data.cursos.length) {
            // Cria um bloco de categoria (mesmo sem categorias)
            const block = document.createElement('div');
            block.className = 'catalog-category';
            block.innerHTML = `
                <h2 class="catalog-category__title">CURSOS</h2>
                <div class="catalog-category__rule" aria-hidden="true"></div>
                <div class="catalog-grid"></div>
            `;
            
            // Seleciona o grid
            const grid = block.querySelector('.catalog-grid');
            
            // Para cada curso:
            data.cursos.forEach((curso) => {
                // Adapta o curso para o formato esperado
                const adapted = {
                    titulo: curso.titulo,
                    detalhes: curso.detalhes,
                    descricao: curso.descricao,
                    preco: curso.preco,
                    imagem: curso.imagem,
                    carga_horaria: curso.carga_horaria,
                    horas: curso.horas,
                    nivel: curso.nivel,
                };
                // Cria o card e adiciona ao grid
                grid.appendChild(buildCatalogCard(adapted));
            });
            
            // Adiciona ao container principal
            container.appendChild(block);
        }

        // ====== 5. ADICIONA OUVINTES DE CLIQUE NOS CARDS ======
        // Usa delegação: um único ouvinte para todos os cards
        container.addEventListener('click', (e) => {
            // ====== SE CLICA NO BOTÃO "COMPRAR" (abre overlay) ======
            if (e.target.closest('.btn-abrir-detalhes')) {
                // Para a propagação
                e.stopPropagation();
                // Acha o card mais próximo
                const card = e.target.closest('.card');
                if (!card) return;
                
                // Fecha todos os cards
                container.querySelectorAll('.card').forEach((c) => {
                    c.classList.remove('ativo');
                });
                
                // Abre apenas este card (adiciona classe 'ativo')
                card.classList.add('ativo');
                return;
            }

            // ====== SE CLICA NO BOTÃO X (fecha overlay) ======
            if (e.target.closest('.close-detalhes')) {
                // Para a propagação
                e.stopPropagation();
                // Acha o card mais próximo
                const card = e.target.closest('.card');
                // Remove a classe 'ativo' (fecha o overlay)
                if (card) card.classList.remove('ativo');
                return;
            }

            // ====== SE CLICA NO BOTÃO "ADICIONAR AO CARRINHO" ======
            if (e.target.classList.contains('btn-comprar')) {
                // Para a propagação
                e.stopPropagation();
                
                // Pega o nome do curso do atributo data-nome
                const nome = e.target.dataset.nome;
                // Pega o preço do atributo data-preco e converte em número
                const preco = parseFloat(e.target.dataset.preco);
                
                // Adiciona o curso ao carrinho
                addToCart({ nome, preco });
                
                // Fecha o overlay
                const card = e.target.closest('.card');
                if (card) card.classList.remove('ativo');
            }
        });
    })
    // ====== TERCEIRA ETAPA: TRATAMENTO DE ERROS ======
    .catch((error) => {
        // Mostra o erro no console (para desenvolvedores)
        console.error('Erro:', error);
        // Mostra um alerta para o usuário
        alert('Erro ao carregar cursos. Verifique se cursos.json existe.');
    });
