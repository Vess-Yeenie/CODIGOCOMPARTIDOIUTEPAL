/**
 * @file registro.js
 * @description Controlador del lado del cliente para el registro de nuevos usuarios (`registro.html`).
 * Implementa validaciones en tiempo real de coincidencia de contraseñas,
 * validación estricta de nombres y apellidos (solo caracteres alfabéticos),
 * validación sintáctica de correo electrónico y comunicación asíncrona con el endpoint `/register`.
 * 
 * @module Client/Register
 * @author IUTEPAL - División de Sistemas
 * @version 1.0.0
 */

// Referencias a los elementos del formulario de registro
const registerForm = document.getElementById('register-form');
const inputNombre = document.getElementById('user');
const inputApellido = document.getElementById('apellido');
const inputRegPassword = document.getElementById('passwordGuest');
const inputConfirm = document.getElementById('confirm');
const inputEmail = document.getElementById('emailGuest');
const inputIutepalista = document.getElementById('iutepalGuest');

/**
 * Validación interactiva en tiempo real para verificar que ambas contraseñas coincidan.
 * Utiliza la API nativa de validación HTML5 (`setCustomValidity`) para mostrar advertencias nativas al usuario.
 */
function verificarCoincidenciaContrasenas() {
    if (inputConfirm.value !== inputRegPassword.value) {
        inputConfirm.setCustomValidity("Las contraseñas no coinciden.");
    } else {
        inputConfirm.setCustomValidity("");
    }
}

// Escuchar cambios de escritura para validar coincidencia en tiempo real
if (inputRegPassword && inputConfirm) {
    inputRegPassword.addEventListener('input', verificarCoincidenciaContrasenas);
    inputConfirm.addEventListener('input', verificarCoincidenciaContrasenas);
}

if (registerForm) {
    /**
     * Manejador de evento submit para el formulario de registro.
     * Aplica la batería completa de validaciones antes de despachar el payload JSON al backend.
     */
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Extracción y saneamiento de valores
        const nombre = (inputNombre && inputNombre.value || '').trim();
        const apellido = (inputApellido && inputApellido.value || '').trim();
        const password = (inputRegPassword && inputRegPassword.value || '').trim();
        const confirm = (inputConfirm && inputConfirm.value || '').trim();
        const email = (inputEmail && inputEmail.value || '').trim().toLowerCase();
        const esIutepalista = inputIutepalista ? inputIutepalista.checked : false;

        // 1. Verificación de campos requeridos
        if (!nombre || !apellido || !password || !confirm || !email) {
            alert('Complete todos los campos obligatorios.');
            return;
        }

        // 2. Validación de solo letras y acentos para nombres y apellidos (evitar inyección de dígitos o símbolos)
        const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        if (!nameRegex.test(nombre)) {
            alert('El nombre solo debe contener letras y espacios.');
            return;
        }
        if (!nameRegex.test(apellido)) {
            alert('El apellido solo debe contener letras y espacios.');
            return;
        }

        // 3. Validación de longitud mínima de la contraseña
        if (password.length < 3) {
            alert('La contraseña debe tener al menos 3 caracteres.');
            return;
        }

        // 4. Verificación de igualdad de contraseñas
        if (password !== confirm) {
            alert('Las contraseñas no coinciden.');
            return;
        }

        // 5. Validación de formato de correo electrónico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Ingrese un correo válido.');
            return;
        }

        // 6. Envío asíncrono al backend Express
        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, apellido, email, password, esIutepalista })
            });
            const data = await response.json();

            if (response.ok) {
                await alert('Usuario registrado exitosamente.');
                // Restablecer el formulario de registro
                registerForm.reset();
                // Redireccionar al login de bienvenida (index.html)
                window.location.href = "index.html";
            } else {
                alert('Error al registrar: ' + (data.error || 'No se pudo completar el registro'));
            }
        } catch (error) {
            console.error('Error en registro:', error);
            alert('Error en el servidor al intentar registrar.');
        }
    });
}
