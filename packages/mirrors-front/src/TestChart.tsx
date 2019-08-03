import { Line } from '@nivo/line'
import * as time from 'd3-time'
import { timeFormat } from 'd3-time-format'
import { last, range } from 'lodash'
import React, { FC, useEffect, useState } from 'react'

const date = new Date()

date.setMinutes(0)
date.setSeconds(0)
date.setMilliseconds(0)

const commonProperties = {
  animate: true,
  enableSlices: 'x',
  height: 400,
  margin: { top: 20, right: 20, bottom: 60, left: 80 },
  width: 900,
}

const getInitData = () => ({
  dataA: range(100).map(i => ({
    x: time.timeMinute.offset(date, i * 30),
    y: 10 + Math.round(Math.random() * 20),
  })),
  dataB: range(100).map(i => ({
    x: time.timeMinute.offset(date, i * 30),
    y: 30 + Math.round(Math.random() * 20),
  })),
  dataC: range(100).map(i => ({
    x: time.timeMinute.offset(date, i * 30),
    y: 60 + Math.round(Math.random() * 20),
  })),
})

const formatTime = timeFormat('%Y %b %d')

const glx = (data: Array<{ x: Date }>) => {
  const l = last(data)
  return l ? l.x : new Date()
}



export const TestChart: FC = () => {
  const [{ dataA, dataB, dataC }, setData] = useState(getInitData())
  useEffect(() => {
    const initData = getInitData()
    const da = [...initData.dataA]
    const db = [...initData.dataB]
    const dc = [...initData.dataC]
    const id = setInterval(() => {
      da.push({
        x: time.timeMinute.offset(glx(da), 30),
        y: 10 + Math.round(Math.random() * 20),
      })
      db.push({
        x: time.timeMinute.offset(glx(db), 30),
        y: 30 + Math.round(Math.random() * 20),
      })
      dc.push({
        x: time.timeMinute.offset(glx(dc), 30)
        y: 60 + Math.round(Math.random() * 20),
      })

      setData({ dataA: da, dataB: db, dataC: dc })

      return () => clearInterval(id)
    }, 100)
  }, [])
  return (
    <Line
      {...commonProperties}
      margin={{ top: 30, right: 50, bottom: 60, left: 50 }}
      data={[
        { id: 'A', data: dataA },
        { id: 'B', data: dataB },
        { id: 'C', data: dataC },
      ]}
      xScale={{ type: 'time', format: 'native' }}
      yScale={{ type: 'linear', max: 100 }}
      axisTop={{
        format: '%H:%M',
        tickValues: 'every 4 hours',
      }}
      axisBottom={{
        format: '%H:%M',
        legend: `${formatTime(dataA[0].x)} ——— ${formatTime(glx(dataA))}`,
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
