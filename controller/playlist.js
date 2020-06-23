/* const Router = require('koa-router')
const router = new Router()
const rp = require('request-promise')
const getAccessToken = require('../utils/getAccessToken')
const ENV = 'test-2e4l9'

router.get('/list', async (ctx, next) => {
    const access_token = await getAccessToken()
    const url = `https://api.weixin.qq.com/tcb/invokecloudfunction?access_token=${access_token}&env=${ENV}&name=music`
    const query = ctx.request.query
    const options = {
        method: 'POST',
        uri: url,
        body: {
            $url: 'playlist',
            start: parseInt(query.start),
            count: parseInt(query.count)
        },
        json: true
    }
    const data = await rp(options).then((res) => {
        console.log(res)
        return JSON.parse(res.resp_data).data
    }).catch((err) => {

    })
    ctx.body = {
        data,
        code: 20000
    }
})

module.exports = router */
const Router = require('koa-router')
const router = new Router()
const callCloudFn = require('../utils/callCloudFn')
const callCloudDB = require('../utils/callCloudDB')

router.get('/list', async (ctx, next) => {
    const query = ctx.request.query
    console.log(query)
    const res = await callCloudFn(ctx, 'music', {
        $url: 'playlist',
        start: parseInt(query.start),
        count: parseInt(query.count)
    })
    let data = []
    if (res.resp_data) {
        data = JSON.parse(res.resp_data).data
    }
    ctx.body = {
        data,
        code: 20000,
    }
})

router.get('/getById', async (ctx, next) => {
    const query = `db.collection('playlist').doc('${ctx.request.query.id}').get()`
    const res = await callCloudDB(ctx, 'databasequery', query)
    ctx.body = {
        code: 20000,
        data: JSON.parse(res.data)
    }
})

router.post('/updatePlaylist', async (ctx, next) => {
    console.log(ctx)
    const params = ctx.request.body
    console.log(params)
    const query = `
        db.collection('playlist').doc('${params._id}').update({
            data: {
                name: '${params.name}',
                copywriter: '${params.copywriter}'
            }
        })
    `
    const res = await callCloudDB(ctx, 'databaseupdate', query)
    ctx.body = {
        code: 20000,
        data: res
    }
})

router.get('/del', async (ctx, next) => {
    const params = ctx.request.query
    const query = `db.collection('playlist').doc('${params.id}').remove()`
    const res = await callCloudDB(ctx, 'databasedelete', query)
    ctx.body = {
        code: 20000,
        data: res
    }
})

module.exports = router