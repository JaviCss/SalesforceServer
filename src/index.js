//IMPORTS
const express = require('express')
const oauth2 = require('salesforce-oauth2')
const cookieParser = require('cookie-parser')
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const path = require('path');
const { setUser, getUser, checkUser, updateUser, updateUserTokenRefresh } = require('./controllers/index.controller')
//CONFIG
const redirect_uri = 'https://server-sf.herokuapp.com/auth/handle_decision'
const token_expire_time = (60 * 2 * 1000) // 24 horas
const domain_expire_time = (3600 * 24 * 1000 * 30 * 12) // 1 año
const PORT = process.env.PORT || 4000
const app = express();
//SET APP
app.set('port', PORT)
app.set('trust proxy', 1)
app.set('views', path.join(__dirname, 'templates'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
//midelware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
//app.use(express.static(__dirname));
app.use(cookieParser())
//routes
app.listen(app.get('port'), () => { })

//SALESFORCE
//save data db
app.post('/auth/user', async (req, res) => {
  let user = await checkUser(req, res)
  if (user.length === 0) {
    console.log('user dont exist')
    setUser(req, res)
  } else {
    console.log('usuario existe')
    let { consumeri, consumers, domain } = user[0]
    if (consumeri === req.body.consumeri && consumers === req.body.consumers && domain === req.body.domain) {
      console.log('credenciales correctas')
      res.status(200).end()
    } else {
      console.log('actualizando credenciales')
      let updateuser = await updateUser(req, res)
      res.status(200).end()
    }
  }
  //crea el usuario
  res.status(200).end()
})
//login
app.get('/auth/salesforce', async (req, res) => {
  const domain = req.query.domain
  let user = await getUser(domain)
  let uri = oauth2.getAuthorizationUrl({
    redirect_uri: redirect_uri,
    client_id: user[0].consumeri,
    scope: 'api web refresh_token', // 'id api web refresh_token'
    base_url: 'https://test.salesforce.com'
  })
  res.cookie('domain', domain, { maxAge: domain_expire_time, httpOnly: true, sameSite: 'none', secure: true })
  res.redirect(uri)
  res.end()

})
app.get('/auth/handle_decision', async (req, res) => {
  const { domain } = req.cookies
  let user = await getUser(domain)
  let authorizationCode = req.query.code
  oauth2.authenticate({
    redirect_uri: redirect_uri,
    client_id: user[0].consumeri,
    client_secret: user[0].consumers,
    code: authorizationCode,
    base_url: 'https://test.salesforce.com',
  }, async function (error, payload) {
    let data = payload
    console.log('payload: ', data)
    res.cookie('sheet', data.access_token, { maxAge: token_expire_time, httpOnly: true, sameSite: 'none', secure: true })

    await updateUserTokenRefresh(data.refresh_token, domain, data.instance_url)

    res.send("<script>window.close();</script >")
    res.end()

  })
})
//TOKEN
app.get('/auth/token', async (req, res) => {
  let domain = req.query.domain
  const { sheet } = req.cookies
  let user = await getUser(domain)
  let token
  console.log(user)
  if (sheet) {
    console.log('Token correct')
    token = sheet
  } else {
    if (user[0].tokenrefresh !== null) {
      console.log('Token expired')
      const params = new URLSearchParams()
      params.append('client_id', user[0].consumeri)
      params.append('refresh_token', user[0].tokenrefresh)
      console.log(user[0].tokenrefresh)
      const response = await fetch('https://test.salesforce.com/services/oauth2/token?grant_type=refresh_token', {
        method: 'post',
        body: params
      })
      const data = await response.json();
      console.log(data)

      console.log('new token generated')
      res.cookie('sheet', data.access_token, { maxAge: token_expire_time, httpOnly: true, sameSite: 'none', secure: true })
      token = data.access_token
    } else {
      console.log('no hay token refresh')
      token = 'undefined'
    }
  }
  res.render('auth.html', { token: token, instance_url: user[0].instance_url })
})
