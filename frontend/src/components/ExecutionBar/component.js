import React from "react";
import { AppBar, Toolbar } from "@material-ui/core";
import RunButton from './RunButton';
import TimeLimitInput from "./TimeLimitInput";
import EditorSettingsMenu from "./EditorSettingsMenu";
import OptionsInput from "./OptionsInput/component";
import InputLanguageSelector from "./InputLanguageSelector";
import RefreshInputButton from "./RefreshInputButton";
import HelpButton from "./HelpButton";

const ExecutionBar = props => {
  const { style } = props;
  return (
    <AppBar position="static" style={{ margin: "0.4em", minWidth: "min-content",...style }}>
      <Toolbar>
        <RunButton
          createAlert={props.createAlert}
        />
        <OptionsInput
          createAlert={props.createAlert}
          tutorial={props.tutorial}
        />
        <div style={{ marginLeft: "auto", display: "flex" }}>
          {
            !props.tutorial
            && (
              <React.Fragment>
                <HelpButton />
                <InputLanguageSelector />
              </React.Fragment>
            )
          }
          <TimeLimitInput />
          {
            props.tutorial
            && <RefreshInputButton />
          }
          <EditorSettingsMenu hideOrientation={props.tutorial} />
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default ExecutionBar;