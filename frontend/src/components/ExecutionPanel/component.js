import React from 'react';
import { Grid } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Editor from './Editor/component';
import ExecutionBar from '../ExecutionBar/component';
import { EditorSettingsContext, EditorSettingsContextProvider } from '../../contexts/EditorSettingsContext';
import { ExecutionContextProvider } from '../../contexts/ExecutionContext';

export default class ExecutionPanel extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      alert: null
    }
    this.getToken = this.getToken.bind(this);
  }

  getToken() {
    try {
      return this.props.location.search.match(/token=(?<token>[^&$]*)/).groups["token"];
    }
    catch (error) {
      return undefined;
    }
  }

  render() {
    return (
      <EditorSettingsContextProvider>
        <ExecutionContextProvider token={this.getToken()}>
          <React.Fragment>

            <ExecutionBar
              style={{ margin: "2rem", marginTop: "0.5rem" }}
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
                  return (
                    <Grid
                      container
                      direction={value.settings.orientation}
                      justify="space-evenly"
                      alignItems="center"
                      style={{ paddingLeft: "4rem", paddingRight: "4rem" }}>
                      <Grid item>
                        <Editor input />
                      </Grid>

                      <Grid item>
                        <Editor output />
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