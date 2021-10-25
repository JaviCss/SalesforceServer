const express = require('express')
const fetchUrl = require("fetch").fetchUrl;
const PORT = process.env.PORT || 4000
const app = express()


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

  params = {
    'response_type': 'code',
    'redirect_uri': 'https://my-example-app.herokuapp.com/auth/handle_decision',
    'client_id': 'your_client_id',
    'state': req.query.state
  }
  let url = `https://login.salesforce.com/services/oauth2/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code `

  console.log('salesforce')
  res.redirect(url);

  /*
    const response = await fetchUrl('https://httpbin.org/post', {
      method: 'post',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' }
    });
    //const data = await response.json();
  
    console.log(body);
    //res.json()
    */
})
app.get('/auth/token', async (req, res) => {

  let params = {
    'response_type': 'code',
    'redirect_uri': 'https://my-example-app.herokuapp.com/auth/handle_decision',
    'client_id': 'your_client_id',
    'state': req.query.state
  }



  let url = `https://login.salesforce.com/services/oauth2/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code `

  console.log('token')
  res.send('token')

})
/*https://login.salesforce.com/services/oauth2/authorize?
client_id=3MVG9IHf89I1t8hrvswazsWedXWY0i1qK20PSFaInvUgLFB6vrcb9bbWFTSIHpO8G2jxBLJA6uZGyPFC5Aejq&
redirect_uri=https://www.mycustomerorderstatus.com/oauth2/callback&
response_type=code */

app.get('/auth/handle_decision', async (req, res) => {

  console.log('redirect')

  




  
})
app.post('/redirect.js', (req, res) => {
  const { domainBase, account_id, path, pathEncoded } = req.body
  const { consumeri, consumers, tokeni, tokens } = req.headers

  res.json(dataSign)
})
//start






