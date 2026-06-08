// VARIÁVEIS DE ESTADO DO SIMULADOR (FARMING ENGINE)
let dinheiro = 500;
let graosEstoque = 0;
let carbonoRetido = 0;

let temBiocombustivel = false;
let ajudantesContratados = 0;
let arvoresAgrofloresta = 0;

let estagioCampo = "vazio"; // vazio -> plantado -> crescendo -> pronto
let progressoCrescimento = 0;
let loopCrescimento = null;

// Capturando Elementos da Interface
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');

// Componentes do HUD
const hudMoney = document.getElementById('hud-money');
const hudGrains = document.getElementById('hud-grains');
const hudCo2 = document.getElementById('hud-co2');
const fieldStatusText = document.getElementById('field-text-status');
const cropProgressBar = document.getElementById('crop-progress-bar');
const logText = document.getElementById('log-text');

// Botões Operacionais
const btnPlant = document.getElementById('btn-plant');
const btnHarvest = document.getElementById('btn-harvest');
const btnSell = document.getElementById('btn-sell');

// Botões de Loja/Upgrade
const btnBuyBiofuel = document.getElementById('btn-buy-biofuel');
const btnBuyFarmer = document.getElementById('btn-buy-farmer');
const btnBuyTrees = document.getElementById('btn-buy-trees');

// Elementos Visuais do Cenário de Fundo
const animTruck = document.getElementById('anim-truck');
const animHarvester = document.getElementById('anim-harvester');
const animFarmer1 = document.getElementById('anim-farmer1');
const animFarmer2 = document.getElementById('anim-farmer2');

// Ouvintes de Telas Informativas (Manual)
document.getElementById('btn-what-is').addEventListener('click', () => abrirPainelInfo(1));
document.getElementById('btn-tips').addEventListener('click', () => abrirPainelInfo(2));
document.getElementById('btn-close-info').addEventListener('click', () => document.getElementById('info-panel').classList.add('hidden'));

// Ouvintes de Ação do Jogo
document.getElementById('btn-start').addEventListener('click', ligarSimulador);
btnPlant.addEventListener('click', executarSemeadura);
btnHarvest.addEventListener('click', executarColheita);
btnSell.addEventListener('click', executarEscoamento);

// Ouvintes de Compra de Melhorias
btnBuyBiofuel.addEventListener('click', adquirirBiocombustivel);
btnBuyFarmer.addEventListener('click', adquirirAjudante);
btnBuyTrees.addEventListener('click', adquirirAgrofloresta);
document.getElementById('btn-finish-sim').addEventListener('click', finalizarSimulador);
document.getElementById('btn-restart').addEventListener('click', () => { location.reload(); });

// INICIALIZADOR DO SIMULADOR
function ligarSimulador() {
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    atualizarPainelHUD();
    
    // Geração passiva de carbono por Agrofloresta (Ciclo Automático)
    setInterval(() => {
        if(arvoresAgrofloresta > 0) {
            carbonoRetido += arvoresAgrofloresta * 2;
            atualizarPainelHUD();
        }
    }, 3000);
}

// LOG DE EVENTOS
function registrarLog(mensagem) {
    logText.innerText = "🚜 " + mensagem;
}

// ATUALIZAÇÃO HUD
function atualizarPainelHUD() {
    hudMoney.innerText = `R$ ${dinheiro}`;
    hudGrains.innerText = `${graosEstoque} kg`;
    hudCo2.innerText = `${carbonoRetido} t`;

    // Atualiza travas dos botões de compra baseados em dinheiro
    btnBuyBiofuel.disabled = temBiocombustivel || dinheiro < 200;
    btnBuyFarmer.disabled = ajudantesContratados >= 2 || dinheiro < 300;
    btnBuyTrees.disabled = dinheiro < 150;
}

// MECÂNICA 1: SEMEADURA (PLANTAR)
function executarSemeadura() {
    if (estagioCampo !== "vazio") return;

    estagioCampo = "crescendo";
    btnPlant.disabled = true;
    fieldStatusText.innerText = "🌱 As sementes estão germinando no subsolo...";
    registrarLog("Semeadoras em campo. Plantio Direto ativado para proteger o solo!");

    progressoCrescimento = 0;
    loopCrescimento = setInterval(() => {
        progressoCrescimento += 10;
        cropProgressBar.style.width = progressoCrescimento + "%";

        if (progressoCrescimento >= 100) {
            clearInterval(loopCrescimento);
            estagioCampo = "pronto";
            fieldStatusText.innerText = "🌾 O milho cresceu e está pronto para colheita!";
            btnHarvest.disabled = false;
            registrarLog("Plantação madura! Ligue a colheitadeira.");
        }
    }, 400);
}

