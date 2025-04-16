export function createCartItemElement(data, onUpdateSummary, onRemoveProduct) {
    const product = document.createElement("div");
    product.classList.add("product");

    const productImage = document.createElement("div");
    productImage.classList.add("product_image");

    const img = document.createElement("img");
    img.classList.add("img");
    img.src = data.media[0];
    img.alt = data.type;

    productImage.appendChild(img);

    const infoBox = document.createElement("div");
    infoBox.classList.add("info-box");

    const productInfo = document.createElement("div");
    productInfo.classList.add("product-info");

    const h3 = document.createElement("h3");
    h3.textContent = data.title;

    h3.onclick = () => {
        localStorage.setItem("productId", data.id);
        window.location.href = "/src/pages/product/";
    };

    img.onclick = () => {
        localStorage.setItem("productId", data.id);
        window.location.href = "/src/pages/product/";
    };

    const price = document.createElement("span");
    const formattedPrice = new Intl.NumberFormat("ru-RU").format(data.price);
    price.textContent = `${formattedPrice} сум`;

    productInfo.appendChild(h3);
    productInfo.appendChild(price);

    const quantitySelector = document.createElement("div");
    quantitySelector.classList.add("quantity-selector");

    const decrementBtn = document.createElement("button");
    decrementBtn.textContent = "-";

    const quantityDisplay = document.createElement("span");
    quantityDisplay.textContent = data.quantity || "1";

    const incrementBtn = document.createElement("button");
    incrementBtn.textContent = "+";

    quantitySelector.appendChild(decrementBtn);
    quantitySelector.appendChild(quantityDisplay);
    quantitySelector.appendChild(incrementBtn);

    let quantity = parseInt(quantityDisplay.textContent, 10);

    incrementBtn.onclick = () => {
        quantity++;
        quantityDisplay.textContent = quantity;
        product.dataset.quantity = quantity;
        onUpdateSummary();
    };

    decrementBtn.onclick = () => {
        if (quantity > 1) {
            quantity--;
            quantityDisplay.textContent = quantity;
            product.dataset.quantity = quantity;
            onUpdateSummary();
        };
    };

    const removeBtn = document.createElement("button");
    removeBtn.classList.add("remove");
    removeBtn.textContent = "Удалить";

    removeBtn.onclick = () => {
        product.remove();
        onRemoveProduct(data.id);
        onUpdateSummary();
    };

    infoBox.appendChild(productInfo);
    infoBox.appendChild(quantitySelector);
    infoBox.appendChild(removeBtn);

    product.appendChild(productImage);
    product.appendChild(infoBox);

    product.dataset.price = data.price;
    product.dataset.salePercentage = data.salePercentage || 0;
    product.dataset.quantity = quantity;

    return product;
}
