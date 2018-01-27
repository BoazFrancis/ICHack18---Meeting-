const express = require('express')
const path = require('path')
const http = require('http')
const fs = require('fs')

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
  let name = 'captures/' + req.body.name
  
  fs.writeFile(name, binaryData, 'binary', (err) => console.log(err))
  // console.log(`Received ${dataUrl}`)
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))