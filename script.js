const apiKey = "5104c88eb4d19f9fc1f1e32f262612ba";

const button = document.getElementById("weather-btn");
const cityInput = document.getElementById("city-input");
const countryInput = document.getElementById("country-input");
const resultDiv = document.getElementById("weather-result");

const moodboards = {
  veryCold: [
    "img/verycold/verycold1.jpg", "img/verycold/verycold2.jpg", "img/verycold/verycold3.jpg", "img/verycold/verycold4.jpg", "img/verycold/verycold5.jpg", "img/verycold/verycold6.jpg", "img/verycold/verycold7.jpg"
  ],
  cold: [
    "img/cold/cold1.jpg", "img/cold/cold2.jpg", "img/cold/cold3.jpg", "img/cold/cold4.jpg", "img/cold/cold5.jpg", "img/cold/cold6.jpg", "img/cold/cold7.jpg"
  ],
  cool: [
    "img/cool/cool1.jpg", "img/cool/cool2.jpg", "img/cool/cool3.jpg", "img/cool/cool4.jpg", "img/cool/cool5.jpg", "img/cool/cool6.jpg", "img/cool/cool7.jpg"
  ],
  mild: [
    "img/mild/mild1.jpg", "img/mild/mild2.jpg", "img/mild/mild3.jpg", "img/mild/mild4.jpg", "img/mild/mild5.jpg", "img/mild/mild6.jpg", "img/mild/mild7.jpg",
  ],
  warm: [
    "img/warm/warm1.jpg", "img/warm/warm2.jpg", "img/warm/warm3.jpg", "img/warm/warm4.jpg", "img/warm/warm5.jpg", "img/warm/warm6.jpg", "img/warm/warm7.jpg"
  ],
  hot: [
    "img/hot/hot1.jpg", "img/hot/hot2.jpg","img/hot/hot3.jpg", "img/hot/hot4.jpg", "img/hot/hot5.jpg", "img/hot/hot6.jpg", "img/hot/hot7.jpg",
  ]
};

button.addEventListener("click", fetchWeather);

[cityInput, countryInput].forEach((input) => {
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      fetchWeather();
    }
  });
});

function fetchWeather() {
  const city = cityInput.value.trim();
  const country = countryInput.value.trim().toUpperCase();

  if (!city) {
    resultDiv.innerHTML = "<p>Please enter a city 🙂</p>";
    return;
  }

  const q = country ? `${city},${country}` : city;

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    q
  )}&appid=${apiKey}&units=metric&lang=en`;

  resultDiv.innerHTML = "<p>Loading weather…</p>";

  fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Weather not found");
      }
      return res.json();
    })
    .then((data) => {
      const temp = Math.round(data.main.temp);
      const feelsLike = Math.round(data.main.feels_like);
      const description = data.weather[0].description;
      const windSpeed =
        data.wind && data.wind.speed
          ? Math.round(data.wind.speed * 3.6)
          : null;

      const emoji = getWeatherEmoji(description, temp);
      const adviceObj = getClothingAdvice(temp, description);
      const moodboardHtml = renderMoodboard(adviceObj.category);

      resultDiv.innerHTML = `
        <div class="weather-card">
          <div class="weather-header">
            <div>
              <h2>Weather in ${escapeHtml(city)}</h2>
              <p class="weather-description">${emoji} ${description}</p>
            </div>
            <div class="weather-temp">${temp}°C</div>
          </div>

          <div class="weather-details">
            <p><strong>Feels like:</strong> ${feelsLike}°C</p>
            ${
              windSpeed !== null
                ? `<p><strong>Wind:</strong> ${windSpeed} km/h</p>`
                : ""
            }
          </div>

          <div class="clothing-advice">
            <p class="title">OUTFIT ADVICE</p>
            <p>${adviceObj.text}</p>
          </div>

        </div>
        ${moodboardHtml}

      `;
    })
    .catch((err) => {
      console.error(err);
      resultDiv.innerHTML =
        "<p>Could not load the weather. Please check the city/country code.</p>";
    });
}

function getClothingAdvice(temp, description) {
  const desc = description.toLowerCase();
  let text = "";
  let category = "";

  if (temp <= 0) {
    text =
      "Very cold: wear a thick winter coat, warm layers, scarf, gloves, and maybe a hat.";
    category = "veryCold";
  } else if (temp > 0 && temp <= 8) {
    text =
      "Cold: a warm coat, sweater or hoodie, and closed shoes are recommended.";
    category = "cold";
  } else if (temp > 8 && temp <= 15) {
    text =
      "Cool: a light jacket or thick sweater is suitable, together with long trousers.";
    category = "cool";
  } else if (temp > 15 && temp <= 22) {
    text =
      "Mild: light layers work well, such as a T-shirt with a thin jacket or cardigan.";
    category = "mild";
  } else if (temp > 22 && temp <= 28) {
    text =
      "Warm: breathable clothing like T-shirts, dresses, or shorts are perfect.";
    category = "warm";
  } else {
    text =
      "Hot: wear very light clothing, use sunscreen, and drink plenty of water.";
    category = "hot";
  }

  if (desc.includes("rain") || desc.includes("drizzle")) {
    text += " ☔ Don't forget a raincoat or umbrella.";
  }

  if (desc.includes("storm") || desc.includes("thunder")) {
    text += " ⛈ It's safer not to stay outside for too long during heavy storms.";
  }

  if (desc.includes("snow")) {
    text += " ❄ Warm, sturdy shoes with good grip are recommended when it snows.";
    if (!category) category = "veryCold";
  }

  if (desc.includes("sun") && temp >= 18) {
    text += " ☀ Don't forget your sunscreen.";
  }

  return { text, category };
}

function renderMoodboard(category) {
  const photos = moodboards[category];
  if (!photos || photos.length === 0) return "";

  const topRowPhotos = photos.slice(0, 4);
  const bottomRowPhotos = photos.slice(4);

  const topRowHtml = topRowPhotos
    .map((url) => `<img src="${url}" alt="outfit">`)
    .join("");

  const bottomRowHtml = bottomRowPhotos
    .map((url) => `<img src="${url}" alt="outfit">`)
    .join("");

  return `
    <div class="moodboard">
      <div class="row row-top">
        ${topRowHtml}
      </div>
      ${
        bottomRowPhotos.length
          ? `<div class="row row-bottom">
               ${bottomRowHtml}
             </div>`
          : ""
      }
    </div>
  `;
}

function getWeatherEmoji(description, temp) {
  const desc = description.toLowerCase();

  if (desc.includes("thunder") || desc.includes("storm")) return "⛈️";
  if (desc.includes("snow")) return "❄️";
  if (desc.includes("rain") || desc.includes("drizzle") || desc.includes("shower"))
    return "🌧️";
  if (desc.includes("cloud")) return "☁️";
  if (desc.includes("mist") || desc.includes("fog")) return "🌫️";
  if (desc.includes("sun") && temp >= 20) return "☀️";

  return "🌤️";
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, function (c) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[c];
  });
}
