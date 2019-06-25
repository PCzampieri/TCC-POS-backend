const { check, validationResult } = require('express-validator')

const get = ({ db }) => async(req, res) => {   
    const categories = await db.select({
      id: 'categories.id' ,
      name: 'categories.name'      
    }).from('categories')
    if (categories.length === 0) {
      return res.send({ error: true })
    }
    res.send({ data: categories }) 
}

const getOne = ({ db }) => async(req, res) => {  
  let id = req.params.id
  const category = await db('categories').select().where('id', id)
  if (category.length === 0) {
    res.status(401)
    return res.send({ error: true })
  }
  res.send(category[0])
}

const remove = ({ db }) => async(req, res) => {
  const { user } = res.locals
  let id = req.params.id
  const category = await db('categories').select().where('id', id)
  if ((category.length === 0) || (user.role === 'user')) {
    res.status(401)
    return res.send({ error: true })
  } else {
    await db('categories').select().where('id', id).del()
    res.send({ success: true })
  } 
}

const create = ({ db })=> async(req, res) => {
  try{
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array() });
    }
    const { user } = res.locals
    const newCategory = req.body
    const categoryToInsert = {
      id: newCategory.id ,
      name: newCategory.name   
    }
    if (user.role === 'admin') {
      await db.insert(categoryToInsert).into('categories')
      res.send(categoryToInsert)
    } else {
      res.send({ error: true, msg: 'Somente administradores podem fazer nova categoria!' })
    }
  }catch(e){
    res.send({
        success: false,
        error: Object.keys(e.errors)
    })
  }
}

const update = ({ db })=> async(req, res) => {
  try{
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array() });
    }
    const { user } = res.locals
    const updateCategory = req.body
    let { id } = req.params

    const category = await db('categories').select().where('id', id)
    if ((category.length === 0) || (user.role === 'user')) {
      res.status(401)
      return res.send({ error: true, msg: 'Somente administradores podem alterar categoria!' })
    }

    const categoryToUpdate = {
      name: updateCategory.name,
    }
    if (user.role === 'admin') {
      await db('categories').where('id', id).update(categoryToUpdate)
      res.send(categoryToUpdate)
    } else {
      res.send({ error: true })
    }
  }catch(e){
    res.send({
        success: false,
        error: Object.keys(e.errors)
    })
  }
}

module.exports = {
  get,
  getOne,
  remove,
  create,
  update
}