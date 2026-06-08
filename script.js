// CONFIGURAÇÕES DO MOTOR GRÁFICO THREE.JS 3D
let cena, camera, renderizador;
let tratorMesh, loteMesh, galpaoMesh;
let obstaculos = []; // Array de árvores para colisão sólida

// Variáveis de Estado da Partida
let carbonoRetido = 0;
let tratorCarregado = false;
let tempoRestante = 60;
let loopCronometro;
let jogoAtivo = false;

// Parâmetros Físicos dos Objetos (Caixas delimitadoras para cálculo de colisão 3D)
let tratorBox = new THREE.Box3();
let loteBox = new THREE.Box3();
let galpaoBox = new THREE.Box3();

// Configurações do Movimento do Trator
const tratorDados = { x: 0, z: 0, velocidade: 0.15, tamanho: 1.5 };
const limitesCampo = 18; // Tamanho do gramado quadrado

// Captura do Teclado
const keys = {};
window.addEventListener('keydown', e => keys[e.key] = true);
window.addEventListener('keyup', e => keys[e.key] = false);

// Captura de Elementos de Interface
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');

document.getElementById('btn-start').addEventListener('click', iniciarSimulador3D);
document.getElementById('btn-what-is').addEventListener('click', () => document.getElementById('info-panel').classList.remove('hidden'));
document.getElementById('btn-close-info').addEventListener('click', () => document.getElementById('info-panel').classList.add('hidden'));
document.getElementById('btn-restart').addEventListener('click', () => location.reload());

// CONFIGURAÇÃO INICIAL E MONTAGEM DO MUNDO 3D
function iniciarSimulador3D() {
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    jogoAtivo = true;

    // 1. Criando a Cena
    cena = new THREE.Scene();
    cena.background = new THREE.Color('#a0e0ff'); // Céu Azul claro

    // 2. Criando a Câmera Perspectiva (Visão de Cima/Isométrica)
    const container = document.getElementById('canvas3d-container');
    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 20, 25);
    camera.lookAt(0, 0, 0);

    // 3. Renderizador WebGL
    renderizador = new THREE.WebGLRenderer({ antialias: true });
    renderizador.setSize(container.clientWidth, container.clientHeight);
    renderizador.shadowMap.enabled = true;
    container.appendChild(renderizador.domElement);

    // 4. Iluminação do Ambiente Rural
    const luzAmbiente = new THREE.AmbientLight(0xffffff, 0.6);
    cena.add(luzAmbiente);

    const luzSol = new THREE.DirectionalLight(0xffffff, 0.8);
    luzSol.position.set(10, 20, 10);
    cena.add(luzSol);

    // 5. Construindo o Chão / Gramado
    const chaoGeo = new THREE.PlaneGeometry(limitesCampo * 2, limitesCampo * 2);
    const chaoMat = new THREE.MeshStandardMaterial({ color: '#55b659', side: THREE.DoubleSide });
    const chaoMesh = new THREE.Mesh(chaoGeo, chaoMat);
    chaoMesh.rotation.x = Math.PI / 2;
    cena.add(chaoMesh);

    // 6. Construindo o Trator 3D (Cubo Vermelho com Cabine Branca)
    const tratorGrupo = new THREE.Group();
    
    const corpoGeo = new THREE.BoxGeometry(tratorDados.tamanho, 1, tratorDados.tamanho * 1.5);
    const corpoMat = new THREE.MeshStandardMaterial({ color: '#d32f2f' });
    const corpo = new THREE.Mesh(corpoGeo, corpoMat);
    corpo.position.y = 0.5;
    tratorGrupo.add(corpo);

    const cabineGeo = new THREE.BoxGeometry(tratorDados.tamanho * 0.8, 0.8, tratorDados.tamanho * 0.8);
    const cabineMat = new THREE.MeshStandardMaterial({ color: '#ffffff' });
    const cabine = new THREE.Mesh(cabineGeo, cabineMat);
    cabine.position.set(0, 1.4, -0.2);
    tratorGrupo.add(cabine);

    tratorMesh = tratorGrupo;
    cena.add(tratorMesh);

    // 7. Construindo o Lote de Terra (Placa marrom rentes ao chão)
    const loteGeo = new THREE.BoxGeometry(4, 0.1, 4);
    const loteMat = new THREE.MeshStandardMaterial({ color: '#795548' });
    loteMesh = new THREE.Mesh(loteGeo, loteMat);
    loteMesh.position.set(8, 0.05, 4);
    cena.add(loteMesh);

    // 8. Construindo o Galpão / Cooperativa 3D (Grande Bloco Azul)
    const galpaoGeo = new THREE.BoxGeometry(5, 4, 4);
    const galpaoMat = new THREE.MeshStandardMaterial({ color: '#1565c0' });
    galpaoMesh = new THREE.Mesh(galpaoGeo, galpaoMat);
    galpaoMesh.position.set(-10, 2, -10);
    cena.add(galpaoMesh);

    // 9. Injetando Obstáculos / Árvores de Agrofloresta pelo mapa
    criarArvoreObstaculo(-4, 5);
    criarArvoreObstaculo(5, -6);
    criarArvoreObstaculo(10, -2);
    criarArvoreObstaculo(-8, 6);

    // Inicializando Loops de Execução
    dispararCronometro();
    requestAnimationFrame(loopPrincipal3D);
}

