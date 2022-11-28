const ORDER_ASC_BY_PRICE = "AZ";
const ORDER_DESC_BY_PRICE = "ZA";
const ORDER_BY_REL = "Rel.";
let currentProductsArray = [];
let currentSortCriteria = undefined;
let minCount = undefined;
let maxCount = undefined;
let currentID = localStorage.getItem("catID");
let inputBusqueda = document.getElementById("busqueda");
let inputBusquedaSm = document.getElementById("busqueda-sm");
let busquedaFiltrada;

function sortProducts(criteria, array) {
  let result = [];
  if (criteria === ORDER_ASC_BY_PRICE) {
    result = array.sort(function (a, b) {
      if (a.cost < b.cost) {
        return -1;
      }
      if (a.cost > b.cost) {
        return 1;
      }
      return 0;
    });
  } else if (criteria === ORDER_DESC_BY_PRICE) {
    result = array.sort(function (a, b) {
      if (a.cost > b.cost) {
        return -1;
      }
      if (a.cost < b.cost) {
        return 1;
      }
      return 0;
    });
  } else if (criteria === ORDER_BY_REL) {
    result = array.sort(function (a, b) {
      let aCount = parseInt(a.soldCount);
      let bCount = parseInt(b.soldCount);

      if (aCount > bCount) {
        return -1;
      }
      if (aCount < bCount) {
        return 1;
      }
      return 0;
    });
  }

  return result;
}

function setCatID(id) {
  localStorage.setItem("productID", id);
  window.location = "product-info.html";
}

function showProductsList() {
  let array = busquedaFiltrada ? busquedaFiltrada : currentProductsArray;
  let htmlContentToAppend = "";
  for (let i = 0; i < array.length; i++) {
    let product = array[i];
    if (
      (minCount == undefined ||
        (minCount != undefined && parseInt(product.cost) >= minCount)) &&
      (maxCount == undefined ||
        (maxCount != undefined && parseInt(product.cost) <= maxCount))
    ) {
      htmlContentToAppend += `
          <div onclick="setCatID(${product.id})" class="row cursor-active col-6 mb-3 shadow custom-card">
            <div class="col-6 cat-col">
                <img src="${product.image}" alt="${product.description}" class="card-img">
            </div>
            <div class="col-6 cat-col">
                <h4 class="mb-1 mt-2">${product.name} </h4>
                <hr>
                <p>${product.description}</p>
                <small>${product.currency} ${product.cost} - ${product.soldCount} vendidos</small>
            </div>
          </div>
          `;
    }
  }
  document.getElementById("cat-list-container").innerHTML = htmlContentToAppend;
}

function sortAndShowProducts(sortCriteria, productsArray) {
  currentSortCriteria = sortCriteria;

  if (productsArray != undefined) {
    currentProductsArray = productsArray;
  }

  if (busquedaFiltrada) {
    busquedaFiltrada = sortProducts(currentSortCriteria, busquedaFiltrada);
  }

  currentProductsArray = sortProducts(
    currentSortCriteria,
    currentProductsArray
  );

  //Muestro las categorías ordenadas
  showProductsList();
}

function selectFilter(e) {
  sortAndShowProducts(e.target.value);
  //Filtra dependiendo del value de la opción elegida, A-Z, Z-A, etc.
}

function clearFilter(id) {
  document.getElementById(`rangeFilterCountMin${id}`).value = "";
  document.getElementById(`rangeFilterCountMax${id}`).value = "";

  minCount = undefined;
  maxCount = undefined;

  showProductsList();
  //Limpia los filtros, usa una ID ya que existe dos veces casi el mismo código
  //solo que se cambian dependiendo del tamaño de pantalla
}

function filterCount(id) {
  minCount = document.getElementById(`rangeFilterCountMin${id}`).value;
  maxCount = document.getElementById(`rangeFilterCountMax${id}`).value;

  if (minCount != undefined && minCount != "" && parseInt(minCount) >= 0) {
    minCount = parseInt(minCount);
  } else {
    minCount = undefined;
  }

  if (maxCount != undefined && maxCount != "" && parseInt(maxCount) >= 0) {
    maxCount = parseInt(maxCount);
  } else {
    maxCount = undefined;
  }

  showProductsList();
  //Selecciona los valores de filtrado correctos, usa una ID ya que existe dos veces casi el mismo código
  //solo que se cambian dependiendo del tamaño de pantalla
}

document.addEventListener("DOMContentLoaded", function (e) {
  getJSONData(`${PRODUCTS_URL}${currentID}.json`).then(function (resultObj) {
    if (resultObj.status === "ok") {
      currentProductsArray = resultObj.data.products;
      showProductsList();
      //sortAndShowProducts(ORDER_ASC_BY_PRICE, resultObj.data);
    }
  });

  inputBusqueda.addEventListener("input", (e) => {
    let busquedaActual = e.target.value.toLowerCase();

    busquedaFiltrada = currentProductsArray.filter((producto) => {
      return (
        producto.name.toLowerCase().includes(busquedaActual) ||
        producto.description.toLowerCase().includes(busquedaActual)
      );
    });

    showProductsList();
    //Filtra los productos dependiendo del valor del input
  });

  inputBusquedaSm.addEventListener("input", (e) => {
    let busquedaActual = e.target.value.toLowerCase();

    busquedaFiltrada = currentProductsArray.filter((producto) => {
      return (
        producto.name.toLowerCase().includes(busquedaActual) ||
        producto.description.toLowerCase().includes(busquedaActual)
      );
    });

    showProductsList();
    //Filtra los productos dependiendo del valor del input
  });
});
