import React, {
  CSSProperties,
  FC,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

const SEC = 1000

const style = {
  backgroundColor: `rgba(0,0,0,0.5)`,
  width: 80,
}

interface IProps {
  style?: CSSProperties
}

const FpsComponent: FC<IProps> = (props, parentRef) => {
  const [fps, setFps] = useState(0)
  const ref = useRef({ ticks: [] as number[] })
  useImperativeHandle(
    parentRef,
    () => {
      return {
        tick: () => {
          const ticks = ref.current.ticks
          const time = performance.now()
          const secStart = time - SEC
          // keep the tick from the last sec (plus one to calc the fraction fps)
          while (ticks.length > 1 && ticks[1] < secStart) {
            ticks.shift()
          }
          ticks.push(time)
          const fraction = ticks[0] < secStart
            ? (ticks[1] - secStart) / (ticks[1] - ticks[0])
            : 0
          const fullFrames = ticks.length - 1
          setFps(fullFrames + fraction)
        },
      }
    },
    []
  )
  return (
    <div style={{...style, ...props.style}}>
      <pre>fps: {fps}</pre>
    </div>
  )
}

export const Fps = forwardRef(FpsComponent)
