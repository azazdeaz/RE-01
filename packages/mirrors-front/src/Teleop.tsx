import nipplejs from 'nipplejs'
import React, { FC, useCallback, useState } from 'react'

// @ts-ignore
const { ipcRenderer } = window.require('electron')

const styleZone = {
  backgroundColor: 'rgba(33,33,33,0.3)',
  height: 200,
  position: 'relative' as 'relative',
  width: 200,
  fontWeight: 'bold' as 'bold'
}

const cut = (value: number) => Math.max(-1, Math.min(1, value))

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
        let left = 0
        let right = 0

        // turn left
        if (radian < sideTeshold || radian > Math.PI * 2 - sideTeshold) {
          left = force
          right = -force
        }
        // turn right
        else if (
          radian > Math.PI - sideTeshold &&
          radian < Math.PI + sideTeshold
        ) {
          left = -force
          right = force
        } else {
          const flip = radian > Math.PI
          left = (Math.sin(radian + Math.PI / 2) + 1)
          right = (Math.cos(radian + Math.PI) + 1)
          if (flip) {
            const buffLeft = left
            left = -right
            right = -buffLeft
          }
        }
        left = cut(left)
        right = cut(right)
        setSpeed([left, right])
        update(left, right)
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
