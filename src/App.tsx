import React, { useState, useEffect, useRef } from 'react';
import './App.css';

import { Editor } from './Editor';
import { Console } from './Console'
import Interpreter from './interpreter'
import { dragResize } from './utilityFunctions'


function App(): JSX.Element {
  const [consoleText, setConsoleText] = useState<string[]>([]);
  const [consoleWidth, setConsoleWidth] = useState<number>(0);
  const resizer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let resizeEl = resizer.current;
    if (resizeEl) {
      dragResize(resizeEl, changeWidth)
    }
  }, [])
  
  const showOutputToConsole = (data: any):void => {
    setConsoleText(Interpreter(data))
  }

  const getWidth = (side: string, width: number) => {
      setConsoleWidth(width)
  }
  const changeWidth = (pixels: number) => {
    setConsoleWidth(pixels)
  }



  return (
    <div className="App">
      <Editor interpret={showOutputToConsole} getWidth={getWidth} width={consoleWidth}/>
      <div ref={resizer} className="resizer" />
      <Console output={consoleText} getWidth={getWidth} width={consoleWidth}/>
    </div>
  );
}

export default App;
