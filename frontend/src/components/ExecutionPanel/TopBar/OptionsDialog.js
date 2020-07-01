import React from 'react';
import { Dialog, DialogContent, IconButton, Tooltip, Typography } from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import HelpIcon from '@material-ui/icons/Help';
import OptionsExplorer from '../../OptionsExplorer/component';
import { withStyles } from '@material-ui/styles';

const dialogTitleStyle = (theme) => ({
  root: {
    marginLeft: "2rem",
    marginBottom: "-1.4rem",
    paddingTop: "1rem",
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(dialogTitleStyle)((props) => {
  const { children, textVariant, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant={textVariant}>{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const useStyles = theme => ({
  paper: {
    height: '90%',
  }
});

class OptionsDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    }
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };


  handleClose = () => {
    this.setState({ open: false });
  }

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <Tooltip title="Vampire Options Manual">
          <IconButton color="inherit" onClick={this.handleClickOpen}>
            <HelpIcon />
          </IconButton>
        </Tooltip>

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