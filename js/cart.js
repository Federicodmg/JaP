let container = document.getElementById("container");
let storageCart = JSON.parse(localStorage.getItem("cartArray"));
let cartArray = [];

document.addEventListener("DOMContentLoaded", () => {
    getJSONData(`${CART_INFO_URL}25801.json`).then(res => {
        if (res.status === "ok") {
            createCartArray(res.data.articles[0]);
            showShoppingCart();
            //Primero creamos el array del carrito dependiendo de si el usuario compró algo o no
            //y luego lo mostramos
        }
    });
});

function createCartArray(defaultCart) {
    if (storageCart) {
        cartArray.push(defaultCart);
        for (cart of storageCart) {
            cartArray.push(cart);
        }
    }
    //Si existe un carrito, le pusheamos el carrito de la request inicial y luego cada uno de los que haya en localStorage.

    if (!storageCart) {
        cartArray.push(defaultCart);
    }
    //Si no hay, el array solo va a consistir del default
}

function changeArticleTotal(event, id, cost) {
    document.getElementById(id).innerHTML = `${event.target.value * cost}`;
    //A los span con la ID del loop actual los editamos cuando ocurre un 'oninput'
}


function renderTableRows() {
    let tablehtml = "";

    for (i = 0; i < cartArray.length; i++) {
        let article = cartArray[i];
        tablehtml += `
            <tr>
                <td scope="row" class="text-center img-td">
                    <img src="${article.image}" alt="Imágen de un ${article.name}" class="img-table">
                </td>
                <td class="align-items info-td">
                    ${article.name}
                </td>
                <td class="align-items info-td">
                    ${article.currency} ${article.unitCost}
                </td>
                <td class="align-items info-td">
                    <input type="number" oninput="changeArticleTotal(event, ${article.id}, ${article.unitCost})" value="${article.count}" class="input-article">
                </td>
                <td class="align-items info-td">
                    <strong class="total-value">${article.currency} 
                        <span id="${article.id}">${article.unitCost * article.count}</span>
                    </strong>
                </td>
                <td class="align-items btn-td">
                    <button class="btn btn-danger" onclick="deleteItem(${article.id})">Remover</button>
                </td>
            </tr>
        `;
    }
    //Por cada elemento del cartArray creamos una fila con sus datos
    return tablehtml;
}

function renderRadio() {
    let radiohtml = "";

    radiohtml = `
    <div class="form-check">
        <input class="form-check-input" type="radio" name="envio" id="premium">
        <label class="form-check-label" for="premium">
            Premium 2 a 5 días (15%)
        </label>
    </div>
    <div class="form-check">
        <input class="form-check-input" type="radio" name="envio" id="express">
        <label class="form-check-label" for="express">
            Express 5 a 8 días (7%)
        </label>
    </div>
    <div class="form-check mb-3">
        <input class="form-check-input" type="radio" name="envio" id="standard">
        <label class="form-check-label" for="standard">
            Standard 12 a 15 días (5%)
        </label>
    </div>
    `;
    //Creamos los elementos que conforman el radio
    return radiohtml;
}

function showShoppingCart() {
    let htmlContentToAppend = "";

    htmlContentToAppend = `
        <h3>Artículos a comprar</h3>
        <table class="table table-hover table-sm">
          <thead>
            <tr>
              <th class="text-center" scope="col"></th>
              <th class="text-center" scope="col">Nombre</th>
              <th class="text-center" scope="col">Costo</th>
              <th class="text-center" scope="col">Cantidad</th>
              <th class="text-center" scope="col">Subtotal</th>
              <th class="text-center" scope="col"></th>
            </tr>
          </thead>
          <tbody>
            ${renderTableRows()}
          </tbody>
        </table>
        <hr>
        <h3>Tipo de envío</h3>
        ${renderRadio()}
        <h3>Dirección de envío</h3>
        <div class="row mb-3">
            <div class="mb-3 col-6 ">
                <label for="calle" class="form-label">Calle</label>
                <input type="text" class="form-control" id="calle">
            </div>
            <div class="mb-3 col-6">
                <label for="número" class="form-label">Número</label>
                <input type="number" class="form-control" id="número">
            </div>
            <div class="mb-3 col-6">
                <label for="esquina" class="form-label">Esquina</label>
                <input type="text" class="form-control" id="esquina">
            </div>
        </div>
        <hr>
        

    `;
    container.innerHTML = htmlContentToAppend;
    //Combinamos todo el HTML y lo ponemos en el container
}