// CONSTRUTOR DE ÁRVORES 3D (Tronco Cilíndrico + Copa Esférica)
function criarArvoreObstaculo(x, z) {
    const arvoreGrupo = new THREE.Group();

    // Tronco
    const troncoGeo = new THREE.CylinderGeometry(0.3, 0.4, 2, 8);
    const troncoMat = new THREE.MeshStandardMaterial({ color: '#5d4037' });
    const tronco = new THREE.Mesh(troncoGeo, troncoMat);
    tronco.position.y = 1;
    arvoreGrupo.add(tronco);

    // Folhas (Copa)
    const folhasGeo = new THREE.SphereGeometry(1.2, 8, 8);
    const folhasMat = new THREE.MeshStandardMaterial({ color: '#1b5e20' });
    const folhas = new THREE.Mesh(folhasGeo, folhasMat);
    folhas.position.y = 2.4;
    arvoreGrupo.add(folhas);

    arvoreGrupo.position.set(x, 0, z);
    cena.add(arvoreGrupo);

    // Adiciona uma caixa de colisão invisível para travar o trator
    const boxColisao = new THREE.Box3().setFromObject(arvoreGrupo);
    obstaculos.push(boxColisao);
}

// SISTEMA DE CRONÔMETRO
function dispararCronometro() {
    loopCronometro = setInterval(() => {
        tempoRestante--;
        document.getElementById('hud-timer').innerText = `${tempoRestante}s`;

        if (tempoRestante <= 0) {
            finalizarSimulacao3D();
        }
    }, 1000);
}

// CAPTURA DA TECLA ESPAÇO PARA TRABALHO DE CAMPO
window.addEventListener('keydown', e => {
    if ((e.key === ' ' || e.key === 'Spacebar') && jogoAtivo) {
        e.preventDefault();
        processarAcaoEspaco();
    }
});

// PROCESSADOR DE INTERAÇÕES RURAIS
let estagioPlanta = 'vazio'; // vazio -> plantado -> pronto
let progressoPlanta = 0;
let loopCrescimentoPlanta;

function processarAcaoEspaco() {
    tratorBox.setFromObject(tratorMesh);
    loteBox.setFromObject(loteMesh);

    if (tratorBox.intersectsBox(loteBox)) {
        if (estagioPlanta === 'vazio' && !tratorCarregado) {
            estagioPlanta = 'plantado';
            progressoPlanta = 0;
            loteMesh.material.color.set('#a1887f'); // Muda cor para terra úmida
            document.getElementById('log-text').innerText = "🌱 Sementes plantadas em 3D! Espere o milho crescer.";

            // Simula o crescimento
            loopCrescimentoPlanta = setInterval(() => {
                progressoPlanta += 25;
                if (progressoPlanta >= 100) {
                    clearInterval(loopCrescimentoPlanta);
                    estagioPlanta = 'pronto';
                    loteMesh.material.color.set('#ffb300'); // Fica amarelo milho
                    document.getElementById('log-text').innerText = "🌾 Campo Maduro! Vá até lá e aperte ESPAÇO para colher!";
                }
            }, 1000);
        } else if (estagioPlanta === 'pronto' && !tratorCarregado) {
            estagioPlanta = 'vazio';
            tratorCarregado = true;
            loteMesh.material.color.set('#795548'); // Volta para marrom
            document.getElementById('hud-grains').innerText = "Grãos (1/1)";
            document.getElementById('log-text').innerText = "🚜 Colheita Concluída! Leve a carga até o Galpão Azul.";
            
            // Adiciona um bloco amarelo visual no topo do trator representando a carga física
            const blocoCargaGeo = new THREE.BoxGeometry(0.8, 0.4, 0.8);
            const blocoCargaMat = new THREE.MeshStandardMaterial({ color: '#ffea00' });
            const blocoCarga = new THREE.Mesh(blocoCargaGeo, blocoCargaMat);
            blocoCarga.name = "blocoDeCarga"; // Tag identificadora corrigida
            blocoCarga.position.set(0, 2.2, -0.2);
            tratorMesh.add(blocoCarga);
        }
    }
}

// ENGINE DE MOVIMENTAÇÃO E VERIFICAÇÃO DE COLISÕES
function atualizarFisica3D() {
    // Armazena posições antigas caso haja colisão (recuo mecânico)
    const antigaX = tratorMesh.position.x;
    const antigaZ = tratorMesh.position.z;

    // Entrada de comandos direcionais
    if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
        tratorMesh.position.x -= tratorDados.velocidade;
        tratorMesh.rotation.y = Math.PI / 2; // Gira visual do trator para a direção
    }
    if (keys['ArrowRight'] || keys['d'] || keys['D']) {
        tratorMesh.position.x += tratorDados.velocidade;
        tratorMesh.rotation.y = -Math.PI / 2;
    }
    if (keys['ArrowUp'] || keys['w'] || keys['W']) {
        tratorMesh.position.z -= tratorDados.velocidade;
        tratorMesh.rotation.y = 0;
    }
    if (keys['ArrowDown'] || keys['s'] || keys['S']) {
        tratorMesh.position.z += tratorDados.velocidade;
        tratorMesh.rotation.y = Math.PI;
    }

    // Travamento de barreiras invisíveis nas bordas da fazenda
    if (Math.abs(tratorMesh.position.x) > limitesCampo) tratorMesh.position.x = antigaX;
    if (Math.abs(tratorMesh.position.z) > limitesCampo) tratorMesh.position.z = antigaZ;

    // Atualiza a caixa de colisão móvel do trator
    tratorBox.setFromObject(tratorMesh);

    // SISTEMA DE DETECÇÃO DE COLISÃO SÓLIDA CONTRA AS ÁRVORES
    for (let i = 0; i < obstaculos.length; i++) {
        if (tratorBox.intersectsBox(obstaculos[i])) {
            // Se colidir com o tronco, anula o movimento forçando a voltar para a coordenada anterior
            tratorMesh.position.x = antigaX;
            tratorMesh.position.z = antigaZ;
