"use strict";
let signupform = document.getElementById("signup_form");
if (signupform) {
    signupform.addEventListener("submit", signup);
}

const alert = document.querySelector(".alert");
const alertmodal = document.querySelector(".alertmodal");

function signup(event) {
    event.preventDefault();
    let form = event.target;
    let data = {};
    data.first_name = form.firstname.value;
    data.last_name = form.lastname.value;
    data.phone_number = form.phonenumber.value;
    data.email = form.email.value;
    data.password = form.password.value;
    data.confirm_password = form.confirmpassword.value;

    fetch("http:127.0.0.1:5000/api/v2/auth/signup", {
        method: "POST",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify(data)
    })
    .then((res) => {
        if (res.status == 201) {
            res.json().then((data) => {
                window.location = "index.html";
            });
        }
        else {
            res.json().then((data) => {
                alert.classList.toggle("show");
                document.getElementById("message").textContent = data.message;
            });
        }
    })
    .catch((err) => {
        console.log(err);
    });
}

let loginform = document.getElementById("login_form");

if (loginform) {
    loginform.addEventListener("submit", login);
}


function login(event) {
    event.preventDefault();
    let form = event.target;
    let data = {};
    data.email = form.email.value;
    data.password = form.password.value;

    fetch("http:127.0.0.1:5000/api/v2/auth/login", {
        method: "POST",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify(data)
    })
    .then((res) => {
        if (res.status == 200) {
            res.json().then((data) => {
                window.location = "rides.html";
                localStorage.setItem("access_token", data.access_token);
            });
        }
        else {
            res.json().then((data) => {
                alert.classList.toggle("show");
                document.getElementById("message").textContent = data.message;
            });
        }
    })
    .catch((err) => {
        console.log(err);
    });

}

if (document.location.contains("rides.html")) {
    fetch("http:127.0.0.1:5000/api/v2/rides")
    .then((res) => {
        res.json().then((data) => {
            if ("message" in data) {
                alert.classList.toggle("show");
                document.getElementById("message").textContent = data.message;
            }
            else {
                const num_rides = document.getElementById("rides_num");
                let rides = (data.length);
                num_rides.textContent = rides;
                let output = ``;
                data.forEach((ride) => {
                    const {id, origin, destination, date_of_ride, time, price, driver} = ride;
                    output +=
                    `
                    <td>${origin}</td>
                    <td>${destination}</td>
                    <td>${date_of_ride}</td>
                    <td>${time}</td>
                    <td>${price}</td>
                    <td>${driver}</td>
                    <td data-id=${id}><button class="button--success view_ride">view</button></td>
                    </tr>
                    `;
                });
                document.getElementById("ride_offers").innerHTML = output;

                let buttons = document.getElementsByClassName("view_ride");

                for (let i=0; i<buttons.length; i++) {
                    buttons[i].addEventListener("click", view_details)
                }
            }

        })
    })
}


function view_details(event) {
    let token = localStorage.getItem("access_token")
    let ride = event.target.parentNode;
    let id = ride.getAttribute("data-id")

    fetch("http:127.0.0.1:5000/api/v2/rides/"+id, {
        headers: {"Authorization": "Bearer "+ token}
    })
    .then((res) => {
        if (res.status == 401) {
            let message = "Authentication required";
            alert.classList.toggle("show");
            document.getElementById("message").textContent = message;
            window.location = "index.html"
        }
        else {
        res.json().then((data) => {
            console.log(data["ride"])
            const {id, driver, phone_number, origin, destination, date_of_ride, time, price, car_model, registration, seats, requests } = data.ride;
            localStorage.setItem("id", id);
            localStorage.setItem("driver", driver);
            localStorage.setItem("phone_number", phone_number);
            localStorage.setItem("origin", origin);
            localStorage.setItem("destination", destination);
            localStorage.setItem("date_of_ride", date_of_ride);
            localStorage.setItem("time", time);
            localStorage.setItem("price", price);
            localStorage.setItem("car_model", car_model);
            localStorage.setItem("registration", registration);
            localStorage.setItem("seats", seats)
            localStorage.setItem("requests", requests)
            window.location = "ride_details.html";

        })
    }
    })
    .catch((err) => {
        console.log(err)
    })
}

if (document.location.contains("ride_details.html")) {
    document.getElementById("from").textContent = localStorage.getItem("origin");
    document.getElementById("destination").textContent = localStorage.getItem("destination");
    document.getElementById("date_of_ride").textContent = localStorage.getItem("date_of_ride");
    document.getElementById("time").textContent = localStorage.getItem("time");
    document.getElementById("driver").textContent = localStorage.getItem("driver");
    document.getElementById("car_model").textContent = localStorage.getItem("car_model");
    document.getElementById("reg_no").textContent = localStorage.getItem("registration");
    document.getElementById("seats").textContent = localStorage.getItem("seats");
    document.getElementById("price").textContent = localStorage.getItem("price");
    document.getElementById("requests").textContent = localStorage.getItem("requests");

    document.getElementById('request_ride').addEventListener('click', request_ride);
    document.getElementById('back').addEventListener('click', function() {
        window.location = 'rides.html';
    })
}

