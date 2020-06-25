import React, { useState } from 'react';
import './App.css';

import { Editor } from './Editor';
import { Console } from './Console'


function App(): JSX.Element {
  const [consoleText, setConsoleText] = useState<string[]>([]);

  const showOutputToConsole = (text: string):void => {
    let newConsoleText = [...consoleText, text];
    setConsoleText(newConsoleText)
  }

  return (
    <div className="App">
      <Editor printToConsole={showOutputToConsole}/>
      <Console output={consoleText}/>
    </div>
  );
}

export default App;
