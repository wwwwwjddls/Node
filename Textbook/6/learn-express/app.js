const express = require('express')
const morgan  = require('morgan')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const dotenv = require('dotenv')
const path = require('path')
const nunjucks = require('nunjucks')

dotenv.config()
const indexRouter = require('./routes')
const userRouter = require('./routes/user')

const app = express()

app.set('port', process.env.PORT||3000)

// pug
/*
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
*/

// nunjucks
app.set('view engine', 'html')
nunjucks.configure('view', {
    express: app,
    watch: true, // html 파일이 변경될 대 템플릿 엔진을 다시 렌더링 한다.
})

app.use(morgan('dev'))
app.use('/', express.static(path.join(__dirname, 'public')))
// body-parser
app.use(express.json())
// true : qs모듈, false : querystring모듈
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
    name: 'session-cooke',
}))

// multer
const multer = require('multer')
const fs = require('fs')
const { errorMonitor } = require('events')

try {
    fs.readdirSync('uploads')
}
catch(error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.')
    fs.mkdirSync('uploads')
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, 'uploads/')
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname)
            done(null, path.basename(file.originalname, ext)+Date.now()+ext)
        },
    }),
    limits: { fileSize: 5*1024*1024 }
})

// Router
app.use('/', indexRouter)
app.use('/user', userRouter)

app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`)
    error.status = 404
    next(error)
    //res.status(404).send('Not Found')
}) 
/*
app.get('/upload', (req, res) => {
    res.sendFile(path.join(__dirname, 'multipart.html'))
})

app.post('/upload', upload.fields([{ name: 'image1' }, { name: 'image2'}]), 
        (req, res) => {
            console.log(req.files, req.body)
             res.send('ok')
        })

app.use((req, res, next) => {
    console.log('모든 요청에 다 실행됩니다.')
    next()
})

app.get('/', (req, res, next) => {
    console.log('GET / 요청에서만 실행됩니다.')
    next()
}, (req, res) => {
    throw new Error('에러는 에러 처리 미들웨어로 값니다.')
})
*/

app.use((err, req, res, next) => {
    //console.log(err)
    //res.status(500).send(err.message)
    res.locals.message = err.message
    // 시스템 환경 : process.env.NODE_ENV
    res.locals.error   = process.env.NODE_ENV !== 'production' ? err : {}
    res.status(err.status||500)
    res.render('error')
})

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중')
})