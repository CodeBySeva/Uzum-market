import { header } from "../../Components/header";
import { createCartItemElement } from "../../Components/CartItemElement";

header();

let cartProducts = JSON.parse(localStorage.getItem("cartProducts")) || [];

const shoppingCartSection = document.querySelector(".shoppingCart-section");
const activeSection = document.querySelector(".active");
const shoppingCartContainer = document.querySelector('.main');

const totalAmount = document.querySelector("#total-amount");
const totalItems = document.querySelector("#totalItems");
const totalDiscountEl = document.querySelector("#totalDiscount");

const cartItems = [];

function removeProductFromCart(productId) {
    cartProducts = cartProducts.filter(p => p.id !== productId);
    localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
};


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
};

if (cartProducts.length === 0) {
    activeSection.style.display = "block";
    shoppingCartSection.style.display = "none";
} else {
    activeSection.style.display = "none";
    shoppingCartSection.style.display = "block";

    cartProducts.forEach((product) => {
        const item = createCartItemElement(product, updateSummary, removeProductFromCart);
        shoppingCartContainer.appendChild(item);
        cartItems.push(item);
    });

    updateSummary(); 
};