const { check, validationResult } = require('express-validator')

module.exports = {    
    categoryCheck: [
        check('name').isLength({ min: 3}).withMessage('Categoria tem que ser maior ou igual a 3 caracteres!'),
    ]    
}