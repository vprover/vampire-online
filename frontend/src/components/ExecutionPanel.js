import React from 'react';
import { Container, Grid } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Editor from './Editor';
import TopBar from './TopBar';

export default class ExecutionPanel extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      editorSettings: {
        darkTheme: true,
        fontSize: 14,
        orientation: "row"
      },
      input: "",
      output: {},
      alert: null
    }
  }

  updateEditorSettings = (field, val) => {
    this.setState(oldState => ({
      editorSettings: {
        ...oldState.editorSettings,
        [field]: val
      }
    }));
  }

  updateUserInput = (input) => {
    this.setState({
      input: input
    });
  }

  updateVampireOutput = (output) => {
    console.log(output);
    this.setState({
      output: output
    });
  }

  render() {
    return (
      <Container flex p="0.5em">
        <TopBar
          settings={this.state.editorSettings}
          input={this.state.input}
          onVampireOutput={this.updateVampireOutput}
          applySettings={this.updateEditorSettings}
          createAlert={(s, msg) => { this.setState({ alert: { severity: s, message: msg } }) }}
        />

        {
          this.state.alert &&
          <Alert severity={this.state.alert.severity} onClose={() => { this.setState({ alert: null }) }} style={{ margin: "0.5em" }}>
            {this.state.alert.message}
          </Alert>
        }

        <Grid container direction={this.state.editorSettings.orientation} justify="space-evenly" alignItems="center" spacing={3}>

          <Grid item>
            <Editor settings={this.state.editorSettings} updateInput={this.updateUserInput} error={this.state.output.errors} />
          </Grid>

          <Grid item>
            <Editor settings={this.state.editorSettings} value={this.state.output.rawOutput} readOnly={true} />
          </Grid>

        </Grid>
      </Container>
    )
  }
}