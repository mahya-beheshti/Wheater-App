import { iranProvinces } from "../assets/city.js";

const elements = {
    ipBtn: document.querySelector(".btn--ip-detection"),
    geoBtn: document.querySelector(".btn--geolocation"),
    cityDropdown: document.querySelector(".city-dropdown"),
    //wheater
    weatherDisplay: document.querySelector(".weather-display"),
    cityName: document.querySelector(".weather-city-name"),
    weatherIcon: document.querySelector(".weather-icon"),
    currentTemp: document.querySelector(".temp"),
    weatherHourly: document.querySelector(".weather-hourly"),
    hourlyContainer: document.querySelector(".hourly-container"),
    weatherDaily: document.querySelector(".weather-daily"),
    dailyContainer: document.querySelector(".daily-container"),
};

const state = {
    currentCity: null,
    currentLat: null,
    currentLon: null,
    cities: iranProvinces,
};

const apiConfig = {
    weatherApiKey: "<YOUR_WEATHERAPI_KEY>",
    geoApiUrl:
        "https://ipgeolocation.abstractapi.com/v1/?api_key=alsoApiKey&ip_address=94.177.73.27",
    weatherApiBaseUrl: `http://api.weatherapi.com/v1`,
};

function setUp() {
    setUpDropdown();
    elements.ipBtn.addEventListener("click", ipBtnHandler);
    elements.geoBtn.addEventListener("click", geolocationBtnHandler);
    elements.cityDropdown.addEventListener("change", dropdownhandler);
}

//event handlers:
async function ipBtnHandler(event) {
    const data = await getCityByIP();
    state.currentLat = data.latitude;
    state.currentLon = data.longitude;
    state.currentCity = findNearestCity(state.currentLat, state.currentLon);
    console.log(state.currentCity);
    showWeather();
    return;
}

async function geolocationBtnHandler(event) {
    try {
        const data = await getCityByGeolocation();
        state.currentLat = data.latitude;
        state.currentLon = data.longitude;
        state.currentCity = findNearestCity(state.currentLat, state.currentLon);
        console.log("Geolocation success:", state.currentCity);
        await showWeather(state.currentCity);
    } catch (error) {
        console.error("Geolocation failed:", error);
        // Show user-friendly error message
        if (error.includes("denied")) {
            showError(
                "Location access was denied. Please allow location access or use IP detection."
            );
        } else if (error.includes("timeout")) {
            showError(
                "Location detection timed out. Please try again or use IP detection."
            );
        } else {
            showError(`403 Could not determine your location. `);
        }
    }
}

