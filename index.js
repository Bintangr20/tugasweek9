const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/users");
const moviesRoutes = require('./routes/movies');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const morgan = require('morgan')

require('dotenv').config();

const app = express();
const port = 3000;

app.use(morgan('common'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Swagger
const swaggerDefinition = YAML.load('swagger.yml');
const options = {
  swaggerDefinition,
  apis: ['./routes/*'],
};
const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Register the user and secure routes
app.use("/users", userRoutes);
app.use("/movies", moviesRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
