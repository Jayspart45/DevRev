const mongoose = require("mongoose");

// MongoDB connection setup
const url = `mongodb+srv://jay:1357945@cluster0.u2uewqx.mongodb.net/test`;
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("MongoDB connected");
});

// Flight1 Schema
const flight1Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});
const flightSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    number: {
      type: String,
      required: true
    },
    timing: {
      type: String,
      required: true
    }
  });
// FlightSearch Schema
const flightSearchSchema = new mongoose.Schema({
  arrival: { type: String, required: true },
  departure: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
});

// Flight1 Model
const Flight1 = mongoose.model("Flight1", flight1Schema);

// FlightSearch Model
const FlightSearch = mongoose.model("FlightSearch", flightSearchSchema);
const Flight = mongoose.model("Flight", flightSchema);

// Exporting the models
module.exports = {
  Flight1,
  FlightSearch,
  Flight,
};
