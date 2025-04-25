import { getData } from "../libs/api";

export async function createCategoriesSection() {
    const div = document.querySelector(".categories-overlay");

    const section = document.createElement("section");
    section.classList.add("categories-section");
    section.id = "categoriesSection";

    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.id = "modal";

    const title = document.createElement("h3");
    title.classList.add("categories-title");
    title.textContent = "Категории товаров";

    const list = document.createElement("div");
    list.classList.add("categories-list");

    try {
        const response = await getData('goods/');
        
        if (response && Array.isArray(response.data)) {  
            const categoryMap = {
                "Аудиотехника": "audio",
                "Компьютерные кресла": "furniture",
                "Техника для кухни": "kitchen",
                "Телевизоры": "TV",
                "Электроника": "PC"
            };

            const categories = Object.keys(categoryMap);

            categories.forEach(category => {
                const option = document.createElement("div");
                option.classList.add("option");

                const main = document.createElement("div");
                main.classList.add("main");

                const h2 = document.createElement("h2");
                h2.id = "modal-title";
                h2.textContent = category;

                const more = document.createElement("div");
                more.classList.add("more");

                const img = document.createElement("img");
                img.src = "/src/images/arrow_next_right.svg";
                img.alt = "";

                more.appendChild(img);
                main.appendChild(h2);
                main.appendChild(more);

                const count = response.data.filter(item => item.type === categoryMap[category]).length;
                const p = document.createElement("p");
                p.innerHTML = `<span>${count}</span> товара`;

                option.appendChild(main);
                option.appendChild(p);

                list.appendChild(option);

                option.onclick = () => {
                    const type = categoryMap[category];
                    const encodedType = encodeURIComponent(type);
                    window.location.href = `/src/pages/categories/?type=${encodedType}`;
                };
            });
        } else {
            console.error('Invalid data structure:', response);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }

    modal.appendChild(title);
    modal.appendChild(list);
    section.appendChild(modal);
    div.append(section);

    return div;
}
