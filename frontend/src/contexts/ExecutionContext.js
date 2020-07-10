import React, { Component } from 'react';
import axios from 'axios';

export const ExecutionContext = React.createContext({
  input: "",
  output: {},
  args: {},
  vampireVersion: "_latest",
  options: {
    withSections: [],
    asArray: [],
    uiRestricted: [],
  },
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
      args: this.props.defaultArgs || {},
      vampireVersion: "_latest",
      options: {
        withSections: [],
        asArray: [],
        uiRestricted: ["time_limit", "input_syntax"],
      },
    }
    this.updateInput = this.updateInput.bind(this);
    this.restoreInput = this.restoreInput.bind(this);
    this.updateOutput = this.updateOutput.bind(this);
    this.updateArg = this.updateArg.bind(this);
    this.removeArg = this.removeArg.bind(this);
    this.clearArgs = this.clearArgs.bind(this);
  }

  componentDidMount() {
    axios.get(`${process.env.REACT_APP_API_HOST}/options`, { sections: false })
      .then(res => this.setState(prevState => {
        return ({
          options: {
            ...prevState.options,
            asArray: res.data,
          }
        })
      }))
      .catch(error => {
        console.log(`Could not fetch vampire options: ${error.message}. Try again later!`);
      });
    axios.get(`${process.env.REACT_APP_API_HOST}/options`, { params: { sections: true } })
      .then(res => this.setState(prevState => {
        return ({
          options: {
            ...prevState.options,
            withSections: res.data,
          }
        })
      }))
      .catch(error => console.log(`Could not fetch vampire options: ${error.message}`));
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

  clearArgs() {
    this.setState({
      args: {}
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
