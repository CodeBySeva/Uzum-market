const regex = {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    lastname: /^[a-zA-Zа-яА-ЯёЁ]+([ '-][a-zA-Zа-яА-ЯёЁ]+)*$/,
    surname: /^[a-zA-Zа-яА-ЯёЁ]+([ '-][a-zA-Zа-яА-ЯёЁ]+)*$/,
    password: /^[a-zA-Z0-9]{4,}$/,
};

export function validateInputs() {
    const inputs = document.querySelectorAll(".required");
    let isValid = true;

    inputs.forEach(input => {
        const key = input.name;
        const value = input.value.trim();

        if (regex[key] && regex[key].test(value)) {
            input.classList.add("valid");
            input.classList.remove("invalid");
        } else {
            input.classList.add("invalid");
            input.classList.remove("valid");
            isValid = false;
        };
    });

    return isValid;
};