require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./connectDB');
const productRoutes = require('./routes/productRoutes');

const app = express();

// Middleware Setup
app.use(express.json());
app.use(cors());

// Database Connection
connectDB();

// Routes
app.use('/api/products', productRoutes);

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
