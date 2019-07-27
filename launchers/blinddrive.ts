import zmq from 'zeromq'
const sockSub = zmq.socket('sub')
sockSub.connect('tcp://192.168.0.103:5557')
sockSub.subscribe('')
const sockReq = zmq.socket('req')
sockReq.connect('tcp://192.168.0.103:5556')
console.log('listening...')

const send = (msg: string) => {
    console.log(msg)
    sockReq.send(msg)
}

sockSub.on('message', function(message) {
    console.log('received a message:', message.toString());
    const [topic, value] = message.toString().split(' ')
    if (topic === 'obstacle') {
        const distance = parseFloat(value)
        let left = 0.6
        let right = 0.6
        if (distance < 0.4) {
            // slow down the right wheel as the obstacle getting closer
            right *= Math.max(0, distance - 0.3) * 10
        }
        send(`motor speed ${left} ${right}`)
    }
});