import { Line } from '@nivo/line'
import * as time from 'd3-time'
import { timeFormat } from 'd3-time-format'
import { sumBy } from 'lodash'
import React, { FC, useEffect, useState } from 'react'
import { Observable } from 'rxjs'
import {bufferTime, map, scan} from 'rxjs/operators'

// @ts-ignore
const { ipcRenderer } = window.require('electron')

interface IImuData {
  ax: number
  ay: number
  az: number
  gx: number
  gy: number
  gz: number
}

interface IImuDataTime {
  ax: number[]
  ay: number[]
  az: number[]
  gx: number[]
  gy: number[]
  gz: number[]
  time: Date[]
}

const observable = new Observable<IImuData>(subscriber => {
  ipcRenderer.on('zmq', (_: any, event: { type: string; data: any }) => {
    if (event.type === 'mpu') {
      console.log(event)
      subscriber.next(event.data as IImuData)
    }
  })
}).pipe(
  bufferTime(250),
  map(values => ({
    ax: sumBy(values, 'ax'),
    ay: sumBy(values, 'ay'),
    az: sumBy(values, 'az'),
    gx: sumBy(values, 'gx'),
    gy: sumBy(values, 'gy'),
    gz: sumBy(values, 'gz'),
  })),
  scan<IImuData, IImuDataTime>(
    (acc, value) => {
      return {
        ax: [...acc.ax.slice(-100), value.ax],
        ay: [...acc.ay.slice(-100), value.ay],
        az: [...acc.az.slice(-100), value.az],
        gx: [...acc.gx.slice(-100), value.gx],
        gy: [...acc.gy.slice(-100), value.gy],
        gz: [...acc.gz.slice(-100), value.gz],
        time: [...acc.time.slice(-100), new Date()],
      }
    },
    {
      ax: [],
      ay: [],
      az: [],
      gx: [],
      gy: [],
      gz: [],
      time: [],
    }
  )
)

const date = new Date()

date.setMinutes(0)
date.setSeconds(0)
date.setMilliseconds(0)

const toXY = (xValues: Date[], yValues: number[]) => {
  return xValues.map((x, i) => ({ x, y: yValues[i] }))
}

const commonProperties = {
  animate: true,
  enableSlices: 'x',
  height: 400,
  margin: { top: 20, right: 20, bottom: 60, left: 80 },
  width: 900,
}

const TIME_FORMAT = '%M:%s:%L'
const formatTime = timeFormat(TIME_FORMAT)

const renderData = (data: Array<{id: string, data: Array<{x: Date, y: number}>}>) => {
  return (
    <Line
      {...commonProperties}
      margin={{ top: 30, right: 50, bottom: 60, left: 50 }}
      data={data}
      xScale={{ type: 'time', format: 'native' }}
      yScale={{ type: 'linear', max: 1, min: -1 }}
      axisTop={{
        format: '%M:%s:%L',
        tickValues: 'every 4 hours',
      }}
      axisBottom={{
        format: '%M:%s:%L',
        legendOffset: 46,
        legendPosition: 'middle',
        tickValues: 'every 4 hours',
      }}
      axisRight={{}}
      enablePoints={false}
      enableGridX={true}
      curve="monotoneX"
      animate={false}
      motionStiffness={120}
      motionDamping={50}
      isInteractive={false}
      enableSlices={false}
      useMesh={true}
      theme={{
        axis: { ticks: { text: { fontSize: 14 } } },
        grid: { line: { stroke: '#ddd', strokeDasharray: '1 2' } },
      }}
    />
  )
}

export const TestChart: FC = () => {
  const [data, setData] = useState<IImuDataTime>({
    ax: [],
    ay: [],
    az: [],
    gx: [],
    gy: [],
    gz: [],
    time: [],
  })
  useEffect(() => {
    const subscription = observable.subscribe({
      next: x => setData(x),
      error(err) {
        console.error('something wrong occurred: ' + err)
      },
    })
    return () => subscription.unsubscribe()
  }, [])

  return (
    <>
      {renderData([
        { id: 'ax', data: toXY(data.time, data.ax) },
        { id: 'ay', data: toXY(data.time, data.ay) },
        { id: 'az', data: toXY(data.time, data.az) },
      ])}
      {renderData([
        { id: 'gx', data: toXY(data.time, data.gx) },
        { id: 'gy', data: toXY(data.time, data.gy) },
        { id: 'gz', data: toXY(data.time, data.gz) },
      ])}
    </>
  )
}
