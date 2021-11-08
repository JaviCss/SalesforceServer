const express = require('express')
const oauth2 = require('salesforce-oauth2')
const cookieParser = require('cookie-parser')


///////
const PORT = process.env.PORT || 4000
const app = express();



let client_id = '3MVG9LBJLApeX_PAOL8P8mOUd4nVt3vEFrBWR3A_CIVRpm9XoV3Vs75EgJXBm123XIOoNlk.3ATAKxU5x0rIn'
let client_secret = 'CD676C6964227D3163149B6BD77C30EBFBDEBA05DF93F759F9FA873E59219C22'
let redirect_uri = 'https://server-sf.herokuapp.com/auth/handle_decision'




//config
app.set('port', PORT)
//midelware
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
//routes

app.listen(app.get('port'), () => { })
/*
let client_id  
let client_secret 
let redirect_uri 
let subdomain zat
let ticket
*/
app.get('/auth/salesforce', async (req, res) => {
  var uri = oauth2.getAuthorizationUrl({
    redirect_uri: redirect_uri,
    client_id: client_id,
    scope: 'api', // 'id api web refresh_token'
  })
  return res.redirect(uri)
})
app.get('/auth/token', async (req, res) => {

  let data 
  console.log(req.cookies)
  

})
app.get('/auth/handle_decision', async (req, res) => {
  var authorizationCode = req.query.code
  oauth2.authenticate({
    redirect_uri: redirect_uri,
    client_id: client_id,
    client_secret: client_secret,
    code: authorizationCode,
  }, function (error, payload) {
    let data = payload
    console.log('Respuesta: ', data)
    res.cookie('sheet', data.access_token, { maxAge: data.issued_at })
    res.cookie('clean_sheet', data.refresh_token)
    res.redirect('https://d3v-testing.zendesk.com/agent/apps/local-app?zat=true')
    window.close();
    next()
  })
})
app.use(express.static(__dirname + '/public'));







