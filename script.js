// CONFIGURAÇÕES DO MOTOR GRÁFICO (CANVAS 2D)
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Estados Globais
let carbonoRetido = 0;
let tratorCarregado = false; // Se coletou os grãos e precisa levar pro galpão

// Configuração do Trator (Jogador)
const trator = {
    x: 100,
    y: 200,
    width: 32,
    height: 32,
    speed: 4,
    color: '#d32f2f' // Vermelho Maquinário
};

// Configuração do Lote de Terra
const loteTerra = {
    x: 350,
    y: 150,
    width: 80,
    height: 80,
    status: 'vazio', // vazio -> plantado -> pronto
    progresso: 0
};

// Configuração do Galpão de Descarga (Cooperativa)
const galpao = {
    x: 40,
    y: 20,
    width: 90,
    height: 65
};

// Captura de Teclado
const keys = {};
window.addEventListener('keydown', e => keys[e.key] = true);
window.addEventListener('keyup', e => keys[e.key] = false);

// Ouvintes de Telas
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');

document.getElementById('btn-start').addEventListener('click', iniciarMotorJogo);
document.getElementById('btn-what-is').addEventListener('click', () => document.getElementById('info-panel').classList.remove('hidden'));
document.getElementById('btn-close-info').addEventListener('click', () => document.getElementById('info-panel').classList.add('hidden'));
document.getElementById('btn-finish-sim').addEventListener('click', encerrarTurno);
document.getElementById('btn-restart').addEventListener('click', () => location.reload());

function iniciarMotorJogo() {
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    
    // Inicia o Loop Principal do Jogo (Roda a 60 frames por segundo)
    requestAnimationFrame(loopJogo);

    // Ciclo de Crescimento automático da Plantação
    setInterval(() => {
        if (loteTerra.status === 'plantado') {
            loteTerra.progresso += 10;
            if (loteTerra.progresso >= 100) {
                loteTerra.status = 'pronto';
                document.getElementById('log-text').innerText = "🌾 O milho está maduro! Dirija até lá e aperte ESPAÇO para colher!";
            }
        }
    }, 500);
}

// CAPTURA A TECLA ESPAÇO PARA INTERAÇÃO
window.addEventListener('keydown', e => {
    if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        verificarInteracao();
    }
});

// FISICA DE MOVIMENTAÇÃO DO TRATOR
function atualizarFisica() {
    // Mover para Esquerda
    if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
        trator.x -= trator.speed;
        if (trator.x < 0) trator.x = 0;
    }
    // Mover para Direita
    if (keys['ArrowRight'] || keys['d'] || keys['D']) {
        trator.x += trator.speed;
        if (trator.x > canvas.width - trator.width) trator.x = canvas.width - trator.width;
    }
    // Mover para Cima
    if (keys['ArrowUp'] || keys['w'] || keys['W']) {
        trator.y -= trator.speed;
        if (trator.y < 0) trator.y = 0;
    }
    // Mover para Baixo
    if (keys['ArrowDown'] || keys['s'] || keys['S']) {
        trator.y += trator.speed;
        if (trator.y > canvas.height - trator.height) trator.y = canvas.height - trator.height;
    }

    // Verifica se o trator carregado entrou no galpão para entregar os grãos
    if (tratorCarregado && checarColisao(trator, galpao)) {
        tratorCarregado = false;
        carbonoRetido += 50;
        document.getElementById('hud-co2').innerText = `${carbonoRetido} t`;
        document.getElementById('hud-grains').innerText = "0/1";
        document.getElementById('log-text').innerText = "🚚 Grãos entregues! +50t de Carbono retidos com sucesso no subsolo!";
    }
}

