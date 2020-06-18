import React from 'react';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import { Box, Button, CircularProgress } from '@material-ui/core';
import axios from 'axios';

export default class RunButton extends React.Component {
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

    console.log(this.props.input);
    console.log(this.props.args);

    axios.post("http://localhost:8000/solve", {
      clauses: JSON.stringify(this.props.input),
      args: JSON.stringify(this.props.args)
    })
      .then(res => {
        console.log(res);
        this.props.onVampireOutput(res.data);
        this.setState({
          apiCallStatus: "success"
        })
      })
      .catch(error => {
        this.setState({
          apiCallStatus: "fail"
        });
      });
  }

  render() {
    return (
      <Box>
        <Button
          variant="contained"
          endIcon={<PlayArrowIcon />}
          disabled={this.state.apiCallStatus === "loading"}
          onClick={this.callSolveAPI}>
          Run
        </Button>
        {this.state.apiCallStatus === "loading" && <CircularProgress size={24} className={this.classes.buttonProgress} />}
      </Box>
    );
  }
}