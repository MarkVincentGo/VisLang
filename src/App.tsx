import React, { useState } from 'react';
import './App.css';

import { Editor } from './Editor';
import { Console } from './Console'
import Interpreter from './interpreter'


function App(): JSX.Element {
  const [consoleText, setConsoleText] = useState<string[]>([]);
  
  const showOutputToConsole = (data: any):void => {
    setConsoleText(Interpreter(data))
    // setConsoleText(['YOU CAN DO THIS'])
    // let newConsoleText = [...consoleText, text];
    // setConsoleText(newConsoleText)
  }

  return (
    <div className="App">
      <Editor interpret={showOutputToConsole}/>
      <Console output={consoleText}/>
    </div>
  );
}

export default App;
