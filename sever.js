
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const nodemailer = require('nodemailer'); // ✅ Added for email

const app = express();
const PORT = 3000;
const DATA_FILE = './backend/data.json';

app.use(cors());
app.use(express.json());
app.use(express.static('public'));


// ✅ Save user data (unchanged)
app.post('/api/save', (req, res) => {
  const newData = req.body;

  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ message: 'Error reading file' });

    let json = [];
    if (data) {
      try {
        json = JSON.parse(data);
      } catch (parseErr) {
        return res.status(500).json({ message: 'Error parsing JSON' });
      }
    }

    json.push(newData);

    fs.writeFile(DATA_FILE, JSON.stringify(json, null, 2), err => {
      if (err) return res.status(500).json({ message: 'Error writing file' });

      res.json({ message: 'Data saved successfully' });
    });
  });
});

// ✅ Send reset password email
app.post('/api/send-reset-email', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const resetLink = `http://localhost:3000/reset-password.html?email=${encodeURIComponent(email)}`;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'teameventora@gmail.com',         // ✅ Replace with your email
      pass: 'khnn haci zhmn onii'            // ✅ Replace with your app password
    }
  });

  const mailOptions = {
    from: 'youremail@gmail.com',           // ✅ Same as above
    to: email,
    subject: 'Reset Your Password',
    html: `<p>Click the link below to reset your password:</p>
           <a href="${resetLink}">Reset Password</a>`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Email send error:', error);
      return res.status(500).json({ message: 'Failed to send email' });
    }
    res.json({ message: 'Reset email sent successfully' });
  });
});

// ✅ Reset password
app.post('/api/reset-password', (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) return res.status(400).json({ message: 'Email and new password are required' });

  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ message: 'Error reading file' });

    let users = [];
    try {
      users = JSON.parse(data);
    } catch (parseErr) {
      return res.status(500).json({ message: 'Error parsing user data' });
    }

    const user = users.find(u => u.email === email);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.password = newPassword;

    fs.writeFile(DATA_FILE, JSON.stringify(users, null, 2), err => {
      if (err) return res.status(500).json({ message: 'Failed to save new password' });

      res.json({ message: 'Password updated successfully' });
    });
  });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
