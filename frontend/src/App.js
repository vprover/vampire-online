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
      output: "",
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
    this.setState({
      output: output
    })
  }

  render() {
    return (
      <Container flex className="top-container">
        <div className="App">

          <TopBar applySettings={this.updateEditorSettings} settings={this.state.editorSettings} />

          <Grid container direction={this.state.editorSettings.orientation} justify="space-evenly" alignItems="center" spacing={3}>

            <Grid item>
              <Editor settings={this.state.editorSettings} />
            </Grid>

            <Grid item>
              <Editor settings={this.state.editorSettings} readOnly={true} />
            </Grid>

          </Grid>
        </div>
      </Container>
    );
  }
}
