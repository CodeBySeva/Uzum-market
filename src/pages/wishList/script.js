import { header } from "../../Components/header";
import { createProductCardElemnt } from "../../Components/productCard";

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