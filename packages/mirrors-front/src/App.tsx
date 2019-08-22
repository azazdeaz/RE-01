import React from 'react'
import { TestChart } from './TestChart'
import { Teleop } from './Teleop'
import { Monitor } from './Monitor'
import { Simulation } from './Simulation'

const App: React.FC = () => {
  return (
    <div className="App bp3-dark">
      <header className="App-header">
        {/*<TestChart />*/}
        <Teleop />
        {/*<Monitor />*/}
        <Simulation width={500} height={350}/>
      </header>
    </div>
  )
}

export default App
