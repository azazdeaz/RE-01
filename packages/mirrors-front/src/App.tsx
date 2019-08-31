import React from 'react'
import { TestChart } from './TestChart'
import { Teleop } from './Teleop'
import { Monitor } from './Monitor'
import { Simulation } from './Simulation'

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
}

const App: React.FC = () => {
  return (
    <div style={containerStyle}>
      {/*<TestChart />*/}
      {/*<Teleop />*/}
      <Monitor />
      <Simulation width={500} height={350} />
    </div>
  )
}

export default App
