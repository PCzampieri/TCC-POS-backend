const get = ({ db }) => async(req, res) => {  
    const posts = await db.select({
      id: 'posts.id' ,
      title: 'posts.title',
      post: 'posts.post',
      date: 'posts.date',
      image_url: 'posts.image_url',
      name: 'users.name',
      email: 'users.email',
      category_id: 'posts.category_id'
    }).from('posts').leftJoin('users', 'users.id', 'posts.user_id')
    if (posts.length === 0) {
      return res.send({ error: true })
    }
    res.send({ data: posts }) 
}

const getOne = ({ db }) => async(req, res) => {  
  let id = req.params.id
  const post = await db('posts').select().where('id', id)
  if (post.length === 0) {
    res.status(401)
    return res.send({ error: true })
  }
  res.send(post[0])
}

const getByCategories = ({ db }) => async(req, res) => {  
  const posts = await db.select({
    id: 'posts.id' ,
    title: 'posts.title',
    post: 'posts.post',
    date: 'posts.date',
    image_url: 'posts.image_url',
    name: 'users.name',
    email: 'users.email',
    category_id: 'posts.category_id',
    category: 'categories.name' })
                  .from('posts').leftJoin('users', 'users.id', 'posts.user_id')
                  .leftJoin('categories', 'categories.id', 'posts.category_id')
                  .where('category_id', function(){
                    this
                        .select('categories.id')
                        .from('categories')
                        .whereRaw('categories.id = posts.category_id')
                        .where('category_id', req.params.id)
                  })
  if (posts.length === 0) {
    return res.send({ error: true })
  }
  res.send({ data: posts }) 
}

const remove = ({ db }) => async(req, res) => {
  const { user } = res.locals
  let id = req.params.id
  const post = await db('posts').select().where('id', id)
  if ((post.length === 0) || (user.role === 'user' && post[0].user_id != user.id)) {
    res.status(401)
    return res.send({ error: true })
  } else {
    await db('posts').select().where('id', id).del()
    res.send({ success: true })
  } 
}

const create = ({ db })=> async(req, res) => {
  const { user } = res.locals
  const newPost = req.body
  const postToInsert = {
    title: newPost.title,
    post: newPost.post,
    date: newPost.date,
    image_url: newPost.image_url,
    user_id: newPost.user_id,
    category_id: newPost.category_id
  }
  if (user.role === 'admin') {
    await db.insert(postToInsert).into('posts')
    res.send(postToInsert)
  } else {
    res.send({ error: true, message: 'only admins create new posts.' })
  }
}

const update = ({ db })=> async(req, res) => {
  const { user } = res.locals
  const updatePost = req.body
  let { id } = req.params

  const post = await db('posts').select().where('id', id)
  if ((post.length === 0) || (user.role === 'user' && post[0].user_id != user.id)) {
    res.status(401)
    return res.send({ error: true })
  }

  const postToUpdate = {
    title: updatePost.title,
    post: updatePost.post,
    date: updatePost.date,
    image_url: updatePost.image_url,
    user_id: updatePost.user_id,
    category_id: updatePost.category_id
  }
  if (user.role === 'admin') {
    await db('posts').where('id', id).update(postToUpdate)
    res.send(postToUpdate)
  } else {
    res.send({ error: true, message: 'only admins create new posts.' })
  }
}

module.exports = {
  get,
  getOne,
  getByCategories,
  remove,
  create,
  update
}


