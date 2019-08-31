import zmq from 'zeromq'
const sock = zmq.socket('req');
import delay from 'delay'

sock.connect('tcp://192.168.50.111:5556');
// sock.subscribe('kitty cats');
console.log('Subscriber connected to port 5556');

async function blink() {
    let i = 0
    while (++i) {
        const msg = `led ${i % 2 === 0 ? 'on' : 'off'}`
        sock.send(msg)
        console.log(msg)
        await delay(500)
    }
}
blink()
sock.on('message', function(topic, message) {
    console.log('received a message related to:', topic.toString(), 'containing message:', message);
});