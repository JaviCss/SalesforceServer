const express = require('express')
const fetchUrl = require("fetch").fetchUrl;
const oauth2 = require('salesforce-oauth2')
const cookieParser = require('cookie-parser')

const 
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

app.get('/auth/salesforce', async (req, res) => {
/*
let client_id  
let client_secret 
let redirect_uri 
let subdomain zat
let ticket
*/
  var uri = oauth2.getAuthorizationUrl({
    redirect_uri: redirect_uri,
    client_id: client_id,
    scope: 'api', // 'id api web refresh_token'
  });
  return res.redirect(uri);
})
app.get('/auth/token', async (req, res) => {



})
app.get('/auth/handle_decision', async (req, res) => {

  var authorizationCode = req.param('code');
  console.log(authorizationCode)
  /*
  oauth2.authenticate({
    redirect_uri: redirect_uri,
    client_id: client_id,
    client_secret: client_secret,
    code: authorizationCode,
  }, function (error, payload) {

    console.log(error)
    console.log(payload)

  })*/
/*
  data = r.json()
  response.set_cookie('sheet', data['access_token'], max_age = data['expires_in'])
  response.set_cookie('clean_sheet', data['refresh_token'])
  redirect('https://d3v-testing.zendesk.com/agent/tickets/{}'.format(request.query.state))

*/


})
app.post('/redirect.js', (req, res) => {
  const { domainBase, account_id, path, pathEncoded } = req.body
  const { consumeri, consumers, tokeni, tokens } = req.headers

  res.json(dataSign)
})
//start






