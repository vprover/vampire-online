import React from "react";
import { AppBar, Toolbar } from "@material-ui/core";
import RunButton from './RunButton';
import TimeLimitInput from "./TimeLimitInput";
import EditorSettingsMenu from "./EditorSettingsMenu";
import OptionsDialog from "./OptionsDialog";
import OptionsInput from "./OptionsInput/component";
import InputLanguageSelector from "./InputLanguageSelector";

const TopBar = props => {
  return (
    <AppBar position="static" style={{ margin: "0.4em" }}>
      <Toolbar>
        <RunButton
          createAlert={props.createAlert}
        />
        <OptionsInput
          createAlert={props.createAlert} />
        <div style={{ marginLeft: "auto", display: "flex" }}>
          <OptionsDialog createAlert={props.createAlert} />
          <InputLanguageSelector />
          <TimeLimitInput />
          <EditorSettingsMenu />
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;