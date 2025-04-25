import { createCategoriesSection } from "../../Components/categories";
import { createSearchElement } from "../../Components/search";
import { createProductCardElemnt } from "../../Components/productCard";
import { header } from "../../Components/header";
import { getData } from "../../libs/api";

createCategoriesSection();
header();

const liked = JSON.parse(localStorage.getItem("likedProducts")) || [];

const wishListSection = document.querySelector(".wish-list");
const activeSection = document.querySelector(".active");

if (liked.length === 0) {
    activeSection.style.display = "block";
    wishListSection.style.display = "none";
} else {
    activeSection.style.display = "none";
    wishListSection.style.display = "block";

    liked.forEach(product => {
        const card = createProductCardElemnt(product);
        document.querySelector('.wish-list-container').appendChild(card);
    });
};

const getpoductData = getData(`goods/`);

getpoductData.then((res) => {
    if (res && res.data) {
        const allProducts = res.data;

        createSearchElement(allProducts);
    } else {
        console.error("Нет данных для отображения");
    }
})
    .catch((error) => console.error(error));