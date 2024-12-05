const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Proxy route to interact with Flask
app.post("/api/forecast", async (req, res) => {
  try {
    const { year, reservoir } = req.body;

    if (!year || !reservoir) {
      return res.status(400).json({ error: "Year and Reservoir Name are required" });
    }

    // Forward the request to Flask server
    const flaskResponse = await axios.post("http://localhost:5000/forecast", { year, reservoir });

    // Send the response back to the React frontend
    res.json(flaskResponse.data);
  } catch (error) {
    if (error.response) {
      // Error from Flask server
      res.status(error.response.status).json(error.response.data);
    } else {
      // Other errors
      console.error("Server Error:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

// Start Express server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});
