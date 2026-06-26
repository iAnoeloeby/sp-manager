/**
 * Weather Service
 *
 * Temporary weather data provider backed by local mock data.
 * Used for development and UI testing until a real weather API
 * integration is implemented.
 *
 * TODO:
 * - Replace mock data source with a real API implementation.
 * - Add response normalization, error handling, and caching.
 * - Support live weather conditions and forecast updates.
 */

/**
 * @typedef {Object} ForecastDay
 * @property {string} day
 * @property {number} high
 * @property {number} low
 * @property {string} condition
 *
 * @typedef {Object} WeatherData
 * @property {string} location
 * @property {number} temperature
 * @property {number} feelsLike
 * @property {number} humidity
 * @property {number} windSpeed
 * @property {string} condition
 * @property {string} description
 * @property {ForecastDay[]} forecast
 */

/** @type {WeatherData} */
const MOCK_WEATHER = {
    location: "Yogyakarta",
    temperature: 31,
    feelsLike: 34,
    humidity: 78,
    windSpeed: 12,
    condition: "partly-cloudy",
    description: "Berawan sebagian",
    forecast: [
        { day: "Sen", high: 32, low: 26, condition: "sunny" },
        { day: "Sel", high: 31, low: 25, condition: "rainy" },
        { day: "Rab", high: 30, low: 25, condition: "rainy" },
        { day: "Kam", high: 33, low: 26, condition: "partly-cloudy" },
        { day: "Jum", high: 32, low: 26, condition: "sunny" },
    ],
};

/**
 * @param {number} ms
 * @returns {Promise<void>}
 */
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * @returns {Promise<WeatherData>}
 */
async function fetchWeatherFromMock() {
    await delay(500);
    return MOCK_WEATHER;
}

/**
 * Public: fetch the full weather payload (current conditions + forecast).
 * Currently delegates to mock data; swap the body to call a real API.
 *
 * @returns {Promise<WeatherData>}
 */
export async function fetchWeather() {
    // ponytail: currently hardcoded, replace with API call
    // return fetchWeatherFromAPI();
    return fetchWeatherFromMock();
}

/**
 * Public: fetch forecast data only.
 *
 * @returns {Promise<ForecastDay[]>}
 */
export async function fetchForecast() {
    const data = await fetchWeather();
    return data.forecast;
}
