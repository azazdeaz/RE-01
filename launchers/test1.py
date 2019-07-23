import zmq
import random
import sys
import time
from gpiozero import LED

led = LED(26)

port = "5556"
context = zmq.Context()
socket = context.socket(zmq.REP)
socket.bind("tcp://*:%s" % port)


while True:
    #  Wait for next request from client
    message = socket.recv()
    print("Received request: ", message)
    domain, command = message.split()
    print(domain, command)
    if domain  == 'led'.encode('UTF-8'):
        print('LED')
        if command == 'on'.encode('UTF-8'):
            print('ON')
            led.on()
        elif command == 'off'.encode('UTF-8'):
            print('OFF')
            led.off()
    socket.send(("World from %s" % port).encode('ascii'))