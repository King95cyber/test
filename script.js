async function fetchWeather() {
  const searchInput = document.getElementById("search").value.trim();
  const weatherDataSection = document.getElementById("weather-data");
  const apiKey = "cb2012127004afa1d1fc9775f2f17762";

  if (!searchInput) {
    weatherDataSection.style.display = "block";
    weatherDataSection.innerHTML = `
      <div>
        <h2>Empty Input!</h2>
        <p>Please try again with a valid <u>city name</u>.</p>
      </div>`;
    return;
  }

  async function getLonAndLat() {
    const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(searchInput)},US&limit=1&appid=${apiKey}`;
    console.log("Geocode URL:", geocodeURL);
    const response = await fetch(geocodeURL);
    if (!response.ok) {
      console.error("Geocode failed:", response.status);
      return null;
    }
    const data = await response.json();
    console.log("Geocode data:", data);
    if (!data.length) {
      weatherDataSection.style.display = "block";
      weatherDataSection.innerHTML = `
        <div>
          <h2>Invalid Input: "${searchInput}"</h2>
          <p>Please try again with a valid <u>city name</u>.</p>
        </div>`;
      return null;
    }
    return data[0];
  }

  async function getWeatherData(lon, lat, cityName) {
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
    console.log("Weather URL:", weatherURL);
    const response = await fetch(weatherURL);
    if (!response.ok) {
      console.error("Weather failed:", response.status);
      return;
    }
    const data = await response.json();
    console.log("Weather data:", data);

    weatherDataSection.style.display = "flex";
    weatherDataSection.innerHTML = `
      <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" 
           alt="${data.weather[0].description}" width="100" />
      <div>
        <h2>${cityName}</h2>
        <p><strong>Temperature:</strong> ${Math.round(data.main.temp)}°F</p>
        <p><strong>Description:</strong> ${data.weather[0].description}</p>
      </div>
    `;
  }

  document.getElementById("search").value = "";
  const geocodeData = await getLonAndLat();
  if (geocodeData) {
    await getWeatherData(geocodeData.lon, geocodeData.lat, geocodeData.name);
  }
}