import React from "react";
import { AppBar, Toolbar } from "@material-ui/core";
import TimeLimitInput from "./TimeLimitInput";
import EditorSettingsMenu from "./EditorSettingsMenu";
import OptionsInput from "./OptionsInput/component";
import InputLanguageSelector from "./InputLanguageSelector";
import RefreshInputButton from "./RefreshInputButton";
import HelpButton from "./HelpButton";
import ExecButtonsGroup from "./ExecButtonsGroup/component";

const ExecutionBar = props => {
  const { style } = props;
  return (
    <AppBar position="static" style={{ minWidth: "min-content", width: "auto", ...style }}>
      <Toolbar>
        <ExecButtonsGroup />
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