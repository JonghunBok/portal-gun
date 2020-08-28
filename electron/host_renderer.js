const SOCK_HOST = ''
const PEER_HOST = ''
const socket = io.connect('http://' + HOST + ':3000')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
  host: PEER_HOST,
  port: '3001'
})

const ROOM_ID = '12345678'

const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  addVideoStream(myVideo, stream)

  myPeer.on('call', call => {
    call.answer(stream)
    console.log("I got a call" + stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })

  socket.on('user-connected', userId => {
    console.log(userId + " user is conneced")
    connectToNewUser(userId, stream)
  })
})

socket.on('user-disconnected', userId => { if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
  console.log('connecting user ' + userId)
  console.log(stream)
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    console.log(stream)
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    console.log("metadata is loaded")
    video.play()
  })
  videoGrid.append(video)

  console.log("adding ")
  console.log(video)
}