function request_ride() {
    let token = localStorage.getItem("access_token")
    fetch("http:127.0.0.1:5000/api/v2/rides/"+localStorage.getItem("id")+"/requests", {
        method: "POST",
        headers: {"Authorization": "Bearer "+ token}
    })
    .then((res) => {
        res.json().then((data) => {
            console.log(data);
            alert.classList.toggle("show");
            document.getElementById("message").textContent = data.message;
            window.location = 'rides.html';
        })
    })
}

let ride_form = document.getElementById('form_create');

if (ride_form) {
    ride_form.addEventListener('submit', offer_ride);
}

let cancel_btn = document.getElementById('cancel_create')

if (cancel_btn) {
    cancel_btn.addEventListener('click', function(){
        window.location = "rides.html";
    })
}

function offer_ride(event) {
    event.preventDefault();
    let token = localStorage.getItem("access_token");
    let form = event.target;
    let data = {};
    data.origin = form.from.value;
    data.destination = form.to.value;
    data.date_of_ride = form.date.value;
    data.time = form.time.value;
    data.price = parseInt(form.price.value);

    fetch("http://127.0.0.1:5000/api/v2/rides", {
        method: "POST",
        headers: {"Authorization": "Bearer "+ token, "Content-type": "application/json", "Accept": "application/json"},
        body: JSON.stringify(data)
    })
    .then((res) => {
        if (res.status == 201) {
            res.json().then((data) => {
                console.log(data);
                alert.classList.toggle("show");
                document.getElementById("message").textContent = data.message;
                window.location = "rides.html"
            })
        }
        else if (res.status == 401) {
            window.location = "index.html"
        }
        else {
            res.json().then((data) => {
                alert.classList.toggle("show");
                document.getElementById("message").textContent = data.message;
            })
        }
    })
}

if (document.location.contains("profile.html")) {
    let token = localStorage.getItem("access_token")
    fetch("http://127.0.0.1:5000/api/v2/cars", {
        headers: {"Authorization": "Bearer "+ token, "Content-type": "application/json", "Accept": "application/json"}
    })
    .then((res) => {
        if (res.status == 200) {
            res.json().then((data) =>  {
            let car = data.car
            let form = document.getElementById('car_details')
            form.car_model.value = car.car_model
            form.registration.value = car.registration
            form.seats.value = car.seats
            })

        }
        else if (res.status == 404) {

        }
    })

    fetch("http://127.0.0.1:5000/api/v2/users", {
        headers: {"Authorization": "Bearer "+ token, "Content-type": "application/json", "Accept": "application/json"}
    })
    .then((res) => {
        res.json().then((data) => {
            let form_user = document.getElementById("user_details")
            form_user.firstname.value = data.first_name
            form_user.lastname.value = data.last_name
            form_user.email.value = data.email
            form_user.phone_number.value = data.phone_number
        })
    })

    fetch("http://127.0.0.1:5000/api/v2/user/rides", {
        headers: {"Authorization": "Bearer "+ token, "Content-type": "application/json", "Accept": "application/json"}
    })
    .then((res) => {
        res.json().then((data) => {
            document.getElementById('rides_number').textContent = data.length
            let output = ``
            data.forEach((ride) => {
                const {id, origin, destination, date_of_ride, time, price, requests} = ride
            output +=
                `
                <li class="ride__item"><span>${origin} to ${destination}</span><span class="date">${date_of_ride}</span></li>
                `
            })
            document.getElementById('rides_list').innerHTML = output
        })
    })
    let form_update_car = document.getElementById('edit_car_form')

    form_update_car.addEventListener('submit', update_car)

    let form_update_user = document.getElementById('edit_user_form')

    form_update_user.addEventListener('submit', update_user)
}

