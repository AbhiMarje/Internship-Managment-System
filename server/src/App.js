const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());
app.use(require("../router/Routers.js"));

const DB = "mongodb://127.0.0.1:27017/test";
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(5000, () => {
  console.log("Server started at port 5000");
});
