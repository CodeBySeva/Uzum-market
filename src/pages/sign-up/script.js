import { postData } from "../../libs/api";
import { generateToken } from "../../libs/token";
import { validateInputs } from "../../libs/validation";

const form = document.forms.signUp;

form.onsubmit = (e) => {
    e.preventDefault();

    let user = {};
    const fn = new FormData(form);

    const isFormValid = validateInputs();

    if (!isFormValid) {
        console.log("Form is invalid");
        return;
    };

    fn.forEach((value, key) => {
        user[key] = value.trim();
    });

    let token = generateToken(16);

    postData("users", { ...user, token })
        .then(res => {
            localStorage.setItem("userId", res.data.id);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem('userName', user.lastname);
            window.location.replace("/");
            console.log(res.data);
        })
        .catch(error => {
            console.error(error);
        });
};