import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
// @ts-ignore
const { ipcRenderer } = window.require('electron')

interface ICreateThreePartsOptions {
  canvas: HTMLCanvasElement
  width: number
  height: number
}

interface IProps {
  width: number
  height: number
}

const createThreeParts = ({
  canvas,
  width,
  height,
}: ICreateThreePartsOptions) => {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  const renderer = new THREE.WebGLRenderer({ canvas })
  return {
    scene,
    camera,
    renderer,
    canvas,
  }
}

export const Simulation: FC<IProps> = props => {
  const [threeParts, setThreeParts] = useState<ReturnType<
    typeof createThreeParts
  > | null>(null)
  const ref = useCallback((node: HTMLCanvasElement | null) => {
    if (node !== null) {
      setThreeParts(
        createThreeParts({
          canvas: node,
          width: props.width,
          height: props.height,
        })
      )
    }
  }, [])

  useEffect(() => {
    if (threeParts) {
      const { scene, camera, renderer } = threeParts
      const geometry = new THREE.BoxGeometry(1, 1, 1)
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
      const cube = new THREE.Mesh(geometry, material)
      scene.add(cube)

      camera.position.z = 5
      const animate = () => {
        requestAnimationFrame( animate );

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        renderer.render( scene, camera );
      };

      animate();
    }
    // ipcRenderer.on('zmq', (_: any, event: any) => {
    //   if (event.type === 'apriltags' && threeParts) {
    //     const ctx = threeParts.getContext('2d')
    //     if (ctx) {
    //       for (const detection of event.data) {
    //         console.log(_, event)
    //         ctx.beginPath()
    //         ctx.strokeStyle = '#00ff11'
    //         ctx.moveTo(detection.corners[3][0], detection.corners[3][1])
    //         for (const corner of detection.corners) {
    //           ctx.lineTo(corner[0], corner[1])
    //         }
    //         ctx.stroke()
    //       }
    //     }
    //   }
    // })
  }, [threeParts])
  return (
    <div style={{ position: 'relative' }}>
      <canvas width={640} height={480} ref={ref} />
    </div>
  )
}
