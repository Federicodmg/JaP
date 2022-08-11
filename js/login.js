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

function onSignIn(googleUser) {
    let profile = googleUser.getBasicProfile();
  }







