document.addEventListener("DOMContentLoaded", function(){
    if (!localStorage.getItem("logged")) window.location = "login.html"

    document.getElementById("autos").addEventListener("click", function() {
        localStorage.setItem("catID", 101);
        windows.location = "products.html"
    });
    document.getElementById("juguetes").addEventListener("click", function() {
        localStorage.setItem("catID", 102);
    });
    document.getElementById("muebles").addEventListener("click", function() {
        localStorage.setItem("catID", 103);
    });

});