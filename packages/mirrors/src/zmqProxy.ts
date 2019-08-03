import Electron, { ipcMain }  from 'electron'
import zmq from 'zeromq'
const sockSub = zmq.socket('sub')
sockSub.connect('tcp://localhost:5563')
sockSub.subscribe('')

sockSub.on('message', message => {
  message = message.toString()
  console.log('received a message:', message)
})

export const startProxy = (contents: Electron.WebContents) => {
  setInterval(() => {
    const message = {
      gyro: {
        x: Math.random(),
        y: Math.random(),
        z: Math.random(),
      },
      magnet: {
        x: Math.random(),
        y: Math.random(),
        z: Math.random(),
      },
      type: 'imu',
    }
    // console.log(message)
    contents.send('zmq', message)
  }, 1000)
}