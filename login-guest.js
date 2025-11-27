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
    
   
    form && form.addEventListener('submit', function(e){
        e.preventDefault();
        
        const password = (inputPass && inputPass.value || '').trim();
        const userIdentifier = (inputUserIdentifier && inputUserIdentifier.value || '').trim().toLowerCase();

        if (!userIdentifier || !password) {
            alert('Ingrese el correo y la contraseña.');
            return;
        }

        const usuarios = getUsuarios();
        let found = null;

        
        found = usuarios.find(u => (u.email || '').toLowerCase() === userIdentifier);
       

        if (!found) {
            alert('Usuario no encontrado. Regístrese primero.');
            return;
        }
        if (found.password !== password) {
            alert('Contraseña incorrecta.');
            return;
        }
        // 🟢 Nuevo: Detección y uso del estado IUTEPALISTA
    if (found.esIutepalista) {
  
    localStorage.setItem('iutepalistaStatus', 'true');
    } else {
   
    localStorage.setItem('iutepalistaStatus', 'false');
    }
        // Login exitoso: Marcar sesión y registrar log
        try {
            actualLog.Nombre = found.nombre;
            // Corregido el error de sintaxis de la fecha y el mes
            actualLog.Fecha = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`; 
            
            // Añadir el log y guardar
            logs.push(actualLog);
            localStorage.setItem("logs", JSON.stringify(logs));
            
            // Guardar usuario actual para asociar futuras acciones (vistas/descargas)
            try { localStorage.setItem('currentUserName', found.nombre); } catch (e) { /* noop */ }

            // Marcar usuario como invitado
            localStorage.setItem('guest', 'true');
            localStorage.removeItem('admin');
            localStorage.removeItem('adminUser');
        } catch (err) {
            console.warn('No se pudo guardar en localStorage', err);
        }
        
        window.location.href = 'menu.html';
    });
})();