import zmq
import random
import sys
import time

port = "5556"
context = zmq.Context()
socket = context.socket(zmq.PAIR)
socket.bind("tcp://192.168.0.103:%s" % port)

while True:
    socket.send("Server message to client3".encode("ascii"))
    msg = socket.recv()
    print(msg)
    time.sleep(1)