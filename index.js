const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const env =require('dotenv');

env.config();
const app = express();
const url = process.env.URL_MONGO;
const httpStatusText = require('./utils/httpStatusTexxt.js');

const swaggerDocs = require('./utils/swagger.js');
const usersRoutes = require('./routes/users.route.js');
const projectsRoutes = require('./routes/projects.route.js');
const blueprintsRoutes = require('./routes/blueprints.route.js');

app.use(express.json());
app.use(cors());

mongoose.connect(url).then(() => {
    console.log('Connected to MongoDB 🟢');
}).catch((err) => {
    console.log("error============= 🔴 ", err)
});


// Routes
app.use('/', swaggerDocs);
app.use('/api/users' ,usersRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/blueprints', blueprintsRoutes);
app.use("/uploads", express.static(path.join(__dirname, 'uploads')));

app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500; 
    res.status(statusCode).json({
        status: error.httpStatusText || httpStatusText.FAILED,
        message: error.message || 'Internal Server Error',
        code: statusCode,
        data: null
    });
});




const port = process.env.PORT;
app.listen(port, ()=> {
    console.log('Server is running on port ' + port +' 🟠');
});