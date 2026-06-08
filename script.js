// Banco de dados com os cenários temáticos do jogo
const cenarios = [
    {
        titulo: "Rodada 1: Preparo do Solo e Maquinário",
        desc: "Os fazendeiros precisam preparar a terra para a próxima safra. Qual trator e método de manejo escolher para não poluir?",
        icone: "fa-tractor",
        opcoes: {
            A: {
                texto: "🚜 Arado Turbinado: Passar máquinas pesadas para revirar profundamente a terra de uma vez.",
                carbono: 10,
                feedback: "Muuu! Os animais sentiram o calor. Revirar o solo com máquinas pesadas expõe a terra e joga o carbono guardado direto para a atmosfera!"
            },
            B: {
                texto: "🌱 Plantio Direto: Usar semeadoras leves para perfurar apenas o local exato da semente sobre a palha.",
                carbono: 50,
                feedback: "Excelente! As colheitadeiras e tratores leves economizam combustível e a palha antiga retém a umidade e o carbono no chão!"
            }
        }
    },
    {
        titulo: "Rodada 2: Escoamento e Transporte",
        desc: "Caminhões carregados de grãos precisam levar a colheita até a cooperativa. Como otimizar essa logística?",
        icone: "fa-truck-field",
        opcoes: {
            A: {
                texto: "🌳 Agrofloresta e Logística Verde: Plantar linhas de árvores na fazenda e usar caminhões com biocombustível.",
                carbono: 60,
                feedback: "Sensacional! As árvores criam corredores ecológicos que capturam o CO₂ dos escapamentos. Os caminhoneiros e a natureza agradecem!"
            },
            B: {
                texto: "🌾 Transporte Tradicional: Rodar com os caminhões antigos sem manutenção e queimar o capim seco das margens.",
                carbono: 15,
                feedback: "Bah... Caminhões desregulados soltam fumaça preta cheia de fuligem, e queimar o mato joga toneladas de gases poluentes no ar."
            }
        }
    },
    {
        titulo: "Rodada 3: Manejo Pós-Colheita",
        desc: "As colheitadeiras terminaram o trabalho e o campo de cultivo está vazio. Qual a melhor decisão antes que o inverno chegue?",
        icone: "fa-user-wheat",
        opcoes: {
            A: {
                texto: "🟤 Campo Deserto: Deixar o solo exposto ao vento e à chuva até a próxima primavera.",
                carbono: 5,
                feedback: "Ah não... Sem plantas, o vento forte leva a camada fértil embora e o carbono precioso escapa do solo desprotegido."
            },
            B: {
                texto: "🌿 Plantas de Cobertura: Colocar os fazendeiros para plantar braquiária ou crotalária para proteger a terra.",
                carbono: 45,
                feedback: "Isso aí! Raízes vivas continuam alimentando os microrganismos do solo e estocam o carbono de forma 100% natural!"
            }
        }
    }
];

// Estado interno da partida
let rodadaAtual = 0;
let totalCarbono = 0;

// Elementos HTML capturados do DOM
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');

const btnStart = document.getElementById('btn-start');
const btnNext = document.getElementById('btn-next');
const btnRestart = document.getElementById('btn-restart');

const txtCurrentRound = document.getElementById('current-round');
const txtCarbonScore = document.getElementById('carbon-score');
const txtScenTitle = document.getElementById('scenario-title');
const txtScenDesc = document.getElementById('scenario-desc');
const iconScen = document.getElementById('scen-icon');

const btnChoiceA = document.getElementById('choice-a');
const btnChoiceB = document.getElementById('choice-b');
const feedbackBox = document.getElementById('feedback-box');
const txtFeedback = document.getElementById('feedback-text');

// Registro dos ouvintes de eventos (Cliques)
btnStart.addEventListener('click', iniciarJogo);
btnChoiceA.addEventListener('click', () => fazerEscolha('A'));
btnChoiceB.addEventListener('click', () => fazerEscolha('B'));
btnNext.addEventListener('click', avancarRodada);
btnRestart.addEventListener('click', reiniciarJogo);

function iniciarJogo() {
    startScreen.classList.add('hidden');
    endScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    rodadaAtual = 0;
    totalCarbono = 0;
    carregarRodada();
}

function carregarRodada() {
    feedbackBox.classList.add('hidden');
    btnChoiceA.disabled = false;
    btnChoiceB.disabled = false;

    txtCurrentRound.innerText = `${rodadaAtual + 1}/${cenarios.length}`;
    txtCarbonScore.innerText = `${totalCarbono} t`;

    const dadosCenario = cenarios[rodadaAtual];
    txtScenTitle.innerText = dadosCenario.titulo;
    txtScenDesc.innerText = dadosCenario.desc;
    
    // Altera dinamicamente o ícone central da pergunta
    iconScen.className = `fa-solid ${dadosCenario.icone}`;

    btnChoiceA.innerText = dadosCenario.opcoes.A.texto;
    btnChoiceB.innerText = dadosCenario.opcoes.B.texto;
}

function fazerEscolha(opcao) {
    btnChoiceA.disabled = true;
    btnChoiceB.disabled = true;

    const escolha = cenarios[rodadaAtual].opcoes[opcao];
    totalCarbono += escolha.carbono;

    txtCarbonScore.innerText = `${totalCarbono} t`;
    txtFeedback.innerHTML = escolha.feedback;
    feedbackBox.classList.remove('hidden');
}

function avancarRodada() {
    rodadaAtual++;
    if (rodadaAtual < cenarios.length) {
        carregarRodada();
    } else {
        mostrarFimDeJogo();
    }
}

function mostrarFimDeJogo() {
    gameScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');

    document.getElementById('total-carbon').innerText = totalCarbono;

    const txtRank = document.getElementById('rank-message');
    if (totalCarbono >= 145) {
        txtRank.innerHTML = "🏆 <strong>Super Fazenda Carbono Zero!</strong><br>Incrível! Seus fazendeiros operaram colheitadeiras e caminhões com máxima eficiência ecológica. O solo está rico e o ar puríssimo!";
    } else if (totalCarbono >= 80) {
        txtRank.innerHTML = "🌱 <strong>Operador Consciente!</strong><br>Bom trabalho! Suas escolhas ajudaram a conter parte dos gases poluentes. Tente investir mais em plantio direto na próxima!";
    } else {
        txtRank.innerHTML = "⚠️ <strong>Alerta de Emissões Altos!</strong><br>Ih! As chaminés dos caminhões e o solo desprotegido deixaram a nossa maquete cinza. Que tal tentar de novo com tecnologia limpa?";
    }
}

function reiniciarJogo() {
    iniciarJogo();
}
