import { createCategoriesSection } from "./Components/categories";
import { createSearchElement } from "./Components/search";
import { header } from "./Components/header";
import { render } from "./libs/utils";
import { getData } from "./libs/api";
import { createProductCardElemnt } from "./Components/productCard";
import { appendRender } from "./libs/utils";

createCategoriesSection();
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

const categoriesBox = document.querySelectorAll('.title-text h2');

categoriesBox.forEach(h2 => {
    h2.onclick = () => {
        const category = h2.textContent.trim();

        const typeMap = {
            'Телевизоры': 'TV',
            'Аудиотехника': 'audio',
            'Техника для кухни': 'kitchen',
            'Электроника': 'PC',
            'Компьютерные кресла': 'furniture'
        };

        const encodedType = encodeURIComponent(typeMap[category]);
        if (encodedType) {
            window.location.href = `/src/pages/categories/?type=${encodedType}`;
        };
    };
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

        createSearchElement(allProducts);

        const tvProducts = allProducts.filter((item) => item.type === "TV");
        const audioProducts = allProducts.filter((item) => item.type === "audio");
        const kitchenProducts = allProducts.filter((item) => item.type === "kitchen");
        const pcProducts = allProducts.filter((item) => item.type === "PC");
        const furnitureProducts = allProducts.filter((item) => item.type === "furniture");

        render(tvProducts.slice(0, 5), tvBox, createProductCardElemnt);
        render(audioProducts.slice(0, 5), audioBox, createProductCardElemnt);
        render(kitchenProducts.slice(0, 5), kitchenBox, createProductCardElemnt);
        render(pcProducts.slice(0, 5), PCbox, createProductCardElemnt);

        let furnitureRendered = 10;
        let isExpanded = false;
        render(furnitureProducts.slice(0, furnitureRendered), furnitureBox, createProductCardElemnt);

        const showMoreBtn = document.querySelector('.show-more');

        showMoreBtn.addEventListener('click', () => {
            if (!isExpanded) {
                const remaining = furnitureProducts.length - furnitureRendered;
                const toShow = Math.min(10, remaining);

                if (toShow > 0) {
                    const nextProducts = furnitureProducts.slice(furnitureRendered, furnitureRendered + toShow);
                    appendRender(nextProducts, furnitureBox, createProductCardElemnt);
                    furnitureRendered += toShow;

                    if (furnitureRendered >= furnitureProducts.length) {
                        showMoreBtn.textContent = 'Скрыть';
                        isExpanded = true;
                    } else {
                        showMoreBtn.textContent = 'Показать еще 10';
                    }
                }
            } else {
                furnitureBox.innerHTML = '';
                render(furnitureProducts.slice(0, 10), furnitureBox, createProductCardElemnt);
                furnitureRendered = 10;
                showMoreBtn.textContent = 'Показать еще 10';
                isExpanded = false;
            }
        });
    })
    .catch((error) => console.error(error));