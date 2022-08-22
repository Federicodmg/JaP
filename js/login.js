let form = document.getElementById("formulario");
let mail = document.getElementById("email");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  form.classList.add("was-validated");

  if (!form.checkValidity()) {
    e.stopPropagation();
  } else if (form.checkValidity()) {
    if (localStorage.getItem("login")) {
      localStorage.removeItem("login");
      localStorage.setItem("login", mail.value);
      window.location = "portada.html";
    } else {
      localStorage.setItem("login", mail.value);
      window.location = "portada.html";
    }
  }
});

function handleCredentialResponse() {
  localStorage.setItem("login", mail.value);
  window.location = "portada.html";
}
