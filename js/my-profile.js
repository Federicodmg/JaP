let container = document.getElementById("container"),
    form = document.getElementById("form"),
    profileImage = document.getElementById("profile-img"),
    emailInput = document.getElementById("email"),
    imageInput = document.getElementById("image"),
    localStorageMail = localStorage.getItem("login"),
    localStorageImg = localStorage.getItem("profileImg"),
    profileData = localStorage.getItem("profileData");

document.addEventListener("DOMContentLoaded", () => {
    emailInput.value = localStorageMail;
    loadProfileData();
});

function loadProfileData() {
    if (!profileData) return;
    profileData = JSON.parse(profileData);

    document.querySelectorAll("#form input").forEach(input => {
        if (input.id == "image") {
            profileImage.src = profileData[input.id];
        } else if (input.id != "image") {
            input.value = profileData[input.id];
        }
    });

}

function createUserObj() {
    let userObj = Array.from(document.querySelectorAll("#form input")).reduce((acc, input) => ({
        ...acc, [input.id]: input.value
    }), {});
    delete userObj["image"];

    if (localStorageImg) userObj.image = localStorageImg;
    if (userObj.email != localStorageMail) localStorage.setItem("login", userObj.email);

    localStorage.setItem("profileData", JSON.stringify(userObj));
}

form.addEventListener("submit", (e) => {
    if (!form.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
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
});
