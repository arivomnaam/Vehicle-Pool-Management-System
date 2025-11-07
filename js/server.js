const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const cors = require("cors");// Allow requests from any origin


const app = express();
const port = 8081;

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

//const port = 8082;

// PostgreSQL connection
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "vps",
  password: "Smart.rd.739",
  port: 5432, // Default PostgreSQL port
});
/*const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});*/



// Test Database Connection
pool.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to PostgreSQL database!");
  }
});

// Authentication Routes

// User Signup
app.post("/api/auth/signup", async (req, res) => {
  const { username, email, password,mob_no1,mob_no2, emp_no, emp_name, division } = req.body;

  if (!username || !email || !password || !mob_no1 || !emp_no || !emp_name || !division) {
      return res.status(400).json({ success: false, message: "All fields are required." });
  }

  try {
      const result = await pool.query(
          "INSERT INTO Users (username, email, password, mob_no1, mob_no2, emp_id, emp_name, division) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
          [username, email, password,mob_no1,mob_no2, emp_no, emp_name, division]
      );

      res.json({ success: true, message: "Signup successful!", user: result.rows[0] });
  } catch (error) {
      console.error("Signup Error:", error);
      res.status(500).json({ success: false, message: "Signup failed. Try again." });
  }
});

// User Login
app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;

  try {
      const result = await pool.query("SELECT * FROM Users WHERE username = $1 AND password = $2", [username, password]);

      if (result.rows.length > 0) {
          res.json({ success: true, message: "Login successful!" });
      } else {
          res.json({ success: false, message: "Invalid username or password." });
      }
  } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ success: false, message: "Login failed. Try again." });
  }
});

// Admin Login
app.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body;

  try {
      const result = await pool.query("SELECT * FROM admins WHERE email = $1 AND password = $2", [email, password]);

      if (result.rows.length > 0) {
          res.json({ success: true, message: "Admin login successful!" });
      } else {
          res.json({ success: false, message: "Invalid admin credentials." });
      }
  } catch (error) {
      console.error("Admin Login Error:", error);
      res.status(500).json({ success: false, message: "Admin login failed. Try again." });
  }
});

// API Endpoints

