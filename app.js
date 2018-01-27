const express = require('express')
const path = require('path')
const http = require('http')
const fs = require('fs')

const request = require('request')
const rp = require('request-promise')

const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.json({ limit: '16mb' }))
app.use(bodyParser.urlencoded({ extended: false, limit: '16mb'}))

app.use(express.static('public'))

const PORT = process.env.PORT || 5050

app.get('/', (req, res) => {
  console.log(__dirname)
  res.sendFile(__dirname + '/index.html')
})

app.post('/upload', (req, res) => {
  let data = req.body.img.replace(/^data:image\/png;base64,/, "")
  data += data.replace('+', ' ')
  let binaryData = new Buffer(data, 'base64').toString('binary')
  let name = 'public/captures/photo.png'
  // let name = 'public/captures/' + req.body.name
  
  fs.writeFile(name, binaryData, 'binary', (err) => console.log(err))
  // console.log(`Received ${dataUrl}`)

  let requestName = 'https://damp-anchorage-78125.herokuapp.com/captures/photo.png'
  // let requestName = 'https://damp-anchorage-78125.herokuapp.com' + '/captures/' + req.body.name 

  request({
    url: "https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize",
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': 'daecb17d1425499199cefea44c3a38c4'
    },
    body: '{"url": "https://damp-anchorage-78125.herokuapp.com/captures/photo.png"}'
  }, (err, res, body) => {
    alert(err)
  })
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))