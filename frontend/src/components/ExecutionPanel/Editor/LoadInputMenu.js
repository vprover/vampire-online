import React, { Component } from 'react';
import { Button, ButtonGroup } from '@material-ui/core';
import { Icon, InlineIcon } from '@iconify/react';
import fileUploadOutline from '@iconify/icons-mdi/file-upload-outline';
import libraryOutline from '@iconify/icons-ion/library-outline';
import styles from './SlidingButtonsStyles';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';

const useStyles = makeStyles(styles);

const SlideDiv = props => {
  const [hoverTimer, setHoverTimer] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const { children, direction, ...other } = props;
  const classes = useStyles();
  return (
    <div
      {...other}
      className={`${classes.slide} ${open ? classes.leftOpen : classes.leftClose}`}
      onMouseEnter={() => {
        setHoverTimer(setTimeout(() => setOpen(true), 1200));
      }}
      onMouseLeave={() => {
        clearTimeout(hoverTimer);
        setHoverTimer(null);
        setOpen(false);
      }}
    >
      {
        children
      }
    </div>
  )
}

const UploadProblemFileButton = props => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <input
        accept=".tptp, .p"
        style={{ display: "none" }}
        id="upload-problem-file-button"
        type="file"
        onChange={event => {
          const reader = new FileReader();
          reader.onload = (event => props.updateInput(event.target.result));
          reader.readAsText(event.target.files[0]);
        }}
      />
      <label htmlFor="upload-problem-file-button">
        <Button
          {...props}
          fullWidth
          className={`${classes.left} ${classes.normalText}`}
          startIcon={<Icon icon={fileUploadOutline} />}
          component="span"
        >
          Upload File
        </Button>
      </label>
    </React.Fragment>
  )
}

const ImportProblemFromLibButton = props => {
  const classes = useStyles();
  return (
    <Button
      {...props}
      className={`${classes.left} ${classes.normalText}`}
      startIcon={<Icon icon={libraryOutline} />}
    >
      Problem Library
    </Button>
  )
}

const LoadInputMenu = props => {
  const classes = useStyles();
  return (
    <SlideDiv direction="left">
      <ButtonGroup
        className="btn-group"
        variant="outlined"
        color="secondary"
        orientation="vertical"
      >
        <UploadProblemFileButton
          updateInput={props.updateInput}
          style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
        />

        <ImportProblemFromLibButton
          updateInput={props.updateInput}
          style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
        />

      </ButtonGroup>
    </SlideDiv >
  )
}

export default LoadInputMenu;