const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    orgin: "http://localhost:3000",
  })
);

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather App",
    name: "Andew Mead",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About App",
    name: "Andrew",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help App",
    helpText: "This is something helpful",
    name: "Andrew",
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "Address must be provided",
    });
  }
  const location = req.query.address;

  geocode(location, (error, { long, lat, location } = {}) => {
    if (error) {
      return res.send({ error });
    }

    forecast(long, lat, (error, forecastData) => {
      if (error) {
        return res.send(error);
      }
      res.send({
        forecast: forecastData,
        location,
        address: req.query.address,
      });
      console.log(location);
      console.log(forecastData);
    });
  });
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search term",
    });
  }

  console.log(req.query.search);
  res.send({
    products: [],
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    notFoundText: "Help article not found",
    name: "Andrew",
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    notFoundText: "Page not found",
    name: "Andrew",
  });
});

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
