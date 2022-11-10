let container = document.getElementById("container"),
    transferenciaInputs = document.querySelectorAll(".tarjeta-inputs input"),
    cuentaInput = document.getElementById("num-cuenta"),
    storageCart = JSON.parse(localStorage.getItem("cartObj")),
    tarjetaRadio = document.getElementById("tarjeta-radio"),
    transferenciaRadio = document.getElementById("transferencia-radio"),
    success = document.getElementById("alert-success"),
    deliveryText,
    paymentSpan,
    invalidPayment,
    form,
    totalPriceText,
    subTotalPriceText,
    subTotalPriceUSD = 0,
    deliveryCostUSD = 0;

const dollar = 41;

document.addEventListener("DOMContentLoaded", () => {
    showShoppingCart();
});


function addFormValidation() {
    form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
            showError();
            event.preventDefault();
            event.stopPropagation();
        }

        if (form.checkValidity()) {
            event.preventDefault();
            success.classList.add("show");
        }

        form.classList.add('was-validated');
    });
}

function showError() {
    if (!tarjetaRadio.checked && !transferenciaRadio.checked) {
        invalidPayment.classList.add("block");
    } else if (tarjetaRadio.checked || transferenciaRadio.checked) {
        invalidPayment.classList.remove("block");
    }
    //Mostramos o no un error en caso de no tener método de pago
}

function toggleRadio(e) {
    showError();
    if (e.target.id == "tarjeta-radio") {
        cuentaInput.setAttribute("disabled", "");
        transferenciaInputs.forEach(input => {
            input.removeAttribute("disabled");
        });
        paymentSpan.innerHTML = "Tarjeta de crédito";
    } else if (e.target.id == "transferencia-radio") {
        cuentaInput.removeAttribute("disabled");
        transferenciaInputs.forEach(input => {
            input.setAttribute("disabled", "");
        });
        paymentSpan.innerHTML = "Transferencia bancaria";
    }
    //Habilitamos y deshabilitamos los campos de info dependiendo del método de pago
}

function totalPriceCalc() {
    totalPriceText.innerHTML = `${(deliveryCostUSD + subTotalPriceUSD).toFixed(2)} USD`;
    //Precio total
}

function deliveryCost(percentage = 15) {
    if (!storageCart) return;

    deliveryCostUSD = Number(((percentage / 100) * subTotalPriceUSD).toFixed(2));
    deliveryText.innerHTML = `${deliveryCostUSD} USD`;
    //Costo de delivery
}

function subtotalPriceCalc() {
    if (!storageCart) return;
    subTotalPriceUSD = 0;

    for (const productId in storageCart) {
        const product = storageCart[productId];
        if (product.currency == "USD") {
            subTotalPriceUSD += product.unitCost * product.count;
        } else if (product.currency == "UYU") {
            subTotalPriceUSD += (product.unitCost * product.count) / dollar;
        }
    }

    subTotalPriceUSD = Number(subTotalPriceUSD.toFixed(2));

    if (subTotalPriceText) {
        subTotalPriceText.innerHTML = `${subTotalPriceUSD} USD`;
    } //Si ya existe un subtotal, permitimos actualizar su innerHTML para cuando cambiemos el total del artículo

    //Calculamos el subtotal a partir de los articulos del carrito
}

function deleteItem(id) {
    delete storageCart[id];
    localStorage.setItem("cartObj", JSON.stringify(storageCart));
    showShoppingCart();
    //Borramos un artículo y refrescamos la página
}


function changeArticleTotal(event, id, cost) {
    let value;

    if (event.target.value < event.target.min) {
        event.target.value = event.target.min;
        value = event.target.min;
    } else if (event.target.value >= event.target.min) {
        value = event.target.value;
    }

    document.getElementById(id).innerHTML = `${value * cost}`;
    storageCart[id].count = value;
    subtotalPriceCalc();
    deliveryCost();
    totalPriceCalc();
    //A los span con la ID del loop actual los editamos cuando ocurre un 'oninput'
    //Hacemos imposible que el valor del input sea menor al mínimo de 1
    //Y actualizamos el carrito con el nuevo valor
}


