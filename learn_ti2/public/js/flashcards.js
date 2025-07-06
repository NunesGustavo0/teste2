// public/js/flashcards.js

document.addEventListener('DOMContentLoaded', async function() {
    // ... (seu código existente no topo do flashcards.js) ...

    let flashcards = [];
    let currentFlashcardIndex = 0;
    let currentDisciplineId = null; // Para armazenar o ID da disciplina atual

    // Função para extrair o discCodigo da URL (não será mais usada para obter o ID)
    // Manter por enquanto, mas a lógica de obtenção do ID será via input hidden
    function getDisciplineSlugFromUrl() {
        const pathParts = window.location.pathname.split('/');
        return pathParts[pathParts.length - 1]; // Retorna o slug
    }

    // Função auxiliar para buscar os flashcards do servidor
    async function fetchFlashcards(discCodigo) {
        // ... (seu código existente de fetchFlashcards) ...
    }

    // Função para renderizar o flashcard atual
    function renderCurrentFlashcard() {
        // ... (seu código existente de renderCurrentFlashcard) ...
    }

    // Função para virar o card (global para ser acessível do onclick)
    window.flipCard = function(card) {
        card.classList.toggle('flipped');
    }

    // Atualizar estado dos botões de navegação
    function updateNavigationButtons() {
        // ... (seu código existente de updateNavigationButtons) ...
    }

    // Navegação
    prevFlashcardBtn.addEventListener('click', function() {
        // ... (seu código existente de prevFlashcard) ...
    });

    nextFlashcardBtn.addEventListener('click', function() {
        // ... (seu código existente de nextFlashcard) ...
    });

    // Adicionar novo flashcard
    newFlashcardForm.addEventListener('submit', async function(e) {
        // ... (seu código existente de newFlashcardForm submit) ...
    });

    // Editar flashcard (global para ser acessível do onclick)
    window.editFlashcard = function(event, id) {
        // ... (seu código existente de editFlashcard) ...
    }

    // Excluir flashcard (global para ser acessível do onclick)
    window.deleteFlashcard = async function(event, id) {
        // ... (seu código existente de deleteFlashcard) ...
    }

    // --- Inicialização ---

    // Obtém o discCodigo do input hidden que adicionamos em flashcards.handlebars
    const hiddenDiscIdElement = document.getElementById('disciplineActualId');
    if (hiddenDiscIdElement && hiddenDiscIdElement.value) {
        currentDisciplineId = parseInt(hiddenDiscIdElement.value, 10); // Converte para número
    } else {
        console.error("Erro: Elemento hidden com o ID da disciplina não encontrado ou vazio! Verifique views/flashcards.handlebars.");
        flashcardDisplay.innerHTML = '<p style="text-align: center; color: red;">Erro: Não foi possível obter o ID da disciplina.</p>';
        // Adicionalmente, você pode redirecionar ou mostrar uma mensagem de erro mais proeminente.
        return;
    }

    // Se o currentDisciplineId for obtido com sucesso, buscamos os flashcards
    if (currentDisciplineId) {
        await fetchFlashcards(currentDisciplineId);
    } else {
        console.error("Erro: currentDisciplineId é nulo ou inválido após a inicialização.");
        flashcardDisplay.innerHTML = '<p style="text-align: center; color: red;">Erro: ID da disciplina inválido.</p>';
    }

    // Logout function (from main.handlebars or common script)
    window.logout = function() {
        if(confirm('Deseja realmente sair do sistema?')) {
            window.location.href = "/logout"; // Rota de logout no Express
        }
    };
    // User Menu Dropdown (from main.handlebars or common script)
    const userAvatar = document.getElementById('userAvatar');
    const userDropdown = document.getElementById('userDropdown');
    if (userAvatar && userDropdown) {
        userAvatar.addEventListener('click', function() {
            userDropdown.style.display = userDropdown.style.display === 'block' ? 'none' : 'block';
        });

        // Close dropdown when clicking outside
        window.addEventListener('click', function(e) {
            if (!userAvatar.contains(e.target) && !userDropdown.contains(e.target)) {
                userDropdown.style.display = 'none';
            }
        });
    }
});