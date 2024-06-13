const express = require("express");
const path = require("path");
const ejs = require("ejs");
const app = express();

// Set EJS as the view engine
app.set("view engine", "ejs");

// Set the views directory
app.set("views", path.join(__dirname, "views"));

// Serve static files from the "public" directory
app.use("/public", express.static(path.join(__dirname, "public")));

const loginRoute = require("./routes/login");
const pharmacyRoute = require("./routes/pharmacy");
const cabinetRoute = require("./routes/cabinet"); // Require the cabinet routes

// Use the login route
app.use("/login", loginRoute);

// Use the pharmacy route
app.use("/pharmacy", pharmacyRoute);
// Use the pharmacy route
app.use("/cabinet", cabinetRoute); 

// Route for "/" to redirect to "/pharmacy"
app.get("/", (req, res) => {
  res.redirect("/pharmacy");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
