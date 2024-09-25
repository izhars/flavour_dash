const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const connectDB = require('./config/db'); // Import the MongoDB connection function
const authenticateToken = require('./middleware/auth'); // Import the authentication middleware
const productRoutes = require('./routes/productRoutes'); // Import product routes
const authRoutes = require('./routes/authRoutes'); // Import authentication routes

// Initialize Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory where files will be stored
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`); // Append timestamp to filename
  },
});

const upload = multer({ storage });

// Create uploads directory if it does not exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Connect to MongoDB
connectDB(); // Call the function to establish the connection

// Test route
app.get('/api/test', (req, res) => {
  res.send('API is working!');
});

// File upload route with authentication
app.post('/api/upload', authenticateToken, upload.array('images', 10), (req, res) => {
  const filePaths = req.files.map(file => file.path); // Get file paths
  res.json({ filePaths });
});

// Use routes
app.use('/api/products', authenticateToken, productRoutes);
app.use('/api/auth', authRoutes); // Authentication routes

// Define a port
const PORT = process.env.PORT || 5001; // This will use the port defined in the environment or default to 5001

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
