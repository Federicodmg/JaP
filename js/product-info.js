let productID = localStorage.getItem("productID");
let currentInfoArray;
let currentCommentArray = [];

document.addEventListener("DOMContentLoaded", () => {
  getJSONData(`${PRODUCT_INFO_COMMENTS_URL}${productID}.json`).then(
    (resultObj) => {
      if (resultObj.status === "ok") {
        currentCommentArray = resultObj.data;

        if (localStorage.getItem("comentarios")) {
          JSON.parse(localStorage.getItem("comentarios")).forEach((comment) =>
            currentCommentArray.push(comment)
          );
          // Si hay comentarios en el localStorage los pushea al array de comentarios luego del GET
        }

        getJSONData(`${PRODUCT_INFO_URL}${productID}.json`).then(
          (resultObj) => {
            if (resultObj.status === "ok") {
              currentInfoArray = resultObj.data;
              showProductInfo();
            }
          }
        );
      }
    }
  );
});

function addComment() {
  let comentario = {
    product: +localStorage.getItem("productID"),
    score: +document.getElementById("dropdownMenu2").innerText,
    description: document.getElementById("textArea").value,
    user: localStorage.getItem("login"),
    dateTime: moment().format("YYYY-MM-DD HH:mm:ss "), //Fecha usando la libreria moment para ahorrar dolor de gónadas
  };
  updateCommentStorage(comentario);
  currentCommentArray.push(comentario);
  showProductInfo();

  //Crea un objeto de comentario con los valores del HTML
  //Updatea el localStorage, lo pushea al array actual y actualiza el HTML
}

function updateCommentStorage(comment) {
  let arrayComentarios = [];
  let commentStorage = localStorage.getItem("comentarios");

  if (commentStorage) {
    arrayComentarios = JSON.parse(commentStorage);
  }
  arrayComentarios.push(comment);
  localStorage.setItem("comentarios", JSON.stringify(arrayComentarios));

  // Creamos un array vacío, si existe ya un array de comentarios lo reemplazamos por este
  //de otro modo simplemente pusheamos el comentario y actualizamos el localStorage
}

function setValue() {
  document.querySelectorAll(".dropdown-item").forEach((dropdown) => {
    dropdown.addEventListener("click", (e) => {
      document.getElementById("dropdownMenu2").innerText = e.target.innerText;
    });
  });

  //Al clickear un dropdown cambiamos el valor del input por el suyo
}

function showProductInfo() {
  let htmlContentToAppend = "";
  let commentLoop = "";
  let imageLoop = "";
  //Se reinician las variables para que al agregar un comentario no se destruya todo

  for (let i = 0; i < currentInfoArray.images.length; i++) {
    let image = currentInfoArray.images[i];

    imageLoop += `
			<div class="col-3">
				<div class="list-group-item">
					<a href="${image}">
						<img src="${image}" alt="Lights" style="width:100%">
					</a>
				</div>
			</div>
		`;
  } //Un loop de todas las imágenes del array

  for (let i = 0; i < currentCommentArray.length; i++) {
    let comment = currentCommentArray[i];
    let starRating = "";

    for (let i = 0; i < comment.score; i++) {
      starRating += `<span class="fa fa-star checked"></span>`;
    }
    for (let i = 0; i < 5 - comment.score; i++) {
      starRating += `<span class="fa fa-star"></span>`;
    }

    commentLoop += `
			<div class="list-group-item">
				<p><strong>${comment.user}</strong> - ${comment.dateTime} - ${starRating}</p>
				${comment.description}
			</div>
		`;
  } // Un loop que crea comentarios y le agrega una estrella por cada punto de score,
  // Para rellenar las estrellas restantes le resta al total las que haya en el score

  htmlContentToAppend += `
						<h1 class="mt-4">${currentInfoArray.name}</h1>
						<hr>
						<strong>Precio</strong>
							<p>${currentInfoArray.currency} ${currentInfoArray.cost}</p>
						<strong>Descripción</strong>
							<p>${currentInfoArray.description}</p>
						<strong>Categoría</strong>
							<p>${currentInfoArray.category}</p>
						<strong>Cantidad de vendidos</strong>
							<p>${currentInfoArray.soldCount}</p>
						<strong class="mb-2">Imágenes ilustrativas</strong>
						<div class="row">
							${imageLoop}
						</div>
						<h4 class="mt-2">Comentarios</h4>
							${commentLoop}
						<h4 class="mt-2">Comentar</h4>
						<p>Tu opinión:</p>
						<textarea id="textArea" style="width:50%; height:100px"></textarea>
						<p class="mt-3">Tu puntuación:</p>
						<div class="dropdown">
							<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenu2" data-bs-toggle="dropdown" aria-expanded="false">
								1
							</button>
							<ul class="dropdown-menu" aria-labelledby="dropdownMenu2">
								<li><button class="dropdown-item" type="button">1</button></li>
								<li><button class="dropdown-item" type="button">2</button></li>
								<li><button class="dropdown-item" type="button">3</button></li>
								<li><button class="dropdown-item" type="button">4</button></li>
								<li><button class="dropdown-item" type="button">5</button></li>
							</ul>
							<br>
							<button type="button" onclick="addComment()" class="btn btn-primary mt-2">Enviar</button>
						</div>
						
					`;
  //El html donde todos los loop se unen

  document.getElementById("cat-list-container").innerHTML = htmlContentToAppend;

  setValue();
  //Se ejecuta luego de dibujar el HTML para darle a todos los items un evento
}
