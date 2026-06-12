// Estado do Jogo Avançado
const gameState = {
    money: 1000,
    carbon: 20,
    soil: 50,
    woodWet: 10,
    woodDry: 0,
    liquor: 0,
    turn: 1,
    weather: "Ensolarado"
};

const weatherTypes = ["Ensolarado", "Chuvoso", "Seco Oblíquo"];

// Banco de Dados de Eventos e Lógica Condicional
const events = [
    {
        category: "Manejo Inicial",
        title: "Preparação da Biomassa",
        desc: "Você possui 10t de madeira úmida no pátio. Como processar para a carbonização?",
        fact: "Madeiras com alto teor de umidade demandam mais energia para iniciar a pirólise, resultando em menor rendimento e fumaça ácida poluente.",
        choices: [
            {
                title: "Secagem Natural (90 dias)",
                desc: "Aproveite o vento e o sol para reduzir a umidade sem custo financeiro.",
                impactTxt: "+10t Madeira Seca, +15 Saúde Solo",
                action: () => {
                    gameState.woodWet -= 10;
                    gameState.woodDry += 10;
                    gameState.soil += 15;
                }
            },
            {
                title: "Carbonizar Imediatamente",
                desc: "Gera receita rápida, mas perde rendimento térmico do forno.",
                impactTxt: "-10t Madeira Úmida, +R$200, +25% Carbono",
                action: () => {
                    gameState.woodWet -= 10;
                    gameState.money += 200;
                    gameState.carbon += 25;
                }
            }
        ]
    },
    {
        category: "Tecnologia",
        title: "Seleção do Sistema de Fornos",
        desc: "Chegou o momento de queimar a madeira. Qual infraestrutura utilizar?",
        fact: "Fornos de alvenaria circulares otimizam a distribuição do calor, e a coleta de gases impede o lançamento de CH4 (Metano) no ar.",
        choices: [
            {
                title: "Construir Forno Retorta",
                desc: "Sistema moderno de alta tecnologia. Reaproveita gases voláteis como combustível.",
                impactTxt: "-R$400, -20% Carbono, Produz Licor Pirolenhoso futuramente",
                action: () => {
                    gameState.money -= 400;
                    gameState.carbon -= 20;
                    gameState.liquor += 50; // bônus inicial
                }
            },
            {
                title: "Fornos de Alvenaria Tradicional",
                desc: "Investimento acessível, controle moderado de emissões.",
                impactTxt: "-R$150, +5% Carbono, Estabilidade de produção",
                action: () => {
                    gameState.money -= 150;
                    gameState.carbon += 5;
                }
            }
        ]
    },
    {
        category: "Subprodutos",
        title: "Destinação dos Gases e Fumaça",
        desc: "Seus fornos estão operando a pleno vapor. O que fazer com o condensado da fumaça?",
        fact: "A condensação dos gases de carbonização gera o Licor Pirolenhoso, defensivo agrícola natural rico em ácido pirolenhoso e compostos fenólicos.",
        choices: [
            {
                title: "Instalar Condensador de Fumaça",
                desc: "Purifica o escape e extrai bio-insumos valiosos.",
                impactTxt: "-R$100, +100L Licor Pirolenhoso, +10 Saúde Solo",
                action: () => {
                    gameState.money -= 100;
                    gameState.liquor += 100;
                    gameState.soil += 10;
                }
            },
            {
                title: "Liberar na Atmosfera",
                desc: "Evita custos de manutenção no condensador.",
                impactTxt: "+0 Custos, +20% Carbono, Risco de autuação",
                action: () => {
                    gameState.carbon += 20;
                }
            }
        ]
    },
    {
        category: "Evento Climático / Mercado",
        title: "Uso do Biochar (Biocarvão)",
        desc: "A queima gerou finos de carvão que não servem para churrasco. Qual o destino?",
        fact: "O biochar aplicado ao solo atua como uma esponja permanente: retém água, abriga microrganismos benéficos e fixa o carbono na terra por séculos.",
        choices: [
            {
                title: "Incorporar Biochar ao Solo",
                desc: "Aumenta a CTC (Capacidade de Troca Catiônica) da terra.",
                impactTxt: "+30 Saúde Solo, -5% Carbono do Ar",
                action: () => {
                    gameState.soil += 30;
                    gameState.carbon -= 5;
                }
            },
            {
                title: "Vender para Indústria Siderúrgica",
                desc: "Descarte rápido para queima industrial.",
                impactTxt: "+R$300, +15% Carbono Global",
                action: () => {
                    gameState.money += 300;
                    gameState.carbon += 15;
                }
            }
        ]
    },
    {
        category: "Fiscalização",
        title: "Auditoria Ambiental",
        desc: "Fiscais do órgão ambiental chegaram para analisar as emissões gasosas e a origem da biomassa.",
        fact: "Propriedades rurais regulamentadas que evitam o desmatamento nativo recebem isenções fiscais ou Créditos de Carbono.",
        choices: [
            {
                title: "Apresentar Plano de Manejo",
                desc: "Funciona se sua pegada de carbono estiver baixa e o solo saudável.",
                impactTxt: "Se Carbono < 40%: Ganha R$250 em bônus ambiental. Caso contrário: Multa R$200.",
                action: () => {
                    if (gameState.carbon < 40) {
                        gameState.money += 250;
                    } else {
                        gameState.money -= 200;
                    }
                }
            },
            {
                title: "Tentar recurso e adiamento jurídico",
                desc: "Ganha tempo, mas gasta com suporte legal.",
                impactTxt: "-R$100, Mantém os status atuais.",
                action: () => {
                    gameState.money -= 100;
                }
            }
        ]
    }
];

