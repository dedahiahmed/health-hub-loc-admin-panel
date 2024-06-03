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
// Your existing routes and middleware
app.get("/", (req, res) => {
  const navbarContent = fs.readFileSync(
    path.join(__dirname, "/components/navbar.ejs"),
    "utf8"
  );
  const sidebarContent = fs.readFileSync(
    path.join(__dirname, "/components/sidebar.ejs"),
    "utf8"
  );
  const cardContent = fs.readFileSync(
    path.join(__dirname, "/components/card.ejs"),
    "utf8"
  );
  res.render("index", {
    title: "Home",
    navbar: navbarContent,
    sidebar: sidebarContent,
    card: cardContent,
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
