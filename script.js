function startGame() {
    // Oculta a tela de entrada com animação simples
    document.getElementById('start-screen').style.display = 'none';
    
    // Mostra o dashboard principal do jogo
    const dashboard = document.getElementById('main-dashboard');
    dashboard.style.display = 'flex';
    
    // Força o reset/atualização da interface do simulador
    updateInterface();
}