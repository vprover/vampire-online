import React, { Component, Fragment } from 'react';
import { IconButton, Popover, ButtonGroup, Button } from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';
import { withStyles } from '@material-ui/core/styles';
import useStyles from './Style';
import OptionsDialog from './OptionsDialog';
import { Link } from 'react-router-dom';

class HelpButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
    }
    this.optionsExplorerRef = React.createRef();
    this.handlePopoverClose = this.handlePopoverClose.bind(this);
    this.handlePopoverOpen = this.handlePopoverOpen.bind(this);
  }

  handlePopoverOpen(event) {
    this.setState({ anchorEl: event.currentTarget });
  };

  handlePopoverClose() {
    this.setState({ anchorEl: null });
  };

  render() {
    const open = Boolean(this.state.anchorEl);
    const { classes } = this.props;

    return (
      <Fragment>
        <IconButton
          color="inherit"
          aria-owns={open ? "helper-menu" : undefined}
          aria-haspopup="true"
          onClick={this.handlePopoverOpen}
        >
          <HelpIcon />
        </IconButton>

        <Popover
          id="helper-menu"
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          open={open}
          anchorEl={this.state.anchorEl}
          onClose={this.handlePopoverClose}
        >

          <ButtonGroup color="secondary">

            <Button className={classes.normalText} component={Link} to="/tutorial">
              Tutorial Mode
            </Button>

            <Button
              onClick={() => {
                this.optionsExplorerRef.current.handleClickOpen();
                this.handlePopoverClose();
              }}
              className={classes.normalText}
            >
              Vampire Options Manual
            </Button>
          </ButtonGroup>
        </Popover>
        <OptionsDialog ref={this.optionsExplorerRef} />
      </Fragment>
    )
  }
}

export default withStyles(useStyles)(HelpButton);