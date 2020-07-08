import React, { Component } from 'react';

export const ExecutionContext = React.createContext({
  input: "",
  output: {},
  args: {},
  updateInput: (newInput) => { },
  restoreInput: () => { },
  updateOutput: (newOutput) => { },
  updateArg: (name, newVal) => { },
  removeArg: (name) => { },
});

export class ExecutionContextProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: this.props.defaultInput || "",
      output: {},
      args: {},
    }
    this.updateInput = this.updateInput.bind(this);
    this.restoreInput = this.restoreInput.bind(this);
    this.updateOutput = this.updateOutput.bind(this);
    this.updateArg = this.updateArg.bind(this);
    this.removeArg = this.removeArg.bind(this);
  }

  updateInput(input) {
    this.setState({
      input: input
    });
  }

  restoreInput() {
    this.setState({
      input: this.props.defaultInput
    })
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
    const baseValues = {
      ...this.state,
      updateInput: this.updateInput,
      restoreInput: this.restoreInput,
      updateOutput: this.updateOutput,
      updateArg: this.updateArg,
      removeArg: this.removeArg,
    }
    return (
      <ExecutionContext.Provider
        value={{
          ...baseValues,
          ...this.props.overrideValues
        }}>
        {this.props.children}
      </ExecutionContext.Provider >
    )
  }
}
