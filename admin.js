// admin.js
const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'shreya@2005', // use your password if any
  database: 'eventsDB'
});

db.connect(err => {
  if (err) {
    console.error('MySQL connection failed:', err);
    return;
  }
  console.log('Connected to MySQL Database!');
});

// Create table if it doesn't exist
db.query(`
  CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    eventName VARCHAR(255),
    category VARCHAR(100),
    club VARCHAR(100),
    venue VARCHAR(255),
    time DATETIME,
    regLink TEXT,
    description TEXT
  )
`);

// Get all events
app.get('/api/events', (req, res) => {
  db.query('SELECT * FROM events ORDER BY time ASC', (err, results) => {
    if (err) {
      console.error('Error fetching events:', err);
      return res.status(500).send('Server error');
    }
    res.json(results);
  });
});

// Add new event
app.post('/api/events', (req, res) => {
  const { eventName, category, club, venue, time, regLink, description } = req.body;
  const sql = 'INSERT INTO events (eventName, category, club, venue, time, regLink, description) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [eventName, category, club, venue, time, regLink, description], (err, result) => {
    if (err) {
      console.error('Error inserting event:', err);
      return res.status(500).send('Database error');
    }
    res.status(201).send({ message: 'Event added', id: result.insertId });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
