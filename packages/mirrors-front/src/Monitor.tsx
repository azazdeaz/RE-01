import React, {FC, useCallback, useEffect, useRef, useState} from 'react'
import { Fps } from './Fps'
// @ts-ignore
const { ipcRenderer } = window.require('electron')

function binaryToDataURL(inputArray: Uint8Array) {
  const blob = new Blob([inputArray], { type: 'image/jpeg' })
  return URL.createObjectURL(blob)
}

const styleTopLeft = {
  position: 'absolute' as 'absolute',
  top: 0,
  left: 0
}

function writeToContextWithURL(
  ctx: CanvasRenderingContext2D,
  inputArray: Uint8Array
) {
  const img = new Image()
  img.onload = () => {
    ctx.drawImage(img, 0, 0)
  }
  img.onerror = e => {
    console.log('Error during loading image:', e)
  }
  img.src = binaryToDataURL(inputArray)
}

export const Monitor: FC = () => {
  const [cvImage, setCvImage] = useState<HTMLCanvasElement | null>(null)
  const [cvApril, setCvApril] = useState<HTMLCanvasElement | null>(null)
  const fpsFef = useRef(null)
  const refImage = useCallback((node: HTMLCanvasElement | null) => {
    if (node !== null) {
      setCvImage(node)
    }
  }, [])
  const refApril = useCallback((node: HTMLCanvasElement | null) => {
    if (node !== null) {
      setCvApril(node)
    }
  }, [])
  useEffect(() => {
    ipcRenderer.on('zmq-camera', (_: any, event: Uint8Array) => {
      if (cvImage) {
        const ctx = cvImage.getContext('2d')
        if (ctx) {
          writeToContextWithURL(ctx, event)
          // putImageBitmapData(ctx, event)
          // @ts-ignore
          fpsFef.current.tick()
          // writeUrlToContext(ctx, event)
        }
      }
    })
  }, [cvImage])

  useEffect(() => {
    ipcRenderer.on('zmq', (_: any, event: any) => {
      if (event.type === 'apriltags' && cvImage) {
        const ctx = cvImage.getContext('2d')
        if (ctx) {
          for (const detection of event.data)  {
            console.log(_, event)
            ctx.beginPath();
            ctx.strokeStyle = '#00ff11'
            ctx.moveTo(detection.corners[3][0], detection.corners[3][1])
            for (const corner of detection.corners) {
              ctx.lineTo(corner[0], corner[1])
            }
            ctx.stroke()
          }
        }
      }
    })
  }, [cvImage])
  return (
    <div style={{position: 'relative'}}>
      <canvas width={640} height={480} ref={refImage} style={styleTopLeft} />
      <canvas width={640} height={480} ref={refApril} style={styleTopLeft} />
      <Fps ref={fpsFef} style={styleTopLeft} />
    </div>
  )
}