// Get all available vehicles
/*app.get("/api/vehicles", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM vehicles WHERE status = 'available'");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});*/
//Insert New Vehicle
app.post("/api/vehicle", async (req, res) => {
  try {
      console.log("🔹 Debugging Request Body:", req.body);  // Log incoming data

      const { vehicleNo, brand, model, inDate, ownerName, ownerMob1, ownerMob2 } = req.body;

      // Check for missing fields
      if (!vehicleNo || !brand || !model || !inDate || !ownerName || !ownerMob1) {
          console.error("❌ Missing Required Fields:", req.body);
          return res.status(400).json({ success: false, message: "All fields are required." });
      }

      const result = await pool.query(
          "INSERT INTO vehicle (vehicle_license_no, brand, model, indate, owner_name, owner_mobile_no, owner_mobile_no2) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
          [vehicleNo, brand, model, inDate, ownerName, ownerMob1, ownerMob2]
      );

      res.json({ success: true, message: "Vehicle added successfully!", vehicle: result.rows[0] });
  } catch (error) {
      console.error("❌ Error adding vehicle:", error);
      res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
});

// Add a New Driver
app.post("/api/drivers", async (req, res) => {
  const { name, mobile_no, mobile_no2, in_date, vehicle_id } = req.body;

  if (!name || !mobile_no || !in_date || !vehicle_id) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  try {
    // Insert into drivers table
    const driverResult = await pool.query(
      "INSERT INTO drivers (driver_name, driver_mobile_no1, driver_mobile_no2, indate) VALUES ($1, $2, $3, $4) RETURNING driver_id",
      [name, mobile_no, mobile_no2, in_date]
    );

    const driver_id = driverResult.rows[0].driver_id;

    // Update vehicle table to assign driver
    await pool.query("UPDATE vehicle SET driver_id = $1 WHERE vehicle_id = $2", [driver_id, vehicle_id]);

    // Insert into vehicles table and mark as available
    await pool.query(
      "INSERT INTO vehicles (vehicle_id, vehicle_license_no, vehicle_brand, driver_id, status) VALUES ($1, (SELECT vehicle_license_no FROM vehicle WHERE vehicle_id = $1), (SELECT brand FROM vehicle WHERE vehicle_id = $1), $2, 'available')",
      [vehicle_id, driver_id]
    );

    res.json({ success: true, message: "Driver added and assigned to vehicle successfully!" });
  } catch (error) {
    console.error("❌ Error adding driver:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

/*app.post("/api/drivers", async (req, res) => {
  const { name, mobile_no, mobile_no2, in_date, vehicle_id } = req.body;

  if (!name || !mobile_no || !in_date) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  try {
    // ✅ Validate if vehicle exists before inserting the driver
    const checkVehicle = await pool.query("SELECT * FROM vehicles WHERE vehicle_id = $1", [vehicle_id]);

    if (checkVehicle.rowCount === 0) {
      return res.status(400).json({ success: false, message: "Invalid vehicle ID." });
    }

    const result = await pool.query(
      "INSERT INTO drivers (driver_name, driver_mobile_no1, driver_mobile_no2, indate, vehicle_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, mobile_no, mobile_no2, in_date, vehicle_id]
    );

    res.json({ success: true, message: "Driver added successfully!", driver: result.rows[0] });
  } catch (error) {
    console.error("❌ Error adding driver:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});*/
//Fetch vehicle
app.get("/api/available-vehicles", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT vehicle_id, vehicle_license_no, brand FROM vehicle WHERE driver_id IS NULL"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching available vehicles:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});



//Fetch available vehicle
app.get("/api/vehicles", async (req, res) => {
  try {
      const result = await pool.query(
          "SELECT vehicle_id, vehicle_license_no, vehicle_brand, driver_id FROM vehicles WHERE status = 'available'"
      );
      res.json(result.rows);
  } catch (error) {
      console.error("❌ Error fetching vehicles:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
app.get("/api/drivers/:vehicle_id", async (req, res) => {
  const { vehicle_id } = req.params;
  try {
    const result = await pool.query(
      "SELECT driver_name AS name, driver_mobile_no1 AS mobile_no, driver_mobile_no2 AS mobile_no2 FROM drivers WHERE driver_id = (SELECT driver_id FROM vehicles WHERE vehicle_id = $1)",
      [vehicle_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Driver not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error fetching driver details:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});



// Book a vehicle
app.post("/api/books", async (req, res) => {
  try {
    const { vehicle_id, username, user_mobile_no, dateandtime, arriving, destination } = req.body;

    // Check if vehicle is available
    const checkVehicle = await pool.query(
      "SELECT vehicle_id, vehicle_license_no, driver_id FROM vehicles WHERE vehicle_id = $1 AND status = 'available'",
      [vehicle_id]
    );

    if (checkVehicle.rowCount === 0) {
      return res.status(400).json({ error: "Vehicle is not available for booking" });
    }

    const vehicleDetails = checkVehicle.rows[0];

    // Insert booking details
    await pool.query(
      "INSERT INTO books (vehicle_id, vehicle_license_no, username, user_mobile_no, dateandtime, driver_id, arriving, destination, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'booked')",
      [
        vehicle_id,
        vehicleDetails.vehicle_license_no,
        username,
        user_mobile_no,
        dateandtime,
        vehicleDetails.driver_id,
        arriving,
        destination,
      ]
    );

    // Update vehicle status to "booked"
    await pool.query("UPDATE vehicles SET status = 'booked' WHERE vehicle_id = $1", [vehicle_id]);

    res.json({ success: true, message: "Vehicle booked successfully!" });
  } catch (err) {
    console.error("❌ Error booking vehicle:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

//View the Booked vehicles
/*app.get("/api/bookedVehicles", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        b.vehicle_license_no, 
        d.driver_name, 
        b.dateandtime, 
        b.user_mobile_no
      FROM books b
      JOIN drivers d ON b.driver_id = d.driver_id
      WHERE b.status = 'booked'
      ORDER BY b.dateandtime DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching booked vehicles:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});*/
app.get("/api/bookedVehicles", async (req, res) => {
  try {
      const result = await pool.query(`
          SELECT b.vehicle_id, v.vehicle_license_no, d.driver_name AS driver_name, 
                 b.dateandtime, b.user_mobile_no
          FROM books b
          JOIN vehicles v ON b.vehicle_id = v.vehicle_id
          JOIN drivers d ON b.driver_id = d.driver_id
          WHERE b.status = 'booked'
      `);

      console.log("🚗 Sending booked vehicles:", result.rows); // Debug log
      res.json(result.rows);
  } catch (error) {
      console.error("❌ Error fetching booked vehicles:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});



// Cancel Booking
/*app.put("/api/cancel/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await pool.query("SELECT * FROM books WHERE id = $1", [id]);
    if (booking.rowCount === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }
    const vehicle_id = booking.rows[0].vehicle_id;
    await pool.query("UPDATE books SET status = 'cancel' WHERE id = $1", [id]);
    await pool.query("UPDATE vehicles SET status = 'available' WHERE vehicle_id = $1", [vehicle_id]);
    res.json({ message: "Booking canceled successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});*/
app.put("/api/cancel/:vehicle_id", async (req, res) => {
  try {
    const { vehicle_id } = req.params; // Extract vehicle_id correctly
    const { action, closeDateTime } = req.body;

    console.log("🔹 Received vehicle_id:", vehicle_id);
    console.log("🔹 Action:", action);
    console.log("🔹 Close DateTime:", closeDateTime);

    if (!vehicle_id || isNaN(vehicle_id)) {
      return res.status(400).json({ error: "Invalid vehicle_id" });
    }

    const booking = await pool.query("SELECT * FROM books WHERE vehicle_id = $1 AND status = 'booked'", [vehicle_id]);
    if (booking.rowCount === 0) {
      return res.status(404).json({ error: "Booking not found or already processed" });
    }

    let newStatus = action.toLowerCase() === "closed" ? "closed" : "cancel";

    await pool.query(
      "UPDATE books SET status = $1, dateandtime = COALESCE($2, dateandtime) WHERE vehicle_id = $3",
      [newStatus, newStatus === "closed" ? closeDateTime : null, vehicle_id]
    );

    await pool.query("UPDATE vehicles SET status = 'available' WHERE vehicle_id = $1", [vehicle_id]);

    res.json({ message: `Booking ${newStatus} successfully!` });
  } catch (err) {
    console.error("❌ Error updating booking status:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});



// Get Booking History
/*app.get("/api/history", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM history ORDER BY timestamp DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});*/
app.get("/api/history", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                b.vehicle_id, 
                v.vehicle_license_no, 
                COALESCE(d.driver_name, 'Unknown') AS driver_name, 
                b.dateandtime, 
                b.username, 
                b.user_mobile_no, 
                b.status 
            FROM books b
            LEFT JOIN vehicles v ON b.vehicle_id = v.vehicle_id
            LEFT JOIN drivers d ON b.driver_id = d.driver_id
            ORDER BY b.dateandtime DESC
        `);

        console.log("📜 Sending booking history:", result.rows); // Debugging log
        res.json(result.rows);
    } catch (error) {
        console.error("❌ Error fetching history:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
