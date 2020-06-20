import React from "react";
import { AppBar, Toolbar } from "@material-ui/core";
import RunButton from './RunButton';
import TimeLimitInput from "./TimeLimitInput";
import EditorSettingsMenu from "./EditorSettingsMenu";
import OptionsDialog from "./OptionsDialog";

export default class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      args: {}
    };
  }

  updateArg = (name, value) => {
    this.setState(prevState => ({
      args: {
        ...prevState.args,
        [name]: value
      }
    }));
  }

  removeArg = (name) => {
    this.setState(prevState => {
      delete prevState.args[name];
      return prevState;
    });
  }

  render() {
    return (
      <AppBar position="static" style={{ margin: "0.4em" }}>
        <Toolbar>
          <RunButton
            input={this.props.input}
            args={this.state.args}
            onVampireOutput={this.props.onVampireOutput}
            createAlert={this.props.createAlert}
          />
          <div style={{ marginLeft: "auto" }}>
            <OptionsDialog />
            <TimeLimitInput updateArg={this.updateArg} />
            <EditorSettingsMenu settings={this.props.settings} applySettings={this.props.applySettings} />
          </div>
        </Toolbar>
      </AppBar>
    );
  }
}