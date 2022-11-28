const ORDER_ASC_BY_NAME = "AZ";
const ORDER_DESC_BY_NAME = "ZA";
const ORDER_BY_PROD_COUNT = "Cant.";
let currentCategoriesArray = [];
let currentSortCriteria = undefined;
let minCount = undefined;
let maxCount = undefined;

function sortCategories(criteria, array) {
  let result = [];
  if (criteria === ORDER_ASC_BY_NAME) {
    result = array.sort(function (a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
  } else if (criteria === ORDER_DESC_BY_NAME) {
    result = array.sort(function (a, b) {
      if (a.name > b.name) {
        return -1;
      }
      if (a.name < b.name) {
        return 1;
      }
      return 0;
    });
  } else if (criteria === ORDER_BY_PROD_COUNT) {
    result = array.sort(function (a, b) {
      let aCount = parseInt(a.productCount);
      let bCount = parseInt(b.productCount);

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
  localStorage.setItem("catID", id);
  window.location = "products.html";
}

function showCategoriesList() {
  let htmlContentToAppend = "";
  for (let i = 0; i < currentCategoriesArray.length; i++) {
    let category = currentCategoriesArray[i];

    if (
      (minCount == undefined ||
        (minCount != undefined &&
          parseInt(category.productCount) >= minCount)) &&
      (maxCount == undefined ||
        (maxCount != undefined && parseInt(category.productCount) <= maxCount))
    ) {
      htmlContentToAppend += `
            <div onclick="setCatID(${category.id})" class="row cursor-active col-6 mb-3 shadow custom-card">
              <div class="col-6 cat-col">
                  <img src="${category.imgSrc}" alt="${category.description}" class="card-img">
              </div>
              <div class="col-6 cat-col">
                  <h4 class="mb-1 mt-2">${category.name}</h4>
                  <hr>
                  <p>${category.description}</p>
                  <p class="mb-0">${category.productCount} artículos disponibles</p>
              </div>
            </div>
            `;
    }

    document.getElementById("cat-list-container").innerHTML =
      htmlContentToAppend;
  }
}

function sortAndShowCategories(sortCriteria, categoriesArray) {
  currentSortCriteria = sortCriteria;

  if (categoriesArray != undefined) {
    currentCategoriesArray = categoriesArray;
  }

  currentCategoriesArray = sortCategories(
    currentSortCriteria,
    currentCategoriesArray
  );

  showCategoriesList();
}

function selectFilter(e) {
  sortAndShowCategories(e.target.value);
  //Filtra dependiendo del value de la opción elegida, A-Z, Z-A, etc.
}

function clearFilter(id) {
  document.getElementById(`rangeFilterCountMin${id}`).value = "";
  document.getElementById(`rangeFilterCountMax${id}`).value = "";

  minCount = undefined;
  maxCount = undefined;

  showCategoriesList();
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

  showCategoriesList();
  //Selecciona los valores de filtrado correctos, usa una ID ya que existe dos veces casi el mismo código
  //solo que se cambian dependiendo del tamaño de pantalla
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
  getJSONData(CATEGORIES_URL).then(function (resultObj) {
    if (resultObj.status === "ok") {
      currentCategoriesArray = resultObj.data;
      showCategoriesList();
    }
  });
});
