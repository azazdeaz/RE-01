import zmq
import random
import sys
import time

port = "5556"
context = zmq.Context()
socket = context.socket(zmq.PAIR)
socket.connect("tcp://192.168.50.111:%s" % port)

while True:
    msg = socket.recv()
    print(msg)
    socket.send("client message to server1".encode("ascii"))
    socket.send("client message to server2".encode("ascii"))
    time.sleep(1)
