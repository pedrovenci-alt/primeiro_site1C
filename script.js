// CONFIGURAÇÕES DO MOTOR GRÁFICO (CANVAS ISOMÉTRICO NATIVO)
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Estados Globais
let carbonoRetido = 0;
let tratorCarregado = false;
let tempoRestante = 60;
let loopCronometro;
let jogoAtivo = false;

// Configuração do Trator (Jogador)
const trator = {
    x: 150,
    y: 150,
    width: 32,
    height: 32,
    speed: 4,
    color: '#d32f2f'
};

// Configuração do Lote de Terra
const loteTerra = {
    x: 400,
    y: 200,
    width: 80,
    height: 80,
    status: 'vazio', // vazio -> plantado -> pronto
    progresso: 0
};

// Configuração do Galpão de Descarga (Cooperativa)
const galpao = {
    x: 20,
    y: 20,
    width: 90,
    height: 70
};

// Array de Árvores (Obstáculos de Agrofloresta)
const arvores = [
    { x: 120, y: 250, r: 15 },
    { x: 300, y: 80, r: 15 },
    { x: 450, y: 70, r: 15 },
    { x: 280, y: 280, r: 15 }
];

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
    jogoAtivo = true;
    
    // Inicia o loop gráfico a 60 fps
    requestAnimationFrame(loopJogo);

    // Cronômetro regressivo
    loopCronometro = setInterval(() => {
        tempoRestante--;
        document.getElementById('hud-timer').innerText = `${tempoRestante}s`;
        if (tempoRestante <= 0) encerrarTurno();
    }, 1000);

    // Ciclo de Crescimento da Plantação
    setInterval(() => {
        if (loteTerra.status === 'plantado') {
            loteTerra.progresso += 20;
            if (loteTerra.progresso >= 100) {
                loteTerra.status = 'pronto';
                document.getElementById('log-text').innerText = "🌾 O milho cresceu! Pare o trator em cima e aperte ESPAÇO para colher!";
            }
        }
    }, 1000);
}

// CAPTURA A TECLA ESPAÇO PARA INTERAÇÃO
window.addEventListener('keydown', e => {
    if ((e.key === ' ' || e.key === 'Spacebar') && jogoAtivo) {
        e.preventDefault();
        verificarInteracao();
    }
});

