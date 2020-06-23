const Koa = require('koa')
const app = new Koa()
const Router = require('koa-router')
const router = new Router()

const cors = require('koa2-cors')
const koaBody = require('koa-body')

const ENV = 'test-2e4l9'

// 跨域
app.use(cors({
  origin: ['http://localhost:9527'],
  credentials: true
}))

// post参数解析
app.use(koaBody({
  multipart: true
}))

app.use(async (ctx, next) => {
  console.log('test全局中间件')
  ctx.state.env = ENV
  await next()
})

const playlist = require('./controller/playlist')
router.use('/playlist', playlist.routes())

const swiper = require('./controller/swiper')
router.use('/swiper', swiper.routes())

const blog = require('./controller/blog')
router.use('/blog', blog.routes())

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000, () => {
  console.log('服务启动在3000端口')
})