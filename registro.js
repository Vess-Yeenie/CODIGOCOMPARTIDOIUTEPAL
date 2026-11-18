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
const selectTipoCedula = document.getElementById('tipoCedula');
const inputCedula = document.getElementById('cedula');
const cedulaErrorMsg = document.getElementById('cedulaErrorMsg');
const inputRegPassword = document.getElementById('passwordGuest');
const inputConfirm = document.getElementById('confirm');
const inputEmail = document.getElementById('emailGuest');
const inputIutepalista = document.getElementById('iutepalGuest');

/**
 * Validación en tiempo real del campo de Cédula de Identidad.
 * Filtra caracteres no numéricos y verifica longitud (6 a 9 dígitos) y que no comience en 0.
 */
function validarCedulaEnTiempoReal() {
    if (!inputCedula) return;
    // Eliminar cualquier carácter que no sea dígito (letras, puntos, guiones, espacios)
    const soloDigitos = inputCedula.value.replace(/[^0-9]/g, '');
    if (inputCedula.value !== soloDigitos) {
        inputCedula.value = soloDigitos;
    }

    const val = inputCedula.value.trim();
    if (!val) {
        inputCedula.setCustomValidity('');
        if (cedulaErrorMsg) cedulaErrorMsg.classList.remove('visible');
        return;
    }

    if (/^0/.test(val)) {
        inputCedula.setCustomValidity('La cédula no puede comenzar con el número 0.');
        if (cedulaErrorMsg) {
            cedulaErrorMsg.textContent = 'La cédula de identidad no puede comenzar con 0.';
            cedulaErrorMsg.classList.add('visible');
        }
    } else if (!/^[1-9][0-9]{5,8}$/.test(val)) {
        inputCedula.setCustomValidity('La cédula debe tener entre 6 y 9 dígitos numéricos.');
        if (cedulaErrorMsg) {
            cedulaErrorMsg.textContent = 'Ingrese una cédula válida (solo números, entre 6 y 9 dígitos).';
            cedulaErrorMsg.classList.add('visible');
        }
    } else {
        inputCedula.setCustomValidity('');
        if (cedulaErrorMsg) cedulaErrorMsg.classList.remove('visible');
    }
}

if (inputCedula) {
    inputCedula.addEventListener('input', validarCedulaEnTiempoReal);
}

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
        const tipo_cedula = (selectTipoCedula && selectTipoCedula.value || 'V').trim().toUpperCase();
        const cedula = (inputCedula && inputCedula.value || '').trim();
        const password = (inputRegPassword && inputRegPassword.value || '').trim();
        const confirm = (inputConfirm && inputConfirm.value || '').trim();
        const email = (inputEmail && inputEmail.value || '').trim().toLowerCase();
        const esIutepalista = inputIutepalista ? inputIutepalista.checked : false;

        // 1. Verificación de campos requeridos
        if (!nombre || !apellido || !tipo_cedula || !cedula || !password || !confirm || !email) {
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

        // 3. Validación de Tipo de Cédula (Venezolano 'V' o Extranjero 'E') y Número de Cédula
        if (tipo_cedula !== 'V' && tipo_cedula !== 'E') {
            alert('Seleccione un tipo de cédula válido: Venezolano (V) o Extranjero (E).');
            return;
        }
        if (!/^[1-9][0-9]{5,8}$/.test(cedula)) {
            alert('Ingrese un número de cédula válido (solo números, entre 6 y 9 dígitos y sin comenzar en 0).');
            if (inputCedula) inputCedula.focus();
            return;
        }

        // 4. Validación de longitud mínima de la contraseña
        if (password.length < 3) {
            alert('La contraseña debe tener al menos 3 caracteres.');
            return;
        }

        // 5. Verificación de igualdad de contraseñas
        if (password !== confirm) {
            alert('Las contraseñas no coinciden.');
            return;
        }

        // 6. Validación de formato de correo electrónico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Ingrese un correo válido.');
            return;
        }

        // 7. Envío asíncrono al backend Express
        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, apellido, tipo_cedula, cedula, email, password, esIutepalista })
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
