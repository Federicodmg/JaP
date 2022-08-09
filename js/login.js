let forms = document.querySelectorAll(".needs-validation")
let form = document.getElementById("formulario")

Array.prototype.slice.call(forms).forEach( form => {
    form.addEventListener("submit", e => {
        if (!form.checkValidity()) {
            e.preventDefault()
            e.stopPropagation()
        }
        form.classList.add("was-validated")
    })
})

form.addEventListener("submit", e => {
    e.preventDefault()
    if (email.checkValidity() && contraseña.checkValidity()) {
        localStorage.setItem("logged", true);
        window.location = "index.html"
    }
})






