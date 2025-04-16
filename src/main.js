import { header } from "./Components/header";
import { render } from "./libs/utils";
import { getData } from "./libs/api";
import { createProductCardElemnt } from "./Components/productCard";

header();

const swiper = new Swiper(".mySwiper", {
    navigation: {
        nextEl: ".custom-button-next",
        prevEl: ".custom-button-prev",
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    loop: true,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },
});


const tvBox = document.querySelector(".TV_box");
const audioBox = document.querySelector(".audio_box");
const kitchenBox = document.querySelector(".kitchen_box");
const PCbox = document.querySelector(".PC_box");
const furnitureBox = document.querySelector(".furniture_box");

const getpoductData = getData(`goods/`);

Promise.all([getpoductData])
    .then(([res]) => {
        const allProducts = res.data;
        const tvProducts = allProducts.filter((item) => item.type === "TV");
        const audioProducts = allProducts.filter((item) => item.type === "audio");
        const kitchenProducts = allProducts.filter((item) => item.type === "kitchen");
        const pcProducts = allProducts.filter((item) => item.type === "PC");
        const furnitureProducts = allProducts.filter((item) => item.type === "furniture");

        render(tvProducts.slice(0, 5), tvBox, createProductCardElemnt);
        render(audioProducts.slice(0, 5), audioBox, createProductCardElemnt);
        render(kitchenProducts.slice(0, 5), kitchenBox, createProductCardElemnt);
        render(pcProducts.slice(0, 5), PCbox, createProductCardElemnt);
        render(furnitureProducts.slice(0, 10), furnitureBox, createProductCardElemnt);
    })
    .catch((error) => console.error(error));
