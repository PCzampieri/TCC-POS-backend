const { check, validationResult } = require('express-validator')
const bcrypt = require('bcrypt')
const salt_rounds = 10

const login = ({ db, jwt, jwtSecret}) => async(req, res) => {  
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.array() });
  }

  const users = await db('users').select().where('email', req.body.email)
  if (users.length === 1) {
    if ( bcrypt.compareSync(req.body.passwd, users[0].passwd)) {
      const { id, name, email, role } = users[0]
      const user = {
        id, name, email, role 
      }
      const token = jwt.sign(user, jwtSecret)
      res.send({ token })
    } else {
        res.status(422).json({ error: [{ msg: 'Verfique email e senha!' }] })
      }
  } else {
      res.status(422).json({ error: [{ msg: 'Verfique email e senha!' }] })
    }  
}

const get = ({ db }) => async(req, res) => {
  const { user } = res.locals
  if (user.role === 'admin' ) {
    const users = await db('users').select()
    res.send(users)
  } else {
    const users = await db('users').select().where('email', user.email)
    res.send(users)
  }
}

const getMe = ({ db }) => async(req, res) => {
  const userDB = await db('users').select().where('id', res.locals.user.id)
  res.send(userDB[0])
}

const getOne = ({ db }) => async(req, res) => {
  const { user } = res.locals
  let id = req.params.id
  if (user.role === 'user' && id != user.id) {
    res.status(401)
    res.send({ error: true })
  } else {
    const userDB = await db('users').select().where('id', id)
    res.send(userDB[0])
  }
}

const remove = ({ db }) => async(req, res) => {
  const { user } = res.locals
  const { id } = req.params
  if ((user.role ==='user') || (user.role === 'admin' && id === user.id)) {
    res.status(401)
    res.send({ error: true })
  } else {
    await db('users').select().where('id', id).del()
    res.send({ success: true })
  }
}

const create = ({ db }) => async(req, res) => {
  try{
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array() });
    }

    const { user } = res.locals
    const newUser = req.body
    const userToInsert = {
      name: newUser.name,
      email: newUser.email,
      passwd: bcrypt.hashSync(newUser.passwd, salt_rounds)
    }
    //criando a nova conta sem o token
    if (!user) {
      userToInsert.role = 'user'
    } else if (user.role === 'user') {
      return res.send({ error: true, msg: 'Somente administradores podem fazer nova conta!' })
    } else {
      userToInsert.role = newUser.role
    }

    const emailAlreadyExists = await db('users').select(db.raw('count(*) as total')).where('email', newUser.email)
    if (emailAlreadyExists[0].total > 0) {
      return res.status(422).json({ error: [{'msg': 'E-mail já Cadastrado!'}] })
    }

    await db.insert(userToInsert).into('users')
    res.send(userToInsert)
  }catch(e){
      res.send({
          success: false,
          error: Object.keys(e.errors)
      })
  }
}

const update = ({db }) => async(req, res) => {
  try{
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array() });
    }
    const { user } = res.locals
    const updatedUser = req.body
    let { id } = req.params
    const userToUpdate= {}  
    if (updatedUser.passwd) {
      userToUpdate.passwd = bcrypt.hashSync(updatedUser.passwd, salt_rounds)
    }
    const fields = ['name', 'email', 'role']
    fields.forEach(field => {
      if (updatedUser[field]) {
        userToUpdate[field] = updatedUser[field]
      }    
    })
    if (user.role === 'user') {
      userToUpdate['role'] = 'user'
    }
    if (user.role === 'user' && user.id != id) {
      return res.send({error: true, msg: 'Somente administradores podem alterar!' })
    }

    await db('users')
      .where('id', id)
      .update(userToUpdate)

    res.send(userToUpdate)   
  }catch(e){
    res.send({
        success: false,
        error: Object.keys(e.errors)
    })
  }
}

module.exports = {
  login,
  get,
  getMe,
  getOne,
  update,
  create,
  remove
}

