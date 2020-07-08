import React from 'react';
import { Button, ButtonGroup, Dialog, DialogContent } from '@material-ui/core';
import { DialogTitle } from '../../ExecutionBar/OptionsDialog';
import ProblemLibraryExplorer from './ProblemLibraryExplorer';
import { Icon, InlineIcon } from '@iconify/react';
import fileUploadOutline from '@iconify/icons-mdi/file-upload-outline';
import libraryOutline from '@iconify/icons-ion/library-outline';
import { makeStyles } from '@material-ui/core/styles';
import styles from './SlidingButtonsStyles';
import { ExecutionContext } from '../../../contexts/ExecutionContext';

const useStyles = makeStyles(styles);

export const SlideDiv = props => {
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
      onClick={() => {
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
  const { updateInput } = React.useContext(ExecutionContext);
  return (
    <React.Fragment>
      <input
        accept=".tptp, .p"
        style={{ display: "none" }}
        id="upload-problem-file-button"
        type="file"
        onChange={event => {
          const reader = new FileReader();
          reader.onload = (event => updateInput(event.target.result));
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
  const { updateInput, ...other } = props;
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);
  return (
    <React.Fragment>
      <Button
        {...other}
        onClick={() => setOpen(true)}
        className={`${classes.left} ${classes.normalText}`}
        startIcon={<Icon icon={libraryOutline} />}
      >
        Problem Library
      </Button>

      <Dialog
        fullWidth
        maxWidth="xs"
        open={open}
        onClose={handleClose}
        onMouseOver={(e) => e.preventDefault()}
        scroll="paper"
      >
        <DialogTitle onClose={handleClose} textVariant="h5">
          Problem Library
        </DialogTitle>

        <DialogContent>
          <ProblemLibraryExplorer closeDialog={handleClose} />
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}

const LoadInputMenu = props => {
  return (
    <SlideDiv direction="left">
      <ButtonGroup
        className="btn-group"
        variant="outlined"
        color="secondary"
        orientation="vertical"
      >
        <UploadProblemFileButton
          style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
        />

        <ImportProblemFromLibButton
          style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
        />

      </ButtonGroup>
    </SlideDiv >
  )
}

export default LoadInputMenu;