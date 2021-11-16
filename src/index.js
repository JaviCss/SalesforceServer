const express = require('express')
const oauth2 = require('salesforce-oauth2')
const cookieParser = require('cookie-parser')
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

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
  let token
  if (sheet) {
    console.log('Token correct')
    token = sheet
  } else {
    if (clean_sheet) {
      console.log('Token expired')
      const body = {
        client_id: client_id,
        refresh_token: clean_sheet
      }
      const params = new URLSearchParams()
      params.append('client_id', client_id)
      params.append('refresh_token', clean_sheet)

      const response = await fetch('https://login.salesforce.com/services/oauth2/token?grant_type=refresh_token', {
        method: 'post',
        body: params
      })
      const data = await response.json();
      console.log('new token generated')
      console.log(data);
      

      res.cookie('sheet', data.access_token, { maxAge: data.issued_at, httpOnly: true, sameSite: 'none', secure: true })
      res.cookie('clean_sheet', data.refresh_token, { httpOnly: true, sameSite: false, sameSite: 'none', secure: true })
      res.cookie('id_sheet', data.instance_url, { httpOnly: true, sameSite: false, sameSite: 'none', secure: true })

    }


  }
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
    let time1 =  new Date(Number(data.issued_at))
    let time =  new Date(new Date().getTime()+1*3600*1000).toGMTString()
    console.log('Tiempo: ',time1)
    console.log(time)

    let time_refresh =  new Date(new Date().getTime()+30*3600*1000).toGMTString()
    console.log('tiempo_refresh: ',time_refresh)



    res.cookie('sheet', data.access_token, { expires: new Date(Number(data.issued_at)), httpOnly: true, sameSite: 'none', secure: true })
    res.cookie('clean_sheet', data.refresh_token, {  maxAge: 1*3600*1000 ,httpOnly: true, sameSite: false, sameSite: 'none', secure: true })
    res.cookie('id_sheet', data.instance_url, { maxAge: 3600*1000, httpOnly: true, sameSite: false, sameSite: 'none', secure: true })



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
  issued_at: '1636557821642' //16 36 99 9324109
}

/*
5Aep8615B7Psrq3qblUf.WoheZoUyT1y82wXZsjM6sAQJWHa.ZuOej14Hx4cdOw3pGQt_hbdJ74PXDM1sSRPNgQ
5Aep8615B7Psrq3qblUf.WoheZoUyT1y82wXZsjM6sAQJWHa.Y5FG7Y6_jf.QdhsRNesITg4Aunl2N0QxRtAdBv



*/
