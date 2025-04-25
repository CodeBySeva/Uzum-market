import { getData } from "../../libs/api";
import { validateInputs } from "../../libs/validation";

const form = document.forms.signIn;

form.onsubmit = (e) => {
    e.preventDefault();

    const fn = new FormData(form);
    const email = fn.get('email');
    const password = fn.get('password');

    const isFormValid = validateInputs();

    if (!isFormValid) {
        console.log("Form is invalid");
        return;
    };

    let user = {};

    fn.forEach((value, key) => {
        user[key] = value.trim();
    });

    getData(`users?email=${email}`)
        .then(res => {
            if (res.data.length > 0) {
                const user = res.data[0];
                if (password == user.password) {
                    localStorage.setItem('userId', user.id);
                    localStorage.setItem('token', user.token);
                    localStorage.setItem('userName', user.lastname);
                    window.location.replace("/");
                } else {
                    alert('Password is incorrect!');
                }
            } else {
                alert('Пользователь не найден!');
            }
        })
        .catch(error => {
            console.error(error);
        });
};