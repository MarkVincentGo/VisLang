import React from 'react';
import './App.css';

import { Editor } from './Editor';
import { Console } from './Console'


function App(): JSX.Element {
  return (
    <div className="App">
      <Editor />
      <Console />
    </div>
  );
}

export default App;
