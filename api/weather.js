document.addEventListener('DOMContentLoaded', function () {
    const apiKey = 'b87adc34bcb29ecf1dc07b271528f21f'; // Replace with your OpenWeatherMap API key
    const map = L.map('map').setView([0, 0], 5);
    const tileLayerUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    L.tileLayer(tileLayerUrl, {
        maxZoom: 19,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
    }).addTo(map);

    let weeklyForecastTable;

    function updateWeatherInfo(data) {
        const temperatureElement = document.getElementById('temperature');
        const feelsLikeElement = document.getElementById('feels-like');
        const humidityElement = document.getElementById('humidity');
        const precipitationElement = document.getElementById('precipitation');
        const windSpeedElement = document.getElementById('wind-speed');
        const windDirectionElement = document.getElementById('wind-direction');

        // Update HTML elements with weather data
        temperatureElement.textContent = (data.main.temp - 273.15).toFixed(2) + "°C"; // Convert temperature from Kelvin to Celsius
        feelsLikeElement.textContent = (data.main.feels_like - 273.15).toFixed(2) + "°C"; // Convert feels like temperature
        humidityElement.textContent = data.main.humidity + "%";
        if (data.rain) {
            precipitationElement.textContent = data.rain['1h'] + " mm"; // Assuming precipitation data is in '1h' format
        } else {
            precipitationElement.textContent = "0 mm"; // Show a message if precipitation data is not available
        }
        windSpeedElement.textContent = data.wind.speed + " m/s";
        windDirectionElement.textContent = data.wind.deg + "°";
    }

    function getWeatherInfo(city) {
        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

        fetch(currentWeatherUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network Error!');
                }
                return response.json();
            })
            .then(data => {

                updateWeatherInfo(data);

                const { coord } = data;

                map.flyTo([coord.lat, coord.lon], 10);

                const oneCallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coord.lat}&lon=${coord.lon}&exclude=current,minutely,hourly&appid=${apiKey}`;

                return fetch(oneCallUrl);
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('No Network Response');
                }
                return response.json();
            })
            .then(data => {
                const dailyForecast = data.daily.slice(1);

                if (weeklyForecastTable) {
                    weeklyForecastTable.remove();
                }

                const weatherInfo = document.getElementById('weatherInfo');
                weeklyForecastTable = document.createElement('table');
                weeklyForecastTable.classList.add('weekly-forecast');


                let tableContent = '<caption>Weekly Forecast</caption><tr><th>Date</th><th>Max/Min</th><th>Weather Conditions</th></tr>';
                dailyForecast.forEach(dayData => {
                    const date = new Date(dayData.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                    const maxTemp = Math.round(dayData.temp.max - 273.15);
                    const minTemp = Math.round(dayData.temp.min - 273.15);
                    const conditions = dayData.weather[0].description;

                    tableContent += `<tr><td>${date}</td><td>${maxTemp}/${minTemp}°C</td><td>${conditions}</td></tr>`;
                });

                weeklyForecastTable.innerHTML = tableContent;
                weatherInfo.appendChild(weeklyForecastTable);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
                alert('Failed to fetch weather data. Please try again.');
            });
    }

    document.getElementById('cityForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const city = document.getElementById('cityInput').value.trim();
        getWeatherInfo(city);
    });

    // Default city: Chittoor, IN
    getWeatherInfo('Chittoor, IN');
});