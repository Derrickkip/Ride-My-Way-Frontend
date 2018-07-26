"use strict";
document.getElementById('signup_form').addEventListener('submit', signup)
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
                document.getElementById('message').textContent = data['success']
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