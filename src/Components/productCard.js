import { getData, postData, patchData } from "./../libs/api";

export function createProductCardElement(data) {
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');

    const productImg = document.createElement('div');
    productImg.classList.add('product_img');

    const img = document.createElement('img');
    img.src = data.media[0];
    img.alt = data.type;

    productImg.appendChild(img);

    const productInfo = document.createElement('div');
    productInfo.classList.add('product-info');

    const productTitle = document.createElement('div');
    productTitle.classList.add('product_title');

    const title = document.createElement('h4');
    title.textContent = data.title;

    const rating = document.createElement('div');
    rating.classList.add('rating');

    const ratingIcon = document.createElement('img');
    ratingIcon.src = '/src/images/rating_icon.svg';
    ratingIcon.alt = 'rating_icon';

    const ratingScore = document.createElement('span');
    ratingScore.textContent = data.rating;

    rating.appendChild(ratingIcon);
    rating.appendChild(ratingScore);

    productTitle.appendChild(title);
    productTitle.appendChild(rating);

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('card-wrapper');

    const productPrice = document.createElement('div');
    productPrice.classList.add('product_price');

    const priceOld = document.createElement('div');
    priceOld.classList.add('price-old');
    priceOld.textContent = data.price;

    const discountedPrice = Math.round(data.price - (data.price * data.salePercentage / 100));

    const priceNew = document.createElement('div');
    priceNew.classList.add('price-new');
    priceNew.textContent = discountedPrice.toLocaleString();

    productPrice.appendChild(priceOld);
    productPrice.appendChild(priceNew);

    const button = document.createElement('button');

    const cartIcon = document.createElement('img');
    cartIcon.src = '/src/images/shopping-cart.svg';
    cartIcon.alt = 'shopping-cart';

    const cartProducts = JSON.parse(localStorage.getItem("cartProducts")) || [];
    const inCart = cartProducts.some(product => product.id === data.id);
    cartIcon.src = inCart ? "/src/images/shopping-cart-added.svg" : "/src/images/shopping-cart.svg";


    button.appendChild(cartIcon);

    cardWrapper.appendChild(productPrice);
    cardWrapper.appendChild(button);

    productInfo.appendChild(productTitle);
    productInfo.appendChild(cardWrapper);

    const likedIcon = document.createElement('img');
    likedIcon.classList.add('liked');
    likedIcon.src = '/src/images/liked-icon.svg';
    likedIcon.alt = 'like icon';

    const userId = localStorage.getItem("userId");
    if (userId) {
        getData("favorites").then((res) => {
            const userFavorites = res.data.find(fav => String(fav.userId) === userId);
            const isLiked = userFavorites.products.some(product => product.id === data.id);

            if (isLiked) {
                likedIcon.classList.add("active");
            }
        });

        getData("cart").then((res) => {
            const userCart = res.data.find(cart => String(cart.userId) === userId);
            let cartProducts = userCart?.products || [];

            const isInCart = cartProducts.some(product => product.id === data.id);

            if (isInCart) {
                cartIcon.src = "/src/images/shopping-cart-added.svg";
            } else {
                cartIcon.src = "/src/images/shopping-cart.svg";
            }
        });
    } else {
        let likedProducts = JSON.parse(localStorage.getItem("likedProducts")) || [];

        const isAlreadyLiked = likedProducts.some(product => product.id === data.id);
        if (isAlreadyLiked) {
            likedIcon.classList.add("active");
        }

        let cartProducts = JSON.parse(localStorage.getItem("cartProducts")) || [];
        const isInCart = cartProducts.some(product => product.id === data.id);

        if (isInCart) {
            cartIcon.src = "/src/images/shopping-cart-added.svg";
        } else {
            cartIcon.src = "/src/images/shopping-cart.svg";
        }

    }

    likedIcon.onclick = async (event) => {
        event.stopPropagation();
        const userId = localStorage.getItem("userId");

        if (userId) {
            const favoritesRes = await getData("favorites");
            const userFavorites = favoritesRes.data.find(fav => String(fav.userId) === userId);
            let favProducts = userFavorites?.products || [];

            const isLiked = favProducts.some(product => product.id === data.id);

            if (isLiked) {
                favProducts = favProducts.filter(product => product.id !== data.id);
                likedIcon.classList.remove("active");
            } else {
                favProducts.push({ id: data.id });
                likedIcon.classList.add("active");
            }

            if (userFavorites) {
                await patchData(`favorites/${userFavorites.id}`, { userId, products: favProducts });
            } else {
                await postData("favorites", { userId, products: favProducts });
            }
        } else {
            let favorites = JSON.parse(localStorage.getItem("likedProducts")) || [];
            const isLiked = favorites.some(product => product.id === data.id);

            if (isLiked) {
                favorites = favorites.filter(product => product.id !== data.id);
                likedIcon.classList.remove("active");

            } else {
                favorites.push(data);
                likedIcon.classList.add("active");
            }

            localStorage.setItem("likedProducts", JSON.stringify(favorites));
        }
    };

    cartIcon.onclick = async (event) => {
        event.stopPropagation();
        const userId = localStorage.getItem("userId");

        if (userId) {
            try {
                const cartRes = await getData("cart");
                const userCart = cartRes.data.find(cart => String(cart.userId) === userId);
                let cartProducts = userCart?.products || [];

                const isInCart = cartProducts.some(product => product.id === data.id);

                if (isInCart) {
                    cartProducts = cartProducts.filter(product => product.id !== data.id);
                    cartIcon.src = "/src/images/shopping-cart.svg";
                    showRemoveFromCartNotification(data);
                } else {
                    cartProducts.push({ id: data.id, quantity: 1 });
                    cartIcon.src = "/src/images/shopping-cart-added.svg";
                    showAddToCartNotification(data);
                }

                if (userCart) {
                    await patchData(`cart/${userCart.id}`, {
                        userId,
                        products: cartProducts
                    });
                } else {
                    await postData("cart", {
                        userId,
                        products: cartProducts
                    });
                }
            } catch (error) {
                console.error("Ошибка при обновлении корзины:", error);
            }
        } else {
            let cartProducts = JSON.parse(localStorage.getItem("cartProducts")) || [];
            const isInCart = cartProducts.some(product => product.id === data.id);

            if (isInCart) {
                cartProducts = cartProducts.filter(product => product.id !== data.id);
                cartIcon.src = "/src/images/shopping-cart.svg";
                showRemoveFromCartNotification(data);
            } else {
                cartProducts.push({ ...data, quantity: 1 });
                cartIcon.src = "/src/images/shopping-cart-added.svg";
                showAddToCartNotification(data);
            }

            localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
        }
    };

    productCard.appendChild(productImg);
    productCard.appendChild(productInfo);
    productCard.appendChild(likedIcon);

    productCard.onclick = () => {
        localStorage.setItem("productId", data.id);
        window.location.href = "/src/pages/product/";
    };

    return productCard;
};

