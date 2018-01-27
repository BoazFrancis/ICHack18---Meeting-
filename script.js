let video = document.getElementById('video')

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia( { video: true })
        .then((stream) => {
          video.src = window.URL.createObjectURL(stream)
          video.play()
        })
}

setInterval(() => {
  let canvas = document.createElement("canvas")
  canvas.width = 640
  canvas.height = 480

  let context = canvas.getContext('2d')
  context.drawImage(video, 0, 0, 640, 480)

  let link = document.createElement("a")

  link.href = canvas.toDataURL()
  link.download = new Date().valueOf() + '.png'
  link.click()

  
}, 30000)