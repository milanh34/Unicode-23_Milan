let i = 0;
let selectedFilter = 'all';
let selectedSort = 'date';
const structuredData = [];

fetch('data-fetch/source.html')
    .then(res => {
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        return res.text();
    })
    .then(data => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');
        const listItems = doc.querySelectorAll('#data li');

        const resultContainer = document.getElementById('events-list');
        resultContainer.innerHTML = '';

        listItems.forEach(item => {
            const imageSrc = item.querySelector('img').getAttribute('src');
            const event = {
                id: item.getAttribute('event-id'),
                name: item.getAttribute('name'),
                location: item.getAttribute('location'),
                date: item.getAttribute('date'),
                category: item.getAttribute('category'),
                imageSrc,
            };

            structuredData.push(event);

            const eventCard = document.createElement('div');
            eventCard.classList.add('event-card');
            eventCard.setAttribute('data-category', event.category.toLowerCase());
            eventCard.setAttribute('data-date', event.date);
            eventCard.setAttribute('data-location', event.location);
            eventCard.innerHTML = `
                <img src="${event.imageSrc}" alt="Fetched Image">
                <h2>${event.name}</h2>
                <p>Date : ${event.date}</P>
                <p>Location : ${event.location}</p>
                <p>Category : ${event.category}</p>
                <div class="btn-container">
                    <a href="event-description${item.id}.html">
                        <button class="view-btn">View More</button>
                    </a>
                </div>
            `;
            resultContainer.appendChild(eventCard);
        });
    });