// DETECTOR DE COLISÃO DO RETÂNGULO
function checarColisao(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

// DETECTOR DE COLISÃO DO TRATOR CONTRA ÁRVORE (CÍRCULO)
function checarColisaoCirculo(ret, circ) {
    let proxX = Math.max(circ.x, Math.min(ret.x, ret.x + ret.width));
    let proxY = Math.max(circ.y, Math.min(ret.y, ret.y + ret.height));
    let distX = circ.x - proxX;
    let distY = circ.y - proxY;
    return (distX * distX + distY * distY) < (circ.r * circ.r);
}

// ATUALIZAÇÃO DOS COMANDOS DO TECLADO
function atualizarFisica() {
    const antigaX = trator.x;
    const antigaY = trator.y;

    if (keys['ArrowLeft'] || keys['a'] || keys['A']) trator.x -= trator.speed;
    if (keys['ArrowRight'] || keys['d'] || keys['D']) trator.x += trator.speed;
    if (keys['ArrowUp'] || keys['w'] || keys['W']) trator.y -= trator.speed;
    if (keys['ArrowDown'] || keys['s'] || keys['S']) trator.y += trator.speed;

    // Bloqueia saída das bordas do Canvas
    if (trator.x < 0 || trator.x > canvas.width - trator.width) trator.x = antigaX;
    if (trator.y < 0 || trator.y > canvas.height - trator.height) trator.y = antigaY;

    // Checa colisão com as árvores de Agrofloresta
    for (let i = 0; i < arvores.length; i++) {
        if (checarColisaoCirculo(trator, arvores[i])) {
            trator.x = antigaX;
            trator.y = antigaY;
            document.getElementById('log-text').innerText = "💥 Colisão! Você bateu em uma árvore de proteção ambiental!";
        }
    }

    // Checa entrega automática no galpão azul
    if (tratorCarregado && checarColisao(trator, galpao)) {
        tratorCarregado = false;
        carbonoRetido += 50;
        document.getElementById('hud-co2').innerText = `${carbonoRetido} t`;
        document.getElementById('hud-grains').innerText = "Vazio";
        document.getElementById('log-text').innerText = "🚚 Carga entregue no Silo! +50t de CO₂ capturadas com sucesso!";
    }
}

// AÇÃO DO BOTÃO ESPAÇO
function verificarInteracao() {
    if (checarColisao(trator, loteTerra)) {
        if (loteTerra.status === 'vazio' && !tratorCarregado) {
            loteTerra.status = 'plantado';
            loteTerra.progresso = 0;
            document.getElementById('log-text').innerText = "🌱 Sementes plantadas! Aguarde o milho crescer.";
        } else if (loteTerra.status === 'pronto' && !tratorCarregado) {
            loteTerra.status = 'vazio';
            tratorCarregado = true;
            document.getElementById('hud-grains').innerText = "Grãos (1/1)";
            document.getElementById('log-text').innerText = "🌾 Colheita feita! Dirija até o Galpão Azul no topo esquerdo.";
        }
    }
}

// DESENHO EM PERSPECTIVA ISOMÉTRICA (EFEITO 3D SEM BIBLIOTECA)
function desenharCenario() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Desenhar Galpão (Estrutura com volume 3D)
    ctx.fillStyle = '#0d47a1'; // Sombra do galpão
    ctx.fillRect(galpao.x + 4, galpao.y + 4, galpao.width, galpao.height);
    ctx.fillStyle = '#1565c0'; // Frente do galpão
    ctx.fillRect(galpao.x, galpao.y, galpao.width, galpao.height);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('🚚 COOPERATIVA', galpao.x + 5, galpao.y + 40);

    // 2. Desenhar Lote de Terra
    if (loteTerra.status === 'vazio') ctx.fillStyle = '#5d4037';
    else if (loteTerra.status === 'plantado') ctx.fillStyle = '#8d6e63';
    else ctx.fillStyle = '#ffb300'; // Amarelo milho
    ctx.fillRect(loteTerra.x, loteTerra.y, loteTerra.width, loteTerra.height);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '11px sans-serif';
    if(loteTerra.status === 'plantado') {
        ctx.fillText(`Milho: ${loteTerra.progresso}%`, loteTerra.x + 12, loteTerra.y + 45);
    } else {
        ctx.fillText(loteTerra.status.toUpperCase(), loteTerra.x + 22, loteTerra.y + 45);
    }

    // 3. Desenhar Árvores de Agrofloresta (Tronco + Copa com relevo)
    arvores.forEach(a => {
        // Sombra
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        ctx.beginPath(); ctx.arc(a.x + 3, a.y + 3, a.r, 0, Math.PI * 2); ctx.fill();
        // Tronco
        ctx.fillStyle = '#3e2723';
        ctx.fillRect(a.x - 3, a.y, 6, 12);
        // Copa das folhas
        ctx.fillStyle = '#1b5e20';
        ctx.beginPath(); ctx.arc(a.x, a.y - 4, a.r, 0, Math.PI * 2); ctx.fill();
    });

    // 4. Desenhar o Trator do Jogador (Com relevo e carga)
    ctx.fillStyle = '#212121'; // Sombra das rodas
    ctx.fillRect(trator.x - 2, trator.y + 2, trator.width + 4, trator.height + 4);
    
    ctx.fillStyle = trator.color; // Corpo Vermelho
    ctx.fillRect(trator.x, trator.y, trator.width, trator.height);

    ctx.fillStyle = '#ffffff'; // Cabine
    ctx.fillRect(trator.x + 6, trator.y + 6, trator.width - 12, trator.height - 18);

    // Desenhar a Carga de Grãos Amarela se estiver cheia
    if (tratorCarregado) {
        ctx.fillStyle = '#ffea00';
        ctx.fillRect(trator.x + 8, trator.y + 18, 16, 10);
    }
}

// LOOP GRÁFICO CONSTANTE
function loopJogo() {
    if (!jogoAtivo) return;
    atualizarFisica();
    desenharCenario();
    requestAnimationFrame(loopJogo);
}

// TELA DE RESULTADOS DA AUDITORIA
function encerrarTurno() {
    jogoAtivo = false;
    clearInterval(loopCronometro);
    gameScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');
    document.getElementById('res-co2').innerText = carbonoRetido;

    const txtRank = document.getElementById('rank-message');
    if (carbonoRetido >= 150) {
        txtRank.innerHTML = "🏆 <strong>Piloto Nota 10 - Agrinho!</strong><br>Excelente pilotagem! Você dominou o circuito rural, evitou emissões desnecessárias e recolheu toneladas de carbono de forma sustentável!";
    } else if (carbonoRetido >= 50) {
        txtRank.innerHTML = "🌱 <strong>Operador Regular!</strong><br>Bom trabalho ao volante. Conseguiu realizar entregas na cooperativa, mas pilote com mais agilidade na próxima para render mais.";
    } else {
        txtRank.innerHTML = "⚠️ <strong>Manejo Lento!</strong><br>O tempo esgotou e faltou entregar os grãos no galpão azul. Jogue novamente para dominar o teclado e ajudar a ecofazenda!";
    }
}