// MECÂNICA 2: COLHEITA
function executarColheita() {
    if (estagioCampo !== "pronto") return;

    animHarvester.classList.remove('hidden'); // Ativa animação 2D
    btnHarvest.disabled = true;
    
    setTimeout(() => {
        animHarvester.classList.add('hidden');
        estagioCampo = "vazio";
        graosEstoque += 500;
        
        // Penalidade Ecológica ou Bônus por Combustível
        if (temBiocombustivel) {
            carbonoRetido += 40;
            registrarLog("Colheita concluída com Biocombustível! +40t de CO₂ retidos.");
        } else {
            carbonoRetido += 10;
            registrarLog("Colheita feita com Diesel comum. Emissão alta de poluentes.");
        }

        cropProgressBar.style.width = "0%";
        fieldStatusText.innerText = "🪵 Solo vazio. Pronto para nova rotação de culturas.";
        btnSell.disabled = false;
        btnPlant.disabled = false;
        atualizarPainelHUD();

        // Automação: Se tiver ajudante, ele planta de novo sozinho!
        if(ajudantesContratados > 0) {
            setTimeout(executarSemeadura, 1000);
        }
    }, 2000);
}

// MECÂNICA 3: ESCOAMENTO (VENDER GRÃOS)
function executarEscoamento() {
    if (graosEstoque <= 0) return;

    animTruck.classList.remove('hidden'); // Ativa caminhão na rodovia
    btnSell.disabled = true;

    setTimeout(() => {
        animTruck.classList.add('hidden');
        let lucro = (graosEstoque / 500) * 350;
        dinheiro += lucro;
        graosEstoque = 0;

        registrarLog(`Safra vendida na Cooperativa! Faturamento de R$ ${lucro}.`);
        atualizarPainelHUD();
    }, 2000);
}

// UPGRADES DA LOJA
function adquirirBiocombustivel() {
    if(dinheiro >= 200 && !temBiocombustivel) {
        dinheiro -= 200;
        temBiocombustivel = true;
        registrarLog("Maquinários adaptados para Biodiesel. Menos fumaça no céu!");
        atualizarPainelHUD();
    }
}

function adquirirAjudante() {
    if(dinheiro >= 300 && ajudantesContratados < 2) {
        dinheiro -= 300;
        ajudantesContratados++;
        if(ajudantesContratados === 1) animFarmer1.classList.remove('hidden');
        if(ajudantesContratados === 2) animFarmer2.classList.remove('hidden');

        registrarLog("Novo colono contratado! Ele fará o plantio automático.");
        atualizarPainelHUD();
        if(estagioCampo === "vazio") executarSemeadura();
    }
}

function adquirirAgrofloresta() {
    if(dinheiro >= 150) {
        dinheiro -= 150;
        arvoresAgrofloresta++;
        carbonoRetido += 20; // Bônus imediato
        registrarLog(`Linha de árvores plantada! Sequestro passivo de CO₂ ativado.`);
        atualizarPainelHUD();
    }
}

// INSTRUÇÕES PEDAGÓGICAS
function abrirPainelInfo(tipo) {
    const panel = document.getElementById('info-panel');
    const title = document.getElementById('info-title');
    const content = document.getElementById('info-content');
    panel.classList.remove('hidden');

    if(tipo === 1) {
        title.innerHTML = "<i class='fa-solid fa-leaf'></i> Ciclo do Carbono Prático";
        content.innerHTML = "<p>O trator a diesel comum emite fumaça poluente. Ao comprar o <strong>Biocombustível</strong> ou plantar <strong>Árvores (Agrofloresta)</strong>, sua fazenda compensa as emissões das colheitadeiras e estoca o carbono no solo.</p>";
    } else {
        title.innerHTML = "<i class='fa-solid fa-book'></i> Estratégia de Lucro Sustentável";
        content.innerHTML = "<p>1. Clique em <strong>Plantar</strong> e aguarde a barra encher.<br>2. Use a <strong>Colheitadeira</strong> para gerar Grãos em estoque.<br>3. Envie o <strong>Caminhão</strong> para faturar dinheiro e reinvestir em automações ecológicas!</p>";
    }
}

// TELA FINAL: AUDITORIA
function finalizarSimulador() {
    if(loopCrescimento) clearInterval(loopCrescimento);
    gameScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');

    document.getElementById('res-co2').innerText = carbonoRetido;
    document.getElementById('res-money').innerText = dinheiro;
    document.getElementById('res-grains').innerText = carbonoRetido * 12; // Estimativa de produção total

    const txtRank = document.getElementById('rank-message');
    const icon = document.getElementById('end-icon');

    if (carbonoRetido >= 150) {
        icon.className = "fa-solid fa-medal giant-icon gold";
        txtRank.innerHTML = "🏆 <strong>Fazenda de Elite Agrinho 2026!</strong><br>Incrível! Você automatizou sua propriedade e mitigou as emissões dos caminhões com eficiência máxima. O campo prosperou 100% verde!";
    } else if (carbonoRetido >= 60) {
        icon.className = "fa-solid fa-wheat-awn giant-icon";
        txtRank.innerHTML = "🌱 <strong>Produtor Consciente!</strong><br>Ótimo gerenciamento! Suas colheitas renderam lucros, mas lembre-se de comprar mais árvores e biocombustível para limpar o escapamento dos caminhões.";
    } else {
        icon.className = "fa-solid fa-triangle-exclamation giant-icon";
        txtRank.innerHTML = "⚠️ <strong>Propriedade Multada por Emissões!</strong><br>A colheita pesada liberou mais gases do que o solo conseguiu reter. Tente jogar novamente investindo cedo em reflorestamento e combustíveis limpos!";
    }
}

