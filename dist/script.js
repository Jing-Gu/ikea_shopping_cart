if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", gsapReady);
  document.addEventListener("DOMContentLoaded", mainReady);
} else {
  gsapReady();
  mainReady();
}

function gsapReady() {
  window.addEventListener("load", () => {
    document.body.style.display = "block";
  });
  var tl = gsap.timeline();

  tl.staggerFrom(
    ".hero, .sidebar, .inspiration",
    2,
    {
      opacity: 0,
      scale: 0.5,
      ease: "Power2.easeOut",
    },
    0.2
  );

  tl.staggerFrom(
    ".logo,.menu",
    1,
    {
      opacity: 0,
      y: -40,
      ease: "Power2.easeOut",
    },
    0.2,
    "-=1.8"
  );

  tl.staggerFrom(
    ".content,.cta-btn",
    2,
    {
      opacity: 0,
      y: -40,
      ease: "Power2.easeOut",
    },
    0.2,
    "-=1.5"
  );
}

function mainReady() {
  const btnAddToCarts = document.querySelectorAll(".btn-shop");
  const btnPurchase = document.querySelector(".btn-purchase");
  const modals = document.querySelectorAll(".modal");
  const modalPurchase = document.getElementById("modal-purchase");
  const modalCart = document.getElementById("modal-cart");
  const overlay = document.getElementById("overlay");
  const btnModalCloses = document.querySelectorAll(".btn-close");

  btnAddToCarts.forEach((btnAddToCart) => {
    btnAddToCart.addEventListener("click", addToCartClicked);
  });

  btnPurchase.addEventListener("click", () => {
    modalPurchase.classList.add("active");
    overlay.classList.add("active");
  });

  btnModalCloses.forEach((btnModalClose) => {
    btnModalClose.addEventListener("click", closeModal);
  });

  overlay.addEventListener("click", closeModal);

  function closeModal() {
    modals.forEach((modal) => {
      modal.classList.remove("active");
      overlay.classList.remove("active");
    });
  }

  function addToCartClicked(e) {
    let shopItemBtn = e.target;
    let shopItem = shopItemBtn.parentElement.parentElement;
    let title = shopItem.querySelector(".shop-item-title").innerText;
    let price = shopItem.querySelector(".shop-item-price").innerText;
    let imgSrc = shopItem.querySelector("img").src;

    //Add a new row to the cart for the new item
    addToCart(title, price, imgSrc);
  }

  function addToCart(title, price, imgSrc) {
    let cartRow = document.createElement("div");
    cartRow.classList.add("cart-row");

    let cartItemContainer = document.querySelector(".cart-container");
    let cartItemNames = cartItemContainer.querySelectorAll(".cart-item-title");
    //check if the item is already in cart
    for (let i = 0; i < cartItemNames.length; i++) {
      if (cartItemNames[i].innerText === title) {
        modalCart.classList.add("active");
        overlay.classList.add("active");
        return;
        //calling return will immediately stop the function and stop executing the following code, it goes back to the addToCart() function
      }
    }

    let cartRowContent = `
  <div class="cart-item cart-column">
    <img
      class="cart-item-img"
      src="${imgSrc}"
      width="100"
      height="100"
      alt=""
    />
    <span class="cart-item-title">${title}</span>
  </div>

  <div class="cart-price cart-column">${price}</div>
  <div class="cart-quantity cart-column">
    <input class="cart-quantity-input" type="number" value="1" />
    <button class="btn btn-remove">REMOVE</button>
  </div>
  `;

    cartRow.innerHTML = cartRowContent;
    cartItemContainer.appendChild(cartRow);

    cartRow
      .querySelector(".btn-remove")
      .addEventListener("click", removeCartItem);
    cartRow
      .querySelector(".cart-quantity-input")
      .addEventListener("change", quantityChanged);

    updateCartTotal();
  }

  function removeCartItem(e) {
    e.target.parentElement.parentElement.remove();
    updateCartTotal();
  }

  function quantityChanged(e) {
    let input = e.target;
    if (isNaN(input.value) || input.value < 0) {
      input.value = 1;
    }
    updateCartTotal();
  }

  function updateCartTotal() {
    let total = 0;
    let cartItemContainer = document.querySelector(".cart-container");
    let cartRows = cartItemContainer.querySelectorAll(".cart-row");

    cartRows.forEach((cartRow) => {
      let priceElement = cartRow.querySelector(".cart-price");
      let quantityElement = cartRow.querySelector(".cart-quantity-input");

      let price = priceElement.innerText.replace("$", "");
      let quantity = quantityElement.value;

      //every time goes the loop, the new total will be the previous total adding by the (price * quantity) of that row
      total = total + price * quantity;
    });

    //round the total amount to 2 decimals
    total = Math.round(total * 100) / 100;
    document.querySelector(".cart-total-price").innerText = "$" + total;
  }
}
