const request = require("request");

const forecast = (lat, long, callback) => {
  const url =
    "http://api.weatherstack.com/current?access_key=777e7ceb3da4f8b8e869348bb460880d&query=" +
    lat +
    "," +
    long +
    "&units=m";

  console.log(url);
  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback("Unable to connect to weather services!", undefined);
    } else if (body.error) {
      callback("Unable to find location", undefined);
    } else {
      const data =
        "Local time:" +
        body.location.localtime +
        "\n" +
        body.current.weather_descriptions[0] +
        ", temperature:" +
        body.current.temperature +
        " degrees, feels like " +
        body.current.feelslike +
        ",wind speed is " +
        body.current.wind_speed +
        ",humidity is " +
        body.current.humidity +
        "%";
      callback(undefined, data);
    }
  });
};

module.exports = forecast;