// DETECTOR DE SENSOR DE COLISÃO
function checarColisao(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

// AÇÃO AO APERTAR ESPAÇO
function verificarInteracao() {
    if (checarColisao(trator, loteTerra)) {
        if (loteTerra.status === 'vazio' && !tratorCarregado) {
            loteTerra.status = 'plantado';
            loteTerra.progresso = 0;
            document.getElementById('log-text').innerText = "🌱 Sementes plantadas! Aguarde o crescimento.";
        } else if (loteTerra.status === 'pronto' && !tratorCarregado) {
            loteTerra.status = 'vazio';
            tratorCarregado = true;
            document.getElementById('hud-grains').innerText = "1/1 (Cheio)";
            document.getElementById('log-text').innerText = "🌾 Colheita feita! Pilote até o Galpão Azul no topo esquerdo para descarregar!";
        }
    }
}

// RENDERIZADOR GRÁFICO (DESENHO DOS ELEMENTOS NA TELA)
function desenharCenario() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Desenhar Galpão (Cooperativa)
    ctx.fillStyle = '#1565c0'; // Azul
    ctx.fillRect(galpao.x, galpao.y, galpao.width, galpao.height);
    ctx.fillStyle = '#ffffff';
    ctx.font = '11px sans-serif';
    ctx.fillText('🚚 GALPÃO', galpao.x + 15, galpao.y + 35);

    // 2. Desenhar Lote de Terra
    if (loteTerra.status === 'vazio') {
        ctx.fillStyle = '#795548'; // Marrom Terra
    } else if (loteTerra.status === 'plantado') {
        ctx.fillStyle = '#a1887f'; // Marrom claro com brotos
    } else {
        ctx.fillStyle = '#ffb300'; // Amarelo Milho Maduro
    }
    ctx.fillRect(loteTerra.x, loteTerra.y, loteTerra.width, loteTerra.height);
    
    // Texto descritivo da terra
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px sans-serif';
    if(loteTerra.status === 'plantado') {
        ctx.fillText(`Crescendo: ${loteTerra.progresso}%`, loteTerra.x + 5, loteTerra.y + 45);
    } else {
        ctx.fillText(loteTerra.status.toUpperCase(), loteTerra.x + 15, loteTerra.y + 45);
    }

    // 3. Desenhar o Trator (Jogador)
    ctx.fillStyle = trator.color;
    ctx.fillRect(trator.x, trator.y, trator.width, trator.height);
    
    // Desenhar pequenas rodas pretas no trator para dar identidade visual 2D
    ctx.fillStyle = '#000000';
    ctx.fillRect(trator.x - 2, trator.y + 4, 4, 8);
    ctx.fillRect(trator.x + trator.width - 2, trator.y + 4, 4, 8);
    ctx.fillRect(trator.x - 2, trator.y + 20, 4, 8);
    ctx.fillRect(trator.x + trator.width - 2, trator.y + 20, 4, 8);

    // Detalhe de carga se estiver carregado
    if(tratorCarregado) {
        ctx.fillStyle = '#ffea00';
        ctx.fillRect(trator.x + 8, trator.y + 8, 16, 16);
    }
}

// LOOP INFINITO DE CORRIDA 2D
function loopJogo() {
    atualizarFisica();
    desenharCenario();
    requestAnimationFrame(loopJogo);
}

// SISTEMA DE AUDITORIA FINAL
function encerrarTurno() {
    gameScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');
    document.getElementById('res-co2').innerText = carbonoRetido;

    const txtRank = document.getElementById('rank-message');
    if (carbonoRetido >= 150) {
        txtRank.innerHTML = "🏆 <strong>Piloto Nota 10 - Agrinho!</strong><br>Excelente pilotagem! Você dominou o circuito rural, evitou emissões desnecessárias e recolheu toneladas de carbono puro de forma sustentável!";
    } else if (carbonoRetido >= 50) {
        txtRank.innerHTML = "🌱 <strong>Operador Regular!</strong><br>Bom trabalho ao volante. Conseguiu realizar entregas na cooperativa, mas pilote com mais agilidade no próximo ano agrícola para faturar mais!";
    } else {
        txtRank.innerHTML = "⚠️ <strong>Manejo Lento!</strong><br>O trator ficou parado ou faltou descarregar os grãos no galpão azul. Jogue novamente para dominar o teclado e ajudar a ecofazenda!";
    }
}
