import cv2
from apriltags3 import Detector

img = cv2.imread('./test/test_image_multiple_01.png', cv2.IMREAD_GRAYSCALE)
at_detector = Detector(searchpath=['apriltags/lib', 'apriltags/lib64'],
                       families='tag36h11',
                       nthreads=1,
                       quad_decimate=1.0,
                       quad_sigma=0.0,
                       refine_edges=1,
                       decode_sharpening=0.25,
                       debug=1)
tags = at_detector.detect(img)
print(tags)
