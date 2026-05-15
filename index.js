require('dotenv').config();
const express = require('express');
const httpStatusText = require('./utils/httpStatusTexxt.js');
const app = express();
const mongoose = require('mongoose');


const url = process.env.URL_MONGO;
mongoose.connect(url).then(() => {
    console.log('Connected to MongoDB')
}).catch((err) => {
    console.log("error=============", err)
});

app.use(express.json());


const coursesRoutes = require('./routes/courses.route.js');
const usersRoutes = require('./routes/users.route.js');

app.use('/api/courses' ,coursesRoutes);
app.use('/api/users' ,usersRoutes);


app.use((error, req, res, next) => {
    res.status(404).json({
        status: error.httpStatusText || httpStatusText.FAILED,
        message: error.message || 'Not found',
        code: error.statusCode || 404,
        data: null
    });
});




const port = process.env.PORT;
app.listen(port, ()=> {
    console.log('Server is running on port ' + port);
});