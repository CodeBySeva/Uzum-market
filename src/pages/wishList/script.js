import { createCategoriesSection } from "../../Components/categories";
import { createSearchElement } from "../../Components/search";
import { createProductCardElement } from "../../Components/productCard";
import { header } from "../../Components/header";
import { getData } from "../../libs/api";

createCategoriesSection();
header();

const wishListSection = document.querySelector(".wish-list");
const activeSection = document.querySelector(".active");

const userId = localStorage.getItem("userId");
if (userId) {
    const allLiked = await getData('favorites');
    const liked = allLiked.data.find(product => +product.userId === +userId);

    if (!liked.products?.length) {
        activeSection.style.display = "block";
        wishListSection.style.display = "none";
    } else {
        activeSection.style.display = "none";
        wishListSection.style.display = "block";
    }  

    liked.products?.forEach(async product => {
        const data = await getData(`goods/${product.id}`);
        const card = createProductCardElement(data.data);
        document.querySelector('.wish-list-container').appendChild(card);
    });
} else {
    const allLiked = JSON.parse(localStorage.getItem("likedProducts")) || [];
    
    if (allLiked.length === 0) {
        activeSection.style.display = "block";
        wishListSection.style.display = "none";
    } else {
        activeSection.style.display = "none";
        wishListSection.style.display = "block";
    }    

    allLiked.forEach(product => {
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
