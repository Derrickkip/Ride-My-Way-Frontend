"use strict";
let signupform = document.getElementById("signup_form");
if (signupform) {
    signupform.addEventListener("submit", signup);
}

const alert = document.querySelector(".alert");

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

if (document.URL.contains("rides.html")) {
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
            const {id, driver, phone_number, origin, destination, date_of_ride, time, price, car_model, registration, seats } = data.ride;
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
            window.location = "ride_details.html";

        })
    }
    })
    .catch((err) => {
        console.log(err)
    })
}

if (document.URL.contains("ride_details.html")) {
    document.getElementById("from").textContent = localStorage.getItem("origin");
    document.getElementById("destination").textContent = localStorage.getItem("destination");
    document.getElementById("date_of_ride").textContent = localStorage.getItem("date_of_ride");
    document.getElementById("time").textContent = localStorage.getItem("time");
    document.getElementById("driver").textContent = localStorage.getItem("driver");
    document.getElementById("car_model").textContent = localStorage.getItem("car_model");
    document.getElementById("reg_no").textContent = localStorage.getItem("registration");
    document.getElementById("seats").textContent = localStorage.getItem("seats");
    document.getElementById("price").textContent = localStorage.getItem("price");
}

