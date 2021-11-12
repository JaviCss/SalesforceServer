const express = require('express')
const oauth2 = require('salesforce-oauth2')
const cookieParser = require('cookie-parser')
const axios = require('axios');


///////
const PORT = process.env.PORT || 4000
const app = express();



let client_id = '3MVG9LBJLApeX_PAOL8P8mOUd4nVt3vEFrBWR3A_CIVRpm9XoV3Vs75EgJXBm123XIOoNlk.3ATAKxU5x0rIn'
let client_secret = 'CD676C6964227D3163149B6BD77C30EBFBDEBA05DF93F759F9FA873E59219C22'
let redirect_uri = 'https://server-sf.herokuapp.com/auth/handle_decision'



//config
app.set('port', PORT)
app.set('trust proxy', 1)
//midelware


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname));
app.use(cookieParser())

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
    scope: 'api refresh_token', // 'id api web refresh_token'
  })
  return res.redirect(uri)
})
app.get('/auth/token', async (req, res) => {

  const { sheet, clean_sheet, id_sheet } = req.cookies

  if (false) { } else {
    if (clean_sheet) {


      axios({
        method: 'POST',
        baseURL: 'https://login.salesforce.com/',
        url:'/services/oauth2/token',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},      
        data: {          
          client_id: client_id,
          grant_type: 'refresh_token&',  
          refresh_token: clean_sheet 
        },
       
        
      }).then(function (response) {
        console.log(response)
      }).catch( e =>  console.log(e.response.data))




     /* 
      var uri = oauth2.getAuthorizationUrl({
        redirect_uri: redirect_uri,
        client_id: client_id,
        scope: 'refresh_token',
        // You can change loginUrl to connect to sandbox or prerelease env.
        //base_url: 'https://test.my.salesforce.com'
      });
      return res.redirect(uri)*/
    }


  }


  //console.log('sheet', sheet)
  //console.log('clean_sheet', clean_sheet)
  //console.log(id_sheet)
  res.json('listo')

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
    console.log(data)
    res.cookie('sheet', data.access_token, { maxAge: data.issued_at, httpOnly: true, sameSite: 'none', secure: true })
    res.cookie('clean_sheet', data.refresh_token, { httpOnly: true, sameSite: false, sameSite: 'none', secure: true })
    res.cookie('id_sheet', data.instance_url, { httpOnly: true, sameSite: false, sameSite: 'none', secure: true })



    res.send("<script>window.close();</script >")
    res.end()

  })
})
//app.use(express.static(__dirname + '/src'));







let sample = {
  access_token: '00D6g000005hXEM!AQIAQKN0oBvoAVNFLX_jBG1bE29DwMjzg6JisOmsZu7ZCtNHYH0Y6gM9LW_VsmPwznN850fKLucK185R99vCiKlZYIPNAh',
  signature: 'O3UfpqpSdeY/pFlbvqaVih8tp+J2nKD8Nd+FrZ0vz6s=',
  scope: 'api',
  instance_url: 'https://venom.my.salesforce.com',
  id: 'https://login.salesforce.com/id/00D6g000005hXEMEA2/0056g0000032XSzAAM',
  token_type: 'Bearer',
  issued_at: '1636557821642'
}

/*
5Aep8615B7Psrq3qblUf.WoheZoUyT1y82wXZsjM6sAQJWHa.ZuOej14Hx4cdOw3pGQt_hbdJ74PXDM1sSRPNgQ
5Aep8615B7Psrq3qblUf.WoheZoUyT1y82wXZsjM6sAQJWHa.Y5FG7Y6_jf.QdhsRNesITg4Aunl2N0QxRtAdBv



*/