import React from 'react';
import './App.css';
import { Container, Grid } from '@material-ui/core';
import Editor from './components/Editor';
import TopBar from './components/TopBar';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      editorSettings: {
        darkTheme: true,
        fontSize: 14,
        orientation: "row"
      },
      input: "",
      output: {}
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
      <Container flex className="top-container">
        <div className="App">

          <TopBar
            settings={this.state.editorSettings}
            input={this.state.input}
            onVampireOutput={this.updateVampireOutput}
            applySettings={this.updateEditorSettings}
          />

          <Grid container direction={this.state.editorSettings.orientation} justify="space-evenly" alignItems="center" spacing={3}>

            <Grid item>
              <Editor settings={this.state.editorSettings} updateInput={this.updateUserInput} error={this.state.output.errors} />
            </Grid>

            <Grid item>
              <Editor settings={this.state.editorSettings} value={this.state.output.rawOutput} readOnly={true} />
            </Grid>

          </Grid>
        </div>
      </Container>
    );
  }
}
