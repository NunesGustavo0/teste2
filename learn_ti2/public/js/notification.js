// public/js/notification.js
function closeNotification() {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const notification = document.getElementById('notification');
    if (notification) {
        setTimeout(() => {
            closeNotification();
        }, 5000);
    }
});

// Função para mostrar notificação via JavaScript (útil para validação de frontend)
function showNotification(type, title, message) {
    const existingNotification = document.getElementById('notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.id = 'notification';
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <strong class="notification-title">${title}</strong>
            <p class="notification-message">${message}</p>
            <button class="notification-close" onclick="closeNotification()">&times;</button>
        </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        closeNotification();
    }, 5000);
}