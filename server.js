const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const fileupload = require('express-fileupload');
const errorHandler = require('./middleware/error.js');
const connectDB = require('./config/db.js');

// load env vars
dotenv.config({path: './config/config.env'});

// connect to database
connectDB();

// route files
const bootcamps = require('./routes/bootcamps.js');
const courses = require('./routes/courses.js');

const app = express();

// using Body parser
app.use(express.json());

// File Uploading
app.use(fileupload());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);

app.use(errorHandler);

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