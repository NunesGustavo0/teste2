// public/js/auth.js

document.addEventListener('DOMContentLoaded', function() {

    // --- FUNÇÃO AUXILIAR PARA EXIBIR NOTIFICAÇÕES ---
    // Certifique-se de que esta função existe ou adapte para sua implementação de notificações
    // Se sua função `showNotification` está em `notification.js`, certifique-se de que ela é globalmente acessível
    // ou mova-a para cá.
    function showNotification(type, title, message) {
        const notificationDiv = document.getElementById('notification');
        if (notificationDiv) {
            notificationDiv.classList.remove('notification-success', 'notification-error', 'notification-warning'); // Limpa classes antigas
            notificationDiv.classList.add(`notification-${type}`);
            notificationDiv.querySelector('.notification-title').textContent = title;
            notificationDiv.querySelector('.notification-message').textContent = message;
            notificationDiv.style.display = 'block'; // Ou 'flex', dependendo do seu CSS
        }
    }

    // Função para fechar a notificação (se estiver em auth.js)
    window.closeNotification = function() { // Torna a função global para uso no HTML
        const notification = document.getElementById('notification');
        if (notification) {
            notification.style.display = 'none';
        }
    };

    // --- Validação frontend para o formulário de Login ---
    const loginForm = document.querySelector('.auth-form[action="/login"]');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            const usuario = document.getElementById('login-user').value.trim();
            const senha = document.getElementById('login-password').value.trim();

            if (!usuario || !senha) {
                e.preventDefault();
                showNotification('error', 'Campos obrigatórios', 'Por favor, preencha todos os campos!');
                return;
            }

            if (usuario.length < 2) {
                e.preventDefault();
                showNotification('error', 'Usuário inválido', 'O usuário deve ter pelo menos 2 caracteres!');
                return;
            }

            if (senha.length < 6) {
                e.preventDefault();
                showNotification('error', 'Senha inválida', 'A senha deve ter pelo menos 6 caracteres!');
                return;
            }
        });
    }

    // --- Validação frontend para o formulário de Registro ---
    const registerForm = document.querySelector('.auth-form[action="/cadastro"]');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            const usuario = document.getElementById('register-usuario').value.trim();
            const email = document.getElementById('register-email').value.trim();
            const senha = document.getElementById('register-senha').value.trim();

            if (!usuario || !email || !senha) {
                e.preventDefault();
                showNotification('error', 'Campos obrigatórios', 'Por favor, preencha todos os campos!');
                return;
            }

            if (usuario.length < 2) {
                e.preventDefault();
                showNotification('error', 'Usuário inválido', 'O usuário deve ter pelo menos 2 caracteres!');
                return;
            }

            if (senha.length < 6) {
                e.preventDefault();
                showNotification('error', 'Senha inválida', 'A senha deve ter pelo menos 6 caracteres!');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                e.preventDefault();
                showNotification('error', 'Email inválido', 'Por favor, insira um email válido!');
                return;
            }
        });
    }
});