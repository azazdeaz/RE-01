import io
import time
import picamera
import zmq

port = "5560"
context = zmq.Context()
socket = context.socket(zmq.PUB)
socket.setsockopt(zmq.CONFLATE, 1)
socket.bind("tcp://*:%s" % port)

width = 640
height = 480

try:
    with picamera.PiCamera() as camera:
        camera.resolution = (width, height)
        print("camera", camera)
        # Start a preview and let the camera warm up for 2 seconds
        camera.start_preview()
        time.sleep(2)

        # Note the start time and construct a stream to hold image data
        # temporarily (we could write it directly to connection but in this
        # case we want to find out the size of each capture first to keep
        # our protocol simple)
        start = time.time()
        stream = io.BytesIO()
        for foo in camera.capture_continuous(stream, 'jpeg', use_video_port=True):
            # Write the length of the capture to the stream and flush to
            # ensure it actually gets sent
            # connection.write(struct.pack('<L', stream.tell()))
            # connection.flush()
            # Rewind the stream and send the image data over the wire
            stream.seek(0)
            socket.send(stream.read())
            print("image sent")

            # Reset the stream for the next capture
            stream.seek(0)
            stream.truncate()
    # Write a length of zero to the stream to signal we're done
    # connection.write(struct.pack('<L', 0))
except KeyboardInterrupt:
    print('interrupted!')
finally:
    print('ended')
    # connection.close()
    # client_socket.close()
