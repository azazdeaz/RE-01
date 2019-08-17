import zmq
import random
import sys
import time
import json
from gpiozero import LED, Robot

robot = Robot(left=(18, 12), right=(19, 13))
led = LED(26)

port = "5556"
context = zmq.Context()
socket = context.socket(zmq.REP)
socket.bind("tcp://*:%s" % port)


def run():
    print("Waiting for commands...")
    while True:
        #  Wait for next request from client
        message = socket.recv()
        print("Received request: ", message)
        message = json.loads(message.decode('ascii'))
        domain = message['domain']
        command = message['command']
        print(domain, command)
        if domain  == 'led':
            print('LED')
            if command == 'on':
                print('ON')
                led.on()
            elif command == 'off':
                print('OFF')
                led.off()
        elif domain  == 'motor':
            print('MOTOR')
            if command == 'speed':
                print(float(message['left']), float(message['right']))
                robot.value = (float(message['left']), float(message['right']))
        socket.send(("World from %s" % port).encode('ascii'))

if __name__== "__main__":
    run()