if (document.location.contains('rides_offered.html')) {
    let token = localStorage.getItem("access_token")
    fetch("http://127.0.0.1:5000/api/v2/user/rides", {
        headers: {"Authorization": "Bearer "+ token, "Content-type": "application/json", "Accept": "application/json"}
    })
    .then((res) => {
        res.json().then((data) => {
            let output = ``
            data.forEach((ride) => {
                const {id, origin, destination, date_of_ride, time, price, requests} = ride
                output +=
                `
                <tr>
                <td class="hidden">${id}</td>
                <td>${origin}</td>
                <td>${destination}</td>
                <td class="date">${date_of_ride}</td>
                <td class="red_bg">${time}</td>
                <td>${price}</td>
                <td class="ride_requests">${requests}<button class="button--success view_requests" data-id="${id}">view</button></td>
                <td><button class="button--success" id="update_ride" data-id="${id}">Update</button></td>
                <td><button class="button--danger" id="delete_ride" data-id="${id}">Delete</button></td>
                </tr>
                `
            })
        document.getElementById('user_rides').innerHTML = output;

        const requests_modal = document.querySelector('#requests_modal')

        let view_requests = document.querySelectorAll('.view_requests')

        if (view_requests) {
            for (let i=0; i< view_requests.length; i++) {
                view_requests[i].addEventListener('click', show_request_modal)
            }
        }

        let delete_button = document.querySelectorAll('#delete_ride')
        if (delete_button) {
            for (let i=0; i < delete_button.length; i++) {
            delete_button[i].addEventListener('click', delete_ride)
            }
        }

        let update_button = document.querySelectorAll('#update_ride')
        if (update_button) {
            for (let i=0; i<update_button.length; i++){
            update_button[i].addEventListener('click', show_ride_modal)
            }
        }
        })
    })

}

let add_car_form = document.getElementById('add_car_form')

if (add_car_form) {
    add_car_form.addEventListener('submit', add_car_details)
}

function add_car_details(event){
    event.preventDefault();
    let token = localStorage.getItem("access_token")
    let form = event.target;
    let data = {};
    data.car_model = form.car_model.value;
    data.registration = form.registration.value;
    data.seats = parseInt(form.seats.value);
    console.log(data)
    fetch("http://127.0.0.1:5000/api/v2/cars", {
        method: "POST",
        headers: {"Authorization": "Bearer "+ token, "Content-type": "application/json", "Accept": "application/json"},
        body: JSON.stringify(data)
    })
    .then((res) => {
        res.json().then((data) => {
            alert.classList.toggle("show");
            document.getElementById("message").textContent = data.message;
            window.location = 'create_ride.html'
        })
    })
}

function update_car(event){
    let token = localStorage.getItem("access_token")
    event.preventDefault()
    let form = event.target
    let data = {}
    data.car_model = form.car_model.value
    data.registration = form.registration.value
    data.seats = parseInt(form.seats.value)

    fetch("http://127.0.0.1:5000/api/v2/cars", {
        method: "PUT",
        headers: {"Authorization": "Bearer "+ token, "Content-type": "application/json", "Accept": "application/json"},
        body: JSON.stringify(data)
    })
    .then((res) => {
        res.json().then((data) => {
            alert.classList.toggle("show");
            document.getElementById("message").textContent = data.message;
            window.location = "profile.html"
        })
    })
}

function update_user(event) {
    let token = localStorage.getItem("access_token")
    event.preventDefault()
    let form = event.target;
    let data = {}
    data.first_name = form.firstname.value
    data.last_name = form.lastname.value
    data.email = form.email.value
    data.phone_number = form.phone_number.value

    fetch("http://127.0.0.1:5000/api/v2/users", {
        method: "PUT",
        headers: {"Authorization": "Bearer "+ token, "Content-type": "application/json", "Accept": "application/json"},
        body: JSON.stringify(data)
    })
    .then((res) => {
        res.json().then((data) => {
            alert.classList.toggle("show");
            document.getElementById("message").textContent = data.message;
            window.location = "profile.html"
        })
    })
}

function delete_ride(event) {
    let token = localStorage.getItem("access_token")
    let ride = event.target;
    let ride_id = ride.getAttribute("data-id")
    console.log(ride_id)

    fetch("http://127.0.0.1:5000/api/v2/rides/"+ride_id, {
        method: "DELETE",
        headers: {"Authorization": "Bearer "+ token, "Content-type": "application/json", "Accept": "application/json"},
    })
    .then((res) => {
        res.json().then((data) => {
            alert.classList.toggle("show");
            document.getElementById("message").textContent = data.message;
            window.location = "rides_offered.html"
        })
    })
}

let update_ride_form = document.getElementById('edit_ride_form')

if (update_ride_form) {
    update_ride_form.addEventListener('submit', update_ride)
}

function update_ride(event) {
    event.preventDefault()
    let token = localStorage.getItem("access_token");
    let form = event.target;
    console.log(form)
    let id = form.ride_id.value;
    let data = {};
    data.origin = form.origin.value;
    data.destination = form.destination.value;
    data.date_of_ride = form.date_of_ride.value;
    data.time = form.time.value;
    data.price = parseInt(form.price.value);
    console.log(data)

    fetch("http://127.0.0.1:5000/api/v2/rides/"+id, {
        method: "PUT",
        headers: {"Authorization": "Bearer "+ token, "Content-type": "application/json", "Accept": "application/json"},
        body: JSON.stringify(data)
    })
    .then((res) => {
        res.json().then((data) => {
            alert.classList.toggle("show");
            document.getElementById("message").textContent = data.message;
        })
    })

}

