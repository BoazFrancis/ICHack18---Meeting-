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

// app.set('view engine', 'ejs')
app.use(express.static('public'))

const plotly = require('plotly')('ichack18', 'Y7wvDu5Xh9kJ2g4TL2dH')

const PORT = process.env.PORT || 5050

emotionData = []
timeStamp = 0

app.get('/', (req, res) => {
  // res.render('index', {})
  res.sendFile(__dirname + '/index.html')
})

app.get('/upload', (req, res) => {
  /* FROM BOAS */
  // Post data to DOM
  let data = emotionData

  let person;
  let numPeople;
  let score = 0
  let scores = []
  let times = []

  for (i = 0; i < data.length; i++) {
    numPeople = data[i].people.length
    for (j = 0; j < numPeople; j++) {
      person = data[i].people[j]
      score += person['anger'] * (-10)
      score += person['contempt'] * (-10)
      score += person['disgust'] * (-10)
      score += person['fear'] * (-10)
      score += person['happiness'] * 10
      score += person['sadness'] * (-10)
      score += person['surprise'] * 5
    }

    score = score / numPeople
    scores.push(score)
    times.push(i)
    score = 0
  }

  const trace = {
    x: times,
    y: scores,
    type: 'scatter'
  }

  let graphLayout = {
    title: "Plotting Your Pitch",
    xaxis: {
      title: "Time elapsed (in seconds)",
    },
    yaxis: {
      title: "Engagement Score"
    }
  }

  let graphParams = {
    layout: graphLayout,
    filename: 'basic-line',
    fileopt: 'overwrite'
  }

  plotly.plot([trace], graphParams, (err, msg) => {
    res.send(msg)
  })

  // let html = ""

  // for (i in scores) {
  //   html += `Time ${times[i] * 30} \t Score ${scores[i]} <br />`
  // }

  // res.send(html)

  /* FROM BOAS */

  // // Post data to DOM
  // let data = JSON.stringify(emotionData)
  // const pyshell = new PyShell('graph.py', { args: [data]})  

  // let result = ""

  // pyshell.on('message', (msg) => result += msg)
  // pyshell.end((err) => {
  //   if (err) {
  //     // throw err
  //     res.send(err)
  //   } else {
  //     res.send(result)
  //   }
  // })

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