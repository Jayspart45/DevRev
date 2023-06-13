const express = require("express");
const { Flight1, FlightSearch, Flight } = require("./mongo");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const app = express();

app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, 'views'));
const port = 3000;
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/sign", async (req, res) => {
  const { name, email, password } = req.body;

  // Validate the form inputs
  if (!name || !email || !password) {
    res.status(400).send("Name, email, and password are required.");
    return;
  }

  try {
    // Check if the user already exists
    const existingUser = await Flight1.findOne({ name });

    if (existingUser) {
      res.status(409).send("User already exists.");
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const newUser = new Flight1({
      name,
      email,
      password: hashedPassword,
    });

    // Save the new user to the database
    await newUser.save();

    res.redirect("/login");
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});
// Define the login route
app.post("/login", async (req, res) => {
  // Get the username and password from the request body
  const { username, password } = req.body;

  try {
    // Find the user in the database by username
    const user = await Flight1.findOne({ name: username });

    // If the user does not exist, return an error message
    if (!user) {
      res.status(401).send("Invalid username or password");
      return;
    }

    // Compare the provided password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If the passwords do not match, return an error message
    if (!isPasswordValid) {
      res.status(401).send("Invalid username or password");
      return;
    }

    // Authentication successful, redirect the user or send a success message
    res.redirect("/flight"); // Replace "/dashboard" with the appropriate URL
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// const flightSchema = new mongoose.Schema({
//   name: String,
//   password: String,
// });
// const flight1Schema = new mongoose.Schema({
//   name: String,
//   email: String,
//   password: String,
// });

// const Flight = mongoose.model("Flight", flightSchema);
// const Flight1 = mongoose.model("Flight1", flight1Schema);

app.get("/login", (req, res) => {
  fs.readFile("./index.html", function (err, data) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      res.end();
    }
  });
});

// app.post("/", (req, res) => {
//   fs.readFile("flightSearch.html", function (err, data) {
//     if (err) {
//       console.log(err);
//       res.sendStatus(500);
//     } else {
//       res.writeHead(200, { "Content-Type": "text/html" });
//       res.write(data);
//       res.end();
//     }
//   });
// });

app.get("/sign", (req, res) => {
  fs.readFile("signup.html", function (err, data) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      res.end();
    }
  });
});
app.get("/adminflight", (req, res) => {
  fs.readFile("remFlight.html", function (err, data) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      res.end();
    }
  });
});
app.post("/adminflight", async (req, res) => {
  try {
    console.log(req.body);
    const { name, number, timing } = req.body;

    // Create a new flight object
    const flight = new Flight({
      name,
      number,
      timing,
    });

    // Save the flight to the database
    await flight.save();

    res.status(201).json({ message: "Flight added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
app.get("/flight", (req, res) => {
  fs.readFile("flightSearch.html", function (err, data) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      res.end();
    }
  });
});
app.get("/booking", async (req, res) => {
  try {
    // Fetch flight search data from the database
    const flightSearchData = await FlightSearch.find();

    // Send flight search data as a JSON response
    res.render("bookings", { flightSearchData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Serve bookings.html file
app.get("/booking", (req, res) => {
  res.sendFile(path.join(__dirname, "bookings.html"));
});

// Assuming you have already set up the MongoDB connection and imported necessary modules

// Step 4: Handle the form submission in a server-side script (assuming Express.js)
// Handle flight search form submission
app.post("/search", async (req, res) => {
  const { arrival, departure, date, time } = req.body;

  try {
    const flights = await FlightSearch.find({ date, time });

    // Send flight search results as JSON response
    res.json(flights);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.get("/book", (req, res) => {
  fs.readFile("book.html", function (err, data) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      res.end();
    }
  });
});
app.get("/admin-login", (req, res) => {
  fs.readFile("adminLogin.html", function (err, data) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      res.end();
    }
  });
});
let seatCount = 60;
// Handle the booking request
app.post("/book", (req, res) => {
  const tickets = parseInt(req.body.tickets);

  if (isNaN(tickets) || tickets < 1) {
    res.send("Please enter a valid number of tickets.");
    return;
  }

  if (tickets > seatCount) {
    res.send("Insufficient seats available.");
    return;
  }

  seatCount -= tickets;
  res.send(`
    <script>
      alert('Tickets booked successfully! Remaining seats: ${seatCount}');
      window.location.href = '/booking'; // Replace '/nextpage' with the actual URL of the next page
    </script>
  `);
});
// app.post("/login", async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const user = await Flight.findOne({ name: username });

//     if (!user) {
//       res.sendStatus(401);
//       return;
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);

//     if (!isPasswordValid) {
//       res.sendStatus(401);
//       return;
//     }

//     res.cookie("username", username);
//     res.redirect("/");
//   } catch (error) {
//     console.error(error);
//     res.sendStatus(500);
//   }
// });

// app.post("/sign", async (req, res) => {
//   const { name, email, password } = req.body;

//   try {
//     const existingUser = await Flight.findOne({ name });

//     if (existingUser) {
//       res.sendStatus(409);
//       return;
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new Flight({
//       name,
//       password: hashedPassword,
//     });

//     await newUser.save();
//     res.redirect("/");
//   } catch (error) {
//     console.error(error);
//     res.sendStatus(500);
//   }
// });

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
