import React, {FC, useCallback, useEffect, useRef, useState} from 'react'
import { Fps } from './Fps'
// @ts-ignore
const { ipcRenderer } = window.require('electron')

function binaryToDataURL(inputArray: Uint8Array) {
  const blob = new Blob([inputArray], { type: 'image/jpeg' })
  return URL.createObjectURL(blob)
}

function writeToContextWithURL(
  ctx: CanvasRenderingContext2D,
  inputArray: Uint8Array
) {
  const img = new Image()
  img.onload = () => {
    console.time('draw image')
    ctx.drawImage(img, 0, 0)
    console.timeEnd('draw image')
  }
  img.onerror = e => {
    console.log('Error during loading image:', e)
  }
  console.time('convert to url')
  img.src = binaryToDataURL(inputArray)
  console.timeEnd('convert to url')
}

export const Monitor: FC = () => {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)
  const fpsFef = useRef(null)
  const ref = useCallback((node: HTMLCanvasElement | null) => {
    console.log({ node })
    if (node !== null) {
      setCanvas(node)
    }
  }, [])
  useEffect(() => {
    ipcRenderer.on('zmq-camera', (_: any, event: Uint8Array) => {
      if (canvas) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          writeToContextWithURL(ctx, event)
          // putImageBitmapData(ctx, event)
          // @ts-ignore
          fpsFef.current.tick()
          // writeUrlToContext(ctx, event)
        }
      }
    })
  }, [canvas])
  return (
    <>
      <canvas width={640} height={480} ref={ref} />
      <Fps ref={fpsFef} />
    </>
  )
}
