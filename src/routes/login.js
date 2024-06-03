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
    const login = readComponent("login.ejs");

    res.render("index", { title: "Login", login });
  } catch (error) {
    console.error("Error reading components:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
