import zmq
import random
import sys
import time
from gpiozero import LED, Robot

robot = Robot(left=(19, 13), right=(18, 12))
led = LED(26)

port = "5556"
context = zmq.Context()
socket = context.socket(zmq.REP)
socket.bind("tcp://*:%s" % port)


while True:
    #  Wait for next request from client
    message = socket.recv()
    print("Received request: ", message)
    domain, command, *args = message.split()
    print(domain, command)
    if domain  == 'led'.encode('UTF-8'):
        print('LED')
        if command == 'on'.encode('UTF-8'):
            print('ON')
            led.on()
        elif command == 'off'.encode('UTF-8'):
            print('OFF')
            led.off()
    elif domain  == 'motor'.encode('UTF-8'):
        print('MOTOR')
        if command == 'speed'.encode('UTF-8'):
            robot.value = (float(args[0]), float(args[1]))
    socket.send(("World from %s" % port).encode('ascii'))