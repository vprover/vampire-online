import React, { Component } from 'react';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

export default class AlertSnackbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.feedback && this.props.feedback) {
      this.setState({ open: true })
    }
  }

  render() {
    if (this.props.feedback) {
      return (
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          open={this.state.open}
          autoHideDuration={5000}
          onClose={() => { this.props.onClose(); this.setState({ open: false }) }}
        >
          <Alert
            onClose={() => { this.props.onClose(); this.setState({ open: false }) }}
            severity={this.props.feedback.severity}>
            {this.props.feedback.message}
          </Alert>
        </Snackbar>
      )
    }
    else {
      return <React.Fragment />
    }
  }
}
