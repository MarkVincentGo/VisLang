import React, { useState, useEffect, useRef } from 'react';
import './App.css';

import { Editor } from './Editor';
import { Console } from './Console'
import Interpreter from './interpreter'
import { dragResizeX } from './utilityFunctions'


function App(): JSX.Element {
  const [consoleText, setConsoleText] = useState<string[]>([]);
  const [consoleWidth, setConsoleWidth] = useState<number>(0);
  const resizer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let resizeEl = resizer.current;
    if (resizeEl && window.innerWidth > 1200) {
      dragResizeX(resizeEl, changeWidth)
    }
  }, [])
  
  const showOutputToConsole = (data: any):void => {
    setConsoleText(Interpreter(data))
  }

  const changeWidth = (pixels: number) => {
    setConsoleWidth(pixels)
  }



  return (
    <div>
      <div className="top">My Lang</div>
      <div className="App">
        <Editor interpret={showOutputToConsole} width={consoleWidth}/>
        <div ref={resizer} className="resizer" />
        <Console output={consoleText} width={consoleWidth}/>
      </div>
    </div>
  );
}

export default App;
