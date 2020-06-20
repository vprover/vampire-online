import React from 'react';
import { Dialog, IconButton, Tooltip } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import HelpIcon from '@material-ui/icons/Help';
import OptionsExplorer from './OptionsExplorer';
import { withStyles } from '@material-ui/styles';

const useStyles = theme => ({
  paper: {
    height: '90%',
  },
  closeBtn: {
    position: "fixed",
    alignSelf: "flex-end",
    marginRight: "1rem"
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
        <Tooltip title="Vampire Options">
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
          <IconButton className={classes.closeBtn} onClick={this.handleClose}>
            <CloseIcon />
          </IconButton>
          <OptionsExplorer />
        </Dialog>
      </React.Fragment>
    )
  }
}

export default withStyles(useStyles)(OptionsDialog);