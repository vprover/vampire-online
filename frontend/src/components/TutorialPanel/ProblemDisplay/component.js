import React from 'react';
import ExecutionBar from '../../ExecutionBar/component';
import { ExecutionContextProvider, ExecutionContext } from '../../../contexts/ExecutionContext';
import Editor from './Editor';


const ProblemDisplay = (props) => {
  const mainExecCtx = React.useContext(ExecutionContext);
  let [argsStr, ...problem] = props.value.split("\n");
  let args = {};

  if (argsStr.startsWith("--")) {
    const splitted = argsStr.match(/\w+ \w+/g);
    try {
      splitted.forEach(element => {
        let name, value;
        [name, value] = element.split(" ");
        args[name] = value;
      });
    }
    finally {
      problem = problem.join("\n");
    }
  }
  else {
    problem.unshift(argsStr);
    problem = problem.join("\n");
  }

  return (
    <div style={{ paddingLeft: "0.5rem", paddingRight: "0.5rem" }}>
      <ExecutionContextProvider
        overrideValues={{
          output: mainExecCtx.output,
          updateOutput: mainExecCtx.updateOutput
        }}
        defaultInput={props.defaultInput || problem}
        defaultArgs={props.defaultArgs || args }
      >
        <ExecutionBar tutorial style={{ margin: "0.1rem" }} />
        <Editor input disableParsingErrors={props.disableParsingErrors} />
      </ExecutionContextProvider>
    </div>
  )
}

export default ProblemDisplay;
