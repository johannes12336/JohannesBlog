import express, { request, response } from 'express'
import { logger } from './middlewares/logger.js'
import mongoose from 'mongoose'
import slug from 'slug'
import { name } from 'ejs'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import 'dotenv/config'


const app = express()
const PORT = 3000



mongoose.connect(process.env.MONGODB_URI)
    .then(()=> console.log('Database connetected'))
    .catch(error => console.log(error))

app.set('view engine', 'ejs')


const articleSchema = new mongoose.Schema({
    title: { type: String, required: true},
    slug: { type: String, required: true},
    content: { type: String, required: true},
    date: { type: String, required: true},
})

const Article = mongoose.model('Article', articleSchema)


const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String},
    isAdmin: {type: Boolean, default: false},
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }]
})

const User = mongoose.model('User', userSchema)

const postSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    username: {type: String, required: true},
    postText: {type: String, required: true},
    likes: {type: Number},
    retweets: {type: Number},
    isLiked: {type: Boolean, default: false},
    isRetweeted: {type: Boolean, default: false}
})

const Post = mongoose.model('Post', postSchema)

// Middlewares:
app.use(logger)
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))




app.listen(PORT, () => {
    console.log(`started server on port ${PORT} `)
})






app.get('/', (request, response) => {
    response.render('index')
})


app.get('/about', (request, response) => {
    response.render('about')
})



//articles

app.get('/articles', async(request, response) => {
    try {
        const articles = await Article.find({}).exec()

        response.render('articles/index', {
            articles: articles
        })
    } catch (error) {
        console.error(error)
        response.render('articles/index', {
            articles: []
        })
    }
})

app.post('/articles', async (request,response) =>{
    try {
        const date = new Date(request.body.date)
        console.log(date)
        console.log(date.getDate())
        console.log(typeof( date.toLocaleDateString()))
        const readableDate = date.toLocaleDateString()

        const article = new Article({
            title: request.body.title,
            slug: slug(request.body.title),
            content: request.body.content, 
            date: readableDate
        })
        await article.save()

        response.redirect('/articles')
        
    } catch (error) {
        console.error(error)
        response.send('Error: the article could not be created :(')
    }
})


app.get('/articles/:slug', async (request, response) => {
    try {
        const article = await Article.findOne({slug: request.params.slug}).exec()

        response.render('articles/show', {
            article: article
        })
    } catch (error) {
        console.error(error)
        response.status(404).send('Error: Newsarticle could not be found :(')
    }
})



//admin pages

app.get('/admin', authenticateToken, isAdmin, async (request, response) => {
    try { const articles = await Article.find({}).exec()
        response.render('admin/index', {
            articles: articles
        })
    } catch (error) {
        console.error(error)
        response.send('There was an error')
    }
})

app.get('/admin/articles/new', authenticateToken, isAdmin, (request, response) => {
    response.render('admin/newArticle')
})


app.get('/admin/articles/:slug/edit', authenticateToken, isAdmin, async (request, response) => {
    try {
        const article = await Article.findOne({slug: request.params.slug}).exec()
        if(!article) throw new Error('Article not found :((')
        response.render('admin/edit', {
            article: article
        })
    } catch (error) {
        console.log(error)
        response.status(404).send('Could not find the article you were looking for :(')
    }
})


app.post('/articles/:slug', async (request, response) => {
    try {
        const article = await Article.findOneAndUpdate(
            {slug: request.params.slug},
            request.body,
            {new: true}
        )
        response.redirect('/admin')
    } catch (error) {
        
    }
})

app.get('/admin/articles/:slug/delete', authenticateToken ,isAdmin, async (request, response) => {
    try {
        await Article.findOneAndDelete({slug: request.params.slug})
        response.redirect('/admin')
    } catch (error) {
        console.error(error)
        response.status(404).send('yooo there was a problem ergo error my friend')
    }
})




//users


app.post('/users', async (request, response)=> {
    try {
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(request.body.password, saltRounds)

        const user = new User({
            username: request.body.username,
            name: request.body.name,
            passwordHash: passwordHash
        })
        await user.save()
        response.send('User created :)')
    } catch (error) {
        console.error(error)
        response.send('User could not be created')
    }
})







