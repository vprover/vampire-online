import React, { Component } from 'react'
import { ExecutionContext } from '../../../contexts/ExecutionContext';
import { IconButton, makeStyles, Box, CircularProgress, Button } from '@material-ui/core';
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
    backgroundColor: grey[50],
    "&:disabled": {
      backgroundColor: grey[300],
    },
    "&:hover": {
      backgroundColor: grey['A100'],
    }
  },
  buttonProgress: {
    color: theme.palette.secondary.main,
    position: 'absolute',
    top: '50%',
    left: '50%',
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
        className={classes.button}
        endIcon={<PlayArrowIcon />}
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
    <IconButton
      variant="contained"
      className={classes.button}
      style={{ padding: "6px" }}
      onClick={props.stop}
    >
      <StopIcon />
    </IconButton>
  )
}

const RunPortfolioButton = () => {
  const classes = useStyles();
  return (
    <IconButton
      variant="contained"
      className={classes.button}
      style={{ padding: "6px" }}
    >
      <FastForwardIcon />
    </IconButton>
  )
}

class ExecButtonsGroup extends Component {
  static contextType = ExecutionContext;

  constructor(props) {
    super(props);
    this.state = {
      running: false,
      dialogOpen: false,
      problemBeingRun: {
        clauses: "",
        args: "",
      }
    }
    this.backupExecData = this.backupExecData.bind(this);
  }

  backupExecData() {
    this.setState({
      problemBeingRun: {
        clauses: this.context.input,
        args: this.context.args
      }
    })
  }

  render() {
    return (
      <>
        <RunButton
          running={this.state.running}
          run={() => {
            this.backupExecData();
            if (this.context.solverSocket.runner) {
              this.context.solverSocket.emit('stop');
              setTimeout(() => {
                this.context.solverSocket.runner = { setState: val => this.setState(val), args: this.context.args }
                this.context.solverSocket.emit('solve', { clauses: this.context.input, args: this.context.args });
              }, 800);
            }
            else {
              this.context.solverSocket.runner = { setState: val => this.setState(val), args: this.context.args }
              this.context.solverSocket.emit('solve', { clauses: this.context.input, args: this.context.args });
            }
          }}
        />
        {
          this.state.running &&
          <StopButton stop={() => { this.context.solverSocket.emit('stop') }} />
        }
        <RunPortfolioButton />
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
