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
    deliveryCostUSD = 0,
    user = localStorage.getItem("login");


const dollar = 41;

document.addEventListener("DOMContentLoaded", () => {
    selectUser();
    showShoppingCart();
});

function selectUser() {
    if (!storageCart) return;

    let cart = {};
    for (let item in storageCart[user]) {
        cart[item] = storageCart[user][item];
    }
    storageCart = cart;
    //Pusheamos cada objeto del carrito del usuario al storageCart
}

function createPurchasesArray() {
    let array = [];
    for (purchase in storageCart) {
        storageCart[purchase].id = purchase;
        array.push(storageCart[purchase]);
    }
    return array;
    //Esto era más que nada para enviar al backend
}

function addFormValidation() {
    form.addEventListener('formdata', function (event) {
        if (!form.checkValidity()) {
            showError();
            event.preventDefault();
            event.stopPropagation();
        }

        if (form.checkValidity()) {
            event.preventDefault();
            createPurchasesArray();
            const formData = event.formData;
            formData.append("user", user);
            formData.append("purchases", JSON.stringify(createPurchasesArray()));
            success.classList.add("show");
            //Appendeamos al formData el usuario y sus compras
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
        transferenciaRadio.checked = false;
        cuentaInput.setAttribute("disabled", "");
        transferenciaInputs.forEach(input => {
            input.removeAttribute("disabled");
        });
        paymentSpan.innerHTML = "Tarjeta de crédito";
    } else if (e.target.id == "transferencia-radio") {
        tarjetaRadio.checked = false;
        cuentaInput.removeAttribute("disabled");
        transferenciaInputs.forEach(input => {
            input.setAttribute("disabled", "");
        });
        paymentSpan.innerHTML = "Transferencia bancaria";
    }
    //Habilitamos y deshabilitamos los campos de info dependiendo del método de pago
}

function totalPriceCalc() {
    totalPriceText.innerHTML = `Precio total: ${(deliveryCostUSD + subTotalPriceUSD).toFixed(2)} USD`;
    //Precio total
}

function deliveryCost(percentage = 15) {
    if (!storageCart) return;

    deliveryCostUSD = Number(((percentage / 100) * subTotalPriceUSD).toFixed(2));
    deliveryText.innerHTML = `Costo de envío: ${deliveryCostUSD} USD`;
    totalPriceCalc();
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
        subTotalPriceText.innerHTML = `Subtotal: ${subTotalPriceUSD} USD`;
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
    localStorage.setItem("cartObj", JSON.stringify(storageCart));
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
                <td scope="row" class="text-center">
                    <img src="${article.image}" alt="Imágen de un ${article.name}" class="img-table">
                </td>
                <td class="align-items">
                    ${article.name}
                </td>
                <td class="align-items">
                    <span class="hidden-span">Costo </span> ${article.currency} ${article.unitCost}
                </td>
                <td class="align-items">
                    <span class="hidden-span">Cantidad </span>
                    <input type="number" min="1" oninput="changeArticleTotal(event, ${productId}, ${article.unitCost})" value="${article.count}" class="input-article">
                </td>
                <td class="align-items">
                    <span class="hidden-span">Subtotal </span>
                    <strong class="total-value">${article.currency} 
                        <span id="${productId}">${article.unitCost * article.count}</span>
                    </strong>
                </td>
                <td class="align-items">
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
        <div class="row main-row">
            <div class="col-9 shadow">
                <table class="table table-hover table-sm">
                    <thead>
                    <tr class="info-tr">
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
            </div>
            <div class="col-3 shadow">
                <h3>Tipo de envío</h3>
                ${renderRadio()}
                <hr>
                <h3>Dirección de envío</h3>
                <form id="formulario" class="row mb-2 needs-validation" novalidate method="POST" action="http://localhost:3000/user_cart" >
                    <div class="mb-2 col-6">
                        <label for="calle" class="form-label">Calle</label>
                        <input type="text" class="form-control" id="calle" required name="street">
                        <div class="invalid-feedback">
                        Ingresa una calle.
                        </div>
                    </div>
                    <div class="mb-2 col-6">
                        <label for="número" class="form-label">Número</label>
                        <input type="number" class="form-control" id="número" required name="street-number">
                        <div class="invalid-feedback">
                        Ingresa un número.
                        </div>
                    </div>
                    <div class="mb-2 col-6">
                        <label for="esquina" class="form-label">Esquina</label>
                        <input type="text" class="form-control" id="esquina" required name="corner">
                        <div class="invalid-feedback">
                        Ingresa una esquina.
                        </div>
                    </div>
                </form>
                <hr>
                <h3>Costos</h3>
                <div>
                    <div class="">
                        <span class="cost-text" id="subtotal-price-text">Subtotal: ${subTotalPriceUSD} USD</span>
                        <p>Costo unitario del producto por cantidad</p>
                    </div>
                    <div class="">
                        <span class="cost-text" id="delivery-text">Costo de envío: ${deliveryCostUSD} USD</span>
                        <p class="cost-p" id="delivery-text"></p>
                        <p>Según el tipo de envío</p>
                    </div>
                    <div class="">
                        <span class="cost-text" id="total-price-text">Precio total: ${(subTotalPriceUSD + deliveryCostUSD)} USD</span>
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
            </div>
        </div>
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

