require('dotenv').config();
const express = require('express');
const httpStatusText = require('./utils/httpStatusTexxt.js');
const app = express();
const mongoose = require('mongoose');



const url = process.env.URL_MONGO;
mongoose.connect(url).then(() => {
    console.log('Connected to MongoDB 🟢');
}).catch((err) => {
    console.log("error=============", err)
});

app.use(express.json());


const coursesRoutes = require('./routes/courses.route.js');
const usersRoutes = require('./routes/users.route.js');
const swaggerDocs = require('./utils/swagger.js');

app.use('/api/courses' ,coursesRoutes);
app.use('/api/users' ,usersRoutes);
app.use('/api/docs', swaggerDocs);

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
    console.log('Server is running on port 🟠 ' + port);
});