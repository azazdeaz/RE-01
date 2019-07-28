import React from 'react';
import './App.css';

import { Button, Intent, Spinner } from "@blueprintjs/core";


const App: React.FC = () => {
  return (
    <div className="App bp3-dark">
      <header className="App-header">
        <Spinner intent={Intent.PRIMARY} />
        <Button text='hihihi' minimal />
      </header>
    </div>
  );
}

export default App;
