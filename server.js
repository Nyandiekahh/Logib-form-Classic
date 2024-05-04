const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

// In-memory data store for users (replace with a database in production)
const users = [
  { id: 1, username: 'admin', password: 'password' }
];

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Find the user in the data store
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    // Authentication successful
    req.session.user = user;
    res.status(200).send('Login successful');
  } else {
    // Authentication failed
    res.status(401).send('Invalid username or password');
  }
});

// Signup route
app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // You should hash the password before saving it to the database
    // For simplicity, I'm using plain text here. You should use bcrypt or similar
    const newUser = { username, email, password };

    // Save user data to database (replace this with your database logic)
    users.push(newUser);

    return res.status(201).json({ message: 'User signed up successfully' });
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      res.status(500).send('An error occurred');
    } else {
      res.status(200).send('Logout successful');
    }
  });
});

// Protected route (replace with your actual protected routes)
app.get('/member-area', (req, res) => {
  // Check if the user is authenticated
  if (req.session.user) {
    res.send(`Welcome to the member area, ${req.session.user.username}!`);
  } else {
    res.status(401).send('Unauthorized');
  }
});

// Serve static files (if needed)
// app.use(express.static('path/to/static/files'));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
