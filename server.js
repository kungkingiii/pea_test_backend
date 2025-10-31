const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const users = [];
const courses = [
  { id: 1, title: "JavaScript for Beginners", description: "เรียนรู้ JavaScript ตั้งแต่พื้นฐาน" },
  { id: 2, title: "React.js Masterclass", description: "สร้างเว็บแอปด้วย React.js" }
];



// const myData = new Pool({
//   user: "Hallykmr",
//   host: "localhost",
//   database: "myData",
//   password: "23082539",
//   port: 5432,
// });


const myData = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});


myData.connect()
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

//============================================================//

// app.post('/create-table', async (req, res) => {
//   try {
//     const { catagory } = req.body
//     console.log("this issss", catagory);
//     const query = `
//       CREATE TABLE IF NOT EXISTS ${catagory} (
//         id SERIAL PRIMARY KEY,
//         food VARCHAR(100) NOT NULL,
//         guantity REAL NOT NULL,
//         calories REAL NOT NULL,
//         protein REAL,
//         carb REAL,
//         fat REAL,
//         sugar REAL,
//         sodium REAL,
//         price REAL
//       );
//     `;
//     await myData.query(query);
//     res.status(200).json({ message: '✅ สร้างตารางสำเร็จแล้ว' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: '❌ มีข้อผิดพลาดในการสร้างตาราง' });
//   }
// });


// app.get("/catagory/:catagory", async (req, res) => {
//   try {
//     const catagory = req.params.catagory
//     const result = await myData.query(`SELECT * FROM ${catagory}`);
//     const title = await myData.query(`SELECT column_name FROM information_schema.columns WHERE table_name = $1`,
//       [catagory]);
//     console.log("this is titlwe", title)
//     res.json({
//       tableData: result.rows,
//       titles: title.rows
//     });
//   } catch (err) {

//     res.status(500).json({ message: "เกิดข้อผิดพลาด" });
//   }
// });


// app.get('/courses', async (req, res) => {
//   try {
//     const query = `
//     SELECT table_name
//     FROM information_schema.tables
//     WHERE table_schema = 'public'
//     ORDER BY table_name;
//     `;
//     const result = await myData.query(query);
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: '❌ ไม่สามารถดึงข้อมูลตารางได้' });
//   }
// });

// app.post('/adddata', async (req, res) => {
//   try {
//     const { catagory, addData } = req.body
//     let titles = Object.keys(addData);
//     let data = titles.map((title, id) => "$" + `${id + 1}`).join(", ");
//     const values = Object.values(addData);
//     const querry = `
//       INSERT INTO ${catagory} (${titles.join(", ")})
//       VALUES (${data})
//     `;
//     console.log("fhuie", data, querry, values)
//     await myData.query(querry, values)
//     res.status(200).json({ message: '✅ success to add data' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: '❌ somthing wrong' });
//   }
// });

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

// =======================

app.get("/courses/:id", async (req, res) => {
  const id = parseInt(req.params.id)
  try {
    const result = await myData.query(`SELECT * FROM courses WHERE id = ${id};`);
    res.json(result.rows[0]);
    // }
  } catch (err) {
    res.status(500).json({ message: "Course not found" });
  }

});


app.post("/courses/:id/register", async (req, res) => {
  const { courseId, username } = req.body;
  try {
    const addCourse = await myData.query(
      "UPDATE users SET registered_courses = array_append(registered_courses, $1) WHERE username = $2;", [courseId, username]);
    // console.log("checkUser", (await bcrypt.compare(password, checkUser.rows[0].password)));
    const userData = await myData.query("SELECT * FROM users WHERE username = $1", [username]);
    res.json(userData.rows[0]);
  } catch (err) {
    console.error("Error add course:", err);
    res.status(500).json({ message: "something wrong on server" });
  }
});


//=========================================================


app.post("/register", async (req, res) => {


  const { username, name, email, phone, password } = req.body;

  try {
    const checkUser = await myData.query("SELECT * FROM users WHERE email = $1", [username]);
    if (checkUser.rows.length > 0) {
      return res.status(400).json({ message: "username already exist" });
    }
    const checkEmail = await myData.query("SELECT * FROM users WHERE email = $1", [email]);

    if (checkEmail.rows.length > 0) {
      return res.status(400).json({ message: "email already exist" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await myData.query(
      "INSERT INTO users (username,name, email, phone ,password, registered_courses) VALUES ($1, $2, $3, $4,$5,$6) RETURNING *",
      [username, name, email, phone, hashedPassword, []]
    );

    res.status(201).json({ message: "register success", user: newUser.rows[0] });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ message: "something wrong on server" }, err);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  // const user = users.find(user => user.username === username);

  // if (!user || !(await bcrypt.compare(password, user.password))) {
  //   return res.status(401).json({ message: "Invalid credentials" });
  // }

  try {
    const checkUser = await myData.query("SELECT * FROM users WHERE username = $1", [username]);
    console.log("checkUser", (await bcrypt.compare(password, checkUser.rows[0].password)));
    if (checkUser.rows.length == 0 || !(await bcrypt.compare(password, checkUser.rows[0].password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    console.error(" Error login user:", err);
    res.status(500).json({ message: "something wrong on server" });
  }
});

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = decoded;
    next();
  });
};

app.get("/profile", authenticate, async (req, res) => {

  const username = req.user.username;
  let userCouse = []

  const userData = await myData.query("SELECT * FROM users WHERE username = $1", [username]);
  for (let courseId of userData.rows[0].registered_courses) {

    const couse = await myData.query("SELECT * FROM courses WHERE id = $1", [courseId]);
    userCouse.push(couse.rows[0])
  }

  res.json({ userData: userData.rows[0], userCouse });
});

app.get("/userdata", authenticate, async (req, res) => {

  const username = req.user.username;


  const userData = await myData.query("SELECT * FROM users WHERE username = $1", [username]);


  res.json(userData.rows[0]);
});

//===============================================================
myData.connect()
  .then(() => console.log("connect PostgreSQL"))
  .catch(err => console.error("connect PostgreSQL fail", err));

app.get("/courses", async (req, res) => {
  try {
    const { search } = req.query;
    let query = "SELECT * FROM courses";
    let values = [];

    if (search) {
      query += " WHERE title ILIKE $1";
      values.push(`%${search}%`);
    }

    const result = await myData.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "something wrong on server" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));


