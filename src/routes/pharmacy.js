const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

// Helper function to read component files
const readComponent = (filePath) => {
  return fs.readFileSync(
    path.join(__dirname, "..", "components", filePath),
    "utf8"
  );
};

router.get("/pharmacy", (req, res) => {
  try {
    // Read components
    const navbar = readComponent("Navbar.ejs");
    const sidebar = readComponent("Sidebar.ejs");

    res.render("pharmacy", { title: "Pharmacy", navbar, sidebar });
  } catch (error) {
    console.error("Error reading components:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;