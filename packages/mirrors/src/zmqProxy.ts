import Electron, { ipcMain } from 'electron'
import zmq from 'zeromq'

const sockSub = zmq.socket('sub')
sockSub.connect('tcp://192.168.0.101:5557')
sockSub.subscribe('')

const sockReq = zmq.socket('req')
sockReq.connect('tcp://192.168.0.101:5556')

ipcMain.on('asynchronous-message', (_, arg: any) => {
  console.log('main sending', arg)
  if (arg.domain && arg.command) {
    sockReq.send(JSON.stringify(arg))
  }
})

export const startProxy = (contents: Electron.WebContents) => {
  // setInterval(() => {
  //   const message = {
  //     data: {
  //       gx: (Math.random() - 0.5) * 2,
  //       gy: (Math.random() - 0.5) * 2,
  //       gz: (Math.random() - 0.5) * 2,
  //       ax: (Math.random() - 0.5) * 2,
  //       ay: (Math.random() - 0.5) * 2,
  //       az: (Math.random() - 0.5) * 2,
  //     },
  //     type: 'mpu',
  //   }
  //   // console.log(message)
  //   contents.send('zmq', message)
  // }, 100)

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
          data,
        })
      }
    } catch (e) {
      console.error(e)
    }
  })
}
