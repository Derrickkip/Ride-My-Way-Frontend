"use strict";
let signupform = document.getElementById('signup_form')
if (signupform) {
    signupform.addEventListener('submit', signup)
}

const alert = document.querySelector('.alert')

function signup(event) {
    event.preventDefault()
    let form = event.target;
    let data = {}
    data.first_name = form.firstname.value
    data.last_name = form.lastname.value
    data.phone_number = form.phonenumber.value
    data.email = form.email.value
    data.password = form.password.value
    data.confirm_password = form.confirmpassword.value

    fetch('http:127.0.0.1:5000/api/v2/auth/signup', {
        method: 'POST',
        headers: {"Content-type": "application/json"},
        body: JSON.stringify(data)
    })
    .then((res) => {
        if (res.status == 201) {
            res.json().then((data) => {
                window.location = 'index.html'
            })
        }
        else {
            res.json().then((data) => {
                alert.classList.toggle('show');
                document.getElementById('message').textContent = data['message'];
            })
        }
    })
    .catch((err) => {
        console.log(err)
    })
}

let loginform = document.getElementById('login_form')

if (loginform) {
    loginform.addEventListener('submit', login)
}


function login(event) {
    event.preventDefault();
    let form = event.target;
    let data = {};
    data.email = form.email.value
    data.password = form.password.value

    fetch('http:127.0.0.1:5000/api/v2/auth/login', {
        method: 'POST',
        headers: {"Content-type": "application/json"},
        body: JSON.stringify(data)
    })
    .then((res) => {
        if (res.status == 200) {
            res.json().then((data) => {
                console.log(data)
                window.location = 'rides.html'
                localStorage.setItem('access_token', data['access_token'])
            })
        }
        else {
            res.json().then((data) => {
                alert.classList.toggle('show');
                document.getElementById('message').textContent = data['message'];
            })
        }
    })
    .catch((err) => {
        console.log(err)
    })

}
