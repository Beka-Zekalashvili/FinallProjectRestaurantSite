let ul = document.querySelector("ul");
let section = document.querySelector("section");
let cartItems = [];
let totalPrice = 0;

fetch("https://restaurant.stepprojects.ge/api/Categories/GetAll")
  .then((res) => res.json())
  .then((data) => {
    data.forEach((item) => (ul.innerHTML += showNavbar(item)));
  });

fetch("https://restaurant.stepprojects.ge/api/Products/GetAll")
  .then((res) => res.json())
  .then((data) =>
    data.forEach((item) => (section.innerHTML += showCards(item)))
  );

// for category
function fetchCategories() {
  fetch("")
    .then((res) => res.json())
    .then((data) => {
      data.forEach((item) => (ul.innerHTML += showNavbar(item)));
    })
    .catch((error) => console.error("Error fetching categories:", error));
}

// product
function fetchProducts() {
  fetch("https://restaurant.stepprojects.ge/api/Products/GetAll")
    .then((res) => res.json())
    .then((data) => {
      section.innerHTML = "";
      data.forEach((item) => (section.innerHTML += showCards(item)));
    })
    .catch((error) => console.error("Error fetching products:", error));
}

// category btn
function showNavbar(item) {
  return `<li class = "nav-li" tabindex="0" onclick="showCardsByCategory(${item.id})">${item.name}</li>`;
}

// product btn
function showCards(item) {
  return `<div class="card">
        <img src="${item.image}" class="card-img-top" >
        <div class="card-body">
            <h5 style="color:white" class="card-title ">${item.name}</h5>
            <h5 style="color:white" class="card-title">ფასი: ${item.price} ₾</h5>
            <h5 style="color:white" class="card-title">სიცხარე: ${item.spiciness} </h5>
            <button class="btn_for__add" onclick="addToCartAPI('${item.name}', ${item.price})">კალათში დამატება</button>
        </div>
    </div>`;
}

// filter category
function showCardsByCategory(id) {
  section.innerHTML = "";
  fetch(`https://restaurant.stepprojects.ge/api/Categories/GetCategory/${id}`)
    .then((res) => res.json())
    .then((finalData) =>
      finalData.products.forEach(
        (item) => (section.innerHTML += showCards(item))
      )
    )
    .catch((error) =>
      console.error("Error fetching category products:", error)
    );
}

function toggleCart() {
  const cart = document.querySelector("#cart");
  const isVisible = cart.style.display === "block";
  cart.style.display = isVisible ? "none" : "block";
  document
    .querySelector("[aria-expanded]")
    .setAttribute("aria-expanded", !isVisible);
}

//add cart

function addToCartAPI(name, price, image) {
  const existingItem = cartItems.find((item) => item.name === name);
  if (existingItem) {
    existingItem.quantity++;
    totalPrice += price;
  } else {
    cartItems.push({ name, price, quantity: 1, image});
    totalPrice += price;
  }

  updateCart();

  const cartObject = {
    items: [],
    total: totalPrice,
    itemImage: image,
  };

  cartItems.forEach((item) => {
    cartObject.items.push({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image  ["https://course-jsbasic.javascript.ru/assets/products/sweet_n_sour.png"]  ,
      // total:item.total,
    });
  });
   
   //! API-ის მოთხოვნა კალათაში პროდუქტის დასამატებლად

     fetch("https://restaurant.stepprojects.ge/api/Baskets/AddToBasket", {
     method: "POST",
     headers: {
       accept: "accept: application/json",
       "Content-Type": "application/json"
     },
     body: JSON.stringify(cartObject),
     
   })
     .then((res) => res.text())
     .then((data) => alert(`${name} დაემატა კალათაში წარმატებით`))
     .catch((err) => alert(`შეცდომა: ${err}`));
 }




//update cart
function updateCart() {
  const cartList = document.querySelector("#cart-items");
  cartList.innerHTML = "";

  cartItems.forEach((item, index) => {
    cartList.innerHTML += `
            <li class = "cartBtn" >
            <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px;">
                ${item.name} - ${item.price}₾ x ${item.quantity} 
                <button class="btn btn-sm btn-secondary btn-add" onclick="changeQuantity(${index}, 1)">+</button>
                <button class="btn btn-sm btn-secondary btn-subb" onclick="changeQuantity(${index}, -1)">-</button>
                <button class="btn btn-danger btn-sm btn-delete" onclick="removeFromCart(${index})">წაშლა</button>
            </li>`;
  });

  document.querySelector("#total-price").innerText = totalPrice.toFixed(2);
  document.querySelector("#cart-count").innerText = cartItems.length;
}

//change prudct
function changeQuantity(index, change) {
  const item = cartItems[index];

  if (item.quantity + change <= 0) {
    return;
  }

  item.quantity += change;
  totalPrice += change * item.price;

  updateCart();
}

function removeFromCart(index) {
  totalPrice -= cartItems[index].price * cartItems[index].quantity;
  cartItems.splice(index, 1);
  updateCart();
}

function clearCart() {
  cartItems = [];
  totalPrice = 0;
  updateCart();
}

//filter
let inputRange = document.getElementById("range");
let nuts = document.getElementById("nuts");
let vegan = document.getElementById("vegan");
let filterBTN = document.getElementById("filterBTN");

filterBTN.addEventListener("click", function () {
  let spiciness = inputRange.value != "-1" ? inputRange.value : "";
  let nutsValue = nuts.checked ? true : false;
  let veganValue = vegan.checked ? true : false;

  fetch(
    `https://restaurant.stepprojects.ge/api/Products/GetFiltered?vegeterian=${veganValue}&nuts=${nutsValue}&spiciness=${spiciness}`
  )
    .then((res) => res.json())
    .then((data) => {
      section.innerHTML = "";
      data.forEach((item) => (section.innerHTML += showCards(item)));
    })
    .catch((error) =>
      console.error("Error fetching filtered products:", error)
    );
});

// burger
document.getElementById("burger").addEventListener("click", function () {
  document.querySelector(".menu").classList.toggle("active");
});

// fetchCategories();
fetchProducts();
