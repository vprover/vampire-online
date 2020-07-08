import React from 'react';
import { IconButton, Popover, MenuItem, Select, Grid, Box, Tooltip } from "@material-ui/core";
import SettingsIcon from '@material-ui/icons/Settings';
import Brightness5Icon from '@material-ui/icons/Brightness5';
import BrightnessHighIcon from '@material-ui/icons/BrightnessHigh';
import { EditorSettingsContext } from '../../contexts/EditorSettingsContext';

export default class EditorSettingsMenu extends React.Component {
  static contextType = EditorSettingsContext;

  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null
    };

    this.openEditorMenu = this.openEditorMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);

    this.onSelectedColorMode = this.onSelectedColorMode.bind(this);
    this.onSelectedOrientation = this.onSelectedOrientation.bind(this);
    this.onSelectedFontSize = this.onSelectedFontSize.bind(this);
  }

  openEditorMenu(event) {
    this.setState({
      anchorEl: event.currentTarget
    });
  }

  closeMenu() {
    this.setState({
      anchorEl: null
    });
  }

  onSelectedColorMode(e) {
    e.preventDefault();
    this.context.updateEditorSettings("darkTheme", !this.context.settings.darkTheme);
  }

  onSelectedOrientation(e) {
    this.context.updateEditorSettings("orientation", e.target.value);
  }

  onSelectedFontSize(e) {
    this.context.updateEditorSettings("fontSize", e.target.value);
  }

  render() {
    return (
      <div style={{ display: "inline" }}>
        <Tooltip title="Editor Options">
          <IconButton color="inherit" aria-controls="editor-settings" aria-haspopup="true" onClick={this.openEditorMenu}>
            <SettingsIcon />
          </IconButton>
        </Tooltip>
        <Popover
          anchorEl={this.state.anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          open={Boolean(this.state.anchorEl)}
          onClose={this.closeMenu}
        >
          <Box m="1em">
            {
              !this.props.hideTheme &&
              <Grid component="label" container alignItems="center" spacing={2}>
                <Grid item>Dark mode</Grid>
                <Grid item>
                  <IconButton onClick={this.onSelectedColorMode}>
                    {this.context.settings.darkTheme ? <BrightnessHighIcon /> : <Brightness5Icon />}
                  </IconButton>

                </Grid>
              </Grid>

            }
            {
              !this.props.hideOrientation &&
              <Grid component="label" container alignItems="center" spacing={2}>
                <Grid item>Orientation</Grid>
                <Grid item>
                  <Select
                    value={this.context.settings.orientation}
                    onChange={this.onSelectedOrientation}
                  >
                    <MenuItem value={"row"}>Vertical</MenuItem>
                    <MenuItem value={"column"}>Horizontal</MenuItem>
                  </Select>
                </Grid>
              </Grid>
            }

            {
              !this.props.hideFontSize &&
              <Grid component="label" container alignItems="center" spacing={1}>
                <Grid item>Font size</Grid>
                <Grid item>
                  <Select
                    value={this.context.settings.fontSize}
                    onChange={this.onSelectedFontSize}
                  >
                    <MenuItem value={14}>14</MenuItem>
                    <MenuItem value={16}>16</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={22}>22</MenuItem>
                  </Select>
                </Grid>
              </Grid>
            }

          </Box>
        </Popover>
      </div>
    )
  }
}