import React from 'react'
import { TestChart } from './TestChart'

import { Button, Intent, Spinner } from "@blueprintjs/core";


const App: React.FC = () => {
  return (
    <div className="App bp3-dark">
      <header className="App-header">
        <Spinner intent={Intent.PRIMARY} />
        <Button text='hihihi' minimal />
        <TestChart />
      </header>
    </div>
  );
}

export default App;
