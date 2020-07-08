import React, { Component } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-terminal';
import { withStyles } from '@material-ui/core/styles';
import useStyles from '../ExecutionPanel/Editor/EditorStyles';
import axios from 'axios';
import { ExecutionContext } from '../../contexts/ExecutionContext';
import { EditorSettingsContext } from '../../contexts/EditorSettingsContext';
import { IconButton } from '@material-ui/core';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

class Editor extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isExpanded: false,
      numberOfInputLines: 0,
      parseError: {},
    }
    this.onUserInput = this.onUserInput.bind(this);
    this.callParseAPI = this.callParseAPI.bind(this);
    this.defaultNumberOfLines = 12;
  }

  componentDidMount() {
    this.setState({ numberOfInputLines: this.getNumberOfLines(this.props.execCtx.input) })
  }

  callParseAPI(val) {
    const syntax = this.props.execCtx.args["input_syntax"];
    axios.post(`${process.env.REACT_APP_API_HOST}/parse`, { clauses: val, inputSyntax: syntax })
      .then(res => {
        this.setState({
          parseError: res.data.error
        });
      });
  }

  onUserInput(value) {
    this.props.execCtx.updateInput(value);
    if (!this.props.readOnly) {
      this.callParseAPI(value);
    }
    this.setState({
      numberOfInputLines: this.getNumberOfLines(value)
    })
  }

  getErrorAnnotations() {
    let e = this.state.parseError;
    if (!e) e = this.props.execCtx.output.error;
    if (e) {
      return [{
        row: e.line - 1,
        column: 0,
        type: "error",
        text: e.text
      }];
    }
    return;
  }

  getNumberOfLines(str) {
    return str.split(/\r\n|\r|\n/).length;
  }

  render() {
    const { classes } = this.props;
    const isOutput = this.props.type === 'output';
    return (
      <div style={{ position: "relative", height: `${isOutput ? "100%" : undefined}` }}>
        {
          !isOutput
          && this.state.numberOfInputLines > this.defaultNumberOfLines
          &&
          <IconButton
            className={classes.expandButton}
            onClick={() => { this.setState(prevState => { return { isExpanded: !prevState.isExpanded } }) }}
          >
            {this.state.isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        }

        <AceEditor
          className={`${this.props.settings.darkTheme ? classes.borderDarkTheme : classes.borderLightTheme}`}
          maxLines={!isOutput ? (this.state.isExpanded ? Infinity : this.defaultNumberOfLines) : undefined}
          height={isOutput ? "100%" : undefined}
          width="100%"
          readOnly={isOutput}
          value={isOutput ? this.props.execCtx.output.rawOutput : this.props.execCtx.input}
          fontSize={this.props.settings.fontSize}
          theme={this.props.settings.darkTheme ? "terminal" : "github"}
          onChange={this.onUserInput}
          annotations={!this.props.disableParsingErrors ? this.getErrorAnnotations() : undefined}
          setOptions={{ useWorker: false }}
        />
      </div >
    )
  }
}

const withContexts = Component => {
  return props => {
    return (
      <EditorSettingsContext.Consumer>
        {
          settingsCtx => {
            return (
              <ExecutionContext.Consumer>
                {
                  execCtx => {
                    return (
                      <Component
                        {...props}
                        readOnly={props.type === 'output'}
                        settings={settingsCtx.settings}
                        execCtx={execCtx} />
                    )
                  }
                }
              </ExecutionContext.Consumer>
            )
          }
        }
      </EditorSettingsContext.Consumer>
    )
  }
}

export default withContexts(withStyles(useStyles)(Editor));