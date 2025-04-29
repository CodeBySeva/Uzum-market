import { createCategoriesSection } from "../../Components/categories";
import { createSearchElement } from "../../Components/search";
import { header } from "../../Components/header";
import { getData } from "../../libs/api";
import { render } from "../../libs/utils";
import { createProductCardElement } from "../../Components/productCard";

createCategoriesSection();
header();

const similarProductBox = document.querySelector(".similar-products-box");

const id = localStorage.getItem("productId");

const getpoductData = getData(`goods/${id}`);
const getAllProducts = getData(`goods/`);
let currentProductData;

Promise.all([getpoductData, getAllProducts])
    .then(([currentProduct, similarProduct]) => {
        productElements(currentProduct.data);
        currentProductData = currentProduct.data;
        const allProducts = similarProduct.data;
        const currentData = currentProduct.data;

        createSearchElement(allProducts);

        const similarProducts = allProducts.filter(
            (item) => item.type === currentData.type && item.id != currentData.id
        );

        render(similarProducts.slice(0, 5), similarProductBox, createProductCardElement);
        updateLikedBtnText();
    })
    .catch(error => console.error(error))


const likedBtn = document.querySelector("#likedBtn");

likedBtn.onclick = () => {
    if (!currentProductData) return;

    let likedProducts = JSON.parse(localStorage.getItem("likedProducts")) || [];

    const isLiked = likedProducts.some(product => product.id === currentProductData.id);

    if (isLiked) {
        likedProducts = likedProducts.filter(product => product.id !== currentProductData.id);
        likedBtn.classList.remove("active");
    } else {
        likedProducts.push(currentProductData);
        likedBtn.classList.add("active");
    }

    localStorage.setItem("likedProducts", JSON.stringify(likedProducts));
    updateLikedBtnText();
};

function updateLikedBtnText() {
    const likedProducts = JSON.parse(localStorage.getItem("likedProducts")) || [];
    const isLiked = likedProducts.some(product => product.id === currentProductData?.id);

    likedBtn.textContent = isLiked ? "В избранном" : "Добавить в избранное";
    likedBtn.classList.toggle("active", isLiked);
}

window.onload = () => {
    updateLikedBtnText();
};


function productElements(data) {
    const title = document.querySelector("#product_title");
    title.textContent = data.title;

    const priceOld = document.querySelector(".price-old");
    priceOld.textContent = `${data.price.toLocaleString("ru-RU")} сум`;

    const discountedPrice = Math.round(data.price - (data.price * data.salePercentage / 100));
    const priceNew = document.querySelector(".price-new");
    priceNew.textContent = `${discountedPrice.toLocaleString("ru-RU")} сум`;

    const shortDescription = document.querySelector(".short-description");
    shortDescription.textContent = data.description ? data.description : "Описание товара отсуствует";

    const description = document.querySelector("#description");
    description.textContent = data.description ? data.description : "Описание товара отсуствует";

    const mediaData = data.media || [];
    const mediaArray = [].concat(mediaData);

    const thumbnailsContainer = document.querySelector(".thumbnails_container");
    const mainSlider = document.querySelector(".main-slider img");

    const rating = document.querySelector("#rating");
    rating.textContent = data.rating;

    if (mediaArray.length > 0) {
        mainSlider.src = mediaArray[0];
        thumbnailsContainer.innerHTML = "";

        mediaArray.forEach((src, index) => {
            const thumbDiv = document.createElement("div");
            thumbDiv.classList.add("thumbnails");

            const img = document.createElement("img");
            img.classList.add = "thumbnails img";
            img.src = src;
            img.alt = `product`;

            if (index === 0) {
                thumbDiv.classList.add("img-active");
            }

            img.onclick = () => {
                mainSlider.src = src;

                const allThumbDivs = thumbnailsContainer.querySelectorAll(".thumbnails");
                allThumbDivs.forEach(div => {
                    div.classList.remove("img-active");
                });

                thumbDiv.classList.add("img-active");
            };

            thumbDiv.appendChild(img);
            thumbnailsContainer.appendChild(thumbDiv);
        });
    } else {
        mainSlider.src = "";
    }

    const cartProducts = JSON.parse(localStorage.getItem("cartProducts")) || [];
    const inCart = cartProducts.some(product => product.id === data.id);

    const addToCartBtn = document.querySelector(".btn.primary");
    if (inCart) {
        addToCartBtn.textContent = "В корзине";
    } else {
        addToCartBtn.textContent = "Добавить в корзину";
    }

    const existingProduct = cartProducts.find(product => product.id === data.id);
    if (existingProduct) {
        quantity = existingProduct.quantity || 1;
    } else {
        quantity = 1;
    }
    quantityDisplay.textContent = quantity;

    updateLikedBtnText();
}


const quantityDisplay = document.querySelector("#quantity");
const incrementBtn = document.querySelector("#increment");
const decrementBtn = document.querySelector("#decrement");

let quantity = 1;

incrementBtn.onclick = () => {
    quantity++;
    quantityDisplay.textContent = quantity;
};

decrementBtn.onclick = () => {
    if (quantity > 1) {
        quantity--;
        quantityDisplay.textContent = quantity;
    };
};


const addToCartBtn = document.querySelector(".btn.primary");

addToCartBtn.onclick = () => {
    if (!currentProductData) return;

    let cartProducts = JSON.parse(localStorage.getItem("cartProducts")) || [];

    const existingProduct = cartProducts.find(product => product.id === currentProductData.id);

    if (existingProduct) {
        cartProducts = cartProducts.filter(product => product.id !== currentProductData.id);
        addToCartBtn.textContent = "Добавить в корзину";
        quantity = 1;
        quantityDisplay.textContent = quantity;
    } else {
        cartProducts.push({ ...currentProductData, quantity });
        addToCartBtn.textContent = "В корзине";
    }

    localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
};


const titleText = document.querySelector(".title-text h2");

titleText.style.cursor = "pointer";
titleText.onclick = () => {
    if (!currentProductData) return;

    const type = currentProductData.type;
    window.location.href = `/src/pages/categories/?type=${encodeURIComponent(type)}`;
};