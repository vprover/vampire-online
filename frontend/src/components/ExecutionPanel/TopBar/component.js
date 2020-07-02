import React from "react";
import { AppBar, Toolbar } from "@material-ui/core";
import RunButton from './RunButton';
import TimeLimitInput from "./TimeLimitInput";
import EditorSettingsMenu from "./EditorSettingsMenu";
import OptionsDialog from "./OptionsDialog";
import OptionsInput from "./OptionsInput/component";
import InputLanguageSelector from "./InputLanguageSelector";

export default class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      args: {}
    };
    this.updateArg = this.updateArg.bind(this);
    this.removeArg = this.removeArg.bind(this);
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
          <OptionsInput
            updateArg={this.updateArg}
            removeArg={this.removeArg}
            args={this.state.args}
            createAlert={this.props.createAlert}/>
          <div style={{ marginLeft: "auto", display: "flex" }}>
            <OptionsDialog createAlert={this.props.createAlert} />
            <InputLanguageSelector updateArg={this.updateArg} inputLang={this.state.args["input_syntax"]}/>
            <TimeLimitInput updateArg={this.updateArg} timeLimit={this.state.args["time_limit"]} />
            <EditorSettingsMenu settings={this.props.settings} applySettings={this.props.applySettings} />
          </div>
        </Toolbar>
      </AppBar>
    );
  }
}