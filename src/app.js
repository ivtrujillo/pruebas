const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParse = require("body-parser");
const availabilityController = require('./Controllers/availability-controller');

dotenv.config();

const app = express();

app.use(bodyParse.json());
app.post('/entry', availabilityController.entry);
app.get('/exit', availabilityController.exit);

const PORT = process.env.PORT || 3000;

mongoose
    .connect(process.env.MONGODB,  {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        app.listen(PORT, () => {
            console.log("app linning");
          });
    })
    .catch(error => {
         console.log("error connect to dabase ", error);
    });


