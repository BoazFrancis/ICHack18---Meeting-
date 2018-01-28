/* Dependencies */
const express = require('express')
const path = require('path')
const http = require('http')
const fs = require('fs')
const request = require('request')
const bodyParser = require('body-parser')

/* Global variables */
const PORT = process.env.PORT || 5050
const BASE_URL = 'https://damp-anchorage-78125.herokuapp.com'
const PLOTLY_USERNAME = 'ichack18'
const PLOTLY_PASSWORD = 'Y7wvDu5Xh9kJ2g4TL2dH'
const CAPTURE_DIR = 'public/captures/'
const EMOTION_API_URL = 'https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize'
const AZURE_KEY = 'daecb17d1425499199cefea44c3a38c4'
const EMOTION_WEIGHTS = {
  'anger': -10,
  'contempt': -10,
  'digust': -10,
  'fear': -10,
  'happy': 10,
  'surprise': 5,
  'sad': -5,
  'neutral': 0
}

let pitchData = []
let timeStamp = 0

/* Express app setup */
const app = express()

// Handle upload limits
app.use(bodyParser.json({ limit: '16mb' }))
app.use(bodyParser.urlencoded({ extended: false, limit: '16mb'}))

// Set captures folder as public for EmotionAPI to work
app.use(express.static('public'))

/* Routes */

// Default route
app.get('/', (req, res) => {
  // pitchData = []
  // timeStamp = 0
  res.sendFile(__dirname + '/index.html')
})

// Post request route: uploading webcam screenshots
app.post('/upload', (req, res) => {
  // Convert image's 'base64URL' to actual image file
  let data = req.body.img.replace(/^data:image\/png;base64,/, "")
  data += data.replace('+', ' ')
  let binaryData = new Buffer(data, 'base64').toString('binary')
  let name = CAPTURE_DIR + req.body.name
  
  // Save image file
  fs.writeFile(name, binaryData, 'binary', (err) => {
    console.log(`Error in saving: ${err}`)
  })
  
  // Submit image file to EmotionAPI
  let requestName = BASE_URL + '/captures/' + req.body.name 

  request({
    url: EMOTION_API_URL,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': AZURE_KEY
    },
    body: {
      url: requestName
    },
    json: true
  }, (err, res, data) => {

    if (err) {
      console.log(`Error in EmotionAPI: ${}`)
    }

    // Collate current emotions 
    let currEmotions = {}
    currEmotions.timeStamp = timeStamp++

    let people = []
    for (i in data) {
      people.push(data[i].scores)
    }

    currEmotions.people = people

    // Accumulate current emotion data
    pitchData.push(currEmotions)
  })
})

// Get request route: plot graph and load result
app.get('/upload', (req, res) => {
  // Initialise plot.ly
  const plotly = require('plotly')(PLOTLY_USERNAME, PLOTLY_PASSWORD)
  
  let data = pitchData

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
    times.push(i * 10)
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
})

// Express app listening on port
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))