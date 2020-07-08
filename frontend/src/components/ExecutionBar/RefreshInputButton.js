import React from 'react';
import { ExecutionContext } from '../../contexts/ExecutionContext';
import { Tooltip, IconButton } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';

const RefreshInputButton = () => {
  const execCtx = React.useContext(ExecutionContext);
  return (
    <Tooltip title="Reset input">
      <IconButton
        color="inherit"
        onClick={() => { execCtx.restoreInput() }}
      >
        <RefreshIcon />
      </IconButton>
    </Tooltip>
  )
}

export default RefreshInputButton;