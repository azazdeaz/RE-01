from mpu6050 import mpu6050
import json
import time

ax_mean = 0
ay_mean = 0
az_mean = 0
gx_mean = 0
gy_mean = 0
gz_mean = 0

sensor = mpu6050(0x68)

def calibrate(buff_size = 1000):
    ax_buff = 0
    ay_buff = 0
    az_buff = 0
    gx_buff = 0
    gy_buff = 0
    gz_buff = 0
    for i in range(buff_size):
        accelerometer_data = sensor.get_accel_data()
        ax_buff += accelerometer_data['x']
        ay_buff += accelerometer_data['y']
        az_buff += accelerometer_data['z']

        gyro_data = sensor.get_gyro_data()
        gx_buff += gyro_data['x']
        gy_buff += gyro_data['y']
        gz_buff += gyro_data['z']

        global ax_mean
        global ay_mean
        global az_mean
        global gx_mean
        global gy_mean
        global gz_mean
        ax_mean = ax_buff / (i + 1)
        ay_mean = ay_buff / (i + 1)
        az_mean = az_buff / (i + 1)
        gx_mean = gx_buff / (i + 1)
        gy_mean = gy_buff / (i + 1)
        gz_mean = gz_buff / (i + 1)

        print ('{:.1%} calibrating acc mean {:.5f} {:.5f} {:.5f} gyro mean {:.5f} {:.5f} {:.5f}'.format(i / buff_size, ax_mean, ay_mean, az_mean, gx_mean, gy_mean, gz_mean))
        time.sleep(0.002)
    print('done')

calibrate()

while True:
    accelerometer_data = sensor.get_accel_data()
    x = accelerometer_data['x'] - ax_mean
    y = accelerometer_data['y'] - ay_mean
    z = accelerometer_data['z'] - az_mean
    print('acc  x %.2f y %.2f z %.2f' % (x, y, z))

    gyro_data = sensor.get_gyro_data()
    x = gyro_data['x'] - gx_mean
    y = gyro_data['y'] - gy_mean
    z = gyro_data['z'] - gz_mean
    print('gyro x %.2f y %.2f z %.2f' % (x, y, z))
    time.sleep(0.5)
