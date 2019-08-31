import cv2
from pupil_apriltags import Detector
import zmq
import time
import json
import numpy as np
import msgpack

cameraMatrix = np.array([336.7755634193813, 0.0, 333.3575643300718, 0.0, 336.02729840829176, 212.77376312080065, 0.0, 0.0, 1.0]).reshape((3,3))
camera_params = ( cameraMatrix[0,0], cameraMatrix[1,1], cameraMatrix[0,2], cameraMatrix[1,2])

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
        'pose_R': detection['pose_R'].tolist(),
        'pose_t': detection['pose_t'].tolist(),
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

# img = cv2.imread('test_image_multiple_01.png', cv2.IMREAD_GRAYSCALE)
# tags = at_detector.detect(img, estimate_tag_pose=True, camera_params=camera_params, tag_size=0.08)
# print(tags)
# tags = [conver_detection_to_dict(detection) for detection in tags]
# print(tags)

context = zmq.Context()
sockImage = context.socket(zmq.SUB)
sockImage.connect('tcp://192.168.50.111:5560')
sockImage.setsockopt(zmq.RCVHWM, 1)
sockImage.subscribe('')

sockPublish = context.socket(zmq.PUB)
sockPublish.bind('ipc:///home/azazdeaz/mirrors');
sockPublish.setsockopt(zmq.CONFLATE, 1)


while True:
    print("Waiting for message")
    message = sockImage.recv()
    # time.sleep (1)
    nparr = np.frombuffer(message, dtype=np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_GRAYSCALE)

    tags = at_detector.detect(img, estimate_tag_pose=True, camera_params=camera_params, tag_size=0.08)
    tags = [conver_detection_to_dict(detection) for detection in tags]
    response = msgpack.packb({
        'tags': tags,
        'image': message
    }, use_bin_type=True)
    sockPublish.send(response)
    print('message sent')
