let form = document.getElementById("formulario");
let mail = document.getElementById("email");
let redirectCart = localStorage.getItem("redirect-cart");
let redirectProfile = localStorage.getItem("redirect-profile");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  form.classList.add("was-validated");

  if (!form.checkValidity()) {
    e.stopPropagation();
  } else if (form.checkValidity() && redirectCart) {
    localStorage.setItem("login", mail.value);
    localStorage.removeItem("redirect-cart");
    window.location = "cart.html";
  } else if (form.checkValidity() && redirectProfile) {
    localStorage.setItem("login", mail.value);
    localStorage.removeItem("redirect-profile");
    window.location = "my-profile.html";
  } else if (form.checkValidity()) {
    localStorage.setItem("login", mail.value);
    window.location = "portada.html";
  }

  //Si venimos redireccionados del carrito o perfil nos devuelve a ellos
  //de lo contrario nso manda a la portada
});

function handleCredentialResponse(response) {
  const decoded = jwt_decode(response.credential);
  localStorage.setItem("login", decoded.name);
  window.location = "portada.html";
  //Decodificamos el JWT
}
