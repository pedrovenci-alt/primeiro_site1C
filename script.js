// Banco de dados com os cenários do jogo
const cenarios = [
    {
        titulo: "Rodada 1: Preparo do Solo",
        desc: "O bezerrinho e os animais querem saber: Como vamos preparar a terra para plantar sem estragar o solo?",
        icone: "fa-tractor",
        opcoes: {
            A: {
                texto: "🚜 Usar Arado Pesado: Passar a máquina e revirar toda a terra profundamente.",
                carbono: 10,
                feedback: "Muuu! A vaquinha ficou triste. Revirar o solo joga todo o carbono guardado direto para o céu, gerando poluição!"
            },
            B: {
                texto: "🌱 Plantio Direto: Furar apenas o local da semente e manter a palha velha protegendo o chão.",
                carbono: 50,
                feedback: "Perfeito! A terra fica fresquinha, protegida da chuva e segura muito carbono no subsolo! Os animais adoraram!"
            }
        }
    },
    {
        titulo: "Rodada 2: Plantações e Árvores",
        desc: "O campo de pasto está muito quente. O que fazer para melhorar a vida do gado e ajudar a natureza?",
        icone: "fa-cow",
        opcoes: {
            A: {
                texto: "🌳 Sistema de Integração (ILPF): Plantar linhas de árvores no meio do pasto.",
                carbono: 60,
                feedback: "Sensacional! As árvores dão sombra gostosa para os animais e puxam toneladas de CO₂ do ar enquanto crescem!"
            },
            B: {
                texto: "🌾 Pasto Aberto: Deixar só o capim e colocar adubo químico forte para crescer rápido.",
                carbono: 15,
                feedback: "Bah... Sem árvores, o sol queima o solo e o adubo químico solta gases perigosos no ar da fazenda."
            }
        }
    },
    {
        titulo: "Rodada 3: O Inverno Chegou",
        desc: "Depois de colher o milho, o chão vai ficar vazio. Qual a melhor estratégia até a próxima primavera?",
        icone: "fa-wheat-awn",
        opcoes: {
            A: {
                texto: "🟤 Chão Descoberto: Deixar a terra sem nada, descansando sob o tempo.",
                carbono: 5,
                feedback: "Ah não... O vento e o calor levam embora os nutrientes e o carbono que restavam na terra nua."
            },
            B: {
                texto: "🌿 Plantas de Cobertura: Cobrir o solo com braquiária ou leguminosas para adubar a terra.",
                carbono: 45,
                feedback: "Isso aí! Raízes vivas continuam alimentando o solo e estocando carbono puro de forma 100% natural!"
            }
        }
    }
];

// Estado interno do jogo
let rodadaAtual = 0;
let totalCarbono = 0;

// Pegando os elementos HTML do DOM
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

// Escutadores de eventos de clique
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
    
    // Troca o ícone da pergunta
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
    if (totalCarbono >= 140) {
        txtRank.innerHTML = "🏆 <strong>Fazenda Nota 10!</strong><br>Incrível! Você é um herói do meio ambiente. Sua fazenda retém o máximo de carbono possível!";
    } else if (totalCarbono >= 80) {
        txtRank.innerHTML = "🌱 <strong>Fazendeiro Consciente!</strong><br>Bom trabalho! Suas escolhas ajudaram a fazendinha, mas tente usar mais árvores e plantio direto na próxima!";
    } else {
        txtRank.innerHTML = "⚠️ <strong>Alerta de Poluição!</strong><br>Ih! O céu da fazenda ficou cinza. Vamos jogar de novo para aprender a segurar esse carbono no chão?";
    }
}

function reiniciarJogo() {
    iniciarJogo();
}