// Test login/signup

app.get('/signup', (request,response) => {
    response.render('user/signup')
})

app.post('/signup', async (request, response) => {
    try {
        const passwordHash = await bcrypt.hash(request.body.password, 10)
        const user = new User({
            username: request.body.username,
            password: passwordHash
        })
        await user.save()

        response.redirect('/login')
    } catch (error) {
        console.error(error)
        response.send('ERROR: user could not be created')
    }
})

app.get('/login', (request, response) => {
    response.render('user/login')
})

app.post('/login', async (request, response) => {

    const user = await User.findOne({username: request.body.username}).exec()
        if (user == null) {
            return response.status(400).send('Cant find user :(')
        }
  
    try {
       if (! await bcrypt.compare(request.body.password, user.password)) {
        
        throw new Error('Userpassword prolly wrong :((')
       } else {
        const accessToken = jwt.sign({user}, process.env.SECRET)
       response.set({"Set-Cookie": "accessToken=" + accessToken + "; path=/"})
       response.redirect('/forum')
       }
    } catch (error) {
        console.error(error)
        response.send('Password prolly wrong')
    }
    
    
    
})


app.get('/logout',(request,response) => {
    response.clearCookie("accessToken")
    response.redirect("/")
})

function authenticateToken(request, response, next) {
    const accessTokenHeader = request.headers['cookie']
    if (accessTokenHeader == null) return response.redirect('/login')

    const accessToken = accessTokenHeader.split("=")[1]
    

    // const token = accessToken // authHeader && authHeader.split(' ')[1]
    

    jwt.verify(accessToken, process.env.SECRET, (err, usershell) => {
        if (err) return response.sendStatus(403)

        request.user = usershell.user
        next()
    })
}


function isAdmin (request, response, next) {
    if(!request.user.isAdmin)
        response.render('error/restricted')

    next()
}


app.get('/admincheck', authenticateToken, isAdmin, (request, response) => {
    try {
        response.send(`Are you an admin ${request.user.username}? the answer is ${request.user.isAdmin}`)
    } catch (error) {
        console.error(error)
        response.send('ERROR')
    }
    response.send(`Are you an admin ${request.user.username}? the answer is ${request.user.isAdmin}`)
})

app.get('/test/forum', authenticateToken, (request, response,) => {
    console.log(request.user.username)
    console.log(testPosts.filter(post => post.username === "test"))
    response.send(testPosts.filter(post=> post.username === request.user.username))
})


// Forum

app.get('/forum', authenticateToken, async (request, response) => {
    const posts = await Post.find({}).exec()
    response.render('forum/index', {
        user: request.user,
        posts: posts
    })
})

app.post('/posts', authenticateToken, async (request, response) => {
    const post = new Post({
        user: request.user._id, 
        username: request.body.username,
        postText: request.body.text, 
        likes: Math.floor(Math.random() * 1001),
        retweets: Math.floor(Math.random() * 301)
    })
    await post.save()

    const posts = await Post.find({}).exec()
    response.redirect('/forum')
})


app.get('/forum/delete/:id', authenticateToken, async (request, response) =>{
    try {
        const postArray = await Post.find({_id: request.params.id})
        const post =postArray[0]
        
        console.log(post.username)

        if(!request.user.username=== post.username){
            throw new Error('Someone not allowed making a request')
            response.send('YOU ARE NOT ALLOWED!!!!!!!')
        }

        await Post.findOneAndDelete({_id: request.params.id})
        const posts = await Post.find({}).exec()
        
        response.render('forum/index', {
            user: request.user,
            posts: posts
        })


    } catch (error) {
        console.error(error)
        response.send('oopsie')
    }
})

app.get('/forum/like/:id', authenticateToken, async (request, response) => {
    try {
        const post = await Post.findOne({_id: request.params.id})
        const newLikes = post.likes +1
    
        console.log(newLikes)
    
    
        const updatedPost = await Post.findOneAndUpdate(
            {_id: request.params.id},
            {likes: newLikes,
            isLiked: true,
            }, 
            {new: true}
        )
    
        response.send(updatedPost)
    
        console.log(updatedPost)
    } catch (error) {
        console.error(error)
        response.status(404).send('probably an old post')
    }


})