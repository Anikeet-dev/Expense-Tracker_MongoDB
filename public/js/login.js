const loginForm = document.querySelector('#login-form');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const loginBtn = document.querySelector('#login-Btn');
const errorMessageContainer = document.querySelector('#error-message');
const gotoSignup = document.querySelector('#goto-signup');

loginForm.addEventListener('submit', onSubmit);
gotoSignup.addEventListener('click', redirectToSignup);

async function onSubmit(e) {
    e.preventDefault();

    const userData = {
        email: email.value,
        password: password.value
    };

    try {

        const response = await axios.post("http://localhost:4000/user/login", userData);
        console.log('Login successful:', response.data);

        alert(response.data.message);
        localStorage.setItem('token', response.data.token);
        window.location.href = '../';

        errorMessageContainer.textContent = '';
        clearInputs();
    }
    catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
            errorMessageContainer.textContent = err.response.data.message;
        } else {
            console.log('Error during login:', err);
        }
    }
}

function redirectToSignup() {
    window.location.href = "http://localhost:4000/user/getSignup"; 
}

const forgotPassword = document.getElementById('forgotPassword');
        forgotPassword.addEventListener('click',async ()=>{
            window.location.href='/password/forgotpassword'
        });
function clearInputs() {
    email.value = '';
    password.value = '';
}