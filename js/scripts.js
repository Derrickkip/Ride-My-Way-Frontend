"use strict";
const nav_toggler = document.querySelector('.jsnavbar__toggle');
const nav_links = document.querySelector('.jsnavbar__links');

const modal = document.querySelectorAll('.modal');

const edit_user = document.querySelector('#edit_user');

const edit_car = document.querySelector('#edit_car');

const user_modal = document.querySelector('#user_modal');

const car_modal = document.querySelector('#car_modal');

const close = document.querySelectorAll('.close');

const edit_ride = document.getElementById('update_ride');

const ride_modal = document.querySelector('#ride_modal');

const add_car =  document.getElementById('add_car');

const add_car_modal = document.querySelector('#add_car_modal');


if (edit_user) {

    edit_user.addEventListener('click', show_user_modal);
}

if (edit_car) {

    edit_car.addEventListener('click', show_car_modal);

}

if (edit_ride) {
    edit_ride.addEventListener('click', show_ride_modal);
}

if (add_car) {
    add_car.addEventListener('click', show_add_car_modal);
}



if (close) {

    for (let i = 0; i < close.length; i++) {
        close[i].addEventListener('click', close_modal);
    }
}

window.onclick = function(event) {
    for (let i = 0; i < modal.length; i++) {
        if (event.target == modal[i]) {
            modal[i].classList.toggle('modal__show');
        }
    }
}

function show_nav() {
    nav_links.classList.toggle('nav_show');
}

function show_user_modal(event) {
    user_modal.classList.toggle('modal__show');
    let form = document.getElementById('user_details');
    let edit_form = document.getElementById('edit_user_form');
    edit_form.firstname.value = form.firstname.value;
    edit_form.lastname.value = form.lastname.value;
    edit_form.email.value = form.email.value;
    edit_form.phone_number.value = form.phone_number.value;
}

function show_car_modal(event) {
    car_modal.classList.toggle('modal__show');
    let form = document.getElementById('car_details');
    let edit_form = document.getElementById('edit_car_form');
    edit_form.car_model.value = form.car_model.value;
    edit_form.registration.value = form.registration.value;
    edit_form.seats.value = form.seats.value;
}

function show_add_car_modal(event) {
    add_car_modal.classList.toggle('modal__show');
}

function show_ride_modal(event) {
    ride_modal.classList.toggle('modal__show');
    let td = document.getElementsByTagName('td');
    let edit_form = document.getElementById('edit_ride_form');
    edit_form.ride_id.value = td[0].childNodes[0].nodeValue;
    edit_form.origin.value = td[1].childNodes[0].nodeValue;
    edit_form.destination.value = td[2].childNodes[0].nodeValue;
    edit_form.date_of_ride.value = td[3].childNodes[0].nodeValue;
    edit_form.time.value = td[4].childNodes[0].nodeValue;
    edit_form.price.value = td[5].childNodes[0].nodeValue;
}

function show_request_modal(event) {
    requests_modal.classList.toggle('modal__show');
    let ride_id = event.target.getAttribute('data-id');
    let token = localStorage.getItem("access_token");
    console.log(document.getElementsByClassName('request__items').textContent);
    fetch("https://derrick-ride-my-way.herokuapp.com/api/v2/rides/"+ride_id+"/requests", {
        headers: {"Authorization": "Bearer "+ token, "Content-type": "application/json", "Accept": "application/json"}
    })
    .then((res) => {
        res.json().then((data) => {
            let output = ``;
            data.forEach((request) => {
                const {id, user_name, accept_status} = request;
                let action = ``;
                if (accept_status == 'pending') {
                    action = `
                    <span class="item__pull-right">
                            <button class="button--success respond" value="accepted">Accept</button>
                        </span>
                        <span>
                            <button class="button--danger respond" value="rejected">Reject</button>
                        </span>
                    `;
                }
                else {
                    action = `
                    <span class="item__pull-right">
                    ${accept_status}
                </span>
                    `;
                }
                output+=`
                    <li class="request__item" data-request_id="${id}", data-ride_id="${ride_id}">
                        <span>${user_name}</span>` + action +

                `</li>`;
            });
            document.getElementById('request_items').innerHTML = output;

            let response_buttons = document.querySelectorAll('.respond');

            if (response_buttons){
                for (let i=0; i<response_buttons.length; i++) {
                    response_buttons[i].addEventListener('click', respond_to_ride)
                }
            }
        });
    });
}

function respond_to_ride(event) {
    let token = localStorage.getItem("access_token");
    let list = event.target.parentNode.parentNode
    let request_id = list.getAttribute('data-request_id')
    let ride_id = list.getAttribute('data-ride_id')
    console.log(request_id)
    console.log(ride_id)
    let response = event.target.value
    fetch("https://derrick-ride-my-way.herokuapp.com/api/v2/rides/"+ride_id+"/requests/"+request_id, {
        method: "PUT",
        headers: {"Authorization": "Bearer "+ token, "Content-type": "application/json", "Accept": "application/json"},
        body: JSON.stringify({'status': response})
    })
    .then((res) => {
        res.json().then((data) => {
            alert.classList.toggle("show");
            document.getElementById("message").textContent = data.message;
        })
    })
}


function show_hidden(event) {
    console.log('I was clicked')
    const requests = event.target.nextElementSibling;

    requests.classList.toggle('show');
}

function close_modal(event) {
    const parent_modal = event.target.parentNode.parentNode.parentNode;
    parent_modal.classList.toggle('modal__show');
}

nav_toggler.addEventListener('click', show_nav);

const acc = document.querySelectorAll('.js_accordion');

if (acc) {
    for (let i = 0; i < acc.length; i++) {
        acc[i].addEventListener('click', show_hidden);
    }
}
