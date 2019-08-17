import React from 'react'
import { TestChart } from './TestChart'
import { Teleop } from './Teleop'

import { Button, Intent, Spinner } from "@blueprintjs/core";


const App: React.FC = () => {
  return (
    <div className="App bp3-dark">
      <header className="App-header">
        <TestChart />
        <Teleop />
      </header>
    </div>
  );
}

export default App;
