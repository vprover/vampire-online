import React, { Component } from 'react';

export const ExecutionContext = React.createContext({
  input: "",
  output: {},
  args: {},
  updateInput: (newInput) => { },
  updateOutput: (newOutput) => { },
  updateArg: (name, newVal) => { },
  removeArg: (name) => { },
});

export class ExecutionContextProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "",
      output: {},
      args: {},
    }
    this.updateInput = this.updateInput.bind(this);
    this.updateOutput = this.updateOutput.bind(this);
    this.updateArg = this.updateArg.bind(this);
    this.removeArg = this.removeArg.bind(this);
  }

  updateInput(input) {
    this.setState({
      input: input
    });
  }

  updateOutput(output) {
    this.setState({
      output: output
    });
  }

  updateArg(name, value) {
    this.setState(prevState => ({
      args: {
        ...prevState.args,
        [name]: value
      }
    }));
  }

  removeArg(name) {
    this.setState(prevState => {
      delete prevState.args[name];
      return prevState;
    });
  }

  render() {
    return (
      <ExecutionContext.Provider value={{
        ...this.state,
        updateInput: this.updateInput,
        updateOutput: this.updateOutput,
        updateArg: this.updateArg,
        removeArg: this.removeArg
      }}>
        {this.props.children}
      </ExecutionContext.Provider>
    )
  }
}
