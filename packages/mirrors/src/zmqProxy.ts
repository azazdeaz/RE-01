import { decode } from '@msgpack/msgpack'
import Electron, { ipcMain } from 'electron'
import zmq from 'zeromq'

const sockSub = zmq.socket('sub')
sockSub.connect('tcp://192.168.50.111:5557')
sockSub.subscribe('')

const sockReq = zmq.socket('req')
sockReq.connect('tcp://192.168.50.111:5556')

const cameraSub = zmq.socket('sub')
cameraSub.connect('ipc:///home/azazdeaz/mirrors')
// cameraSub.setsockopt(zmq.ZMQ_CONFLATE, 1)
cameraSub.subscribe('')


ipcMain.on('asynchronous-message', (_: any, arg: any) => {
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
  //       az: (Math.random() - 0.5) * 2
  //     },
  //     type: 'mpu',
  //   }
  //   // console.log(message)
  //   contents.send('zmq', message)
  // }, 100)

  cameraSub.on('message', async (message: Uint8Array) => {
    const {
      image,
      tags
    } = decode(message) as any
    // console.log(image, tags)
    contents.send('zmq-camera', image)
    contents.send('zmq', {
      type: 'apriltags',
      data: tags,
    })
  })

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
