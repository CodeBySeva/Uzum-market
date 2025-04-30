export function header() {
  let header = document.querySelector(".header");

  header.innerHTML = `
  <div class="logo">
    <img src="/logo.svg" alt="uzum logo">
  </div>

  <div class="top-row">
    <button class="btn-catalog">
      <div class="icon">
        <div class="top-bar top"></div>
        <div class="top-bar middle"></div>
        <div class="bottom-box"></div>
      </div>
      <div class="close-modal">
        <img src="/src/images/exit.svg" alt="exit-icon">        
      </div>
      <span>Каталог</span>
    </button>

    <div class="search-form">
      <input type="text" placeholder="Искать товары и категории">
      <button><img src="/src/images/search-icon.svg" alt="search-icon"></button>
    </div>
  </div>

  <div class="store-action-buttons">
    <button class="sign-in main-btns">
      <img src="/src/images/sign-in-icon.svg" alt="sign-in-icon">
      <span id="account">Войти</span>
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

  const catalogBtn = document.querySelector(".btn-catalog");
  const searchForm = document.querySelector(".search-form");

  catalogBtn.onclick = () => {
    const modal = document.querySelector(".categories-section");
    const closeModal = document.querySelector(".close-modal");
    const catalogIcon = document.querySelector(".icon");
    const categoriesOverlay = document.querySelector(".categories-overlay");

    const searchModal = document.querySelector(".search-section");
    const searchOverlay = document.querySelector(".search-overlay");

    if (!modal || !closeModal || !catalogIcon || !categoriesOverlay) return;

    const isOpen = modal.style.display === "flex";

    if (isOpen) {
      modal.style.display = "none";
      closeModal.style.display = "none";
      categoriesOverlay.style.display = "none";
      catalogIcon.style.display = "flex";
    } else {
      if (searchModal && searchOverlay) {
        searchModal.style.display = "none";
        searchOverlay.style.display = "none";
        document.body.classList.remove('no-scroll');
      }

      modal.style.display = "flex";
      closeModal.style.display = "flex";
      categoriesOverlay.style.display = "flex";
      catalogIcon.style.display = "none";
      document.body.classList.add('no-scroll');
    }
  };

  searchForm.onclick = () => {
    const searchModal = document.querySelector(".search-section");
    const searchOverlay = document.querySelector(".search-overlay");

    const modal = document.querySelector(".categories-section");
    const closeModal = document.querySelector(".close-modal");
    const catalogIcon = document.querySelector(".icon");
    const categoriesOverlay = document.querySelector(".categories-overlay");

    if (!searchModal || !searchOverlay) return;

    const isOpen = searchModal.style.display === "flex";

    if (isOpen) {
      searchModal.style.display = "none";
      searchOverlay.style.display = "none";
      document.body.classList.remove('no-scroll');
    } else {
      if (modal && closeModal && categoriesOverlay && catalogIcon) {
        modal.style.display = "none";
        closeModal.style.display = "none";
        categoriesOverlay.style.display = "none";
        catalogIcon.style.display = "flex";
        document.body.classList.add('no-scroll');
      }

      searchModal.style.display = "flex";
      searchOverlay.style.display = "flex";
    }
  };

  const signIn = document.querySelector(".sign-in");

  signIn.onclick = () => {
    window.location.replace("/src/pages/sign-in/");
  };

  const userName = localStorage.getItem('userName');
  const accountSpan = document.getElementById('account');
  const signInBtn = document.querySelector(".sign-in");

  if (userName && accountSpan && signInBtn) {
    accountSpan.textContent = userName;
    signInBtn.style.cursor = "pointer";

    signInBtn.onclick = () => {
      const logOutModal = document.createElement('div');
      logOutModal.classList.add('log-out-modal');
      logOutModal.innerHTML = `
        <div class="modal-content">
          <h3>Вы уверены, что хотите выйти?</h3>
          <div class="modal-buttons">
            <button class="cancel-btn">Отмена</button>
            <button class="confirm-btn">Выйти</button>
          </div>
        </div>
      `;

      document.body.appendChild(logOutModal);

      const cancelBtn = logOutModal.querySelector('.cancel-btn');
      const confirmBtn = logOutModal.querySelector('.confirm-btn');

      cancelBtn.onclick = () => {
        logOutModal.remove();
      };

      confirmBtn.onclick = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        window.location.replace("/");
      };
    };
  } else {
    signInBtn.onclick = () => {
      window.location.href = "/src/pages/sign-in/";
    };
  }
};
