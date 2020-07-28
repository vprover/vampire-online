import React, { Component } from 'react'
import { ExecutionContext } from '../../../contexts/ExecutionContext';
import { makeStyles, Box, CircularProgress, Button, Tooltip } from '@material-ui/core';
import StopIcon from '@material-ui/icons/Stop';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import FastForwardIcon from '@material-ui/icons/FastForward';
import { grey } from '@material-ui/core/colors';
import SaveProblemDialog from './SaveProblemDialog';
import { withSnackbar } from 'notistack';

const useStyles = makeStyles(theme => ({
  button: {
    color: "black",
    borderRadius: "4px",
    marginLeft: "10px",
    minWidth: "unset",
    backgroundColor: grey[50],
    '&:disabled': {
      backgroundColor: grey[400],
    }
  },
  runButton: {
    color: theme.palette.success.main,
  },
  stopButton: {
    color: theme.palette.error.main,
  },
  buttonProgress: {
    color: theme.palette.secondary.main,
    position: 'absolute',
    top: '50%',
    left: '60%',
    marginTop: -15,
    marginLeft: -15
  },
}));

const RunButton = (props) => {
  const classes = useStyles();
  return (
    <Box position="relative">
      <Button
        variant="contained"
        className={`${classes.button}`}
        endIcon={<PlayArrowIcon className={classes.runButton} />}
        disabled={props.running === true}
        onClick={props.run}>
        Run
      </Button>

      {props.running === true && <CircularProgress size={30} className={classes.buttonProgress} />}
    </Box>
  )
}
const StopButton = (props) => {
  const classes = useStyles();
  return (
    <Button
      variant="contained"
      className={`${classes.button}`}
      disabled={props.disabled}
      style={{ padding: "6px" }}
      onClick={props.stop}
    >
      <StopIcon className={classes.stopButton} />
    </Button>
  )
}

const RunPortfolioButton = (props) => {
  const classes = useStyles();
  return (
    <Box position="relative">
      <Tooltip title={<>Run using portfolio mode which <br /> tries lots of strategies on your problem.</>}>
        <Button
          variant="contained"
          className={classes.button}
          style={{ padding: "6px" }}
          disabled={props.running === true}
          onClick={props.run}
        >
          <FastForwardIcon />
        </Button>
      </Tooltip>
      {props.running === true && <CircularProgress size={30} className={classes.buttonProgress} />}
    </Box>
  )
}

class ExecButtonsGroup extends Component {
  static contextType = ExecutionContext;

  constructor(props) {
    super(props);
    this.state = {
      running: false,
      runningPortfolio: false,
      dialogOpen: false,
      problemBeingRun: {
        clauses: "",
        args: "",
      }
    }
    this.backupExecData = this.backupExecData.bind(this);
    this.solve = this.solve.bind(this);
  }

  backupExecData(clauses, args) {
    this.setState({
      problemBeingRun: {
        clauses,
        args
      }
    })
  }

  solve(clauses, args) {
    this.backupExecData(clauses, args);

    if (this.context.solverSocket.runner) {
      this.context.solverSocket.emit('stop');
      setTimeout(() => {
        this.context.solverSocket.runner = { setState: val => this.setState(val), args }
        this.context.solverSocket.emit('solve', { clauses, args });
      }, 800);
    }
    else {
      this.context.solverSocket.runner = { setState: val => this.setState(val), args }
      this.context.solverSocket.emit('solve', { clauses, args });
    }
  }

  render() {
    return (
      <>
        <RunButton
          running={this.state.running}
          run={() => {
            this.setState({ running: true });
            this.solve(this.context.input, this.context.args);
          }}
        />
        <StopButton
          disabled={!(this.state.running || this.state.runningPortfolio)}
          stop={() => { this.context.solverSocket.emit('stop') }}
        />
        {
          !this.props.hidePortfolioBtn &&
          <RunPortfolioButton
            running={this.state.runningPortfolio}
            run={() => {
              let args = Object.assign({}, this.context.args);
              args['mode'] = 'portfolio'
              if (!args['forced_options']) {
                args['forced_options'] = Object.entries(args).filter(([key, value]) => !this.context.options.uiRestricted.includes(key)).map(([key, value]) => `${key}=${value}`).join(':');
              }
              this.setState({ runningPortfolio: true });
              this.solve(this.context.input, args);
            }}
          />
        }
        <SaveProblemDialog
          open={this.state.dialogOpen}
          clauses={this.state.problemBeingRun.clauses}
          inputSyntax={this.state.problemBeingRun.args["input_syntax"]}
          handleClose={() => this.setState({ dialogOpen: false })}
        />
      </>
    )
  }
}

export default withSnackbar(ExecButtonsGroup);
