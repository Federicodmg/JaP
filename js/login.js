let form = document.getElementById("formulario");
let mail = document.getElementById("email");
let redirect = localStorage.getItem("redirect");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  form.classList.add("was-validated");

  if (!form.checkValidity()) {
    e.stopPropagation();
  } else if (form.checkValidity() && redirect) {
    localStorage.setItem("login", mail.value);
    localStorage.removeItem("redirect");
    window.location = "cart.html";
  } else if (form.checkValidity()) {
    localStorage.setItem("login", mail.value);
    window.location = "portada.html";
  }
});

function handleCredentialResponse(response) {
  const decoded = jwt_decode(response.credential);
  localStorage.setItem("login", decoded.name);
  window.location = "portada.html";
}
