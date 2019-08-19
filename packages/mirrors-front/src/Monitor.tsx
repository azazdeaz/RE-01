import jpegasm from 'jpeg-asm'
import React, {FC, useCallback, useEffect, useRef, useState} from 'react'
import { Fps } from './Fps'
// @ts-ignore
const { ipcRenderer } = window.require('electron')

function binaryToDataURL(inputArray: Uint8Array) {
  const blob = new Blob([inputArray], { type: 'image/jpeg' })
  return URL.createObjectURL(blob)
}

// function binaryToDataURL(inputArray: Uint8Array) {
//   // @ts-ignore
//   const base64 = btoa(Array.from(inputArray).map(String.fromCharCode))
//   const uri = 'data:image/jpeg;base64,' + base64
//   return uri
// }

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

function writeUrlToContext(ctx: CanvasRenderingContext2D, url: string) {
  const img = new Image()
  img.onload = () => {
    console.time('draw image')
    ctx.drawImage(img, 0, 0)
    console.timeEnd('draw image')
  }
  img.onerror = e => {
    console.log('Error during loading image:', e)
  }
  img.src = url
}

function putImageData(ctx: CanvasRenderingContext2D, inputArray: Uint8Array) {
  console.time('convert to url')
  const jpeg = jpegasm.decode(inputArray)
  console.timeEnd('convert to url')

  console.time('add alpha channel')
  var imageData = ctx.getImageData(0, 0, jpeg.width, jpeg.height)
  var imageBytes = imageData.data
  var bufferView = new Uint8Array(jpeg.buffer)
  for (var i = 0, j = 0, size = jpeg.width * jpeg.height * 4; i < size; ) {
    imageBytes[i++] = bufferView[j++] // R
    imageBytes[i++] = bufferView[j++] // G
    imageBytes[i++] = bufferView[j++] // B
    imageBytes[i++] = 0xff // A
  }
  console.timeEnd('add alpha channel')

  console.time('draw image')
  console.log(jpeg)
  // const imageData = new ImageData(
  //   new Uint8ClampedArray(jpeg.buffer),
  //   jpeg.width,
  //   jpeg.height
  // )
  ctx.putImageData(imageData, 0, 0)
  console.timeEnd('draw image')
}

function putImageBitmapData(ctx: CanvasRenderingContext2D, inputArray: Uint8Array) {

  console.time('add alpha channel')
  const imageData = ctx.getImageData(0, 0, 640, 480)
  const imageBytes = imageData.data
  const bufferView = inputArray
  for (let i = 0, j = 0, size = 640*480 * 4; i < size; ) {
    imageBytes[i++] = bufferView[j++] // R
    imageBytes[i++] = bufferView[j++] // G
    imageBytes[i++] = bufferView[j++] // B
    imageBytes[i++] = 0xff // A
  }
  console.timeEnd('add alpha channel')

  console.time('draw image')
  // const imageData = new ImageData(
  //   new Uint8ClampedArray(jpeg.buffer),
  //   jpeg.width,
  //   jpeg.height
  // )
  ctx.putImageData(imageData, 0, 0)
  console.timeEnd('draw image')
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
