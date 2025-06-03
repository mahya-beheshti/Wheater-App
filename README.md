# ☔️ Weather Forecast App

A simple, user-friendly weather web application that displays hourly and daily weather forecasts for cities in Iran. Users can detect their location via IP or geolocation, or manually select a city from a dropdown list.

## 🚀 Features

* 🌍 Location detection:

  * Via IP address using [AbstractAPI](https://www.abstractapi.com/ip-geolocation-api).
  * Via device geolocation (GPS-based).
* 🌧️ Weather forecasts using [WeatherAPI](https://www.weatherapi.com/):

  * Current weather
  * Hourly forecast (up to 48 hours)
  * Daily forecast (7 days)
* 🌐 Persian provinces with latitude and longitude support
* 🌟 Clean and intuitive UI

## 🔧 Technologies Used

* HTML, CSS, and Vanilla JavaScript
* External APIs:

  * IP Geolocation by AbstractAPI
  * Weather data by WeatherAPI

## 🚧 Setup & Usage

1. **Clone the repository**:

```bash
git clone https://github.com/your-username/weather-app.git
cd weather-app
```

2. **Add your API keys**:

Replace the following placeholder keys in `app.js`:

```js
weatherApiKey: "<YOUR_WEATHERAPI_KEY>",
geoApiUrl: "https://ipgeolocation.abstractapi.com/v1/?api_key=<YOUR_ABSTRACTAPI_KEY>&ip_address=...",
```

3. **Open `index.html` in your browser**

You can directly open the file in your browser or host it locally using any static server.

## ✉️ Feedback

Found a bug or have a feature request? Feel free to open an issue or submit a pull request!

---
