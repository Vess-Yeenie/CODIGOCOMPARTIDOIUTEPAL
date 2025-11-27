const validarUsuario  = (e) => {
    e.preventDefault();

    const username = $inputUser.value.trim();
    const password = $inputPassword.value.trim();

    if (!username || !password) {
        alert("Por favor, complete todos los campos.");
        return;
    }

    if (username === user.username && password === user.password) {
        // Marcar como admin y guardar usuario actual para reportes
        try {
            localStorage.setItem('admin', 'true');
            localStorage.setItem('currentUserName', username);
            localStorage.removeItem('guest');
        } catch (e) { /* noop */ }
        window.location.href = "menu.html";
    } else {
        alert("Usuario o contraseña incorrectos.");
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

