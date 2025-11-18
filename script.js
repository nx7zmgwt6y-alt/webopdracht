const apiKey = '5104c88eb4d19f9fc1f1e32f262612ba';

const button = document.getElementById('weather-btn');
const cityInput = document.getElementById('city-input');
const countryInput = document.getElementById('country-input');
const resultDiv = document.getElementById('weather-result');

button.addEventListener('click', () => {
  const city = cityInput.value.trim();
  const country = countryInput.value.trim().toUpperCase();

  if (!city) return;

  const q = country ? `${city},${country}` : city;

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(q)}&appid=${apiKey}&units=metric&lang=nl`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log(data);

      const temp = data.main.temp;
      const description = data.weather[0].description;

      let tip = '';
      if (temp < 5) tip = 'Heel koud: dikke jas, sjaal en handschoenen!';
      else if (temp < 10) tip = 'Koud: jas en trui aan te raden.';
      else if (temp < 15) tip = 'Fris: trui of jas is handig.';
      else if (temp < 20) tip = 'Aangenaam: lichte jas of vest.';
      else if (temp < 25) tip = 'Lekker weer: T-shirt / lichte kleding.';
      else tip = 'Warm: korte broek, jurkje, zonnebril!';

      if (data.rain) {
        tip += ' ✨ Neem ook een regenjas of paraplu mee.';
      }

      resultDiv.innerHTML = `
        <h3>Weer in ${city}</h3>
        <p>Temperatuur: ${temp} °C</p>
        <p>Omschrijving: ${description}</p>
        <p><strong>Kledingadvies:</strong> ${tip}</p>
      `;
    })
    .catch(err => {
      resultDiv.innerHTML = '<p>Kon het weer nu niet ophalen.</p>';
      console.error(err);
    });
});