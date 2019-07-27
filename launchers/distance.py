import zmq
from gpiozero import DistanceSensor
from time import sleep

port = "5557"
context = zmq.Context()
socket = context.socket(zmq.PUB)
socket.bind("tcp://*:%s" % port)

sensor = DistanceSensor(echo=20, trigger=21, max_distance=10)
while True:
    print('Value: ', sensor.value)
    print('Distance: ', sensor.distance, ' / ', sensor.max_distance)
    socket.send(('obstacle %f' % sensor.distance).encode('ascii'))
    sleep(0.1)