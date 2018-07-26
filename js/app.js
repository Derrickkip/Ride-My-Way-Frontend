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

if (document.URL.contains('rides.html')) {
    fetch('http:127.0.0.1:5000/api/v2/rides')
    .then((res) => {
        res.json().then((data) => {
            if ('message' in data) {
                alert.classList.toggle('show');
                document.getElementById('message').textContent = data['message'];
            }
            else {
                const num_rides = document.getElementById('rides_num')
                let rides = (data.length)
                num_rides.textContent = rides
                let output = ``
                data.forEach(ride => {
                    const {id, origin, destination, date_of_ride, time, price, driver} = ride;
                    output +=
                    `<tr>
                    <td class="hidden">${id}</td>
                    <td>${origin}</td>
                    <td>${destination}</td>
                    <td>${date_of_ride}</td>
                    <td>${time}</td>
                    <td>${price}</td>
                    <td>${driver}</td>
                    <td><a href="ride_details.html"><button class="button--success">view</button></a></td>
                    </tr>
                    `
                });
                document.getElementById('ride_offers').innerHTML = output
            }
        })
    })
}
