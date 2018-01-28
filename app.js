const express = require('express')
const path = require('path')
const http = require('http')
const fs = require('fs')

const request = require('request')

const PyShell = require('python-shell')

const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.json({ limit: '16mb' }))
app.use(bodyParser.urlencoded({ extended: false, limit: '16mb'}))

app.use(express.static('public'))

const PORT = process.env.PORT || 5050

emotionData = []
timeStamp = 0

app.get('/', (req, res) => {
  console.log(__dirname)
  res.sendFile(__dirname + '/index.html')
})

app.get('/upload', (req, res) => {
  // Post data to DOM

  let sampleData = "Hello, world!!"
  const pyshell = new PyShell('graph.py', { args: [sampleData]} )  

  let result = ""

  pyshell.on('message', (msg) => result += msg)
  pyshell.end((err) => {
    if (err) {
      // throw err
      res.send("ERROR")
    } else {
      res.send(result)
    }
    // res.send(result)
  })

  // res.send(JSON.stringify(emotionData))
})

app.post('/upload', (req, res) => {
  let data = req.body.img.replace(/^data:image\/png;base64,/, "")
  data += data.replace('+', ' ')
  let binaryData = new Buffer(data, 'base64').toString('binary')
  // let name = 'public/captures/photo.png'
  let name = 'public/captures/' + req.body.name
  
  fs.writeFile(name, binaryData, 'binary', (err) => console.log(err))
  // console.log(`Received ${dataUrl}`)

  let requestName = 'https://damp-anchorage-78125.herokuapp.com' + '/captures/' + req.body.name 

  request({
    url: "https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize",
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': 'daecb17d1425499199cefea44c3a38c4'
    },
    body: {
      url: requestName
    },
    json: true
  }, (err, res, data) => {
    curr = {}
    // curr.requestName = requestName
    // curr.res = res
    // curr.data = data
    curr.timeStamp = timeStamp++

    people = []
    for (i in data) {
      people.push(data[i].scores)
    }
    //   let scores = data[i].scores

    //   let person = {}
    //   for (let prop in scores) {
    //     person[prop] = scores[prop]
    //   }
    //   people.push(person)
    // }

    curr.people = people
    emotionData.push(curr)
  })
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))