async function dropdownhandler(event) {
    const selectedCity = event.target.value;
    if (selectedCity) {
        state.currentCity = selectedCity;
        showWeather();
    }
}
//find location functions:
async function getCityByIP() {
    try {
        const response = await fetch(apiConfig.geoApiUrl);
        if (!response.ok) {
            showError(response.status + " Oops! smth went wrong");
            throw new Error(`Response status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error(error.message);
        return null;
    }
}

async function getCityByGeolocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject("Geolocation not supported");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            (error) => reject(error.message),
            { timeout: 10000 }
        );
    });
}

//setup functions:
async function setUpDropdown() {
    try {
        const locationData = await getCityByIP();
        if (!locationData) {
            state.currentCity = "Tehran";
            state.currentLat = 35.699603;
            state.currentLon = 51.337984;
        } else {
            state.currentLat = locationData.latitude;
            state.currentLon = locationData.longitude;
            state.currentCity = findNearestCity(
                state.currentLat,
                state.currentLon
            );
        }

        state.cities.forEach((city) => {
            const option = document.createElement("option");
            option.value = city.capital;
            option.textContent = city.capital;
            option.dataset.lat = city.lat;
            option.dataset.lon = city.lon;
            elements.cityDropdown.appendChild(option);

            if (city.capital === state.currentCity) {
                option.selected = true;
            }
        });
        elements.cityDropdown.value = state.currentCity;

        elements.cityDropdown.addEventListener("click", function () {
            if (this.value === state.currentCity) {
                dropdownhandler({ target: this });
            }
        });

        console.log("Nearest city set to:", state.currentCity);
    } catch (error) {
        console.error("Dropdown setup failed:", error);
        showError(error.message);
    }
}

function findNearestCity(lat, lon) {
    let minDistance = Infinity;
    let nearestCity = state.cities[0].capital;

    state.cities.forEach((city) => {
        const distance = Math.sqrt(
            Math.pow(city.lat - lat, 2) + Math.pow(city.lon - lon, 2)
        );
        if (distance < minDistance) {
            minDistance = distance;
            nearestCity = city.capital;
        }
    });

    return nearestCity;
}

function showError(er) {
    alert(er);
}

//weather phase:
async function showWeather() {
    elements.weatherDisplay.classList.add("active");
    elements.cityName.textContent = state.currentCity;
    console.log('hey');
    
    const dailyUrl = `${apiConfig.weatherApiBaseUrl}/forecast.json?key=${apiConfig.weatherApiKey}&q=${state.currentCity}&days=7`;
    const hourlyUrl = `${apiConfig.weatherApiBaseUrl}/forecast.json?key=${apiConfig.weatherApiKey}&q=${state.currentCity}&days=2`;
    try {
        const [dailyData, hourlyData] = await Promise.all([
            getWeatherData(dailyUrl),
            getWeatherData(hourlyUrl),
        ]);

        if (dailyData && hourlyData) {
            updateCurrentWeather(dailyData);
            updateDailyForecast(dailyData);
            updateHourlyForecast(hourlyData);
            console.log("happy");
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
        showError("Failed to load weather data. Please try again.");
    }
}

function updateCurrentWeather(data) {
    const current = data.current;
    elements.currentTemp.textContent = Math.round(current.temp_c);
    elements.weatherIcon.src = current.condition.icon;
    elements.weatherIcon.alt = current.condition.text;
}

async function getWeatherData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            showError(response.status + " Oops! smth went wrong");
            throw new Error(`Response status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error(error.message);
        return null;
    }
}

function updateHourlyForecast(data) {
    const forecastHours = data.forecast.forecastday.flatMap((day) => day.hour);
    const now = new Date();
    const upcomingHours = forecastHours
        .filter((hour) => {
            const hourTime = new Date(hour.time);
            return hourTime >= now;
        })
        .slice(0, 48);

    elements.weatherHourly.innerHTML = "";

    upcomingHours.forEach((hour) => {
        const hourTime = new Date(hour.time);
        const hourElement = document.createElement("div");
        hourElement.className = "hourly-container";
        hourElement.innerHTML = `
            <div class="hourly-hour">${hourTime.getHours()}:00</div>
            <img src="${hour.condition.icon}" alt="${
            hour.condition.text
        }" class="hourly-icon">
            <div class="hourly-temperature">
            <div class="hourly-temp">${Math.round(hour.temp_c)}°</div>
            </div>
        `;
        elements.weatherHourly.appendChild(hourElement);
    });
}

function updateDailyForecast(data) {
    const forecastDays = data.forecast.forecastday;
    elements.weatherDaily.innerHTML = "";

    forecastDays.forEach((day) => {
        const date = new Date(day.date);
        const dayElement = document.createElement("div");
        dayElement.className = "daily-container";
        dayElement.innerHTML = `
            <div class="day">${date.toLocaleDateString("en-US", {
                weekday: "short",
            })}</div>
            <img src="${day.day.condition.icon}" alt="${
            day.day.condition.text
        }" class="daily-icon">
            <div class="daily-temp">${Math.round(
                day.day.maxtemp_c
            )}° / ${Math.round(day.day.mintemp_c)}°</div>
        `;
        elements.weatherDaily.appendChild(dayElement);
    });
}
setUp();
