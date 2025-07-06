// public/js/disciplinePage.js

document.addEventListener('DOMContentLoaded', function() {
    // Lógica para o botão "Voltar" (seta)
    const backArrow = document.querySelector('.back-arrow');
    if (backArrow) {
        backArrow.addEventListener('click', function() {
            window.history.back(); // Volta para a página anterior no histórico do navegador
        });
    }
    // Os cards de opção (Biblioteca, Flashcards, Quiz) já funcionam com o onclick direto no HTML.
});