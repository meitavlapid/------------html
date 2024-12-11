const API_KEY = "0696dfeb5d286c6c8813e9f83562a268";
const URL = `https://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}&units=metric&lang=he&q=`;
const query = document.getElementById("city-input");
const city = document.getElementById("city");
const button = document.getElementById("search-button");
const description = document.getElementById("description");
const temp = document.getElementById("temp");
const img = document.querySelector("img");
const errorMessage = document.getElementById("errormessage");
const suggestionBox = document.createElement("ul");

suggestionBox.style.listStyleType = "none";
suggestionBox.style.padding = "0";
suggestionBox.style.marginTop = "10px";
suggestionBox.style.maxHeight = "150px";
suggestionBox.style.overflowY = "auto";
suggestionBox.style.border = "1px solid #ccc";
suggestionBox.style.borderRadius = "5px";
suggestionBox.style.backgroundColor = "#fff";
document.querySelector(".search-box").appendChild(suggestionBox);
async function fetchCitySuggestions(query) {
    if (query.trim().length < 3) {
        suggestionBox.innerHTML = ""; // נקה הצעות אם השאילתה קצרה מדי
        return;
    }

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/find?q=${query}&type=like&lang=he&appid=${API_KEY}`);
        const data = await response.json();
        if (data.cod === "200") {
            displaySuggestions(data.list);
        } else {
            suggestionBox.innerHTML = "<li>No matches found</li>";
        }
    } catch (error) {
        console.log("Error fetching city suggestions:", error);
    }
}

function displaySuggestions(cities) {
    suggestionBox.innerHTML = ""; // נקה הצעות קודמות

    cities.forEach((city) => {
        const cityName = city.local_names && city.local_names.he ? city.local_names.he : city.name; // בדוק אם יש שם בעברית
        const listItem = document.createElement("li");
        listItem.textContent = `${cityName}, ${city.sys.country}`;
        listItem.style.padding = "10px";
        listItem.style.cursor = "pointer";

        listItem.addEventListener("click", () => {
            query.value = city.name; // עדכן את הקלט בשם העיר
            suggestionBox.innerHTML = ""; // נקה את ההצעות
            getWeather(city.name); // הבא תחזית מזג אוויר
        });

        suggestionBox.appendChild(listItem);
    });
}

query.addEventListener("input", () => {
    fetchCitySuggestions(query.value);
});

async function getWeather(cityName) {
    try {
        const response = await fetch(URL + cityName);
        const data = await response.json();

        if (data.cod === 200) {
            displayWeather(data);
            errorMessage.innerText = ""; // לנקות הודעות שגיאה
        } else {
            displayError("העיר לא נמצאה. אנא נסה שוב.");
        }
    } catch (error) {
        displayError("An error occurred. Please try again later.");
        console.log(error);
    }
}
function displayWeather(weatherData) {
    city.innerText = weatherData.name; // שם העיר מהנתונים
    description.innerText = weatherData.weather[0].description; // תיאור מזג האוויר
    temp.innerText = `${weatherData.main.temp}°C`; // טמפרטורה עם יחידות
    img.src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`; // אייקון מזג אוויר
    document.getElementById("humidity").innerText = `לחות: ${weatherData.main.humidity}%`;
    document.getElementById("wind").innerText = `מהירות רוח: ${weatherData.wind.speed} מטר/שנייה`;
}

function displayError(message) {
    errorMessage.innerText = message; // הודעת שגיאה למשתמש
    city.innerText = "";
    description.innerText = "";
    temp.innerText = "";
    img.src = ""; // ניקוי תמונה
    document.getElementById("humidity").innerText = "";
    document.getElementById("wind").innerText = "";
}

button.addEventListener("click", () => {
    if (query.value.trim()) {
        getWeather(query.value);
    } else {
        displayError("Please enter a city name.");
    }
});
