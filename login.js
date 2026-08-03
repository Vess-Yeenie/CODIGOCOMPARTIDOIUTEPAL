// --- Formulario de Login ---
const loginForm = document.getElementById('login-form');
const inputIdentifier = document.getElementById('identifier');
const inputPassword = document.getElementById('password');

if (loginForm) {
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

                // Detección y uso del estado IUTEPALISTA
                if (found.esIutepalista) {
                    localStorage.setItem('iutepalistaStatus', 'true');
                } else {
                    localStorage.setItem('iutepalistaStatus', 'false');
                }

                // Registrar log en DB
                const now = new Date();
                const fecha = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
                await fetch('/log-access', {
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
}
