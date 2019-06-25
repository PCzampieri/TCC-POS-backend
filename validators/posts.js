const { check, validationResult } = require('express-validator')

module.exports = {    
    postsCheck: [
        check('title').isLength({ min: 3}).withMessage('Título tem que ser maior ou igual a 3 caracteres!'),
        check('post').isLength({ min: 1}).withMessage('Post não pode ser vazio!'),
    ]    
}