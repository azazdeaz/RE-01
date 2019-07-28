import zmq from 'zeromq'
const sockSub = zmq.socket('sub')
sockSub.connect('tcp://192.168.0.103:5557')
sockSub.subscribe('')
const sockReq = zmq.socket('req')
sockReq.connect('tcp://192.168.0.103:5556')
console.log('listening...')

const SEC = 1000

const send = (msg: string) => {
  console.log(msg)
  sockReq.send(msg)
}

const { react, sense } = (() => {
  const AUTO_MAX_SPEED = 0.6
  let stuckSince: null | number = null
  let obstacleDangerLevel = 0

  const sense = (topic: string, data: any) => {
    if (topic === 'obstacle') {
      const { distance } = data
      obstacleDangerLevel = Math.min(1, Math.max(0, distance * -100 + 4))
    } else if (topic === 'mpu') {
      const { ax, ay, az } = data
      console.log({ ax, ay, az } )
      if (Math.abs(ax) < 0.2 && Math.abs(ay) < 0.2 && Math.abs(az) < 0.2) {
        if (!stuckSince) {
          stuckSince = Date.now()
        }
      }
      else {
        stuckSince = null
      }
    }
  }

  const react = () => {
    let speedLeft = 0
    let speedRight = 0
    console.log('>>>', stuckSince && Date.now() - stuckSince,  3 * SEC)
    if (stuckSince && Date.now() - stuckSince > 3 * SEC) {
      speedLeft = -AUTO_MAX_SPEED
      speedRight = -AUTO_MAX_SPEED
    }
    else if (obstacleDangerLevel > 0) {
      speedLeft = AUTO_MAX_SPEED * -obstacleDangerLevel
      speedRight = AUTO_MAX_SPEED
    }
    else {
      speedLeft = AUTO_MAX_SPEED
      speedRight = AUTO_MAX_SPEED
    }
    send(`motor speed ${speedLeft} ${speedRight}`)
  }

  return { sense, react }
})()

sockSub.on('message', function(message) {
  message = message.toString()
  // console.log('received a message:', message)
  const topicEnd = message.indexOf(' ')
  if (topicEnd < 0) {
    console.warn('Unknown message format')
    return
  }
  const topic = message.substring(0, topicEnd)
  const data = JSON.parse(message.substring(topicEnd + 1))
  sense(topic, data)
})

setInterval(() => react(), 100)
