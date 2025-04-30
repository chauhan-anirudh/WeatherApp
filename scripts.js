const apiKey = "072e3576c6b4c47d6891cf9e6d29eb05"; // ← Your real API key here
const weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const forecastApiUrl = 'https://api.openweathermap.org/data/2.5/forecast';

const cityInput = document.getElementById('cityInput');
const searchButton = document.getElementById('searchButton');
const weatherContainer = document.getElementById('weatherContainer');
const forecastContainer = document.getElementById('forecastContainer');

// Search button
searchButton.addEventListener('click', () => {
    // alert("Button Clicked!"); // Check if button even works
    const city = cityInput.value.trim();
    if (city !== '') {
        getWeather(city);
        getForecast(city);
    }
});

// Auto-detect location
window.addEventListener('load', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            getWeatherByCoords(lat, lon);
            getForecastByCoords(lat, lon);
        }, () => {
            console.log('Geolocation permission denied.');
        });
    }
});

// Weather by city name
function getWeather(city) {
    fetch(`${weatherApiUrl}?q=${city}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => {
        if (data.cod === 200) {
            displayWeather(data);
            changeBackground(data.weather[0].main);
        } else {
            alert('City not found!');
        }
    })
    .catch(error => console.error('Error fetching weather:', error));
}

// Forecast by city name
function getForecast(city) {
    fetch(`${forecastApiUrl}?q=${city}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => {
        if (data.cod === "200") {
            displayForecast(data.list);
        } else {
            console.error('Forecast error:', data.message);
        }
    })
    .catch(error => console.error('Error fetching forecast:', error));
}

// Weather by GPS
function getWeatherByCoords(lat, lon) {
    fetch(`${weatherApiUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => {
        if (data.cod === 200) {
            displayWeather(data);
            changeBackground(data.weather[0].main);
        } else {
            alert('Location weather not found!');
        }
    })
    .catch(error => console.error('Error fetching GPS weather:', error));
}

// Forecast by GPS
function getForecastByCoords(lat, lon) {
    fetch(`${forecastApiUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => {
        if (data.cod === "200") {
            displayForecast(data.list);
        } else {
            console.error('Forecast GPS error:', data.message);
        }
    })
    .catch(error => console.error('Error fetching GPS forecast:', error));
}

// Display weather
function displayWeather(data) {
    const weatherMain = data.weather[0].main;
    const iconClass = getWeatherIconClass(weatherMain);

    weatherContainer.innerHTML = `
        <h2>${data.name}</h2>
        <i class="wi ${iconClass} weather-icon"></i>
        <p>${data.weather[0].description}</p>
        <h3>${data.main.temp}°C</h3>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind: ${data.wind.speed} m/s</p>
    `;
}

// Display forecast
function displayForecast(forecastList) {
    forecastContainer.innerHTML = '';
    const dailyForecast = {};

    forecastList.forEach(item => {
        const date = item.dt_txt.split(' ')[0];
        if (!dailyForecast[date]) {
            dailyForecast[date] = item;
        }
    });

    const forecastDates = Object.keys(dailyForecast).slice(1, 4); // next 3 days

    forecastDates.forEach(date => {
        const day = dailyForecast[date];
        forecastContainer.innerHTML += `
            <div class="forecast-day">
                <h4>${date}</h4>
                <p>${day.weather[0].description}</p>
                <p>Temp: ${day.main.temp}°C</p>
            </div>
        `;
    });
}

// Weather Icons
function getWeatherIconClass(weatherMain) {
    switch (weatherMain) {
        case 'Clear':
            return 'wi-day-sunny';
        case 'Clouds':
            return 'wi-cloudy';
        case 'Rain':
            return 'wi-rain';
        case 'Drizzle':
            return 'wi-sprinkle';
        case 'Thunderstorm':
            return 'wi-thunderstorm';
        case 'Snow':
            return 'wi-snow';
        case 'Mist':
        case 'Fog':
            return 'wi-fog';
        default:
            return 'wi-day-cloudy';
    }
}

// Change background
function changeBackground(weatherMain) {
    const body = document.body;
    const hour = new Date().getHours();
    let backgroundUrl = '';

    if (hour >= 6 && hour <= 18) { // Day
        switch (weatherMain) {
            case 'Clear':
                backgroundUrl = 'images/clear.jpg';
                break;
            case 'Clouds':
                backgroundUrl = 'images/clouds.jpg';
                break;
            case 'Rain':
            case 'Drizzle':
                backgroundUrl = 'images/rain.jpg';
                break;
            case 'Snow':
                backgroundUrl = 'images/snow.jpg';
                break;
            case 'Mist':
            case 'Fog':
                backgroundUrl = 'images/mist.jpg';
                break;
            default:
                backgroundUrl = 'images/default.jpg';
        }
    } else { // Night
        backgroundUrl = 'images/night.jpg';
    }

    body.style.backgroundImage = `url('${backgroundUrl}')`;
}
