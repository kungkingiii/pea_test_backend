const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const users = [];
const courses = [
  { id: 1, title: "JavaScript for Beginners", description: "เรียนรู้ JavaScript ตั้งแต่พื้นฐาน" },
  { id: 2, title: "React.js Masterclass", description: "สร้างเว็บแอปด้วย React.js" }
];



// const nutrition = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "nutrition",
//   password: "23082539",
//   port: 5432,
// });


const nutrition = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});


nutrition.connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch(err => console.error("❌ Failed to connect to DB:", err));

//=========================================================


// const authenticate = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ message: "Unauthorized" });

//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) return res.status(403).json({ message: "Invalid token" });
//     req.user = decoded;
//     next();
//   });
// };

//============================================================

app.post('/create-table', async (req, res) => {
  try {
    const { catagory } = req.body
    console.log("this issss", catagory);
    const query = `
      CREATE TABLE IF NOT EXISTS ${catagory} (
        id SERIAL PRIMARY KEY,
        food VARCHAR(100) NOT NULL,
        guantity REAL NOT NULL,
        calories REAL NOT NULL,
        protein REAL,
        carb REAL,
        fat REAL,
        sugar REAL,
        sodium REAL,
        price REAL
      );
    `;
    await nutrition.query(query);
    res.status(200).json({ message: '✅ สร้างตารางสำเร็จแล้ว' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '❌ มีข้อผิดพลาดในการสร้างตาราง' });
  }
});


app.get("/catagory/:catagory", async (req, res) => {
  try {
    const catagory = req.params.catagory
    const result = await nutrition.query(`SELECT * FROM ${catagory}`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "เกิดข้อผิดพลาด" });
  }
});


app.get('/courses', async (req, res) => {
  try {
    const query = `
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name;
    `;
    const result = await nutrition.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '❌ ไม่สามารถดึงข้อมูลตารางได้' });
  }
});

// app.get("/userdata", authenticate, async (req, res) => {

//   const username = req.user.username;


//   const userData = await pool.query("SELECT * FROM users WHERE username = $1", [username]);


//   res.json(userData.rows[0]);
// });

//===============================================================

// pool.connect()
//   .then(() => console.log("connect PostgreSQL"))
//   .catch(err => console.error("connect PostgreSQL fail", err));

// app.get("/courses", async (req, res) => {
//   try {
//     const { search } = req.query;
//     let query = "SELECT * FROM courses";
//     let values = [];

//     if (search) {
//       query += " WHERE title ILIKE $1";
//       values.push(`%${search}%`);
//     }

//     const result = await pool.query(query, values);
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "something wrong on server" });
//   }
// });


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));


