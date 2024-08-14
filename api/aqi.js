document.addEventListener('DOMContentLoaded', function () {
    function getCoordinates(city) {
        const apiKey = 'b87adc34bcb29ecf1dc07b271528f21f';
        const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

        fetch(geocodingUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network Error!');
                }
                return response.json();
            })
            .then(data => {
                if (data.length === 0) {
                    throw new Error('City not found!');
                }
                const { lat, lon } = data[0];
                updateAQI(lat, lon);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
                alert('Failed to fetch city coordinates. Please try again.');
            });
    }

    function getAqiStatusText(aqiValue) {
        switch (aqiValue) {
            case 1:
                return 'Good';
            case 2:
                return 'Moderate';
            case 3:
                return 'Unhealthy';
            case 4:
                return 'Very Unhealthy';
            case 5:
                return 'Hazardous';
            default:
                return 'Unknown';
        }
    }

    function updateAQI(latitude, longitude) {
        const aqiTableBody = document.getElementById('aqiTableBody');
        const aqiResultSpan = document.getElementById('aqi-result');
        const aqiStatusParagraph = document.getElementById('aqi-result-bg');

        const apiKey = '412c5efc941468b9df0e3136a3bbd53e';
        const aqiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

        fetch(aqiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network Error!');
                }
                return response.json();
            })
            .then(data => {
                aqiTableBody.innerHTML = '';

                const pollutants = data.list[0].components;

                const gases = {
                    so2: 'SO<sub>2</sub>',
                    no2: 'NO<sub>2</sub>',
                    pm10: 'PM<sub>10</sub>',
                    pm2_5: 'PM<sub>2.5</sub>',
                    o3: 'O<sub>3</sub>',
                    co: 'CO'
                };

                const tableHeaders = document.createElement('thead');
                const headerRow = document.createElement('tr');
                headerRow.innerHTML = '<th>Pollutants</th><th>Concentration(μg/m3)</th>';
                tableHeaders.appendChild(headerRow);
                aqiTableBody.appendChild(tableHeaders);

                for (const gasKey in gases) {
                    if (gases.hasOwnProperty(gasKey)) {
                        const gasDisplayName = gases[gasKey];
                        const concentration = pollutants[gasKey];

                        const row = document.createElement('tr');
                        row.innerHTML = `<td>${gasDisplayName}</td><td>${concentration}</td>`;
                        aqiTableBody.appendChild(row);
                    }
                }

                const aqiValue = data.list[0].main.aqi;
                aqiResultSpan.textContent = `AQI: ${updateAqiStatusBackground(aqiStatusParagraph, aqiValue)}`;
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }

    function updateAqiStatusBackground(element, aqiValue) {
        let statusText = '';

        switch (aqiValue) {
            case 1:
                statusText = 'Good';
                break;
            case 2:
                statusText = 'Moderate';
                break;
            case 3:
                statusText = 'Unhealthy';
                break;
            case 4:
                statusText = 'Very Unhealthy';
                break;
            case 5:
                statusText = 'Hazardous';
                alert('Very High AQI !! \n Stay Indoor and Chat with SkyBot for crucial information and guidance to ensure safety and well-being.');
                break;
            default:
                statusText = 'Unknown';
                break;
        }

        console.log('Inside updateAqiStatusBackground');

        element.textContent = statusText;
        updateAqiStatusBackgroundColor(element, aqiValue);
    }

    function updateAqiStatusBackgroundColor(element, aqiValue) {
        const colors = {
            1: '#00cc44b6',
            2: '#ffcc00b6',
            3: '#ff6633',
            4: '#993399b6',
            5: '#800000b6',
            'Unknown': 'transparent'
        };

        element.style.backgroundColor = colors[aqiValue] || colors['Unknown'];
    }

    console.log('Inside updateAqiStatusBackgroundColor');

    document.getElementById('AQI-form').addEventListener('submit', function (event) {
        event.preventDefault();
        const city = document.getElementById('city2Input').value.trim();
        getCoordinates(city);
    });


    // Default city: Chittoor, IN
    getCoordinates('Chittoor, IN');
});