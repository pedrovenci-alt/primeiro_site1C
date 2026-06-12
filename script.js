const state = {
    money: 500,
    pollution: 20,
    sustainability: 50,
    round: 1,
    maxRounds: 5
};

const scenarios = [
    {
        title: "A Origem da Madeira",
        desc: "Como você obterá a madeira para o seu carvão?",
        fact: "Madeira de reflorestamento (Eucalipto) sequestra carbono enquanto cresce, tornando o ciclo mais neutro.",
        options: [
            { text: "Comprar de manejo sustentável (-R$150)", money: -150, poll: 0, sust: 20 },
            { text: "Usar restos de mata nativa (Grátis)", money: 0, poll: 10, sust: -30 }
        ]
    },
    {
        title: "Tecnologia de Forno",
        desc: "O forno antigo está soltando muita fumaça preta. O que fazer?",
        fact: "Fornos modernos com queimadores de gases reduzem em até 90% a emissão de metano.",
        options: [
            { text: "Instalar queimador de fumaça (-R$200)", money: -200, poll: -20, sust: 25 },
            { text: "Manter o forno de terra (R$0)", money: 0, poll: 25, sust: -15 }
        ]
    },
    {
        title: "Subprodutos Preciosos",
        desc: "A fumaça condensada vira um líquido chamado Licor Pirolenhoso.",
        fact: "O licor pirolenhoso funciona como repelente e adubo orgânico, aumentando o lucro da fazenda.",
        options: [
            { text: "Coletar e vender o licor (+R$150)", money: 150, poll: -5, sust: 10 },
            { text: "Descartar no solo (R$0)", money: 0, poll: 15, sust: -10 }
        ]
    },
    {
        title: "Biochar: O Ouro Negro",
        desc: "Você produziu uma sobra de carvão fino. Como usar?",
        fact: "Biochar no solo retém água e nutrientes por centenas de anos, combatendo as mudanças climáticas.",
        options: [
            { text: "Vender como Biochar (+R$100)", money: 100, poll: 0, sust: 15 },
            { text: "Queimar como resíduo (R$0)", money: 0, poll: 10, sust: -5 }
        ]
    },
    {
        title: "Certificação Verde",
        desc: "Uma empresa quer comprar seu carvão para exportação, mas exige selo verde.",
        fact: "Certificações garantem que não houve trabalho escravo e que a biodiversidade foi respeitada.",
        options: [
            { text: "Pagar auditoria ambiental (-R$100)", money: -100, poll: 0, sust: 30 },
            { text: "Vender sem selo no mercado local (+R$50)", money: 50, poll: 0, sust: -10 }
        ]
    }
];

function updateUI() {
    document.getElementById('money').innerText = state.money;
    document.getElementById('pollution-bar').style.width = state.pollution + "%";
    document.getElementById('sust-bar').style.width = state.sustainability + "%";
    document.getElementById('round').innerText = state.round;

    if (state.round <= state.maxRounds) {
        showScenario(state.round - 1);
    } else {
        showEndGame();
    }
}

function showScenario(index) {
    const s = scenarios[index];
    document.getElementById('scenario-title').innerText = s.title;
    document.getElementById('scenario-desc').innerText = s.desc;
    document.getElementById('fact-text').innerText = s.fact;

    const container = document.getElementById('options-container');
    container.innerHTML = '';

    s.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'btn-choice';
        btn.innerText = opt.text;
        btn.onclick = () => makeChoice(opt);
        container.appendChild(btn);
    });
}

function makeChoice(opt) {
    state.money += opt.money;
    state.pollution = Math.max(0, Math.min(100, state.pollution + opt.poll));
    state.sustainability = Math.max(0, Math.min(100, state.sustainability + opt.sust));
    state.round++;
    updateUI();
}

function showEndGame() {
    const gameScreen = document.getElementById('game-screen');
    let message = "";
    let icon = "";

    if (state.sustainability > 70 && state.money > 0) {
        message = "Parabéns! Você se tornou uma referência em Carbonização Sustentável. O campo prospera graças a você!";
        icon = "fa-crown";
    } else if (state.money <= 0) {
        message = "Infelizmente você faliu. Sustentabilidade exige gestão financeira!";
        icon = "fa-skull-crossbones";
    } else {
        message = "Sua fazenda produz, mas o impacto ambiental foi alto. Tente focar mais em tecnologias limpas na próxima!";
        icon = "fa-exclamation-triangle";
    }

    gameScreen.innerHTML = `
        <div class="event-card" style="text-align:center">
            <i class="fas ${icon} fa-5x" style="color:var(--primary); margin-bottom:20px"></i>
            <h2>Fim da Jornada</h2>
            <p>${message}</p>
            <button class="btn-choice" style="width:100%; text-align:center" onclick="location.reload()">Recomeçar Desafio</button>
        </div>
    `;
}

// Iniciar jogo
updateUI();