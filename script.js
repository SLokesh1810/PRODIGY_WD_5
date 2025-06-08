
function openSearch(data) {
    if (data) {
        document.getElementById('searchButton').style.display = 'none';
        document.getElementById('closeSearch').style.display = 'block';
        document.getElementById('searchCon').style.display = 'block';
        document.getElementById('currentLocal').style.opacity = '0.1';
        document.getElementById('currentLocal').style.pointerEvents = 'none';
        document.querySelector('.localWeathers').style.opacity = '0.1';
        document.querySelector('.localWeathers').style.pointerEvents = 'none';
        document.querySelector('.selectedCity').style.opacity = '0.1';
        document.querySelector('.selectedCity').style.pointerEvents = 'none';
    } else {
        document.getElementById('searchButton').style.display = 'block';
        document.getElementById('closeSearch').style.display = 'none';
        document.getElementById('searchCon').style.display = 'none';
        document.getElementById('currentLocal').style.opacity = '1';
        document.getElementById('currentLocal').style.pointerEvents = 'auto';
        document.querySelector('.localWeathers').style.opacity = '1';
        document.querySelector('.localWeathers').style.pointerEvents = 'auto';
        document.querySelector('.selectedCity').style.opacity = '1';
        document.querySelector('.selectedCity').style.pointerEvents = 'auto';
    }
}
const apiKey = '93cfe59fd5019c508d6a31e227259420';

navigator.geolocation.getCurrentPosition(position => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    const url = `https://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lon}&cnt=7&units=metric&appid=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            let datalist = data.list;
            const main = datalist[0];
            const mainIconURL = `https://openweathermap.org/img/wn/${main.weather[0].icon}@2x.png`;
            document.getElementsByClassName('cityName')[0].textContent += `${main.name}`;
            document.getElementsByClassName('imgNcondt')[0].innerHTML =
                `
                        <div style="grid-row: 2; grid-column: 4/5; display:block; text-align:center; justify-content: center; padding:0;">
                            <img style="margin:0; width:75px; height:70px;" src="${mainIconURL}" alt="${main.weather[0].description}">
                            <p style="margin:0;">${main.weather[0].description}</p>
                        </div>
                    `;
            document.getElementById('temp').textContent = `${main.main.temp}°C`;
            document.getElementById('feelsLike').textContent = `${main.main.feels_like}°C`;
            document.getElementById('minTemp').textContent = `${main.main.temp_min}°C`;
            document.getElementById('maxTemp').textContent = `${main.main.temp_max}°C`;

            for (let i = 1; i < datalist.length; i++) {
                let city = datalist[i];
                const name = city.name;
                const temp = city.main.temp;
                const condition = city.weather[0].description;
                const iconCode = city.weather[0].icon;
                const iconURL = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

                console.log(`${name}: ${temp}°C - ${condition}`);
                console.log("Icon URL:", iconURL);

                document.getElementsByClassName('weathercondts')[i - 1].innerHTML += `
                                <h2>${name}</h2>
                                <p>${temp}°C - ${condition}</p>
                                <img src="${iconURL}" alt="${condition}">
                        `;
                document.getElementsByClassName('weathercondts')[i - 1].onclick = function () { showDetails(name) };
            }
        })
        .catch(err => console.error("Error fetching nearest cities:", err));

});

document.querySelector('#citySearch').addEventListener('keydown', () => {
    let container = document.querySelector('.tooltip');
    container.innerHTML = '';
    let searchingVal = document.getElementById('citySearch').value;
    if (searchingVal != '') {
        const url = `http://api.openweathermap.org/geo/1.0/direct?q=${searchingVal}&limit=10&appid=${apiKey}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                container.style.display = 'block';
                for (let i = 0; i < data.length; i++) {
                    let city = data[i];
                    const name = city.name;
                    const country = city.country;
                    console.log(name);
                    container.innerHTML += `<p onclick="chosenCity('${name}')">${country} - ${name}</p>`;
                }
            })
            .catch(err => console.error("Error fetching city details:", err));
    }
})

function closeWeather() {
    document.getElementById('weatherReport').style.display = 'none';
}

function chosenCity(name){
    openSearch(false);
    showDetails(name);
}

function showDetails(name) {
    document.getElementById('weatherReport').style.display = 'grid';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const main = data;
            const mainIconURL = `https://openweathermap.org/img/wn/${main.weather[0].icon}@2x.png`;
            document.getElementsByClassName('country')[0].textContent = ` Country: ${main.sys.country}`;
            document.getElementsByClassName('name')[0].textContent = `${main.name}`;
            document.getElementsByClassName('imgNcondt')[1].innerHTML =
                `
                        <div style="grid-row: 2; grid-column: 4/5; display:block; text-align:center; justify-content: center; padding:0;">
                            <img style="margin:0; width:75px; height:70px;" src="${mainIconURL}" alt="${main.weather[0].description}">
                            <p style="margin:0;">${main.weather[0].description}</p>
                        </div>
                    `;

            document.getElementById('temp1').textContent = `${main.main.temp}°C`;
            document.getElementById('feelsLike1').textContent = `${main.main.feels_like}°C`;
            document.getElementById('minTemp1').textContent = `${main.main.temp_min}°C`;
            document.getElementById('maxTemp1').textContent = `${main.main.temp_max}°C`;
        })
        .catch(err => console.error("Error fetching city details:", err));
}