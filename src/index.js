const express = require('express')
const oauth2 = require('salesforce-oauth2')
const cookieParser = require('cookie-parser')
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const path = require('path');
const { setUser, getUser, checkUser,updateUser,updateUserTokenRefresh } = require('./controllers/index.controller')

///////
const PORT = process.env.PORT || 4000
const app = express();


//let client_id = '3MVG9LBJLApeX_PAOL8P8mOUd4nVt3vEFrBWR3A_CIVRpm9XoV3Vs75EgJXBm123XIOoNlk.3ATAKxU5x0rIn'
let client_secret = '0FD86DB0FA9DB7013019B7F41F80697E836379B6048A983A5DF733BCF8DB0BF1'
let redirect_uri = 'https://server-sf.herokuapp.com/auth/handle_decision'

//config
let ageShort = 3600 * 1000
let ageLong = 30 * 24 * 3600 * 1000

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

app.post('/auth/user', async (req, res) => {
  let user = await checkUser(req, res)
  if (user.length === 0) {
    console.log('user dont exist')
    setUser(req, res ) 
  } else {
    console.log('usuario existe')
    let { consumeri, consumers, domain } = user[0]
    if (consumeri === req.body.consumeri && consumers === req.body.consumers && domain === req.body.domain ) {
      console.log('credenciales correctas')
      res.status(200).end()
    }else{
      console.log('actualizando credenciales')
     let updateuser = await  updateUser(req, res)
     res.status(200).end()
    }
  }


  //crea el usuario
  res.status(200).end()
})

app.get('/auth/salesforce', async (req, res) => {
  const domain = req.query.domain
  let user = await getUser(domain)
  console.log(user)
 
  var uri = oauth2.getAuthorizationUrl({
    redirect_uri: redirect_uri,
    client_id: user[0].consumeri,
    scope: 'api web refresh_token', // 'id api web refresh_token'
    base_url: 'https://test.salesforce.com'
  })
  
  res.cookie('domain', domain, { maxAge: ageLong , httpOnly: true, sameSite: 'none', secure: true })
  //res.send(`${uri}`)*/
  res.redirect(uri)
  res.end()

})

app.get('/auth/handle_decision', async (req, res) => {
  const { domain } = req.cookies
  let user = await getUser(domain)
  var authorizationCode = req.query.code
  oauth2.authenticate({
    redirect_uri: redirect_uri,
    client_id: user[0].consumeri,
    client_secret: user[0].consumers,
    code: authorizationCode,
    base_url: 'https://test.salesforce.com',
  }, async function (error, payload) {
    let data = payload
    console.log('payload: ', data)

    var timestamp = Number(data.issued_at)
    var date = new Date(timestamp);
    console.log('timestamp', date.getTime())
    console.log(date)


   res.cookie('sheet', data.access_token, { maxAge: data.issued_at , httpOnly: true, sameSite: 'none', secure: true })
    /*
    let time1 =  new Date(Number(data.issued_at))
    let time =  new Date(new Date().getTime()+1*3600*1000).toGMTString()
    console.log('Tiempo: ',time1)
    console.log(time)    
    
    res.cookie('clean_sheet', data.refresh_token, { maxAge: ageLong, httpOnly: true, sameSite: false, sameSite: 'none', secure: true })
    res.cookie('url_sheet', data.instance_url, { maxAge: ageLong, httpOnly: true, sameSite: false, sameSite: 'none', secure: true })*/


    res.send("<script>window.close();</script >")
    res.end()

  })
})


//TOKEN
app.get('/auth/token', async (req, res) => {
  const { sheet, clean_sheet, url_sheet, consumer_id_sheet } = req.cookies
  let token
  if (sheet) {
    console.log('Token correct')
    token = sheet
  } else {
    if (clean_sheet) {
      console.log('Token expired')
      const params = new URLSearchParams()
      params.append('client_id', consumer_id_sheet)
      params.append('refresh_token', clean_sheet)
      const response = await fetch('https://login.salesforce.com/services/oauth2/token?grant_type=refresh_token', {
        method: 'post',
        body: params
      })
      const data = await response.json();
      console.log(data)
      console.log('new token generated')
      res.cookie('sheet', data.access_token, { maxAge: ageLong, httpOnly: true, sameSite: 'none', secure: true })
    } else {
      token = 'undefined'
    }
  }
  res.render('auth.html', { token: token, instance_url: url_sheet })
})
