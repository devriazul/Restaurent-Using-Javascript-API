function spinnerControl(remove, add) {
  const spinner = document.getElementById("spinner");
  spinner.classList.remove(remove);
  spinner.classList.add(add);
}
const searchBtn = document.getElementById("search-btn");
searchBtn.addEventListener("click", () => {
  const searchField = document.getElementById("search-field");

  // Error Handling
  const errorDiv = document.getElementById("error-message");
  if (searchField.value == "") {
    errorDiv.innerText = "😝 Please write something to search";
  } else {
    errorDiv.innerText = "";

    // Spinner

    spinnerControl("d-none", "d-block");
    // Load Meals APi ..........

    const loadMeals = () => {
      const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchField.value}`;
      fetch(url)
        .then((res) => res.json())
        .then((data) => displayMeals(data))
        .catch((error) => displayError(error));
    };
    const displayError = (error) => {
      searchField.value = "";
      document.getElementById("result-container").textContent = "";
      let errorMessage = "No result found 😔";
      const resultCount = document.getElementById("result-count");
      resultCount.innerText = errorMessage;
    };
    loadMeals();

    // Display Meals.........

    const displayMeals = (data) => {
      const resultContainer = document.getElementById("result-container");
      spinnerControl("d-block", "d-none");
      const mealsFromData = data.meals;
      const resultCount = document.getElementById("result-count");
      if (mealsFromData.length > 1) {
        resultCount.innerHTML = `${data.meals.length} results found for "<strong>${searchField.value}</strong>" 😃`;
      } else if (mealsFromData.length == 1) {
        resultCount.innerHTML = `${data.meals.length} result found for "<strong>${searchField.value}</strong>" 😃`;
      }

      searchField.value = "";
      resultContainer.textContent = "";

      // Show Results ........

      data.meals.forEach((meal) => {
        const createDiv = document.createElement("div");
        createDiv.classList.add("col");
        createDiv.innerHTML = `
          <div class="card shadow border-0 p-2">
              <img src="${meal.strMealThumb}" class="card-img-top" alt="...">
              <div class="card-body">
                  <h5 class="card-title">${meal.strMeal}</h5>
                  <p class="card-text">${meal.strInstructions.slice(0, 150)}</p>
                  <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#meal-details" onclick="mealDetails(${
                    meal.idMeal
                  })">More Details</button>
              </div>
          </div>
        `;
        resultContainer.appendChild(createDiv);
      });
    };
  }
});

// Meal Details Modal

const mealDetails = (mealId) => {
  const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => displayMealDetails(data.meals[0]));
};
const displayMealDetails = (meal) => {
  console.log(meal);
  const parentDetailsContainer = document.getElementById("modal-dialog-box");
  const modalContent = document.createElement("div");
  modalContent.classList.add("row", "g-0");
  modalContent.innerHTML = `
      <div class="col-md-4" style="background-image:url('${
        meal.strMealThumb
      }');background-repeat: no-repeat; background-position: center center; background-size: cover;">
          <div style="height:300px"></div>
      </div>
      <div class="col-md-8">
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          <div class="card-body text-start">
              <h3 class="card-title">${meal.strMeal}</h3>
              <p class="area">Type: <span>${meal.strArea}</span></p>
              <p class="category">Category: <span>${meal.strCategory}</span></p>
              <p class="card-text">${meal.strInstructions.slice(0, 500)}...</p>
              <p class="ingredients">Ingredients: <span>${
                meal.strIngredient1
              }</span><span>${meal.strIngredient2}</span><span>${
    meal.strIngredient3
  }</span><span>${meal.strIngredient4}</span><span>${
    meal.strIngredient5
  }</span><span>${meal.strIngredient6}</span></p>
          </div>
      </div>
  `;

  parentDetailsContainer.textContent = "";
  parentDetailsContainer.appendChild(modalContent);
};
