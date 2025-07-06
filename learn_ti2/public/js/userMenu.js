// public/js/userMenu.js
document.addEventListener('DOMContentLoaded', function() {
    const userAvatar = document.getElementById('userAvatar');
    const userDropdown = document.getElementById('userDropdown');

    if (userAvatar && userDropdown) {
        userAvatar.addEventListener('click', function() {
            userDropdown.style.display = userDropdown.style.display === 'block' ? 'none' : 'block';
        });

        // Fechar o dropdown se clicar fora dele
        document.addEventListener('click', function(event) {
            if (!userAvatar.contains(event.target) && !userDropdown.contains(event.target)) {
                userDropdown.style.display = 'none';
            }
        });
    }
});

// A função logout() já está sendo chamada no seu handlebars,
// mas a lógica real de logout está no servidor (login.js rota '/logout').
// Esta função apenas redireciona para lá.
function logout() {
    window.location.href = '/logout';
}