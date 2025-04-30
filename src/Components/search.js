export function createSearchElement(products = []) {
    const searchOverlay = document.querySelector('.search-overlay');

    const section = document.createElement('div');
    section.classList.add('search-section');

    const modal = document.createElement('div');
    modal.classList.add('modal');

    const searchTitle = document.createElement('div');
    searchTitle.classList.add('search-title');

    const h3 = document.createElement('h3');
    h3.textContent = 'Поиск';

    searchTitle.appendChild(h3);
    modal.appendChild(searchTitle);

    const searchList = document.createElement('div');
    searchList.classList.add('search-list');

    modal.appendChild(searchList);
    section.appendChild(modal);
    searchOverlay.append(section);

    const input = document.querySelector('.search-form input');

    const categories = [
        "Аудиотехника",
        "Компьютерные кресла",
        "Техника для кухни",
        "Телевизоры",
        "Электроника"
    ];

    const categoryMap = {
        "Аудиотехника": "audio",
        "Компьютерные кресла": "furniture",
        "Техника для кухни": "kitchen",
        "Телевизоры": "TV",
        "Электроника": "PC"
    };

    let debounceTimeout;

    input.addEventListener('input', (e) => {
        clearTimeout(debounceTimeout);

        debounceTimeout = setTimeout(() => {
            const query = e.target.value.toLowerCase().trim();
            searchList.innerHTML = "";

            if (query.length < 3) return;

            const filteredProducts = products.filter(product =>
                product.title.toLowerCase().includes(query) ||
                product.description.toLowerCase().includes(query) ||
                (product.type && product.type.toLowerCase().includes(query))
            );

            const filteredCategories = categories.filter(cat =>
                cat.toLowerCase().includes(query)
            );

            if (filteredCategories.length > 0) {
                const catTitle = document.createElement("div");
                catTitle.classList.add("option-title");
                catTitle.textContent = "Категории:";
                searchList.appendChild(catTitle);

                filteredCategories.forEach(cat => {
                    const option = document.createElement("div");
                    option.classList.add("option");
                    option.textContent = cat;

                    option.addEventListener("click", () => {
                        const encodedType = encodeURIComponent(categoryMap[cat]);
                        window.location.href = `/src/pages/categories/?type=${encodedType}`;
                    });

                    searchList.appendChild(option);
                });
            }

            if (filteredProducts.length > 0) {
                const prodTitle = document.createElement("div");
                prodTitle.classList.add("option-title");
                prodTitle.textContent = "Товары:";
                searchList.appendChild(prodTitle);

                filteredProducts.forEach(product => {
                    const option = document.createElement("div");
                    option.classList.add("option");

                    const h2 = document.createElement('h2');
                    h2.textContent = product.title;

                    const img = document.createElement('img');
                    img.src = product.media[0];
                    img.alt = product.title;
                    img.style.width = '50px';
                    img.style.marginRight = '10px';

                    const wrapper = document.createElement('div');
                    wrapper.style.display = 'flex';
                    wrapper.style.alignItems = 'center';
                    wrapper.appendChild(img);
                    wrapper.appendChild(h2);

                    option.appendChild(wrapper);

                    option.addEventListener('click', () => {
                        localStorage.setItem("productId", product.id);
                        window.location.href = `/src/pages/product/?id=${product.id}`;
                    });

                    searchList.appendChild(option);
                });
            }

            if (filteredCategories.length === 0 && filteredProducts.length === 0) {
                const empty = document.createElement("div");
                empty.classList.add('option');
                empty.textContent = 'Ничего не найдено';
                searchList.appendChild(empty);
            }

        }, 1000);
    });

    return searchOverlay;
}
