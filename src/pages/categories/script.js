import { getData } from "../../libs/api";
import { createCategoriesSection } from "../../Components/categories";
import { createSearchElement } from "../../Components/search";
import { createProductCardElemnt } from "../../Components/productCard";
import { render } from "../../libs/utils";
import { header } from "../../Components/header";

createCategoriesSection();
header();

const params = new URLSearchParams(window.location.search);
const type = params.get("type");
const container = document.querySelector(".products-container");
const cardsWrapper = document.querySelector(".products");

const inputMin = document.querySelector('.price-range #from');
const inputMax = document.querySelector('.price-range #to');

function filterProductsByPrice() {
    const min = parseInt(inputMin.value.replace(/\D/g, "")) || 0;
    const max = parseInt(inputMax.value.replace(/\D/g, "")) || Infinity;

    const filtered = allFilteredProducts.filter(product => {
        const basePrice = product.price;
        const discount = product.salePercentage || 0;
        const finalPrice = Math.floor(basePrice * (1 - discount / 100));
        return finalPrice >= min && finalPrice <= max;
    });

    cardsWrapper.innerHTML = "";
    render(filtered, cardsWrapper, createProductCardElemnt);
}

[inputMin, inputMax].forEach(input => {
    input.addEventListener("input", () => {
        filterProductsByPrice();
    });
});

let allFilteredProducts = [];

const availableColors = [];

const colorNames = {
    red: 'Красный',
    green: 'Зеленый',
    blue: 'Синий',
    black: 'Черный',
    white: 'Белый',
    grey: 'Серый',
    orange: 'Оранжевый',
    brown: 'Коричневый',
};

const colorListContainer = document.querySelector('.color-list');
colorListContainer.innerHTML = "";

const categoryNames = {
    audio: "Аудиотехника",
    furniture: "Компьютерные кресла",
    kitchen: "Техника для кухни",
    TV: "Телевизоры",
    PC: "Электроника"
};

if (type) {
    const decodedType = decodeURIComponent(type);

    const categoryName = categoryNames[decodedType] || decodedType;

    getData("goods/")
        .then(response => {
            const data = response.data;

            createSearchElement(data);

            allFilteredProducts = data.filter(product => product.type === decodedType);

            const availableColors = [...new Set(
                allFilteredProducts.flatMap(product => product.colors || [])
            )];

            for (const color in colorNames) {
                if (availableColors.includes(color)) {
                    const box = document.createElement('div');
                    box.className = 'color_box';
                    box.dataset.color = color;

                    box.innerHTML = `
                    <div class="color" style="background-color: ${color};"></div>
                    <span>${colorNames[color]}</span>
                  `;

                    box.addEventListener('click', () => {
                        filterByColor(color);
                    });

                    colorListContainer.appendChild(box);
                };
            };

            const h3 = document.createElement("h3");
            h3.textContent = `Категория: ${categoryName}`;
            h3.classList.add("h3");
            container.prepend(h3);

            if (allFilteredProducts.length === 0) {
                container.innerHTML += "<p>Товары не найдены</p>";
                return;
            };

            render(allFilteredProducts, cardsWrapper, createProductCardElemnt);
        })
        .catch(error => {
            console.error("Ошибка при получении данных:", error);
        });
}


function filterByColor(selectedColor) {
    const filteredByColor = allFilteredProducts.filter(product => {
        return product.colors && product.colors.includes(selectedColor);
    });

    cardsWrapper.innerHTML = "";

    if (filteredByColor.length > 0) {
        render(filteredByColor, cardsWrapper, createProductCardElemnt);
    } else {
        cardsWrapper.innerHTML = "<p>Товары данного цвета не найдены</p>";
    }
}
