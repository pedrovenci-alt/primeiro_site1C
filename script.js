// Banco de dados com as rodadas do jogo
const cenarios = [
    {
        titulo: "Rodada 1: Preparo do Solo",
        desc: "Chegou o momento de preparar o terreno para a próxima safra de soja. O que você decide fazer?",
        icone: "fa-tractor",
        opcoes: {
            A: {
                texto: "A) Usar o Arado Tradicional: Revirar bem a terra para limpar tudo de forma rápida.",
                carbono: 10,
                feedback: "Putz! Revirar o solo expõe a matéria orgânica ao oxigênio, liberando muito CO₂ acumulado na atmosfera. Você ganhou pouquíssimo carbono sólido (10t)."
            },
            B: {
                texto: "B) Implementar Plantio Direto: Semear direto sobre a palhada da colheita anterior, protegendo o chão.",
                carbono: 50,
                feedback: "Excelente escolha! Manter o solo coberto evita a erosão e prende o carbono profundamente na terra! (+50t de CO₂ retidos)."
            }
        }
    },
    {
        titulo: "Rodada 2: Otimizando o Espaço",
        desc: "Você tem uma área de pastagem desgastada e quer melhorar a produtividade e a pegada ecológica da fazenda. Qual o plano?",
        icone: "fa-tree",
        opcoes: {
            A: {
                texto: "A) Sistema ILPF: Integrar fileiras de árvores nativas/eucaliptos junto com o pasto e o gado.",
                carbono: 60,
                feedback: "Incrível! As árvores crescem sugando o CO₂ do ar, e a sombra melhora o bem-estar do gado. Um golaço ecológico! (+60t de CO₂ retidos)."
            },
            B: {
                texto: "B) Pastagem Comum: Apenas colocar mais fertilizantes químicos industriais para o capim crescer rápido.",
                carbono: 15,
                feedback: "Cuidado! O excesso de adubos químicos pode liberar óxido nitroso (outro gás poluente) e não ajuda a estocar muito carbono no solo a longo prazo. (+15t)."
            }
        }
    },
    {
        titulo: "Rodada 3: Proteção de Entressafra",
        desc: "Sua colheita principal acabou. O que fazer com o campo vazio durante o período de inverno/seca?",
        icone: "fa-seedling",
        opcoes: {
            A: {
                texto: "A) Deixar em Pousio: Deixar a terra descansando sem nada plantado até a próxima grande safra.",
                carbono: 5,
                feedback: "Vixe... Solo nu fica exposto ao sol e chuva, destruindo microrganismos bons e liberando o restante do carbono estocado. (+5t)."
            },
            B: {
                texto: "B) Adubação Verde: Plantar espécies de cobertura (como braquiária ou crotalária) apenas para proteger o solo.",
                carbono: 45,
                feedback: "Perfeito! Essas plantas criam biomassa rica em carbono e consertam o solo biologicamente para o futuro. (+45t de CO₂ retidos)."
            }
        }
    }
];

// Variáveis de estado do jogo
let rodadaAtual = 0;
let totalCarbono = 0;

// Elementos da Interface
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

// Eventos
btnStart.addEventListener('click', iniciarJogo);
btnChoiceA.addEventListener('click', () => fazerEscolha('A'));
btnChoiceB.addEventListener('click', () => fazerEscolha('B'));
btnNext.addEventListener('click', avançarRodada);
btnRestart.addEventListener('click', reiniciarJogo);

// Funções do Jogo
function iniciarJogo() {
    startScreen.classList.add('hidden');
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
    
    // Atualiza o ícone dinamicamente
    iconScen.className = `fa-solid ${dadosCenario.icone}`;

    btnChoiceA.innerText = dadosCenario.opcoes.A.texto;
    btnChoiceB.innerText = dadosCenario.opcoes.B.texto;
}

function fazerEscolha(opcao) {
    // Bloqueia cliques repetidos
    btnChoiceA.disabled = true;
    btnChoiceB.disabled = true;

    const escolha = cenarios[rodadaAtual].opcoes[opcao];
    totalCarbono += escolha.carbono;

    // Atualiza placar imediato
    txtCarbonScore.innerText = `${totalCarbono} t`;

    // Mostra o texto explicativo (Pedagógico do Agrinho)
    txtFeedback.innerHTML = escolha.feedback;
    feedbackBox.classList.remove('hidden');
}

function avançarRodada() {
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

    // Mensagem de classificação baseada na pontuação
    const txtRank = document.getElementById('rank-message');
    if (totalCarbono >= 140) {
        txtRank.innerHTML = "🏆 <strong>Classificação: Produtor Carbono Zero Lendário!</strong><br>Suas escolhas foram impecáveis. Sua fazenda é referência global em sustentabilidade no Agrinho 2026!";
    } else if (totalCarbono >= 80) {
        txtRank.innerHTML = "🌱 <strong>Classificação: Produtor Consciente.</strong><br>Bom trabalho! Você aplicou técnicas valiosas, mas ainda dá para reter mais carbono evitando os métodos tradicionais.";
    } else {
        txtRank.innerHTML = "⚠️ <strong>Classificação: Alerta de Emissões!</strong><br>Sua fazenda liberou muito gás estufa. Que tal jogar de novo e focar em Plantio Direto e árvores para salvar seu solo?";
    }
}

function reiniciarJogo() {
    endScreen.classList.add('hidden');
    iniciarJogo();
}