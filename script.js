const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const weatherContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector("[data-grantAccess]");
const searchContainer = document.querySelector(".search-container")
const accessLocation = document.querySelector(".access-location");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const weatherInfo = document.querySelector(".weather-info");
const fetchError = document.querySelector(".error-container");
const errorInfo = document.querySelector("[data-errorInfo]");


let currentTab = userTab;
const API_key = "702cd08366160bde30491c96b2216597";
currentTab.classList.add("current-tab");
getFromSessionStorage();

// tab switching
function switchTab(clickedTab) {
  if (currentTab != clickedTab) {
    currentTab.classList.remove("current-tab");
    currentTab = clickedTab;
    currentTab.classList.add("current-tab");

    if (!searchContainer.classList.contains("active")) {
      accessLocation.classList.remove("active");
      weatherInfo.classList.remove("active");
      fetchError.classList.remove("active")
      searchContainer.classList.add("active");
    }
    else {
      searchContainer.classList.remove("active");
      weatherInfo.classList.remove("active");
      fetchError.classList.remove("active")
      getFromSessionStorage();
    }
  }
}

userTab.addEventListener("click", () => {
  switchTab(userTab);
})

searchTab.addEventListener("click", () => {
  switchTab(searchTab);
})

function getFromSessionStorage() {
  const localCoordinates = sessionStorage.getItem("user-coordinates");
  if (!localCoordinates) {
    accessLocation.classList.add("active");
  }
  else {
    const coordinates = JSON.parse(localCoordinates);
    fetchWeatherByCoordinates(coordinates);
  }
}

async function fetchWeatherByCoordinates(coordinates) {
  const { lat, lon } = coordinates;
  fetchError.classList.remove("active")
  accessLocation.classList.remove("active");
  loadingScreen.classList.add("active");

  // Calling API
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`);
    const data = await response.json();

    loadingScreen.classList.remove("active");
    weatherInfo.classList.add("active");
    fetchError.classList.remove("active")
    renderWeatherDetails(data);
  }
  catch (error) {
    console.log("Error Found ", error);
    loadingScreen.classList.remove("active")
    weatherInfo.classList.remove("active")
    accessLocation.classList.remove("active")
    fetchError.classList.add("active")
    errorInfo.innerText = "Unable to fetch details from API"
  }
}

function renderWeatherDetails(weatherDetails) {

  const cityName = document.querySelector("[data-cityInfo]");
  const countryFlag = document.querySelector("[data-countryInfo]");
  const weatherDisc = document.querySelector("[data-weatherDisc]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const temp = document.querySelector("[data-temp]");
  const wind = document.querySelector("[data-windInfo]");
  const humidity = document.querySelector("[data-humidityInfo]");
  const cloud = document.querySelector("[data-cloudInfo]");

  // Adding Sunset and sunrise 
  const sunrise = document.querySelector("[data-sunriseInfo]")
  const sunset = document.querySelector("[data-sunsetInfo]")

  cityName.innerText = weatherDetails?.name;
  countryFlag.src = `https://flagcdn.com/144x108/${weatherDetails?.sys?.country.toLowerCase()}.png`;
  weatherDisc.innerText = weatherDetails?.weather?.[0]?.description.toUpperCase();
  weatherIcon.src = `https://openweathermap.org/img/wn/${weatherDetails?.weather?.[0]?.icon}.png`
  temp.innerText = `${weatherDetails?.main.temp} °C`;
  wind.innerText = `${weatherDetails?.wind?.speed}m/s`;
  humidity.innerText = `${weatherDetails?.main?.humidity}%`;
  cloud.innerText = `${weatherDetails?.clouds?.all}%`;
  sunrise.innerText = `${new Date(weatherDetails?.sys?.sunrise * 1000).toLocaleTimeString()}`
  sunset.innerText = `${new Date(weatherDetails?.sys?.sunset * 1000).toLocaleTimeString()}`

}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition)
  }
  else {
    console.log("No GeoLocation support available");
  }
}

function showPosition(position) {

  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  }

  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates))
  fetchWeatherByCoordinates(userCoordinates)
}

const grantAccess = document.querySelector("[data-grantAccess]")
grantAccess.addEventListener("click", getLocation)

const searchInput = document.querySelector("[data-searchInput]")
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let cityName = searchInput.value;

  if (cityName === "") {
    return;
  }
  else {
    fetchWeatherByName(cityName)
  }
})

async function fetchWeatherByName(city) {
  fetchError.classList.remove("active")
  loadingScreen.classList.add("active")
  weatherInfo.classList.remove("active")
  accessLocation.classList.remove("active")

  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`);
    const data = await response.json();

    console.log(data);

    fetchError.classList.remove("active")
    loadingScreen.classList.remove("active")
    weatherInfo.classList.add("active")

    renderWeatherDetails(data);
  }
  catch (error) {
    console.log("Error Found ", error);
    loadingScreen.classList.remove("active")
    weatherInfo.classList.remove("active")
    accessLocation.classList.remove("active")
    fetchError.classList.add("active")
    errorInfo.innerText = "Unable to fetch details"
  }
}

//  Adding Dark mode 
const toggleBtn = document.querySelector("#check")
const wrapper = document.querySelector(".wrapper")

toggleBtn.addEventListener("click", () => {
  if (toggleBtn.checked) {
    wrapper.classList.add("dark-mode")
  }
  else {
    wrapper.classList.remove("dark-mode")
  }
})

