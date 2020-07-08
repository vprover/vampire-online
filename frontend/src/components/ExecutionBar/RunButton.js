import React from 'react';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import { Box, Button, IconButton, CircularProgress, Backdrop } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import axios from 'axios';
import { ExecutionContext } from '../../contexts/ExecutionContext';

const useStyles = theme => ({
  buttonProgress: {
    color: theme.palette.secondary.main,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -15,
    marginLeft: -15
  },

  button: {
    backgroundColor: grey[50],
    "&:disabled": {
      backgroundColor: grey[200]
    }
  }
});

class RunButton extends React.Component {
  static contextType = ExecutionContext;

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      apiCallStatus: "no-call"
    }
    this.callSolveAPI = this.callSolveAPI.bind(this);
  }

  callSolveAPI() {
    this.setState({
      apiCallStatus: "loading"
    });

    axios.post(`${process.env.REACT_APP_API_HOST}/solve`, {
      clauses: this.context.input,
      args: JSON.stringify(this.context.args)
    })
      .then(res => {
        console.log(res);
        this.context.updateOutput(res.data);
        this.setState({
          apiCallStatus: "success"
        })
        if (res.data.info) {
          this.props.createAlert("info", res.data.info);
        }
      })
      .catch(error => {
        this.setState({
          apiCallStatus: "fail"
        });
        let msg = error.response ? `Status ${error.response.status}: ` : "";
        msg += error.message;
        this.props.createAlert("error", msg);
      });
  }

  render() {
    const { classes } = this.props;
    return (
      <Box position="relative">
        {
          this.props.iconOnly ?
            <IconButton
              variant="contained"
              className={classes.button}
              style={{ borderRadius: "4px" }}
              disabled={this.state.apiCallStatus === "loading"}
              onClick={this.callSolveAPI}>
              <PlayArrowIcon />
            </IconButton>
            :
            <Button
              variant="contained"
              className={classes.button}
              endIcon={<PlayArrowIcon />}
              disabled={this.state.apiCallStatus === "loading"}
              onClick={this.callSolveAPI}>
              Run
            </Button>
        }
        {/* <Backdrop open={this.state.apiCallStatus === "loading"}>
          <CircularProgress />
        </Backdrop> */}
        {this.state.apiCallStatus === "loading" && <CircularProgress size={30} className={classes.buttonProgress} />}
      </Box>
    );
  }
}

export default withStyles(useStyles)(RunButton)