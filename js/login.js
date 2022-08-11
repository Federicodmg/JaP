let form = document.getElementById("formulario")

form.addEventListener("submit", e => {
    e.preventDefault()
    form.classList.add("was-validated")
    
    if (!form.checkValidity()) {
        e.stopPropagation()
    } else if (form.checkValidity()) {
        window.location = "portada.html"
    }

})

function onSuccess() {
    window.location = "portada.html"
}

function onFailure() {
    console.log("Hubo un error con el log-in")
}

function renderButton() {
    gapi.signin2.render("my-signin2", {
        "scope": "profile email",
        "width": 240,
        "height": 50,
        "longtitle": true,
        "theme": "dark",
        "onsuccess": onSuccess,
        "onfailure": onFailure,
    })
}







