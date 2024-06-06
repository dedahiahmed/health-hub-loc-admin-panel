const express = require("express");
const path = require("path");
const fs = require("fs");
const ejs = require("ejs"); // Import EJS module
const app = express();

// Set EJS as the view engine
app.set("view engine", "ejs");

// Set the views directory
app.set("views", path.join(__dirname, "views"));

// Serve static files from the "public" directory
app.use("/public", express.static(path.join(__dirname, "public")));

const loginRoute = require("./routes/login");
// Use the login route
app.use("/login", loginRoute);

// Route for "/" to redirect to "/pharmacy"
app.get("/", (req, res) => {
  res.redirect("/pharmacy");
});

// Route for "/pharmacy"
app.get("/pharmacy", (req, res) => {
  const navbarContent = fs.readFileSync(
    path.join(__dirname, "/components/navbar.ejs"),
    "utf8"
  );
  const sidebarContent = fs.readFileSync(
    path.join(__dirname, "/components/sidebar.ejs"),
    "utf8"
  );

  res.render("pharmacy", {
    title: "Pharmacy",
    navbar: navbarContent,
    sidebar: sidebarContent,
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
