let form = document.getElementById("formulario");
let mail = document.getElementById("email");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  form.classList.add("was-validated");

  if (!form.checkValidity()) {
    e.stopPropagation();
  } else if (form.checkValidity()) {
    if (localStorage.getItem("login")) {
      localStorage.setItem("login", mail.value);
      window.location = "portada.html";
    }
  }
});

function handleCredentialResponse(response) {
  const decoded = jwt_decode(response.credential);
  localStorage.setItem("login", decoded.name);
  window.location = "portada.html";
}
