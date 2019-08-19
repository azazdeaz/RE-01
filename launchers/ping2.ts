

import zmq from 'zeromq'
const sockSub = zmq.socket('sub')
sockSub.connect('tcp://192.168.0.101:5560')
sockSub.subscribe('')
import fs from 'fs'

sockSub.on('message', function(message) {
  console.log('received a message:', message)
  fs.writeFile("test.jpg", message, function(err) {
    if (err) {
      return console.log(err);
    }

    console.log("The file was saved!");
    process.exit()
  })
})
