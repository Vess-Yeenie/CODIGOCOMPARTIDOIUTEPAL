const validarUsuario  = (e) => {
    e.preventDefault();

    const username = $inputUser.value.trim();
    const password = $inputPassword.value.trim();

    if (!username || !password) {
        alert("Por favor, complete todos los campos.");
        return;
    }

    if (username === user.username && password === user.password) {
        window.location.href = "menu.html";
    } else {
        alert("Usuario o contraseña incorrectos.");
    }
}

let user = {
    username: "admin",
    password: "123",
}

let $inputUser = document.querySelector("#user"),
    $inputPassword = document.querySelector("#password"),
    $formInput = document.querySelector(".form");

$formInput.addEventListener("submit", validarUsuario);

