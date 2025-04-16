export function createProductCardElemnt(data) {
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

    button.appendChild(cartIcon);

    cardWrapper.appendChild(productPrice);
    cardWrapper.appendChild(button);

    productInfo.appendChild(productTitle);
    productInfo.appendChild(cardWrapper);

    const likedIcon = document.createElement('img');
    likedIcon.classList.add('liked');
    likedIcon.src = '/src/images/liked-icon.svg';
    likedIcon.alt = 'like icon';

    let likedProducts = JSON.parse(localStorage.getItem("likedProducts")) || [];

    const isAlreadyLiked = likedProducts.some(product => product.id === data.id);
    if (isAlreadyLiked) {
        likedIcon.classList.add("active");
    };

    likedIcon.onclick = (event) => {
        event.stopPropagation();

        let likedProducts = JSON.parse(localStorage.getItem("likedProducts")) || [];

        const isLiked = likedProducts.some(product => product.id === data.id);

        if (isLiked) {
            likedProducts = likedProducts.filter(product => product.id !== data.id);
            likedIcon.classList.remove("active");
        } else {
            likedProducts.push(data);
            likedIcon.classList.add("active");
        };

        localStorage.setItem("likedProducts", JSON.stringify(likedProducts));
    };

    cartIcon.onclick = (event) => {
        event.stopPropagation();

        let cartProducts = JSON.parse(localStorage.getItem("cartProducts")) || [];

        const isInCart = cartProducts.some(product => product.id === data.id);

        if (!isInCart) {
            cartProducts.push({ ...data, quantity: 1 });
            alert("Товар добавлен в корзину!");
        } else {
            cartProducts = cartProducts.map(product => {
                if (product.id === data.id) {
                    return { ...product, quantity: product.quantity + 1 };
                };
                return product;
            });
        }

        localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
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

