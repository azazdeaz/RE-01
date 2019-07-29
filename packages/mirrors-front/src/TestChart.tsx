import * as d3 from 'd3'
import * as Plottable from 'plottable'
import React, { FC, useCallback } from 'react'

type Data = {
  x: number
  y: number
}

function makeBasicChart(el: HTMLElement) {
  const xScale = new Plottable.Scales.Linear()
  const yScale = new Plottable.Scales.Linear()

  const xAxis = new Plottable.Axes.Numeric(xScale, 'bottom')
  const yAxis = new Plottable.Axes.Numeric(yScale, 'left')

  const plot = new Plottable.Plots.Line<Data>()
  // @ts-ignore
  plot.x(d => d.x, xScale)
  plot.y(d => d.y, yScale)

  const data: Data[] = [{ x: 0, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 4 }, { x: 3, y: 8 }]

  const dataset = new Plottable.Dataset(data)
  plot.addDataset(dataset)

  const chart = new Plottable.Components.Table([[yAxis, plot], [null, xAxis]])

  chart.renderTo(d3.select(el))
  setTimeout(() => chart.redraw(), 1000)
}

export const TestChart: FC = () => {
  const ref = useCallback(node => {
    makeBasicChart(node)
  }, [])
  return <div ref={ref} style={{ width: 400, height: 300 }}/>
}
