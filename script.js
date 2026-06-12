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