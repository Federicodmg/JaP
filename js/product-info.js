let productID = +localStorage.getItem("productID");
let commentArray = JSON.parse(localStorage.getItem("comentarios"));
let currentInfoArray;
let currentCommentArray = [];
let cartArray = localStorage.getItem("cartArray");
let success = document.getElementById("alert-success");
let danger = document.getElementById("alert-danger");

document.addEventListener("DOMContentLoaded", () => {
  getJSONData(`${PRODUCT_INFO_COMMENTS_URL}${productID}.json`).then(
    (resultObj) => {
      if (resultObj.status === "ok") {
        currentCommentArray = resultObj.data;

        if (commentArray) {
          identifyComments();
        } //Si hay un array de comentarios, identifica cuales pertenecen a este producto

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

function identifyComments() {
  for (i = 0; i < commentArray.length; i++) {
    let comment = commentArray[i];

    if (comment.product === productID) {
      currentCommentArray.push(comment);
    }
  }
}

function addComment() {
  if (!document.getElementById("textArea").value) return;

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

function relatedProductRefresh(id) {
  localStorage.setItem("productID", id);
  window.location = "product-info.html";
  //Refresca la página con un producto relacionado
}

function createComments() {
  let commentLoop = "";

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
  }

  return commentLoop;
  // Un loop que crea comentarios y le agrega una estrella por cada punto de score,
  // Para rellenar las estrellas restantes le resta al total las que haya en el score
}

function createRelatedItems() {
  let relatedItems = "";

  for (let i = 0; i < currentInfoArray.relatedProducts.length; i++) {
    let item = currentInfoArray.relatedProducts[i];

    relatedItems += `
			<div class="col-3" onclick="relatedProductRefresh(${item.id})">
				<div class="list-group-item">
					<img src="${item.image}" alt="" style="width:100%">
          <p>${item.name}</p>
				</div>
			</div>
		`;
  }
  return relatedItems;
  //Crea un loop de productos relacionados con un evento para cambiar de página
}

function createImages() {
  let imageLoop = "";

  imageLoop += `
      <div class="carousel-item active">
        <img src="${currentInfoArray.images[0]}" class="d-block w-100" alt="">
      </div>
		`; //Agrega la primer imágen del array la cual tiene la clase 'active'

  for (let i = 1; i < currentInfoArray.images.length - 1; i++) {
    let image = currentInfoArray.images[i];

    imageLoop += `
      <div class="carousel-item">
        <img src="${image}" class="d-block w-100" alt="">
      </div>
		`;
  }
  return imageLoop;
  //Comienza el loop desde 1 para no repetir imágenes y loopea -1 para no pasarse de cantidad
}

function purchaseItem() {
  let currentCartArray = [];
  //Creamos un array vacío

  if (
    cartArray && cartArray.includes(currentInfoArray.id) ||
    productID === 50924
  ) {
    danger.classList.add("show");
    return;
  }
  //Si el array incluye la ID de lo que intentamos agregar
  // o es 50924 (la default de la request) no se agrega

  if (cartArray) {
    currentCartArray = JSON.parse(cartArray);
  }
  //Si hay un carrito lo traemos

  let producto = {
    id: currentInfoArray.id,
    name: currentInfoArray.name,
    count: +1,
    unitCost: currentInfoArray.cost,
    currency: currentInfoArray.currency,
    image: currentInfoArray.images[0]
  };
  //Creamos el producto con los datos

  currentCartArray.push(producto);
  localStorage.setItem("cartArray", JSON.stringify(currentCartArray));
  success.classList.add("show");
  //Pusheamos el producto al array, lo guardamos en localStorage y sale una alerta
}

function showProductInfo() {
  let htmlContentToAppend = "";
  let commentLoop = "";
  let imageLoop = "";
  let relatedItems = "";
  //Se reinician las variables para que al agregar un comentario no se destruya todo

  relatedItems = createRelatedItems();
  imageLoop = createImages();
  commentLoop = createComments();

  htmlContentToAppend += `
            <div class="header-prod-info mt-3">
                <h1>${currentInfoArray.name}</h1>
                <button class="btn btn-success" onclick="purchaseItem()">Comprar</button>
            </div>
            <hr>
            <div class="row">
              <div class="col-6 d-flex justify-content-between flex-column">
                <strong>Precio</strong>
                  <p>${currentInfoArray.currency} ${currentInfoArray.cost}</p>
                <strong>Descripción</strong>
                  <p>${currentInfoArray.description}</p>
                <strong>Categoría</strong>
                  <p>${currentInfoArray.category}</p>
                <strong>Cantidad de vendidos</strong>
                  <p>${currentInfoArray.soldCount}</p>
              </div>
              <div class="col-6">
                <div id="carouselExampleIndicators" class="carousel carousel-dark slide" data-bs-ride="carousel">
                  <div class="carousel-indicators">
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                </div>
                <div class="carousel-inner">
                    ${imageLoop}
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
                </div>
              </div>
            </div>
            <hr>
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
            <hr>
            <h4>Productos relacionados</h4>
            <div class="row" style="cursor: pointer">
              ${relatedItems}
						</div>
            

						
					`;
  //El html donde todos los loop se unen

  document.getElementById("cat-list-container").innerHTML = htmlContentToAppend;

  setValue();
  //Se ejecuta luego de dibujar el HTML para darle a todos los items un evento
  //Usando el input type select me ahorraba esto pero bueno :)
}
