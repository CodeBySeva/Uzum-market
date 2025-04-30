import { createCategoriesSection } from "../../Components/categories";
import { createSearchElement } from "../../Components/search";
import { header } from "../../Components/header";
import { createCartItemElement } from "../../Components/CartItemElement";
import { getData, postData, patchData } from "../../libs/api";

createCategoriesSection();
header();

let userId = null;
let cartProducts = [];
let cartItems = [];
let allGoods = [];

const shoppingCartSection = document.querySelector(".shoppingCart-section");
const activeSection = document.querySelector(".active");
const shoppingCartContainer = document.querySelector('.shoppingCart .main-box');
const totalAmount = document.querySelector("#total-amount");
const totalItems = document.querySelector("#totalItems");
const totalDiscountEl = document.querySelector("#totalDiscount");

async function initCart() {
    userId = localStorage.getItem("userId");

    if (userId) {
        try {
            const cartRes = await getData("cart");
            const userCart = cartRes.data.find(cart => String(cart.userId) === userId);
            cartProducts = userCart?.products || [];
        } catch (error) {
            console.error("Ошибка при получении корзины:", error);
        }
    } else {
        cartProducts = JSON.parse(localStorage.getItem("cartProducts")) || [];
        localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
    }

    await loadData();
}

async function loadData() {
    try {
        const res = await getData('goods/');
        if (res && res.data) {
            allGoods = res.data;
            console.log("Загружены товары:", allGoods);
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
            console.log("Корзина пользователя:", cartProducts);
        } catch (err) {
            console.error("Ошибка загрузки корзины пользователя", err);
        }
    } else {
        cartProducts = JSON.parse(localStorage.getItem("cartProducts")) || [];
    }

    renderCartItems();
}

async function renderCartItems() {
    const userId = localStorage.getItem("userId");
    let cartProducts = [];

    if (userId) {
        const res = await getData("cart");
        const userCart = res.data.find(item => String(item.userId) === userId);
        cartProducts = userCart?.products || [];
    } else {
        cartProducts = JSON.parse(localStorage.getItem("cartProducts")) || [];
    }

    if (cartProducts.length === 0) {
        activeSection.style.display = "block";
        shoppingCartSection.style.display = "none";
    } else {
        cartItems = [];
        activeSection.style.display = "none";
        shoppingCartSection.style.display = "block";
        shoppingCartContainer.innerHTML = "";

        const validProducts = [];

        for (const cartItem of cartProducts) {
            const fullProductData = allGoods.find(product => +product.id === +cartItem.id);
            if (fullProductData) {
                const productData = { ...fullProductData, quantity: cartItem.quantity };
                const item = createCartItemElement(productData, updateSummary, removeProductFromCart);
                shoppingCartContainer.appendChild(item);
                cartItems.push(item);
                validProducts.push(cartItem);
            } else {
                console.warn(`Товар с ID ${cartItem.id} не найден и будет удалён из корзины`);
            }
        }

        cartProducts = validProducts;

        if (userId) {
            const res = await getData("cart");
            const userCart = res.data.find(c => +c.userId === +userId);
            if (userCart) {
                await patchData(`cart/${userCart.id}`, { ...userCart, products: cartProducts });
            }
        } else {
            localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
        }

        updateSummary();
    }
}

async function removeProductFromCart(productId) {
    const userId = localStorage.getItem("userId");

    if (userId) {
        const res = await getData("cart");
        const userCart = res.data.find(cart => String(cart.userId) === userId);
        if (!userCart) return;

        const updatedProducts = userCart.products.filter(product => product.id !== productId);
        await patchData(`cart/${userCart.id}`, { userId, products: updatedProducts });
    } else {
        let cartProducts = JSON.parse(localStorage.getItem("cartProducts")) || [];
        cartProducts = cartProducts.filter(product => product.id !== productId);
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
        const discount = (itemTotal * salePercentage) / 100;

        totalPrice += itemTotal;
        discountSum += discount;
    });

    const finalPrice = totalPrice - discountSum;
    const roundedPrice = Math.round(finalPrice * 100) / 100;

    totalAmount.textContent = `${new Intl.NumberFormat("ru-RU").format(Math.floor(roundedPrice))} сум`;
    totalItems.textContent = totalQty;
    totalDiscountEl.textContent = `${new Intl.NumberFormat("ru-RU").format(Math.floor(discountSum))}`;
}

const checkoutButton = document.querySelector(".summary-box button");
checkoutButton.addEventListener("click", placeOrder);

async function placeOrder() {
    const userId = localStorage.getItem("userId");

    const order = {
        orderNumber: Date.now().toString(),
        totalAmount: totalAmount.textContent
    };

    try {
        await postData("orders", order);
        showOrderConfirmation("Ваш заказ оформлен!");

        cartProducts = [];

        if (!userId) {
            localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
        } else {
            const res = await getData("cart");
            const userCart = res.data.find(c => +c.userId === +userId);
            if (userCart) {
                await patchData(`cart/${userCart.id}`, { ...userCart, products: [] });
            }
        }

        renderCartItems();
    } catch (error) {
        console.error("Ошибка при оформлении заказа", error);
    }
}
function showOrderConfirmation(message) {
    let confirmationDiv = document.querySelector(".order-confirmation");

    if (!confirmationDiv) {
        confirmationDiv = document.createElement("div");
        confirmationDiv.className = "order-confirmation";
        document.body.appendChild(confirmationDiv);
    }

    confirmationDiv.textContent = message;
    confirmationDiv.classList.add("show");

    setTimeout(() => {
        confirmationDiv.classList.remove("show");
    }, 3000);
}

initCart();
