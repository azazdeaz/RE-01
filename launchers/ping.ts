const zmq = require('zeromq')
const requester = zmq.socket('req')

requester.connect('tcp://localhost:5600', (err: Error) => {
  if (err) {
    console.log(err)
  } else {
    console.log('Listening on 5563…')
  }
})

let replyNbr = 0
requester.on('message', (msg: any) => {
  console.log('got reply', replyNbr, msg.toString())
  replyNbr += 1
})

setInterval(() => requester.send('Hello'), 1000)
