from mpu6050 import mpu6050
import json
import time

sensor = mpu6050(0x68)

def calibrate(buff_size = 1000):
    ax_mean = 0
    ay_mean = 0
    az_mean = 0
    gx_mean = 0
    gy_mean = 0
    gz_mean = 0

    ax_buff = 0
    ay_buff = 0
    az_buff = 0
    gx_buff = 0
    gy_buff = 0
    gz_buff = 0
    for i in range(buff_size):
        try:
            accelerometer_data = sensor.get_accel_data()
            ax_buff += accelerometer_data['x']
            ay_buff += accelerometer_data['y']
            az_buff += accelerometer_data['z']

            gyro_data = sensor.get_gyro_data()
            gx_buff += gyro_data['x']
            gy_buff += gyro_data['y']
            gz_buff += gyro_data['z']

            ax_mean = ax_buff / (i + 1)
            ay_mean = ay_buff / (i + 1)
            az_mean = az_buff / (i + 1)
            gx_mean = gx_buff / (i + 1)
            gy_mean = gy_buff / (i + 1)
            gz_mean = gz_buff / (i + 1)

            print ('{:.1%} calibrating acc mean {:.5f} {:.5f} {:.5f} gyro mean {:.5f} {:.5f} {:.5f}'.format(i / buff_size, ax_mean, ay_mean, az_mean, gx_mean, gy_mean, gz_mean))
            time.sleep(0.002)
        except OSError as e:
            # TODO fix average calculation on errors
            print(str(e))

    calibration = {
        'ax_mean': ax_mean,
        'ay_mean': ay_mean,
        'az_mean': az_mean,
        'gx_mean': gx_mean,
        'gy_mean': gy_mean,
        'gz_mean': gz_mean
    }
    print('done', json.dumps(calibration))
    return calibration

ZERO_CALIBRATION = {
    'ax_mean': 0.0,
    'ay_mean': 0.0,
    'az_mean': 0.0,
    'gx_mean': 0.0,
    'gy_mean': 0.0,
    'gz_mean': 0.0
}

def run(publish, calibration=None):
    if calibration is None:
        calibration = ZERO_CALIBRATION
    while True:
        try:
            accelerometer_data = sensor.get_accel_data()
            ax = accelerometer_data['x'] - calibration['ax_mean']
            ay = accelerometer_data['y'] - calibration['ay_mean']
            az = accelerometer_data['z'] - calibration['az_mean']

            gyro_data = sensor.get_gyro_data()
            gx = gyro_data['x'] - calibration['gx_mean']
            gy = gyro_data['y'] - calibration['gy_mean']
            gz = gyro_data['z'] - calibration['gz_mean']
            print('read done')
            time.sleep(0.05)
            publish('mpu', {
                'ax': ax,
                'ay': ay,
                'az': az,
                'gx': gx,
                'gy': gy,
                'gz': gz
            })
        except OSError as e:
            print(str(e))
