document.getElementById('btn-calcular').addEventListener('click', function() {
    // Pega o valor digitado pelo usuário
    const hectaresInput = document.getElementById('hectares').value;
    const hectares = parseFloat(hectaresInput);

    // Validação simples
    if (isNaN(hectares) || hectares <= 0) {
        alert('Por favor, digite um número válido de hectares.');
        return;
    }

    // Cálculo hipotético baseado em médias de retenção de práticas sustentáveis:
    // Supondo que 1 hectare com boas práticas sequestra cerca de 4 toneladas de CO2 por ano.
    // Uma árvore da Mata Atlântica absorve aprox. 150kg (0.15 toneladas) de CO2 na vida (em 20 anos).
    const toneladasCO2 = hectares * 4;
    const arvoresEquivalentes = Math.round(tonelasCO2 / 0.15);

    // Seleciona o elemento de resultado
    const resultadoDiv = document.getElementById('resultado');
    const textoResultado = document.getElementById('texto-resultado');

    // Insere o texto explicativo
    textoResultado.innerHTML = `Aplicando técnicas de manejo corretas em <strong>${hectares} hectares</strong>, estima-se a retenção de até <strong>${toneladasCO2} toneladas de CO2</strong> por ano. <br><br>Isso equivale ao impacto ambiental positivo de plantio de aproximadamente <strong>${arvoresEquivalentes} árvores</strong> nativas crescendo juntas!`;

    // Remove a classe 'hidden' para mostrar o resultado com animação
    resultadoDiv.classList.remove('hidden');
});