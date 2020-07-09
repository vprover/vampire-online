import React, { Component } from 'react';
import ExecutionBar from '../../ExecutionBar/component';
import { ExecutionContextProvider, ExecutionContext } from '../../../contexts/ExecutionContext';
import Editor from '../Editor';


const DemoProblemDisplay = (props) => {
  const mainExecCtx = React.useContext(ExecutionContext);
  return (
    <div style={{ paddingLeft: "0.5rem", paddingRight: "0.5rem" }}>
      <ExecutionContextProvider
        overrideValues={{
          output: mainExecCtx.output,
          updateOutput: mainExecCtx.updateOutput
        }}
        defaultInput={props.defaultInput} >
        <ExecutionBar tutorial style={{ margin: "0.1rem" }} />
        <Editor input disableParsingErrors={props.disableParsingErrors} />
      </ExecutionContextProvider>
    </div>
  )
}

export default DemoProblemDisplay;
