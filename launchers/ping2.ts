

import zmq from 'zeromq'
const sockSub = zmq.socket('sub')
sockSub.connect('tcp://localhost:5563')
sockSub.subscribe('')

sockSub.on('message', function(message) {
  message = message.toString()
  console.log('received a message:', message)
})
