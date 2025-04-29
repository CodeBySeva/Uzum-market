import { createCategoriesSection } from "../../Components/categories";
import { createSearchElement } from "../../Components/search";
import { header } from "../../Components/header";
import { createCartItemElement } from "../../Components/CartItemElement";
import { getData, postData, patchData } from "../../libs/api";

createCategoriesSection();
header();

let cartProducts = JSON.parse(localStorage.getItem("cartProducts")) || [];

const shoppingCartSection = document.querySelector(".shoppingCart-section");
const activeSection = document.querySelector(".active");
const shoppingCartContainer = document.querySelector('.shoppingCart .main-box');

const totalAmount = document.querySelector("#total-amount");
const totalItems = document.querySelector("#totalItems");
const totalDiscountEl = document.querySelector("#totalDiscount");

const cartItems = [];

let userId = localStorage.getItem("userId");

let allGoods = [];

async function loadData() {
    try {
        const res = await getData('goods/');
        if (res && res.data) {
            allGoods = res.data; 
            console.log("All goods data after loading:", allGoods);
            createSearchElement(allGoods);

            await loadCartData();
        } else {
            console.error("Нет данных для отображения");
        }
    } catch (error) {
        console.error(error);
    }
}

async function loadCartData() {
    if (userId) {
        try {
            const res = await getData("cart");
            const userCart = res.data.find(c => +c.userId === +userId);
            cartProducts = userCart?.products || [];
        } catch (err) {
            console.error("Ошибка загрузки корзины пользователя", err);
        }
    } else {
        cartProducts = JSON.parse(localStorage.getItem("cartProducts")) || [];
    }

    renderCartItems();
}

function renderCartItems() {
    if (cartProducts.length === 0) {
        activeSection.style.display = "block";
        shoppingCartSection.style.display = "none";
    } else {
        activeSection.style.display = "none";
        shoppingCartSection.style.display = "block";

        shoppingCartContainer.innerHTML = "";

        console.log("Cart products:", cartProducts);
        console.log("All goods data:", allGoods);

        cartProducts.forEach(cartItem => {
            const cartItemId = cartItem.id;
            console.log("Cart item ID:", cartItemId); 

            const fullProductData = allGoods.find(product => +product.id === +cartItemId);
            if (fullProductData) {
                const productData = {
                    ...fullProductData,
                    quantity: cartItem.quantity
                };
                const item = createCartItemElement(productData, updateSummary, removeProductFromCart);
                shoppingCartContainer.appendChild(item);
                cartItems.push(item);
            } else {
                console.error("Товар с id", cartItemId, "не найден в allGoods");
                cartProducts = cartProducts.filter(item => item.id !== cartItemId);
            }
        });

        updateSummary();
    }
}

function removeProductFromCart(productId) {
    cartProducts = cartProducts.filter(p => p.id !== productId);

    if (userId) {
        getData("cart").then(res => {
            const userCart = res.data.find(c => c.userId === userId);
            if (userCart) {
                patchData(`cart/${userCart.id}`, { ...userCart, products: cartProducts });
            }
        });
    } else {
        localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
    }

    renderCartItems();
}

function updateSummary() {
    let totalQty = 0;
    let totalPrice = 0;
    let discountSum = 0;

    cartItems.forEach(item => {
        const price = parseInt(item.dataset.price, 10);
        const salePercentage = item.dataset.salePercentage ? parseInt(item.dataset.salePercentage, 10) : 0;
        const qty = parseInt(item.dataset.quantity, 10);

        totalQty += qty;

        const itemTotal = price * qty;
        const discount = salePercentage ? (itemTotal * salePercentage) / 100 : 0;

        totalPrice += itemTotal;
        discountSum += discount;
    });

    const finalPrice = totalPrice - discountSum;
    const roundedPrice = Math.round(finalPrice * 100) / 100;
                                                                                                                                                                           
    totalAmount.textContent = `${new Intl.NumberFormat("ru-RU").format(Math.floor(roundedPrice))} сум`;
    totalItems.textContent = totalQty;
    totalDiscountEl.textContent = `${new Intl.NumberFormat("ru-RU").format(Math.floor(discountSum))}`;
}

loadData();
