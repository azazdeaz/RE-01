import cv2
from pupil_apriltags import Detector
import zmq
import time
import json
import numpy as np

def conver_detection_to_dict(detection):
    detection = detection.__dict__
    return {
        'tag_family': str(detection['tag_family'], 'utf-8'),
        'tag_id': detection['tag_id'],
        'hamming': detection['hamming'],
        'decision_margin': detection['decision_margin'],
        'homography': detection['homography'].tolist(),
        'center': detection['center'].tolist(),
        'corners': detection['corners'].tolist(),
        'pose_R': detection['pose_R'],
        'pose_t': detection['pose_t'],
        'pose_err': detection['pose_err'],
    }
at_detector = Detector(#searchpath=['apriltags/lib', 'apriltags/lib64'],
                       families='tag36h11',
                       nthreads=1,
                       quad_decimate=1.0,
                       quad_sigma=0.0,
                       refine_edges=1,
                       decode_sharpening=0.25,
                       debug=0)

port = "5600"
context = zmq.Context()
socket = context.socket(zmq.REP)
socket.bind("tcp://127.0.0.1:%s" % port)
print('listening')

while True:
    print("Waiting for message")
    message = socket.recv()
    print("Received request")
    # time.sleep (1)
    nparr = np.frombuffer(message, dtype=np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_GRAYSCALE)

    tags = at_detector.detect(img)
    print(tags)
    tags = [conver_detection_to_dict(detection) for detection in tags]
    print(tags)
    response = json.dumps(tags)
    print(response)
    socket.send_string(response)
    print('message sent')
