/**
 * @file login.js
 * @description Controlador del lado del cliente para el formulario de inicio de sesión (`login.html`).
 * Gestiona la validación de campos, la diferenciación automática entre perfiles (Estudiante/Visitante vs Administrador),
 * la comunicación con los endpoints `/login-guest` y `/login-admin`, la persistencia del estado de sesión
 * en `localStorage` y el registro automático de auditoría en `/log-access`.
 * 
 * @module Client/Login
 * @author IUTEPAL - División de Sistemas
 * @version 1.0.0
 */

// Referencias a los elementos del DOM en el formulario de inicio de sesión
const loginForm = document.getElementById('login-form');
const inputIdentifier = document.getElementById('identifier');
const inputPassword = document.getElementById('password');

if (loginForm) {
    /**
     * Manejador de evento submit para el formulario de login.
     * Intercepta el envío estándar, valida la presencia de credenciales y determina
     * la estrategia de autenticación según si el identificador es un correo electrónico o nombre de usuario.
     */
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const identifier = inputIdentifier.value.trim();
        const password = inputPassword.value.trim();

        // 1. Validación de campos obligatorios
        if (!identifier || !password) {
            alert("Por favor, complete todos los campos.");
            return;
        }

        // 2. Detección de formato de correo electrónico
        const isEmail = identifier.includes('@');
        if (isEmail) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(identifier)) {
                alert('Ingrese un correo electrónico válido.');
                return;
            }
        }

        // ---------------------------------------------------------------------
        // FLUJO A: ESTUDIANTE / VISITANTE (Acceso mediante Correo Electrónico)
        // ---------------------------------------------------------------------
        if (isEmail) {
            try {
                const response = await fetch('/login-guest', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: identifier.toLowerCase(), password })
                });
                const data = await response.json();
                
                if (!data.success) {
                    alert('Usuario no encontrado o contraseña incorrecta.');
                    return;
                }
                const found = data.user;

                // Guardar estatus académico para control de acceso a Hojas de Resumen
                if (found.esIutepalista) {
                    localStorage.setItem('iutepalistaStatus', 'true');
                } else {
                    localStorage.setItem('iutepalistaStatus', 'false');
                }

                // Registrar evento de acceso en la bitácora de auditoría
                const now = new Date();
                const fecha = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
                await fetch('/log-access', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ usuario_id: found.id, fecha })
                });

                // Almacenar metadatos del usuario activo para futuras trazas
                localStorage.setItem('currentUserName', found.nombre);
                localStorage.setItem('currentUserId', found.id);

                // Configurar privilegios de usuario invitado / estudiante
                localStorage.setItem('guest', 'true');
                localStorage.removeItem('admin');
                localStorage.removeItem('adminUser');
                
                // Redireccionar al panel principal
                window.location.href = "menu.html";
            } catch (error) {
                console.error('Error en login Estudiante:', error);
                alert('Error al conectar con el servidor.');
            }
        } 
        // ---------------------------------------------------------------------
        // FLUJO B: ADMINISTRADOR (Acceso mediante Nombre de Usuario)
        // ---------------------------------------------------------------------
        else {
            try {
                const response = await fetch('/login-admin', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: identifier, password })
                });
                const data = await response.json();
                
                if (!data.success) {
                    alert("Usuario o contraseña incorrectos.");
                    return;
                }

                // Configurar privilegios y datos del Administrador
                localStorage.setItem('admin', 'true');
                localStorage.setItem('currentUserName', data.user.nombre);
                localStorage.setItem('currentUserId', data.user.id);
                localStorage.removeItem('guest');
                
                // Redireccionar al panel principal con permisos administrativos
                window.location.href = "menu.html";
            } catch (error) {
                console.error('Error en login Administrador:', error);
                alert('Error al conectar con el servidor.');
            }
        }
    });
}
