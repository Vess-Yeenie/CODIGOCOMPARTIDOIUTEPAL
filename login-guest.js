(function(){
    const form = document.querySelector('.form');

    const inputUserIdentifier = document.getElementById('emailGuest'); 
    const inputPass = document.getElementById('passwordGuest');


    let actualLog = {
        Nombre: "",
        Fecha: ""
    };
    let logs = JSON.parse(localStorage.getItem('logs')) || []; // Cargar logs existentes
    let now = new Date();

    function getUsuarios() {
        try { return JSON.parse(localStorage.getItem('usuarios')) || []; }
        catch (e) { return []; }
    }
    
   
    form && form.addEventListener('submit', async function(e){
        e.preventDefault();
        
        const password = (inputPass && inputPass.value || '').trim();
        const userIdentifier = (inputUserIdentifier && inputUserIdentifier.value || '').trim().toLowerCase();

        if (!userIdentifier || !password) {
            alert('Ingrese el correo y la contraseña.');
            return;
        }

        // Hacer request al server para login
        try {
            const response = await fetch('http://localhost:3000/login-guest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: userIdentifier, password })
            });
            const data = await response.json();
            if (!data.success) {
                alert('Usuario no encontrado o contraseña incorrecta.');
                return;
            }
            const found = data.user;

            // 🟢 Nuevo: Detección y uso del estado IUTEPALISTA
            if (found.esIutepalista) {
                localStorage.setItem('iutepalistaStatus', 'true');
            } else {
                localStorage.setItem('iutepalistaStatus', 'false');
            }

            // Registrar log en DB
            const fecha = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
            await fetch('http://localhost:3000/log-access', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario_id: found.id, fecha })
            });

            // Guardar usuario actual para asociar futuras acciones
            try { 
                localStorage.setItem('currentUserName', found.nombre);
                localStorage.setItem('currentUserId', found.id);
            } catch (e) { /* noop */ }

            // Marcar usuario como invitado
            localStorage.setItem('guest', 'true');
            localStorage.removeItem('admin');
            localStorage.removeItem('adminUser');
        } catch (error) {
            console.error('Error en login:', error);
            alert('Error en el servidor.');
            return;
        }
        
        window.location.href = 'menu.html';
    });
})();