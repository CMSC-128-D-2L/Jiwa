// dependencies
const App = require("./app.js");
const mongoose = require("mongoose");
const createAdmin = require("./db_setup");
require("dotenv").config();

// connect to database
mongoose.connect(
  `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  { useNewUrlParser: true, useUnifiedTopology: true },
  async (err) => {
    if (err) {
      console.log(`Failed to connect to Database: ${err}`);
    } else {
      console.log("Connected to Mongo DB");

      try {
        await createAdmin();
        console.log("Database setup complete");

        // start server
        App.start();
      } catch (err) {
        console.log(`Error setting up Database: Error: ${err}`);
      }
    }
  }
);
