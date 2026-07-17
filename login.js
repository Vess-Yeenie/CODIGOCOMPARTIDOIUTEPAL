// Configuración de alternancia dinámica de formularios (Login / Registro)
function toggleForms() {
    const hash = window.location.hash;
    const loginSection = document.getElementById('login-section');
    const registerSection = document.getElementById('register-section');

    if (hash === '#register') {
        loginSection.style.display = 'none';
        registerSection.style.display = 'block';
        document.title = "Registrarse - IUTEPAL";
    } else {
        loginSection.style.display = 'block';
        registerSection.style.display = 'none';
        document.title = "Iniciar Sesión - IUTEPAL";
    }
}

window.addEventListener('hashchange', toggleForms);
window.addEventListener('load', toggleForms);

// --- Formulario de Login ---
const loginForm = document.getElementById('login-form');
const inputIdentifier = document.getElementById('identifier');
const inputPassword = document.getElementById('password');

loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const identifier = inputIdentifier.value.trim();
    const password = inputPassword.value.trim();

    if (!identifier || !password) {
        alert("Por favor, complete todos los campos.");
        return;
    }

    const isEmail = identifier.includes('@');
    if (isEmail) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(identifier)) {
            alert('Ingrese un correo electrónico válido.');
            return;
        }
    }

    if (isEmail) {
        // Flujo de Estudiante (Guest)
        try {
            const response = await fetch('http://localhost:3000/login-guest', {
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

            // Detección y uso del estado IUTEPALISTA
            if (found.esIutepalista) {
                localStorage.setItem('iutepalistaStatus', 'true');
            } else {
                localStorage.setItem('iutepalistaStatus', 'false');
            }

            // Registrar log en DB
            const now = new Date();
            const fecha = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
            await fetch('http://localhost:3000/log-access', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario_id: found.id, fecha })
            });

            // Guardar usuario actual para asociar futuras acciones
            localStorage.setItem('currentUserName', found.nombre);
            localStorage.setItem('currentUserId', found.id);

            // Marcar usuario como invitado
            localStorage.setItem('guest', 'true');
            localStorage.removeItem('admin');
            localStorage.removeItem('adminUser');
            
            window.location.href = "menu.html";
        } catch (error) {
            console.error('Error en login Estudiante:', error);
            alert('Error en el servidor.');
        }
    } else {
        // Flujo de Administrador (Admin)
        try {
            const response = await fetch('http://localhost:3000/login-admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: identifier, password })
            });
            const data = await response.json();
            if (!data.success) {
                alert("Usuario o contraseña incorrectos.");
                return;
            }
            // Marcar como admin y guardar usuario actual para reportes
            localStorage.setItem('admin', 'true');
            localStorage.setItem('currentUserName', data.user.nombre);
            localStorage.setItem('currentUserId', data.user.id);
            localStorage.removeItem('guest');
            
            window.location.href = "menu.html";
        } catch (error) {
            console.error('Error en login Administrador:', error);
            alert('Error en el servidor.');
        }
    }
});

// --- Formulario de Registro ---
const registerForm = document.getElementById('register-form');
const inputNombre = document.getElementById('user');
const inputApellido = document.getElementById('apellido');
const inputRegPassword = document.getElementById('passwordGuest');
const inputConfirm = document.getElementById('confirm');
const inputEmail = document.getElementById('emailGuest');
const inputIutepalista = document.getElementById('iutepalGuest');

// Validación interactiva en tiempo real para confirmar contraseña
function verificarCoincidenciaContrasenas() {
    if (inputConfirm.value !== inputRegPassword.value) {
        inputConfirm.setCustomValidity("Las contraseñas no coinciden.");
    } else {
        inputConfirm.setCustomValidity("");
    }
}
inputRegPassword.addEventListener('input', verificarCoincidenciaContrasenas);
inputConfirm.addEventListener('input', verificarCoincidenciaContrasenas);


registerForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const nombre = (inputNombre && inputNombre.value || '').trim();
    const apellido = (inputApellido && inputApellido.value || '').trim();
    const password = (inputRegPassword && inputRegPassword.value || '').trim();
    const confirm = (inputConfirm && inputConfirm.value || '').trim();
    const email = (inputEmail && inputEmail.value || '').trim().toLowerCase();
    const esIutepalista = inputIutepalista ? inputIutepalista.checked : false;

    if (!nombre || !apellido || !password || !confirm || !email) {
        alert('Complete todos los campos obligatorios.');
        return;
    }

    // Validar que nombre y apellido solo contengan letras y espacios (bloquear números)
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!nameRegex.test(nombre)) {
        alert('El nombre solo debe contener letras y espacios.');
        return;
    }
    if (!nameRegex.test(apellido)) {
        alert('El apellido solo debe contener letras y espacios.');
        return;
    }

    // Validar longitud de contraseña
    if (password.length < 3) {
        alert('La contraseña debe tener al menos 3 caracteres.');
        return;
    }
    if (password !== confirm) {
        alert('Las contraseñas no coinciden.');
        return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Ingrese un correo válido.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, apellido, email, password, esIutepalista })
        });
        const data = await response.json();
        if (response.ok) {
            alert('Usuario registrado exitosamente.');
            // Restablecer el formulario de registro
            registerForm.reset();
            // Alternar de vuelta al formulario de login en la misma interfaz
            window.location.hash = '#login';
        } else {
            alert('Error al registrar: ' + data.error);
        }
    } catch (error) {
        console.error('Error en registro:', error);
        alert('Error en el servidor.');
    }
});
