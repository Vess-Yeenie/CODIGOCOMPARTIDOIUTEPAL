const validarUsuario  = async (e) => {
    e.preventDefault();

    const username = $inputUser.value.trim();
    const password = $inputPassword.value.trim();

    if (!username || !password) {
        alert("Por favor, complete todos los campos.");
        return;
    }

    // Hacer request al server para login admin
    try {
        const response = await fetch('http://localhost:3000/login-admin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (!data.success) {
            alert("Usuario o contraseña incorrectos.");
            return;
        }
        // Marcar como admin y guardar usuario actual para reportes
        try {
            localStorage.setItem('admin', 'true');
            localStorage.setItem('currentUserName', data.user.nombre);
            localStorage.setItem('currentUserId', data.user.id);
            localStorage.removeItem('guest');
        } catch (e) { /* noop */ }
        window.location.href = "menu.html";
    } catch (error) {
        console.error('Error en login:', error);
        alert('Error en el servidor.');
    }
}

let user = {
    username: "admin",
    password: "123",
}

// Si existe un admin almacenado en localStorage, usarlo (permite cambiar contraseña desde UI)
try {
    const storedAdmin = JSON.parse(localStorage.getItem('adminUser'));
    if (storedAdmin && storedAdmin.username) {
        user.username = storedAdmin.username;
        user.password = storedAdmin.password || user.password;
    }
} catch (e) { /* noop */ }

let $inputUser = document.querySelector("#user"),
    $inputPassword = document.querySelector("#password"),
    $formInput = document.querySelector(".form");

$formInput.addEventListener("submit", validarUsuario);

