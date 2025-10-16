const validarUsuario  = (e) => {
    e.preventDefault();

    const username = $inputUser.value.trim();

    if (!username) {
        alert("Por favor, complete todos los campos.");
        return;
    }else{
        actualLog.Nombre = $inputUser.value
        actualLog.Fecha = `${now.getDate()}-${now.getMonth()}-${now.getFullYear()}}`;
        logs.push(actualLog)
        localStorage.setItem("logs", JSON.stringify(logs));
        window.location.href = "menu.html";
    }

}


let $inputUser = document.querySelector("#user"),
    $formInput = document.querySelector(".form");

$formInput.addEventListener("submit", validarUsuario);

let actualLog = {

    Nombre: "",
    Fecha: ""
};

let logs = []
let now = new Date()

console.log(now.getDate())