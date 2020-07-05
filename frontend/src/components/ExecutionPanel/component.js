import React from 'react';
import { Grid } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Editor from './Editor/component';
import TopBar from './TopBar/component';
import { EditorSettingsContext, EditorSettingsContextProvider } from '../../contexts/EditorSettingsContext';
import { ExecutionContextProvider } from '../../contexts/ExecutionContext';

export default class ExecutionPanel extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      alert: null
    }
  }

  render() {
    return (
      <EditorSettingsContextProvider>
        <ExecutionContextProvider>
          <React.Fragment>

            <TopBar
              createAlert={(s, msg) => { this.setState({ alert: { severity: s, message: msg } }) }}
            />

            {
              this.state.alert &&
              <Alert severity={this.state.alert.severity} onClose={() => { this.setState({ alert: null }) }} style={{ margin: "0.5em" }}>
                {this.state.alert.message}
              </Alert>
            }

            <EditorSettingsContext.Consumer>
              {
                value => {
                  console.log(value);
                  return (
                    <Grid container direction={value.settings.orientation} justify="space-evenly" alignItems="center" spacing={3}>

                      <Grid item>
                        {/* <Editor settings={this.state.editorSettings} value={this.state.input} updateInput={this.updateUserInput} error={this.state.output.errors} /> */}
                        <Editor type="input" />
                      </Grid>

                      <Grid item>
                        {/* <Editor settings={this.state.editorSettings} value={this.state.output.rawOutput} readOnly={true} /> */}
                        <Editor type="output" />
                      </Grid>
                    </Grid>

                  )
                }
              }
            </EditorSettingsContext.Consumer>
          </React.Fragment>
        </ExecutionContextProvider>
      </EditorSettingsContextProvider>
    )
  }
}