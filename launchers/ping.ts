const zmq = require('zeromq')
const publisher = zmq.socket('pub')

publisher.bind('tcp://*:5563', (err: Error) => {
  if (err) {
    console.log(err)
  } else {
    console.log('Listening on 5563…')
  }
})

setInterval(() => {
  // if you pass an array, send() uses SENDMORE flag automatically
  publisher.send(['A', 'We do not want to see this'])
  // if you want, you can set it explicitly
  publisher.send('B', zmq.ZMQ_SNDMORE)
  publisher.send('We would like to see this')
}, 1000)
