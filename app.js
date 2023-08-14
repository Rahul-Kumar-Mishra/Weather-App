const { log } = require('console');
const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended:  true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

let city = "";
let temp = "";
let temp_min = "";
let temp_max = "";
let weatherDescription = "";
let imageURL = "";

app.get("/", (req, resp) => {

    resp.render('index');
});

app.get('/output', (req, resp) =>{
    resp.render('output', {
        cityName : city.toUpperCase(),
        currentTemp : temp, 
        min : temp_min,
        max : temp_max,
        description : weatherDescription,
        img : imageURL
    }); 
});


app.post('/', (req, resp) => {
    


    city = req.body.cityName;
    const apiKey = "af8b2fc98f6cfc5c5a8d7ed60fe2e8e5";
    const units = "metric";

    const url = "https://api.openweathermap.org/data/2.5/weather?q="+city.toLowerCase()+"&appid=" + apiKey +"&units=" + units;


    https.get(url, (response) =>{
        //console.log(response.statusCode);

        response.on('data', (data)=>{
                       
            const weatherData = JSON.parse(data);
            // console.log(weatherData);

            temp = weatherData.main.temp;
            temp_min = weatherData.main.temp_min;
            temp_max = weatherData.main.temp_max;
            weatherDescription = weatherData.weather[0].description;
            let icon = weatherData.weather[0].icon;
            imageURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
            
            resp.redirect('/output');

        });
    });

});



app.listen(4500, ()=>{
    console.log("Server is running on port 4500...");
});

