import React from 'react';
import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import { withSnackbar } from 'notistack';
import axios from 'axios';

class SaveProblemDialog extends React.Component {

  constructor(props) {
    super(props);
  }

  sendProblem = () => {
    axios.post(`${process.env.REACT_APP_API_HOST}/upload-problem`, {
      clauses: this.props.data.clauses,
      description: document.getElementById("problem-description").value,
      inputSyntax: this.props.data.inputSyntax,
    })
      .then(res => {
        this.props.enqueueSnackbar("Thank you for sharing your problem!", { variant: "success" });
      })
      .catch(error => {
        this.props.enqueueSnackbar(<>Failed to upload problem<br /> {error.response.data}</>, { variant: "error" });
      });
  }

  render() {
    return (
      <Dialog
        open={this.props.data.open}
        onClose={this.props.handleClose}
        aria-labelledby="save-problem-dialog-title"
        aria-describedby="save-problem-dialog-description"
      >
        <DialogTitle id="save-problem-dialog-title">{"Share problem?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Is this a hard problem that you think Vampire should be able to solve?
            Would you like to share it with us to make Vampire better?
          </DialogContentText>
          <TextField
            autoFocus
            multiline
            variant="outlined"
            margin="dense"
            id="problem-description"
            label="Problem Description"
            type="text"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { this.sendProblem(); this.props.handleClose(); }} color="primary">
            Yes
          </Button>
          <Button onClick={this.props.handleClose} color="primary" autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog >
    )
  }
}

export default withSnackbar(SaveProblemDialog);
