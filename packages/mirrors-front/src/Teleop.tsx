import nipplejs from 'nipplejs'
import React, { FC, useCallback, useState } from 'react'

// @ts-ignore
const { ipcRenderer } = window.require('electron')

const styleZone = {
  backgroundColor: '#333333',
  height: 200,
  position: 'relative' as 'relative',
  width: 200,
}

export const Teleop: FC = () => {
  const [speed, setSpeed] = useState([0, 0])
  const ref = useCallback(node => {
    if (node) {
      const manager = nipplejs.create({
        color: 'blue',
        zone: node,
      })

      const update = (left: number, right: number) => {
        ipcRenderer.send('asynchronous-message', {
          command: 'speed',
          domain: 'motor',
          left,
          right
        })
        setSpeed([left, right])
      }

      manager.on('move', (_, data) => {
        const radian = data.angle.radian
        const force = Math.min(1, data.force)
        const sideTeshold = Math.PI / 12

        // turn left
        if (radian < sideTeshold || radian > Math.PI * 2 - sideTeshold) {
          setSpeed([force, -force])
        }
        // turn right
        else if (
          radian > Math.PI - sideTeshold &&
          radian < Math.PI + sideTeshold
        ) {
          setSpeed([-force, force])
        } else {
          const flip = radian > Math.PI
          let left = (Math.sin(radian + Math.PI / 2) + 1) / 2
          let right = (Math.cos(radian + Math.PI) + 1) / 2
          if (flip) {
            const buffLeft = left
            left = -right
            right = -buffLeft
          }
          update(left, right)
        }
      })

      manager.on('end', () => update(0, 0))
    }
  }, [])
  return (
    <div ref={ref} style={styleZone}>
      <div>L {speed[0]}</div>
      <div>R {speed[1]}</div>
    </div>
  )
}
