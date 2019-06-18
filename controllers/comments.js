const getByPost = ({ db }) => async(req, res) => {  
  const comments = await db.select({
    id: 'comments.id' ,
    comment: 'comments.comment',
    date: 'comments.date',
    post_id: 'comments.post_id',
    user_id: 'comments.user_id',
    name: 'users.name'
                  }).from('comments').leftJoin('users', 'users.id', 'comments.user_id')                  
                  .where('post_id', function(){
                    this
                        .select('posts.id')
                        .from('posts')
                        .whereRaw('posts.id = comments.post_id')
                        .where('posts.id', req.params.id)
                  })
  if (comments.length === 0) {
    return res.send({ error: true })
  }
  res.send({ data: comments }) 
}

const getOne = ({ db }) => async(req, res) => {  
  let id = req.params.id
  const comment = await db('comments').select().where('id', id)
  if (comment.length === 0) {
    res.status(401)
    return res.send({ error: true })
  }
  res.send(comment[0])
}

const remove = ({ db }) => async(req, res) => {  
  let id = req.params.id
  const comment = await db('comments').select().where('id', id)  
  if (comment.length === 0) {
    res.status(401)
    return res.send({ error: true })
  }
  await db('comments').select().where('id', id).del()
  return res.send({ success: true })
}

const create = ({ db })=> async(req, res) => { 
  const newComment = req.body
  const commentToInsert = {
    id: newComment.id ,
    comment: newComment.comment,
    date: newComment.date,
    post_id: newComment.post_id,
    user_id: newComment.user_id    
  }  
    await db.insert(commentToInsert).into('comments')
    res.send(commentToInsert)  
}

const update = ({ db })=> async(req, res) => {  
  const updateComment = req.body
  let { id } = req.params
  const comment = await db('comments').select().where('id', id)
  if (comment.length === 0) {
    res.status(401)
    return res.send({ error: true })
  }
  const commentToUpdate = {
    comment: updateComment.comment,    
    date: updateComment.date
  }
  await db('comments').where('id', id).update(commentToUpdate)
  res.send(commentToUpdate)  
}

module.exports = {
  getByPost,
  getOne,
  remove,
  create,
  update
}