function updateInterface() {
    // Atualiza Textos e Barras
    document.getElementById('money').innerText = gameState.money;
    document.getElementById('txt-carbon').innerText = gameState.carbon + "%";
    document.getElementById('bar-carbon').style.width = gameState.carbon + "%";
    document.getElementById('txt-soil').innerText = gameState.soil + "%";
    document.getElementById('bar-soil').style.width = gameState.soil + "%";
    
    // Atualiza Inventário
    document.getElementById('inv-wood-wet').innerText = gameState.woodWet + "t";
    document.getElementById('inv-wood-dry').innerText = gameState.woodDry + "t";
    document.getElementById('inv-liquor').innerText = gameState.liquor + "L";
    
    // Rodada
    document.getElementById('current-turn').innerText = gameState.turn;

    // Gerencia o fim do jogo ou renderiza o próximo evento
    if (gameState.turn <= events.length) {
        renderEvent(gameState.turn - 1);
    } else {
        renderEndGame();
    }
}

function renderEvent(index) {
    const ev = events[index];
    
    // Modifica Clima Aleatoriamente a cada rodada
    gameState.weather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
    const weatherBadge = document.getElementById('weather-badge');
    weatherBadge.innerHTML = gameState.weather === "Chuvoso" ? `<i class="fas fa-cloud-showers-heavy"></i> Chuvoso` : `<i class="fas fa-sun"></i> Ensolarado`;

    // Aplica efeito climático simples
    if (gameState.weather === "Chuvoso" && gameState.woodDry > 0) {
        gameState.woodDry -= 2;
        gameState.woodWet += 2; // Chuva molhou parte da madeira seca
    }

    document.getElementById('event-category').innerText = ev.category;
    document.getElementById('event-title').innerText = ev.title;
    document.getElementById('event-desc').innerText = ev.desc;
    document.getElementById('event-fact').innerText = ev.fact;

    const container = document.getElementById('choices-container');
    container.innerHTML = '';

    ev.choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.innerHTML = `
            <h4>${choice.title}</h4>
            <p>${choice.desc}</p>
            <div class="impacts"><i class="fas fa-bolt"></i> Consequência: <span>${choice.impactTxt}</span></div>
        `;
        btn.onclick = () => {
            choice.action();
            // Travas de limite (0 a 100)
            gameState.carbon = Math.max(0, Math.min(100, gameState.carbon));
            gameState.soil = Math.max(0, Math.min(100, gameState.soil));
            gameState.turn++;
            updateInterface();
        };
        container.appendChild(btn);
    });
}

function renderEndGame() {
    const mainScreen = document.querySelector('.game-screen');
    let title, message, badgeHTML;

    if (gameState.money > 0 && gameState.carbon < 35 && gameState.soil > 60) {
        title = "🏆 Elite do Carbono Neutro";
        message = "Espetacular! Você provou que a carbonização no campo pode ser uma aliada do clima. Seus fornos capturam subprodutos, geram receita limpa através do Biochar e mantêm o ecossistema equilibrado.";
        badgeHTML = `<span class="category-tag" style="background:#2ecc71; color:#fff">Selo Ouro Carbono Zero</span>`;
    } else if (gameState.money <= 0) {
        title = "❌ Insolvência Técnica";
        message = "Sua fazenda faliu. Investir em tecnologias verdes sem gerenciar o fluxo de caixa drenou todos os seus recursos. A sustentabilidade no agronegócio precisa ser economicamente viável.";
        badgeHTML = `<span class="category-tag" style="background:#e74c3c; color:#fff">Falência Econômica</span>`;
    } else {
        title = "⚠️ Alerta de Passivo Ambiental";
        message = "Sua operação gerou muito lucro, mas os níveis de emissão de carbono sufocaram a região e degradaram o solo. O mercado moderno pune severamente produtores sem responsabilidade ecológica.";
        badgeHTML = `<span class="category-tag" style="background:#f1c40f; color:#000">Retorno Necessário</span>`;
    }

    mainScreen.innerHTML = `
        <div class="main-card" style="text-align: center;">
            <div style="font-size: 4rem; margin-bottom: 20px;">🏁</div>
            <h2>${title}</h2>
            <div style="margin: 15px 0;">${badgeHTML}</div>
            <p class="description" style="margin-bottom: 30px;">${message}</p>
            
            <div style="display: flex; justify-content: center; gap: 20px; background: var(--bg-card); padding: 20px; border-radius: 8px; border: 1px solid var(--border-color)">
                <div><strong>R$ Final:</strong> ${gameState.money}</div>
                <div><strong>Poluição CO2:</strong> ${gameState.carbon}%</div>
                <div><strong>Fertilidade Solo:</strong> ${gameState.soil}%</div>
            </div>
            
            <button class="choice-btn" style="margin-top: 30px; width: 100%; text-align: center; align-items: center;" onclick="location.reload()">
                <h4>Reiniciar Simulação</h4>
            </button>
        </div>
    `;
}

// Inicializa o Dashboard
updateInterface();