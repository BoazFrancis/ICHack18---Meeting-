# PitchPlot
--
## Inspiration
Through one of our member's experience in the corporate world, we wanted to create a solution to provide real feedback to individuals pitching to clients. This would allow the presenter and their peers to asses how their pitch was received by the clients.

## What it does
PitchPlot uses your webcam to take pictures of the clients throughout the presentation to provide a score on how engaged they were at given intervals during the pitch. It then process the data to produce a graph of the overall emotion score in the room against time. This lets users evaluate which parts of the presentation were more engaging and which require further revisions.

## How we built it
We used nodejs to connect to Microsoft's cognitive services APIs for face recognition and emotion in order to assign members of the audience a score corresponding to their engagement with the pitch. The APIs returned a json file containing all of the data which we had to parse in order to obtain the values corresponding to the individual emotions of the people captured by the webcam. A weighting was assigned to each emotion so that we could capture the positivity and negativity of the audience. Using this weighting an average score for the emotion in the room was calculated for each time interval that the webcam recorded and this data was used to construct the graph mentioned in the above section.

## What we learned
It was our first time using Microsoft's cognitive services and we found it very friendly and simple to integrate. We also got to implement many networking concepts we learned in our studies this year, which was a challenging and rewarding experience.

## What's next for PitchPlot
We would like to extend PitchPlot to support live feedback and allow synchronisation with presentation slides to increase the accuracy of our emotions data.

## Technologies
Built With
* javascript
* node.js
* express.js
* heroku
* microsoft-cognitive-services
* azure

## Contributors
A project co-developed by:
* Anson Miu
* Omar Todd
* Boaz Francis
* Moshe Shamash