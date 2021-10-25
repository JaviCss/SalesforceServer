const express = require('express')
const fetchUrl = require("fetch").fetchUrl;
const oauth2 = require('salesforce-oauth2')
const PORT = process.env.PORT || 4000
const app = express.createServer(express.logger());


let client_id = '3MVG9LBJLApeX_PAOL8P8mOUd4nVt3vEFrBWR3A_CIVRpm9XoV3Vs75EgJXBm123XIOoNlk.3ATAKxU5x0rIn'
let client_secret = 'CD676C6964227D3163149B6BD77C30EBFBDEBA05DF93F759F9FA873E59219C22'
let redirect_uri = 'https://server-sf.herokuapp.com/auth/handle_decision'




//config
app.set('port', PORT)
//midelware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
//routes

app.listen(app.get('port'), () => { })



app.get('/auth/salesforce', async (req, res) => {

  var uri = oauth2.getAuthorizationUrl({
    redirect_uri: redirect_uri,
    client_id: client_id,
    scope: 'api', // 'id api web refresh_token'
    // You can change loginUrl to connect to sandbox or prerelease env.
    //base_url: 'https://test.my.salesforce.com'
  });
  return response.redirect(uri);   
   

  /*
 params = {
    'response_type': 'code',
    'redirect_uri': 'https://my-example-app.herokuapp.com/auth/handle_decision',
    'client_id': 'your_client_id',
    'state': req.query.state
  }
  let url = `https://login.salesforce.com/services/oauth2/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code `

  console.log('salesforce')
  res.redirect(url);

  */
 
})
app.get('/auth/token', async (req, res) => {

  

})
app.get('/auth/handle_decision', async (req, res) => {
  res.json('hola')
  /*
   
  var authorizationCode = request.param('code');
  
  oauth2.authenticate({
    redirect_uri: redirect_uri,
    client_id: client_id,
    client_secret: client_secret,
    code: authorizationCode,    
  }, function (error, payload) {
   

    return 
  })*/

  















  /*
 
   let code = req.query.code
   res.json(code)
 
   params = {
     'grant_type': 'authorization_code',
     'code': req.query.code,
     'client_id': client_id,
     'client_secret': client_secret,
     'redirect_uri': 'https://server-sf.herokuapp.com/auth/handle_decision'
 }
 const response = await fetchUrl('services/oauth2/token', {
   method: 'post',
   body: JSON.stringify(body),
   headers: { 'Content-Type': 'application/json' }
 });
 //const data = await response.json();
 
 console.log(body);
 //
 */

})
app.post('/redirect.js', (req, res) => {
  const { domainBase, account_id, path, pathEncoded } = req.body
  const { consumeri, consumers, tokeni, tokens } = req.headers

  res.json(dataSign)
})
//start






