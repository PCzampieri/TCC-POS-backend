const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './db.sqlite'
    },
    useNullAsDefault: true
})

//depurar SQL no console
/*knex.on('query', query => { 
    console.log(query.sql)    
})*/

const initDB = async () => {
    const userExist = await knex.schema.hasTable('users')
    if (!userExist) {
        await knex.schema.createTable('users', table => {
            table.increments('id').primary()
            table.string('name')
            table.string('email')
            table.string('passwd')
            table.string('role')            
        })
    }
    const postsExit = await knex.schema.hasTable('posts')
    if (!postsExit) {
        await knex.schema.createTable('posts', table => {
            table.increments('id').primary()
            table.string('title')
            table.string('post')
            table.timestamps();
            table.string('image_url')
            table.integer('category_id')
            table.integer('user_id')
        })
    }
    const categoriesExist = await knex.schema.hasTable('categories')
    if (!categoriesExist) {
        await knex.schema.createTable('categories', table => {
            table.increments('id').primary()
            table.string('name')
        })
    }
    const commentsExist = await knex.schema.hasTable('comments')
    if (!commentsExist) {
        await knex.schema.createTable('comments', table => {
            table.increments('id').primary()
            table.string('comment')
            table.dateTime('date')
            table.integer('post_id')
            table.integer('user_id')
        })
    }
    const totalUsers = await knex('users').select(knex.raw('count(*) as total'))
    if (totalUsers[0].total === 0) {
        await knex.insert({
            name: 'Cezar Zampieri',
            email: 'cezar@cezar.com',
            passwd: '123456',
            role: 'admin',
        }).into('users')
        await knex.insert({
            name: 'Bruno',
            email: 'bruno@bruno.com',
            passwd: '123456',
            role: 'admin'
        }).into('users')
    }
}
initDB()

module.exports = knex