function searchEvents() {
    const searchInput = document.getElementById('search').value.toLowerCase();
    const eventCards = document.querySelectorAll('.event-card');

    eventCards.forEach(card => {
        const eventName = card.querySelector('h2').textContent.toLowerCase();
        if (eventName.includes(searchInput)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function filtering() {
    selectedFilter = document.getElementById('filter').value;

    const eventCards = document.querySelectorAll('.event-card');

    eventCards.forEach(card => {
        const category = card.getAttribute('data-category').toLowerCase();
        if (selectedFilter === 'all' || category === selectedFilter) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function sorting() {
    selectedSort = document.getElementById('sort').value;

    const eventCards = document.querySelectorAll('.event-card');

    const sortedEventCards = Array.from(eventCards).sort((a, b) => {
        if (selectedSort === 'date') {
            const dateA = new Date(a.getAttribute('data-date'));
            const dateB = new Date(b.getAttribute('data-date'));
            return dateA - dateB;
        } else if (selectedSort === 'location') {
            const locationA = a.getAttribute('data-location').toLowerCase();
            const locationB = b.getAttribute('data-location').toLowerCase();
            return locationA.localeCompare(locationB);
        }
    });

    const resultContainer = document.getElementById('events-list');
    resultContainer.innerHTML = '';
    sortedEventCards.forEach(card => {
        resultContainer.appendChild(card);
    });
}


document.addEventListener('DOMContentLoaded', function () {
    const cinema_hall = document.querySelector('.cinema-hall');
    const available_seats = document.querySelectorAll('.rows .available-seats:not(.sold)');
    const no_of_seats = document.getElementById('no-of-seats');
    const total_price = document.getElementById('total-price');
    let eventid;

    function setValue(id) {
        eventid = id;
    }

    initializeSeats();

    populateUI();

    let ticketRate = 200;

    function setEventData(eventindex, eventprice) {
        localStorage.setItem('selectedeventindex', eventindex);
        localStorage.setItem('selectedeventprice', eventprice);
    }

    // initializeSeats(); 

    // function initializeSeats() {
    //     localStorage.removeItem('selectedSeats');

    //     available_seats.forEach(seat => {
    //         if (seat.classList.contains('selected')) {
    //             seat.classList.remove('selected');
    //         }
    //     });
    //     updateSelectedseats();
    // }

    // function clearseats(){
    //     available_seats.forEach(seat =>{
    //         if(seat.classList.contains("selected")){
    //             seat.classList.toggle("!selected");
    //         }
    //     });
    // }


    function updateSelectedseats() {
        const selectedSeats = document.querySelectorAll('.rows .available-seats.selected');
        const seatsIndex = Array.from(selectedSeats).map(seat => {
            const seats = document.querySelectorAll('.rows .available-seats');
            return [...seats].indexOf(seat);
        });
        // const seatsIndex = Array.from(selectedSeats).map(seat => [...seat].indexOf(seat));
        localStorage.setItem(`event_${eventid}_seats`, JSON.stringify(seatsIndex));
        // localStorage.setItem('selectedSeats', JSON.stringify(seatsIndex));
        const selectedSeatsCount = selectedSeats.length;
        no_of_seats.innerText = selectedSeatsCount;
        total_price.innerText = selectedSeatsCount * ticketRate;
        setEventData(eventid.selectedIndex, eventid.value);
    }

    function populateUI() {
        const selectedSeats = JSON.parse(localStorage.getItem('selectedSeats'))
        if (selectedSeats !== null && selectedSeats.length > -1) {
            available_seats.forEach((seat, index) => {
                if (selectedSeats.indexOf(index) > -1) {
                    seat.classList.add("selected");
                }
            });
        }
        const selectedeventindex = localStorage.getItem("selectedeventindex");

        if (selectedeventindex !== null) {
            eventid.selectedIndex = selectedeventindex;
        }
    }


    function initializeSeats() {
        const selectedSeats = JSON.parse(localStorage.getItem(`event_${eventid}_seats`));
        if (selectedSeats) {
            selectedSeats.forEach(seatIndex => {
                const seat = document.querySelector(`.rows .available-seats:nth-child(${seatIndex + 1})`);
                if (seat) {
                    seat.classList.remove("selected");
                }
            });
        }
    }

    cinema_hall.addEventListener('click', e => {
        if (
            e.target.classList.contains("available-seats") &&
            !e.target.classList.contains("sold")
        ) {
            e.target.classList.toggle("selected");

            updateSelectedseats();
        }
    })
});

document.addEventListener('DOMContentLoaded', function () {
    const mailid = [];
    const passid = [];
    const authForm = document.getElementById('auth-form');
    const registerLink = document.getElementById('register-link');
    const loginLink = document.getElementById('login-link');
    const registerForm = document.getElementById('register');

    authForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = document.getElementById('gmail').value;
        const password = document.getElementById('pass').value;

        if (mailid.includes(email) && passid.includes(password)) {
            alert('Authentication successful! Your tickets have been booked.');
            window.location.href = 'index.html';
        } else {
            alert('Authentication unsuccessfull')
        }
    });

    registerLink.addEventListener('click', function () {
        registerForm.style.display = 'block';
        authForm.style.display = 'none';
        errorMessage.textContent = '';
    });
    loginLink.addEventListener('click', function () {
        registerForm.style.display = 'none';
        authForm.style.display = 'block';
        errorMessage.textContent = '';
    });

    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();


        function validate() {                   //function to check all above conditions when submitting and submit form if all conditions are met
            const fullname = document.getElementById("full-name").value;
            const emailid = document.getElementById("email1").value;
            const pass = document.getElementById("new-pass").value;
            const confpass = document.getElementById("conf-pass").value;
            const nameError = document.getElementById('nameError');
            const emailError = document.getElementById('emailError');
            const passError = document.getElementById('passError');
            const confpassError = document.getElementById('confpassError');
            if (fullname && emailid && pass && confpass && nameError.textContent == "" && emailError.textContent == "" && passError.textContent == "" && confpassError.textContent == "") {
                return true;
            }
        }
        if (validate() == true) {
            const email1 = document.getElementById('email1').value;
            const newpass = document.getElementById('new-pass').value;
            mailid.push(email1);
            passid.push(newpass);
            alert('Registration successful! You can now log in.');
            authForm.style.display = 'block';
            registerForm.style.display = 'none';
        }
        else {
            alert('Registration unsuccessful :( Please Enter all details');
            registerForm.style.display = 'none';
            authForm.style.display = 'block';
            errorMessage.textContent = '';
        }
    });
});
function checkname() {                //function to check error in name
    const fullname = document.getElementById("full-name").value;
    const nameError = document.getElementById('nameError');
    if (fullname.length < 5) {             //condition 
        nameError.textContent = 'Name must not be less than 5 characters';
    }
    else {
        nameError.textContent = '';
    }
}
function checkemail() {                //function to check error in email
    const emailid = document.getElementById("email1").value;
    const emailError = document.getElementById('emailError');
    if (emailid.indexOf("@") == -1) {                     //condition
        emailError.textContent = 'Email Id should have @ character in it';
    }
    else {
        emailError.textContent = '';
    }
}
function checkpass() {                 //function to check erro in password
    const name = document.getElementById("full-name").value;
    const pass = document.getElementById("new-pass").value;
    const passError = document.getElementById('passError');
    if (pass.length < 8) {                  //condition 1
        passError.textContent = 'Password cannot be less than 8 characters';
    }
    else if (pass == "password") {           //condition 2
        passError.textContent = 'Password cannot be "password"';
    }
    else if (pass === name) {                 //condition 3
        passError.textContent = 'Password cannot be name of the user';
    }
    else {
        passError.textContent = '';
    }
}
function confpass() {                         //function to check error in confirm password
    const pass = document.getElementById("new-pass").value;
    const confpass = document.getElementById("conf-pass").value;
    const confError = document.getElementById('confpassError');
    if (confpass != pass) {                   //condition
        confError.textContent = 'Password and confirm password should match';
    }
    else {
        confError.textContent = '';
    }
}
