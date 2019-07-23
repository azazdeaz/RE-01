import zmq from 'zeromq'
const sock = zmq.socket('pair');

sock.connect('tcp://192.168.0.103:5556');
// sock.subscribe('kitty cats');
console.log('Subscriber connected to port 5556');

sock.on('message', function(topic, message) {
    console.log('received a message related to:', topic.toString(), 'containing message:', message);
});