const { check, validationResult } = require('express-validator')
const { isDate } = require('./customValidators')

module.exports = {    
    postsCheck: [
        check('title').isLength({ min: 3}).withMessage('Título tem que ser maior ou igual a 3 caracteres!'),
        check('post').isLength({ min: 1}).withMessage('Post não pode ser vazio!'),

        
        /*check('date').custom(value => {
            const isValid = isDate(value, 'YYYY-MM-DD')
            if(isValid !== true){
              return false
            } else {
                    return false
               }
        }).withMessage('Data inválida!')*/
    ]    
}