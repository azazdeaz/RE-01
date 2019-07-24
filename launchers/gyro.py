from mpu6050 import mpu6050
import json
import time

sensor = mpu6050(0x68)
while True:
    accelerometer_data = sensor.get_accel_data()
    msg = 'giro ' + json.dumps(accelerometer_data, separators=(',', ':'))
    print(msg)
    time.sleep(0.1)