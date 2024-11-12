const express = require("express");
const mongoose = require("mongoose");
const route = require("./routes/route.js");

const app = express();

app.use(express.json());

app.use("/", route);

mongoose
  .connect(
    "mongodb+srv://sainitushar51:q4WvscE4AhbjkBfL@cluster0.7dtpx.mongodb.net/PizzaDeliveryApp"
  )
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

app.listen(3000, function () {
  console.log("Express app running on port " + 3000);
});
