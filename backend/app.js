// dependencies
const express = require('express');
const cookieParser = require("cookie-parser");
const Router = require('./router');
const formData = require('express-form-data');
require('dotenv').config()


exports.start = () => {
    const App = express();
    App.use(formData.parse());
    App.use(express.urlencoded({ extended: true }));
    App.use(express.json());
    App.use(cookieParser());

    App.use((req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000")
        res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE")
        res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers,Access-Control-Allow-Methods,Origin,Accept,Content-Type")
        res.setHeader("Access-Control-Allow-Credentials","true")
        next()
    })

    App.use('/', Router);

    App.listen(process.env.SERVER_PORT, (err) => {
        if (err) { console.log(err) }
        else { console.log(`Server started at port ${process.env.SERVER_PORT}`) }
    })

}

