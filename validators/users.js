const { check, validationResult } = require('express-validator')

module.exports = {    
    userCheck: [        
        check('name').isLength({ min: 3 }).withMessage('Nome tem que ter no mínimo 3 caracteres!'),  
        check('email').isEmail().withMessage('email inválido!'),        
        check('passwd').isLength({ min: 3 }).withMessage('Senha tem que ter no mínimo 3 caracteres!'),    
    ]    
}