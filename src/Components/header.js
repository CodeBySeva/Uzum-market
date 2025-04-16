export function header() {
  let header = document.querySelector(".header");

  header.innerHTML = `
      <div class="logo">
        <img src="/logo.svg" alt="uzum logo">
      </div>
      <button class="btn-catalog">
        <div class="icon">
          <div class="top-bar top"></div>
          <div class="top-bar middle"></div>
          <div class="bottom-box"></div>
        </div>
        <span>Каталог</span>
      </button>
      <div class="search-form">
        <input type="text" placeholder="Искать товары и категории">
        <button><img src="/src/images/search-icon.svg" alt="search-icon"></button>
      </div>
      <div class="store-action-buttons">
        <button class="sign-in main-btns">
          <img src="/src/images/sign-in-icon.svg" alt="sign-in-icon">
          <span>Войти</span>
        </button>
        <button class="button_wishes main-btns">
          <img src="/src/images/liked-icon.svg" alt="button_wishes">
          <span>Избранное</span>
        </button>
        <button class="button_cart main-btns">
          <img src="/src/images/cart-icon.svg" alt="button_cart">
          <span>Корзина</span>
        </button>
      </div>
    `;

  header.classList.add("header");

  const btnWishes = document.querySelector(".button_wishes");
  const btnCart = document.querySelector(".button_cart");
  const logo = document.querySelector(".logo");

  btnWishes.onclick = () => {
    window.location.href = "/src/pages/wishList/";
  };

  btnCart.onclick = () => {
    window.location.href = "/src/pages/shoppingСart/";
  };

  logo.onclick = () => {
    window.location.href = "/";
  };
};