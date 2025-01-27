import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 4000;

// API Key for OpenWeather
const API_KEY = "8b98d147407fedf1cbce8c4daba9fe";

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index", { weather: null, error: null });
});

app.post("/", async (req, res) => {
    const cityName = req.body.city;

    try {
        const weatherResult = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
        );

        const weatherData = weatherResult.data;

        res.render("index", {
            weather: {
                location: weatherData.name,
                temperature: weatherData.main.temp,
                description: weatherData.weather[0].description,
                humidity: weatherData.main.humidity,
                windSpeed: weatherData.wind.speed,
            },
            error: null,
        });
    } catch (error) {
        console.error(error.message);

        res.render("index", {
            weather: null,
            error: "Could not fetch weather data. Please try again.",
        });
    }
});

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
