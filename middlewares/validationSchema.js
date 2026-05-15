const {body} = require('express-validator');

const validationSchema = () => {
    return [
        body("name")
            .notEmpty()
            .isLength({min: 5})
            .withMessage('Name must be at least 5 characters long')
        ,body("price")
            .isNumeric()
            .withMessage('Price must be a positive number')
    ];
}

module.exports ={
    validationSchema
}