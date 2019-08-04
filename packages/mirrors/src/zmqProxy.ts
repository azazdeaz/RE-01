import Electron from 'electron'
import zmq from 'zeromq'

const sockSub = zmq.socket('sub')
sockSub.connect('tcp://192.168.0.103:5557')
sockSub.subscribe('')



export const startProxy = (contents: Electron.WebContents) => {
  sockSub.on('message', message => {
    try {
      message = message.toString()
      const topicEnd = message.indexOf(' ')
      if (topicEnd < 0) {
        console.warn('Unknown message format')
        return
      }
      const topic = message.substring(0, topicEnd)
      const data = JSON.parse(message.substring(topicEnd + 1))
      if (topic === 'mpu') {
        contents.send('zmq', {
          type: 'mpu',
          data
        })
      }
    }
    catch (e) {
      console.error(e)
    }
  })
}