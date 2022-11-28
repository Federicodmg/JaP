let container = document.getElementById("container"),
    danger = document.getElementById("alert-danger"),
    form = document.getElementById("form"),
    profileImage = document.getElementById("profile-img"),
    emailInput = document.getElementById("email"),
    imageInput = document.getElementById("image"),
    localStorageMail = localStorage.getItem("login"),
    profileDataArray = localStorage.getItem("profileDataArray"),
    userDataIndex,
    profileData;

document.addEventListener("DOMContentLoaded", () => {
    emailInput.value = localStorageMail;
    loadProfileData();
});

function loadProfileData() {
    if (!profileDataArray) return;
    profileDataArray = JSON.parse(profileDataArray);
    userDataIndex = profileDataArray.findIndex(profile => profile.email == localStorageMail);

    if (!profileDataArray[userDataIndex]) return;

    profileData = profileDataArray.filter(profile => profile.email == localStorageMail)[0];
    document.querySelectorAll("#form input").forEach(input => {
        if (input.id == "image" && profileDataArray[userDataIndex].image) {
            profileImage.src = profileData[input.id];
        } else if (input.id != "image") {
            input.value = profileData[input.id];
        }
    });
    //Si no hay un array que checkear retornamos
    //buscamos el index de usuario usando el localStorageMail, y si no existe también retornamos
    //finalmente con filter sacamos del array el objeto con los datos del perfil
}

function createUserObj() {
    let localStorageImg = localStorage.getItem("profileImg");
    let userObj = Array.from(document.querySelectorAll("#form input")).reduce((acc, input) => ({
        ...acc, [input.id]: input.value
    }), {});

    if (localStorageImg) userObj.image = localStorageImg;
    if (userObj.email != localStorageMail) {
        emailInput.value = userObj.email;
        localStorage.setItem("login", userObj.email);
        profileDataArray[userDataIndex].email = userObj.email;
    }

    if (profileDataArray && profileDataArray[userDataIndex]) {
        profileDataArray[userDataIndex] = userObj;
    } else if (profileDataArray && !profileDataArray[userDataIndex]) {
        profileDataArray.push(userObj);
    } else if (!profileDataArray) {
        profileDataArray = [];
        profileDataArray.push(userObj);
    }

    localStorage.setItem("profileDataArray", JSON.stringify(profileDataArray));

    //Creamos un array reduciendo los campos del input a grupos de clave valor usando un acumulador
    //el {} es para que no se ignore el primer input

    //Si el mail es modificado, se cambia el input del formulario, el login de localStorage y el objeto de usuario
    //Si existe el array y ya hay un objeto, se lo iguala al nuevo
    //si existe el array pero no el usuario, se pushea su objeto
    //de lo contrario se cra el array de usuarios
}

form.addEventListener("submit", (e) => {
    if (!form.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
        danger.classList.add("show");
    } else if (form.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
        createUserObj();
    }
});

imageInput.addEventListener("change", () => {
    const reader = new FileReader();
    reader.readAsDataURL(imageInput.files[0]);

    reader.addEventListener("load", () => {
        localStorage.setItem("profileImg", reader.result);
        profileImage.src = reader.result;
    });
    //Se lee la imágen y se guarda en localStorage, a la vez que se cambia la imágen en pantalla
});