function showAddToCartNotification(product) {
    const notification = document.createElement('div');
    notification.classList.add('cart-notification');

    const img = document.createElement('img');
    img.src = product.media[0];
    img.alt = product.title;

    const info = document.createElement('div');
    info.classList.add('cart-notification-info');

    const title = document.createElement('div');
    title.classList.add('cart-notification-title');
    title.textContent = 'Товар добавлен в корзину';

    const description = document.createElement('div');
    description.classList.add('cart-notification-desc');
    description.textContent = `${product.title}`;

    const link = document.createElement('a');
    link.href = '/src/pages/shoppingСart/';
    link.classList.add('cart-notification-link');
    link.textContent = 'ПЕРЕЙТИ В КОРЗИНУ';

    info.appendChild(title);
    info.appendChild(description);
    info.appendChild(link);

    notification.appendChild(img);
    notification.appendChild(info);

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 4000);
};

function showRemoveFromCartNotification(product) {
    const notification = document.createElement('div');
    notification.classList.add('cart-notification', 'remove-notification');

    const info = document.createElement('div');
    info.classList.add('notification-info');

    const title = document.createElement('div');
    title.classList.add('notification-title');
    title.textContent = 'Товар удалён из корзины!';

    const description = document.createElement('div');
    description.classList.add('notification-desc');
    description.textContent = `${product.title}`;

    info.appendChild(title);
    info.appendChild(description);

    notification.appendChild(info);

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 4000);
}
