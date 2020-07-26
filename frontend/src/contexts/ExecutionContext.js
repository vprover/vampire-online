import React, { Component } from 'react';
import axios from 'axios';
import socketIOClient from 'socket.io-client';
import { withSnackbar } from 'notistack';

export const ExecutionContext = React.createContext({
  input: "",
  output: {},
  args: {},
  vampireVersion: "_latest",
  solverSocket: undefined,
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

class ExecutionContextProvider extends Component {

  constructor(props, context) {
    super(props);
    this.state = {
      input: props.defaultInput || "",
      output: {},
      args: props.defaultArgs || {},
      vampireVersion: "_latest",
      solverSocket: undefined,
      options: {
        withSections: [],
        asArray: [],
        uiRestricted: ["time_limit", "input_syntax"],
      },
    }
    this.initSolverSocket = this.initSolverSocket.bind(this);
    this.updateInput = this.updateInput.bind(this);
    this.restoreDefaults = this.restoreDefaults.bind(this);
    this.updateOutput = this.updateOutput.bind(this);
    this.updateArg = this.updateArg.bind(this);
    this.removeArg = this.removeArg.bind(this);
    this.clearArgs = this.clearArgs.bind(this);
  }

  initSolverSocket() {
    const socket = socketIOClient(process.env.REACT_APP_API_HOST, {
      path: '/solver',
      query: {
        token: sessionStorage.getItem('token') || process.env.REACT_APP_API_DEFAULT_TOKEN,
      }
    });

    this.setState({ solverSocket: socket });

    const snackbarOptions = {
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'center',
      },
      variant: 'error',
      persist: true,
      preventDuplicate: true,
    }

    socket.on('disconnect', () => {
      this.props.enqueueSnackbar(`The server is down! Come back later.`, snackbarOptions);
    });

    socket.on('connect_error', (error) => {
      this.props.enqueueSnackbar(`The server is down! Come back later.`, snackbarOptions);
    });

    socket.on('error', error => console.log(`Error ${error}`));
    socket.on('solve_error', error => console.log(`Solve error ${error}`));

    socket.on('started_solving', () => {
        this.updateOutput({ rawOutput: "" });
    });

    socket.on('stopped_solving', data => {
      const { code } = data;
      if (socket.runner) socket.runner.setState({ running: false, runningPortfolio: false });
      if (code === 0) {
        this.props.enqueueSnackbar("Problem solved", { variant: "success" });
      }
      else {
        if (code === 3) {
          // Stopped by user
          this.props.enqueueSnackbar("Execution stopped", { variant: "warning" });
        }
        else {
          const args = socket.runner ? socket.runner.args : {};
          const { output } = this.state;
          if (output.error) {
            if (Object.keys(output.error).length === 0) {
              this.props.enqueueSnackbar("No solution was found", { variant: "warning" });
              if (args["mode"] && args["mode"] === "portfolio" && args["time_limit"] >= 30) {
                socket.runner.setState({ dialogOpen: true });
              }
            }
            else {
              switch (output.error.type) {
                case "parse_error":
                  this.props.enqueueSnackbar("Could not solve due to parsing error", { variant: "error" });
                  break;
                case "user_error":
                  const hideTime = 1000 / 2.6 * output.error.text.split(/[\s_:]/).length;
                  this.props.enqueueSnackbar(<>Could not solve due to user error<br />{output.error.text}</>, { variant: "error", autoHideDuration: hideTime });
                  break;
                default:
                  break;
              }
            }
            if (output.info) {
              const hideTime = 1000 / 2.6 * output.info.split(/[\s_:]/).length;
              this.props.enqueueSnackbar(output.info, { variant: "info", autoHideDuration: hideTime });
            }
          }
        }
      }
      socket.runner = undefined;
    });

    socket.on('output', data => {
      this.updateOutput(data);
    });
  }

  componentDidMount() {
    if (this.props.token) sessionStorage.setItem('token', this.props.token);

    if (!(this.props.overrideValues && this.props.overrideValues.solverSocket)) this.initSolverSocket();

    axios.interceptors.request.use(config => {
      config.headers.Authorization = `Bearer ${this.props.token || process.env.REACT_APP_API_DEFAULT_TOKEN}`;
      return config;
    })

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

const WrappedComponent = withSnackbar(ExecutionContextProvider);
export { WrappedComponent as ExecutionContextProvider }