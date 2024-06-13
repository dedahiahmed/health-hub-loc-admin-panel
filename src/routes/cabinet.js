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

router.get("/", (req, res) => {
  try {
    // Read components
    const navbar = readComponent("Navbar.ejs");
    const sidebar = readComponent("Sidebar.ejs");

    res.render("cabinet", { title: "Cabinet", navbar, sidebar });
  } catch (error) {
    console.error("Error reading components:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/new-cabinet", (req, res) => {
  res.render("new-cabinet", { title: "New Cabinet" });
});

router.get("/update-cabinet", (req, res) => {
  res.render("update-cabinet", { title: "Update Cabinet" });
});

module.exports = router;
