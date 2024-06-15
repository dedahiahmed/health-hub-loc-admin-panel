const express = require("express");
const path = require("path");
const ejs = require("ejs");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
const dotenv = require("dotenv");
const app = express();

dotenv.config();

const encryptionKey = process.env.ENCRYPTION_KEY;
const algorithm = process.env.ENCRYPTION_ALGORITHM;
function encryptToken(token) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, encryptionKey, iv);
  let encryptedToken = cipher.update(token, "utf8", "hex");
  encryptedToken += cipher.final("hex");
  return `${iv.toString("hex")}:${encryptedToken}`;
}

// Function to decrypt the token
function decryptToken(encryptedToken) {
  const [ivHex, tokenHex] = encryptedToken.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(algorithm, encryptionKey, iv);
  let decryptedToken = decipher.update(tokenHex, "hex", "utf8");
  decryptedToken += decipher.final("utf8");
  return decryptedToken;
}
// Set EJS as the view engine
app.set("view engine", "ejs");
// Set the views directory
app.set("views", path.join(__dirname, "views"));
// Serve static files from the "public" directory
app.use("/public", express.static(path.join(__dirname, "public")));

// Middleware to parse request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to parse cookies
app.use(cookieParser());

const loginRoute = require("./routes/login");
const pharmacyRoute = require("./routes/pharmacy");
const doctorRoute = require("./routes/doctor");
const cabinetRoute = require("./routes/cabinet");

// Use the login route
app.use("/login", loginRoute);

// POST route for handling login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const payload = {
    username: username,
    password: password,
  };

  try {
    const response = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const data = await response.json();
      const token = data.token;
      const encryptedToken = encryptToken(token);

      res.cookie("token", encryptedToken, { httpOnly: true });
      res.json({ success: true });
    } else {
      const errorData = await response.json();
      res.status(response.status).json(errorData);
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
const checkToken = async (req, res, next) => {
  const encryptedToken = req.cookies.token;

  if (!encryptedToken) {
    // If token is not found, redirect to login page
    return res.redirect("/login");
  }

  try {
    const token = decryptToken(encryptedToken);
    const response = await fetch("http://localhost:8080/api/auth/user-me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      req.user = data;
      next();
    } else {
      res.clearCookie("token");
      res.redirect("/login");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// Route for "/" to redirect to "/pharmacy"
app.use("/pharmacy", checkToken, pharmacyRoute);
app.use("/doctor", checkToken, doctorRoute);
app.use("/cabinet", checkToken, cabinetRoute);

// Route for "/" to redirect to "/pharmacy"
app.get("/", checkToken, (req, res) => {
  res.redirect("/pharmacy");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
