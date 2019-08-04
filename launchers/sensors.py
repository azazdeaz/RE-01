import mpu
import zmq
import distance
import json
import threading


port = "5557"
context = zmq.Context()
socket = context.socket(zmq.PUB)
socket.bind("tcp://*:%s" % port)

def publish(topic, data):
    message = "{} {}".format(topic, json.dumps(data, separators=(',', ':')))
    socket.send(message.encode("ascii"))

# threading.Thread(target=distance.run, args=(publish,)).start()
threading.Thread(target=mpu.run, args=(publish, mpu.calibrate())).start()