function renderTableRows() {
    let tablehtml = "";

    for (const productId in storageCart) {
        const article = storageCart[productId];
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
                    <input type="number" min="1" oninput="changeArticleTotal(event, ${productId}, ${article.unitCost})" value="${article.count}" class="input-article">
                </td>
                <td class="align-items info-td">
                    <strong class="total-value">${article.currency} 
                        <span id="${productId}">${article.unitCost * article.count}</span>
                    </strong>
                </td>
                <td class="align-items btn-td">
                    <button class="btn btn-danger" onclick="deleteItem(${productId})">Remover</button>
                </td>
            </tr>
        `;
    }
    //Por cada elemento del cartObj creamos una fila con sus datos
    return tablehtml;
}

function renderRadio() {
    let radiohtml = "";

    radiohtml = `
    <div class="form-check">
        <input class="form-check-input" type="radio" name="envio" id="premium" checked onclick="deliveryCost(15)">
        <label class="form-check-label" for="premium">
            Premium 2 a 5 días (15%)
        </label>
    </div>
    <div class="form-check">
        <input class="form-check-input" type="radio" name="envio" id="express" onclick="deliveryCost(7)">
        <label class="form-check-label" for="express">
            Express 5 a 8 días (7%)
        </label>
    </div>
    <div class="form-check mb-3">
        <input class="form-check-input" type="radio" name="envio" id="standard" onclick="deliveryCost(5)">
        <label class="form-check-label" for="standard">
            Standard 12 a 15 días (5%)
        </label>
    </div>
    `;
    //Creamos los elementos que conforman el radio
    return radiohtml;
}

function showShoppingCart() {
    subtotalPriceCalc();

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
        <form id="formulario" class="row mb-3 needs-validation" novalidate>
            <div class="mb-3 col-6">
                <label for="calle" class="form-label">Calle</label>
                <input type="text" class="form-control" id="calle" required>
                <div class="invalid-feedback">
                Ingresa una calle.
                </div>
            </div>
            <div class="mb-3 col-6">
                <label for="número" class="form-label">Número</label>
                <input type="number" class="form-control" id="número" required>
                <div class="invalid-feedback">
                Ingresa un número.
                </div>
            </div>
            <div class="mb-3 col-6">
                <label for="esquina" class="form-label">Esquina</label>
                <input type="text" class="form-control" id="esquina" required>
                <div class="invalid-feedback">
                Ingresa una esquina.
                </div>
            </div>
        </form>
        <hr>
        <h3>Costos</h3>
        <div class="container">
            <div class="row list-group-item">
                <div class="col-6 d-flex w-100 justify-content-between">
                    <p class="text-decoration-underline">Subtotal</p>
                    <p class="text-end" id="subtotal-price-text">${subTotalPriceUSD} USD</p>
                </div>
                <div class="col-6">
                    <p>Costo unitario del producto por cantidad</p>
                </div>
            </div>
            <div class="row list-group-item">
                <div class="col-6 d-flex w-100 justify-content-between">
                    <p class="text-decoration-underline">Costo de envío</p>
                    <p class="text-end" id="delivery-text">${deliveryCostUSD} USD</p>
                </div>
                <div class="col-6">
                    <p>Según el tipo de envío</p>
                </div>
            </div>
            <div class="row list-group-item">
                <div class="col d-flex w-100 justify-content-between">
                    <p class="text-decoration-underline">Total (USD)</p>
                    <p class="text-end" id="total-price-text">${(subTotalPriceUSD + deliveryCostUSD)} USD</p>
                </div>
            </div>
        </div>
        <hr>
        <div> 
            <h3>Forma de pago</h3>
            <span id="payment-span">No ha seleccionado</span>
            <button type="button" class="btn btn-link ps-0" data-bs-toggle="modal"
            data-bs-target="#exampleModal">Seleccionar</button>
            <span class="invalid-feedback mb-3" id="invalid-payment">
                Debe seleccionar una forma de pago
            </span>
        </div>
        <button form="formulario" type="submit" class="btn btn-primary w-100">Finalizar compra</button>

    `;
    container.innerHTML = htmlContentToAppend;
    //Combinamos todo el HTML y lo ponemos en el container

    deliveryText = document.getElementById("delivery-text");
    totalPriceText = document.getElementById("total-price-text");
    subTotalPriceText = document.getElementById("subtotal-price-text");
    paymentSpan = document.getElementById("payment-span");
    form = document.getElementById("formulario");
    invalidPayment = document.getElementById("invalid-payment");
    //Traemos un montón de elementos para cambiar sus valores dinámicamente

    deliveryCost();
    totalPriceCalc();
    addFormValidation();
    //Ejecutamos las funciones para mostrar correctamente los costos cada vez que el carrito es creado
}

