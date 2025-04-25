export function render(arr, place, Component) {
    place.innerHTML = '';

    for (const item of arr) {
        const elem = Component(item);

        place.append(elem);
    };
};

export function appendRender(arr, place, Component) {
    for (const item of arr) {
        const elem = Component(item);
        place.append(elem);
    }
};