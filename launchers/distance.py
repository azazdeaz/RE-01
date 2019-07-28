from time import sleep
from gpiozero import DistanceSensor
import json

def run(publish):
    sensor = DistanceSensor(echo=20, trigger=21, max_distance=10)
    while True:
        print('Value: ', sensor.value)
        print('Distance: ', sensor.distance, ' / ', sensor.max_distance)
        publish('obstacle', { 'distance': sensor.value })
        sleep(0.1)
