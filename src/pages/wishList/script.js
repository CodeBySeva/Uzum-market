import { createCategoriesSection } from "../../Components/categories";
import { createSearchElement } from "../../Components/search";
import { createProductCardElement } from "../../Components/productCard";
import { header } from "../../Components/header";
import { getData } from "../../libs/api";

createCategoriesSection();
header();

const userId = localStorage.getItem("userId");
const allLiked = JSON.parse(localStorage.getItem("likedProducts")) || [];
const liked = allLiked.filter(product => +product.userId === +userId);

const wishListSection = document.querySelector(".wish-list");
const activeSection = document.querySelector(".active");

if (liked.length === 0) {
    activeSection.style.display = "block";
    wishListSection.style.display = "none";
} else {
    activeSection.style.display = "none";
    wishListSection.style.display = "block";

    liked.forEach(product => {
        const card = createProductCardElement(product);
        document.querySelector('.wish-list-container').appendChild(card);
    });
}

getData("goods/")
    .then((res) => {
        if (res && res.data) {
            createSearchElement(res.data);
        } else {
            console.error("Нет данных для отображения");
        }
    })
    .catch((error) => console.error(error));
