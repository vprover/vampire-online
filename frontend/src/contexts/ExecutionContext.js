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
  updateOutput: (newOutput) => { },
  updateArg: (name, newVal) => { },
  restoreDefaults: () => { },
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
    this.restoreDefaults = this.restoreDefaults.bind(this);
    this.updateOutput = this.updateOutput.bind(this);
    this.updateArg = this.updateArg.bind(this);
    this.removeArg = this.removeArg.bind(this);
    this.clearArgs = this.clearArgs.bind(this);
  }

  componentDidMount() {
    if (this.props.token) {
      axios.interceptors.request.use(config => {
        config.headers.Authorization = `Bearer ${this.props.token}`;
        return config;
      })
    }

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

  restoreDefaults() {
    this.setState({
      input: this.props.defaultInput,
      args: this.props.defaultArgs,
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
    let newArgs = {}
    this.state.options.uiRestricted.forEach(arg => newArgs[arg] = this.state.args[arg]);
    this.setState({
      args: newArgs
    });
  }

  render() {
    const baseValues = {
      ...this.state,
      updateInput: this.updateInput,
      restoreDefaults: this.restoreDefaults,
      updateOutput: this.updateOutput,
      updateArg: this.updateArg,
      removeArg: this.removeArg,
      clearArgs: this.clearArgs,
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
