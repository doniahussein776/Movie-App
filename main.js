// ------------------ Global Variables ------------------
let allMovies = [];
const apiKey = "eba8b9a7199efdcb0ca1f96879b83c44"; 
const imgPath = "https://image.tmdb.org/t/p/w500";

// ------------------ 1. Fetch Movies Data ------------------
async function getMovies(category = 'now_playing') {
    let url = '';
    
    if (category === 'trending') {
        url = `https://api.themoviedb.org/3/trending/all/day?api_key=${apiKey}`;
    } else {
        url = `https://api.themoviedb.org/3/movie/${category}?api_key=${apiKey}`;
    }

    try {
        let response = await fetch(url);
        let finalResult = await response.json();
        allMovies = finalResult.results || [];
        displayMovies(allMovies);
    } catch (error) {
        console.error("Error fetching movies:", error);
        document.getElementById("rowData").innerHTML = "<p class='text-center'>Failed to load movies.</p>";
    }
}

// ------------------ 2. Display Movies ------------------
function displayMovies(arr) {
    let cartona = "";
    for (let i = 0; i < arr.length; i++) {
        let poster = arr[i].poster_path 
            ? imgPath + arr[i].poster_path 
            : 'https://www.csaff.org/wp-content/uploads/2016/09/no-image-found.jpg';
            
        let title = arr[i].title || arr[i].name || "No Title";
        let date = arr[i].release_date || arr[i].first_air_date || "Unknown Date";
        let overview = arr[i].overview 
            ? arr[i].overview.split(" ").slice(0, 20).join(" ") + "..." 
            : "No description available.";

        cartona += `
        <div class="col-md-6 col-lg-4">
            <div class="movie-card shadow rounded">
                <img src="${poster}" class="movie-poster w-100" alt="${title}">
                <div class="movie-layer">
                    <h2>${title}</h2>
                    <p class="mt-3">${overview}</p>
                    <p>Rate: ${arr[i].vote_average || "N/A"}</p>
                    <p>${date}</p>
                </div>
            </div>
        </div>`;
    }
    document.getElementById("rowData").innerHTML = cartona;
}

// ------------------ 3. Search Functions ------------------
async function searchByWord(term) {
    if (term === "") {
        getMovies('now_playing');
        return;
    }

    let url = `https://api.themoviedb.org/3/search/movie?query=${term}&api_key=${apiKey}&include_adult=false`;

    try {
        let response = await fetch(url);
        let finalResult = await response.json();
        displayMovies(finalResult.results || []);
    } catch (error) {
        console.error("Error searching movies:", error);
    }
}

// ------------------ Search inside current movies ------------------
function searchInCurrent(term) {
    let matched = allMovies.filter(movie => {
        let title = movie.title || movie.name || "";
        return title.toLowerCase().includes(term.toLowerCase());
    });
    displayMovies(matched);
}

// ------------------ 4. Sidebar Toggle ------------------
function toggleMenu() {
    let sideNav = document.getElementById("sideNav");
    let links = document.querySelectorAll(".links a");
    let icon = document.querySelector(".open-close-icon");

    if (sideNav.style.left === "0px") {
        sideNav.style.left = "-250px";
        icon.classList.replace("fa-xmark","fa-bars");
        links.forEach(a => a.style.display="none");
    } else {
        sideNav.style.left = "0px";
        icon.classList.replace("fa-bars","fa-xmark");
        links.forEach(a => a.style.display="block");
    }
}

// ------------------ 5. Contact Validation ------------------
const nameInput = document.getElementById("nameInput");
const emailInput = document.getElementById("emailInput");
const phoneInput = document.getElementById("phoneInput");
const ageInput = document.getElementById("ageInput");
const passwordInput = document.getElementById("passwordInput");
const repasswordInput = document.getElementById("repasswordInput");
const submitBtn = document.getElementById("submitBtn");

function validateInputs() {
    let isNameValid = /^[a-zA-Z ]+$/.test(nameInput.value);
    let isEmailValid = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(emailInput.value);
    let isPhoneValid = /^01[0125][0-9]{8}$/.test(phoneInput.value);
    let isAgeValid = /^(1[6-9]|[2-9][0-9]|100)$/.test(ageInput.value);
    let isPassValid = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(passwordInput.value);
    let isRePassValid = repasswordInput.value === passwordInput.value && repasswordInput.value !== "";

    toggleAlert(nameInput, document.getElementById("nameAlert"), isNameValid);
    toggleAlert(emailInput, document.getElementById("emailAlert"), isEmailValid);
    toggleAlert(phoneInput, document.getElementById("phoneAlert"), isPhoneValid);
    toggleAlert(ageInput, document.getElementById("ageAlert"), isAgeValid);
    toggleAlert(passwordInput, document.getElementById("passwordAlert"), isPassValid);
    toggleAlert(repasswordInput, document.getElementById("repasswordAlert"), isRePassValid);

    if (isNameValid && isEmailValid && isPhoneValid && isAgeValid && isPassValid && isRePassValid) {
        submitBtn.removeAttribute("disabled");
    } else {
        submitBtn.setAttribute("disabled", "true");
    }
}

function toggleAlert(input, alertMsg, isValid) {
    if (isValid || input.value === "") {
        alertMsg.classList.add("d-none");
    } else {
        alertMsg.classList.remove("d-none");
    }
}

// ------------------ Initial Call ------------------
getMovies('now_playing');
