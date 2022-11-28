let productID = +localStorage.getItem("productID");
let commentArray = JSON.parse(localStorage.getItem("comentarios"));
let currentLogin = localStorage.getItem("login");
let currentInfoArray;
let currentCommentArray = [];
let cartObj = localStorage.getItem("cartObj");
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
  if (!document.getElementById("comment-input").value) return;

  let comentario = {
    product: +localStorage.getItem("productID"),
    score: +document.getElementById("dropdownMenu2").innerText,
    description: document.getElementById("comment-input").value,
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
				<p class="m-0"><strong class="comment-user">${comment.user}</strong><span class="comment-date"> ${comment.dateTime}</span></p>
        <p>${starRating}</p>
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
			<div class="col-6 related-item-col" onclick="relatedProductRefresh(${item.id})">
				<div class="list-group-item">
					<img src="${item.image}" alt="" style="width:100%">
          <p class="related-item-name">${item.name}</p>
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
  let currentItemInCart;
  let currentCartObj = {};

  let product = {
    name: currentInfoArray.name,
    count: +1,
    unitCost: currentInfoArray.cost,
    currency: currentInfoArray.currency,
    image: currentInfoArray.images[0],
    id: currentInfoArray.id
  };

  if (cartObj) {
    currentCartObj = JSON.parse(cartObj);
    if (currentCartObj[currentLogin]) currentItemInCart = currentCartObj[currentLogin].find(item => item.id == currentInfoArray.id);
  }
  //Si existe el carrito se lo parsea, y si tiene el login actual nos fijamos si existe en el carrito actual

  if (
    cartObj && currentItemInCart
  ) {
    danger.classList.add("show");
    return;
  }
  //Si el item está en el carrito se retorna y tira alerta

  if (currentCartObj[currentLogin]) {
    currentCartObj[currentLogin].push(product);
  } else if (!currentCartObj[currentLogin]) {
    let array = [];
    array.push(product);
    currentCartObj[currentLogin] = array;
  }
  //Si existe ya un usuario con su array de productos, le pusheamos uno nuevo
  //de lo contrario le creamos un array vacío primero

  localStorage.setItem("cartObj", JSON.stringify(currentCartObj));
  success.classList.add("show");
  //Pusheamos el producto al array, lo guardamos en localStorage y sale una alerta
}

function startCarousel() {
  let myCarousel = document.querySelector('#carouselExampleIndicators');
  let carousel = new bootstrap.Carousel(myCarousel, {
    interval: 5000,
    wrap: true
  });
  //Para que el carrusel ande desde el DOMContentLoaded
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
            <div class="row main-row shadow">
              <div class="col-7 img-col">
                <div id="carouselExampleIndicators" class="carousel carousel-dark slide">
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
              <div class="col-5 d-flex flex-column info-col">
                <div>
                  <p class="description-name">Nombre</p>
                  <p class="description-text">${currentInfoArray.name}</p>
                </div>
                <div>
                  <p class="description-name">Precio</p>
                  <p class="description-text">${currentInfoArray.currency} ${currentInfoArray.cost}</p>
                </div>
                <div>
                  <p class="description-name">Descripción</p>
                  <p class="description-text">${currentInfoArray.description}</p>
                </div>
                <div>
                  <p class="description-name">Categoría</p>
                  <p class="description-text">${currentInfoArray.category}</p>
                </div>
                <div>
                  <p class="description-name">Cantidad de vendidos</p>
                  <p class="description-text">${currentInfoArray.soldCount}</p>
                </div>
                <button class="btn btn-success" onclick="purchaseItem()">Comprar</button>
              </div>
            </div>
            <div class="row comment-row">
              <div class="col-6 shadow">
                <h4>Comentarios</h4>
                ${commentLoop}
              </div>
              <div class="col-6 shadow related-products">
                <h4 class="comment-label">Deje su comentario y opinión aquí</h4>
                <input type="text" class="comment-input" placeholder="Me parece..." id="comment-input">
                <div class="dropdown rating-dropdown">
                  <button class="btn btn-secondary dropdown-toggle my-3" type="button" id="dropdownMenu2" data-bs-toggle="dropdown" aria-expanded="false">
                    1
                  </button>
                  <ul class="dropdown-menu" aria-labelledby="dropdownMenu2">
                    <li><button class="dropdown-item" type="button">1</button></li>
                    <li><button class="dropdown-item" type="button">2</button></li>
                    <li><button class="dropdown-item" type="button">3</button></li>
                    <li><button class="dropdown-item" type="button">4</button></li>
                    <li><button class="dropdown-item" type="button">5</button></li>
                  </ul>
                </div>
                <button type="button" onclick="addComment()" class="btn btn-primary my-3">Enviar</button>
                <h3>Productos relacionados</h3>
                <div class="row" style="cursor: pointer">
                  ${relatedItems}
                </div>
              </div>
            </div>
					`;
  //El html donde todos los loop se unen

  document.getElementById("cat-list-container").innerHTML = htmlContentToAppend;

  setValue();
  startCarousel();
  //Se ejecuta luego de dibujar el HTML para darle a todos los items un evento
  //Usando el input type select me ahorraba esto pero bueno :)
}
