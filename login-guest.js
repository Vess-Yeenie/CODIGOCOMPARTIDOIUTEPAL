const validarUsuario  = (e) => {
    e.preventDefault();

    const username = $inputUser.value.trim();

    if (!username) {
        alert("Por favor, complete todos los campos.");
        return;
    }else{
        
        window.location.href = "menu.html";
    }

}


let $inputUser = document.querySelector("#user"),
    $formInput = document.querySelector(".form");

$formInput.addEventListener("submit", validarUsuario);