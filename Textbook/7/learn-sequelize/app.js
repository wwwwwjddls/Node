const express  = require('express')
const path     = require('path')
const morgan   = require('morgan')
const nunjucks = require('nunjucks')

const { sequelize } = require('./models')

const app = express()

// port
app.set('port', process.env.PORT || 3001)

// nunjucks
app.set('view engine', 'html')
nunjucks.configure('view', {
    express: app,
    watch: true,
})

// sequelize
sequelize.sync({ force: false }) // 서버실행 대마다 테이블 재생성
         .then(() => {
             console.log('데이터베이스 연결 성공')
         })
         .catch((err) => {
             console.error(err)
         })

// morgan
app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, 'public')))
//parser
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// middle
app.use((req, res, next) => {
    const error  = new Error(`${req.method} ${req.url} 라우터가 없습니다.`)
    error.status = 404
    next(error) 
})

app.use((err, req, res, next) => {
    req.locals.message = err.message
    req.locals.error   = process.env.NODE_ENV !== 'production' ? err : {}
    req.status(err.status || 500)
    res.render('error') 
})

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중')
})