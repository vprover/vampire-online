import React from 'react';
import { Dialog, DialogContent, IconButton, Typography } from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import OptionsExplorer from '../OptionsExplorer/component';
import { withStyles } from '@material-ui/styles';
import useStyles from './Style';

const DialogTitle = withStyles(useStyles)((props) => {
  const { children, textVariant, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.dialogTitle} {...other}>
      <Typography variant={textVariant}>{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

class OptionsDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    }
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClickOpen() {
    this.setState({ open: true });
  };


  handleClose() {
    this.setState({ open: false });
  }

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <Dialog
          fullWidth={true}
          maxWidth="lg"
          open={this.state.open}
          onClose={this.handleClose}
          scroll="paper"
          classes={{ paper: classes.paper }}
        >
          <DialogTitle onClose={this.handleClose} textVariant="h4">
            Vampire Options
          </DialogTitle>

          <DialogContent>
            <OptionsExplorer />
          </DialogContent>
        </Dialog>
      </React.Fragment>
    )
  }
}

export default withStyles(useStyles)(OptionsDialog);
export { DialogTitle };