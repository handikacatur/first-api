const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js')

// load env vars
dotenv.config({path: './config/config.env'});

// connect to database
connectDB();

// route files
const bootcamps = require('./routes/bootcamps.js');

const app = express();

// mount routers
app.use('/api/v1/bootcamps', bootcamps);

const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT, 
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // close server & exit process
    server.close(() => process.exit(1));
});