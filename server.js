const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');

const app = express();

//basic connection
mongoose.connect("mongodb://localhost:27017/JournalMe", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(()=>{
  console.log("MongoDB connected");
})
.catch((error)=>{
  console.error('Failed to connect to MongoDB', error);
});


app.use(express.static("public"));
app.use(cors());


app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.get("/users", async (req, res) => {
  try {
    const db = mongoose.connection;
    const collection = db.collection('users'); // Use your collection name here

    // Find all documents in the collection
    const documents = await collection.find().toArray();

    // Send the retrieved documents as JSON response
    res.json(documents);
  } catch (error) {
    console.error('Failed to retrieve documents from the database:', error);
    res.status(500).json({ error: 'Failed to retrieve documents from the database' });
  }
});


app.listen(3001, () => {
  console.log("Server started on port 3001");
});