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

if (inputRegPassword && inputConfirm) {
    inputRegPassword.addEventListener('input', verificarCoincidenciaContrasenas);
    inputConfirm.addEventListener('input', verificarCoincidenciaContrasenas);
}

if (registerForm) {
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
                await alert('Usuario registrado exitosamente.');
                // Restablecer el formulario de registro
                registerForm.reset();
                // Redireccionar al login (Index.html)
                window.location.href = "index.html";
            } else {
                alert('Error al registrar: ' + data.error);
            }
        } catch (error) {
            console.error('Error en registro:', error);
            alert('Error en el servidor.');
        }
    });
}
