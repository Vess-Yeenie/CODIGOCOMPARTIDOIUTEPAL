/**
 * @file bienvenida.js
 * @description Controlador de la pantalla de bienvenida institucional (`index.html`).
 * Gestiona el reloj digital en tiempo real con formato 24 horas y los botones de acceso rápido
 * hacia las vistas de inicio de sesión y registro de usuarios.
 * 
 * @module Client/Bienvenida
 * @author IUTEPAL - División de Sistemas
 * @version 1.0.0
 */

/**
 * Actualiza el reloj digital en el encabezado de la página de bienvenida.
 * Obtiene la hora local del sistema, aplica formato de dos dígitos (padding con ceros)
 * e inyecta la cadena resultante en el elemento `#time-display`.
 */
function updateTime() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    // Añadir un cero delante si los minutos o segundos son menores a 10
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    const timeString = `${hours}:${minutes}:${seconds}`;
    const displayElement = document.getElementById('time-display');
    if (displayElement) {
        displayElement.textContent = `HORA: ${timeString}`;
    }
}

// Inicializar la hora de forma inmediata y configurar el refresco periódico cada 1 segundo (1000ms)
updateTime();
setInterval(updateTime, 1000);

// Botón de redirección hacia el formulario de inicio de sesión
const loginBtn = document.querySelector(".btn-login");
if (loginBtn) {
    loginBtn.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "login.html#login";
    });
}

// Botón de redirección hacia el formulario de registro de usuario
const registerBtn = document.querySelector(".btn-register");
if (registerBtn) {
    registerBtn.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "login.html#register";
    });
}