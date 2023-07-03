const express = require("express");
const mongoose = require("mongoose");

const app = express();

mongoose.connect("mongodb://localhost:27017/JournalMe")
.then(()=>{
  console.log("mongodb connected");
})
.catch(()=>{
  console.log('failed');
});

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});