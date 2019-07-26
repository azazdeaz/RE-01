import zmq from 'zeromq'
const sockSub = zmq.socket('sub')
sockSub.connect('tcp://192.168.0.103:5557')
sockSub.subscribe('')
const sockReq = zmq.socket('req')
sockReq.connect('tcp://192.168.0.103:5556')
console.log('listening...')

sockSub.on('message', function(message) {
    console.log('received a message related to:', message.toString(), 'containing message:', message);
    const [topic, value] = message.toString().split(' ')
    if (topic === 'obstacle') {
        const distance = parseFloat(value)
        if (distance > 0.12) {
            sockReq.send('motor speed 0.5 0.5')
        }
        else {
            sockReq.send('motor speed 0 0')
        }
    }
});