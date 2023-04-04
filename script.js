// Definindo a chave da API, URL base, idioma e unidades de medida padrão
const api = {
    key: " ", // adicione sua chave aqui
    base: "https://api.openweathermap.org/data/2.5/",
    lang: "pt_br",
    units: "metric"
}

// Selecionando os elementos HTML da página que serão atualizados com os dados da API
const city = document.querySelector('.city')
const date = document.querySelector('.date');
const container_img = document.querySelector('.container-img');
const container_temp = document.querySelector('.container-temp');
const temp_number = document.querySelector('.container-temp div');
const temp_unit = document.querySelector('.container-temp span');
const weather_t = document.querySelector('.weather');
const search_input = document.querySelector('.form-control');
const search_button = document.querySelector('.btn');
const low_high = document.querySelector('.low-high');

// Quando a página carrega, a função é executada para obter a posição do usuário
window.addEventListener('load', () => {
    // Se o navegador suportar geolocalização, a posição do usuário será obtida
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setPosition, showError);
    }
    // Caso contrário, uma mensagem de erro será exibida
    else {
        alert('navegador não suporta geolozalicação');
    }

    // Define a posição do usuário como os valores de latitude e longitude obtidos pela geolocalização
    function setPosition(position) {
        let lat = position.coords.latitude;
        let long = position.coords.longitude;
        coordResults(lat, long);
    }

    // Exibe uma mensagem de erro se a geolocalização falhar
    function showError(error) {
        alert(`erro: ${error.message}`);
    }
})

// Obtém os resultados da API com base nas coordenadas do usuário
function coordResults(lat, long) {
    fetch(`${api.base}weather?lat=${lat}&lon=${long}&lang=${api.lang}&units=${api.units}&APPID=${api.key}`)
        .then(response => {
            // Verifica se a resposta da API é bem-sucedida
            if (!response.ok) {
                throw new Error(`http error: status ${response.status}`)
            }
            return response.json();
        })
        .catch(error => {
            // Exibe uma mensagem de erro se ocorrer um erro na solicitação à API
            alert(error.message)
        })
        .then(response => {
            // Exibe os resultados da API na página
            displayResults(response)
        });
}

// Obtém os resultados da API com base na cidade pesquisada pelo usuário
search_button.addEventListener('click', function () {
    searchResults(search_input.value)
})

// Obtém os resultados da API quando o usuário pressiona a tecla "Enter" na caixa de pesquisa
search_input.addEventListener('keypress', enter)
function enter(event) {
    key = event.keyCode
    if (key === 13) {
        searchResults(search_input.value)
    }
}

// A função que envia uma solicitação para a API do clima e mostra os resultados
function searchResults(city) {
    // A URL da API é construída com base nas variáveis ​​do objeto 'api' e na cidade fornecida
    fetch(`${api.base}weather?q=${city}&lang=${api.lang}&units=${api.units}&APPID=${api.key}`)
        .then(response => {
            // Se houver um erro na resposta, lance uma exceção
            if (!response.ok) {
                throw new Error(`http error: status ${response.status}`)
            }
            // Se não houver erro, retorne o conteúdo da resposta como JSON
            return response.json();
        })
        // Capture quaisquer erros ocorridos durante a chamada e exiba-os em um alerta
        .catch(error => {
            alert(error.message)
        })
        // Chame a função 'displayResults' para mostrar as informações do clima
        .then(response => {
            displayResults(response)
        });
}

// A função que mostra as informações do clima na página
function displayResults(weather) {
    console.log(weather)

    // Mostra o nome da cidade e o país
    city.innerText = `${weather.name}, ${weather.sys.country}`;

    // Mostra a data atual usando a função 'dateBuilder'
    let now = new Date();
    date.innerText = dateBuilder(now);

    // Mostra o ícone do clima correspondente usando a variável 'iconName'
    let iconName = weather.weather[0].icon;
    container_img.innerHTML = `<img src="./icons/${iconName}.png">`;

    // Mostra a temperatura atual e a unidade de medida (°C) correspondente
    let temperature = `${Math.round(weather.main.temp)}`
    temp_number.innerHTML = temperature;
    temp_unit.innerHTML = `°c`;

    // Mostra o tempo atual e capitaliza a primeira letra usando a função 'capitalizeFirstLetter'
    weather_tempo = weather.weather[0].description;
    weather_t.innerText = capitalizeFirstLetter(weather_tempo)

    // Mostra a temperatura mínima e máxima para o dia
    low_high.innerText = `${Math.round(weather.main.temp_min)}°c / ${Math.round(weather.main.temp_max)}°c`;
}

// A função que constrói uma string com a data atual
function dateBuilder(d) {
    let days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    let months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julio", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    let day = days[d.getDay()]; //getDay: 0-6
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    // Retorna a data formatada em uma string
    return `${day}, ${date} ${month} ${year}`;
}

container_temp.addEventListener('click', changeTemp);

function changeTemp() {
    // Obter o valor atual da temperatura
    let temp_number_now = temp_number.innerHTML;

    if (temp_unit.innerHTML === "°c") {
        // Converter a temperatura de Celsius para Fahrenheit
        let f = (temp_number_now * 1.8) + 32;
        temp_unit.innerHTML = "°f";
        temp_number.innerHTML = Math.round(f);
    }
    else {
        // Converter a temperatura de Fahrenheit para Celsius
        let c = (temp_number_now - 32) / 1.8;
        temp_unit.innerHTML = "°c";
        temp_number.innerHTML = Math.round(c);
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
