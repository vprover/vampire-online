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
      editor: undefined,
      value: "",
      isExpanded: false,
      numberOfInputLines: 0,
    }
    this.onUserInput = this.onUserInput.bind(this);
    this.callParseAPI = this.callParseAPI.bind(this);
    this.defaultNumberOfLines = 12;
  }

  componentDidMount() {
    this.setState({
      value: this.props.execCtx.input,
      numberOfInputLines: this.getNumberOfLines(this.props.execCtx.input)
    })
  }

  componentDidUpdate(prevProps) {
    if (this.props.execCtx.input !== this.state.value
      && this.props.execCtx.input !== prevProps.execCtx.input) {
      this.setState({
        value: this.props.execCtx.input,
        numberOfInputLines: this.getNumberOfLines(this.props.execCtx.input)
      })
    }
  }

  callParseAPI(val) {
    const syntax = this.props.execCtx.args["input_syntax"];
    axios.post(`${process.env.REACT_APP_API_HOST}/parse`, { clauses: val, inputSyntax: syntax })
      .then(res => {
        this.state.editor.getSession().setAnnotations(this.getErrorAnnotations(res.data.error));
      });
  }

  onUserInput(value) {
    if (!this.props.disableParsingErrors) {
      this.callParseAPI(value);
    }
    this.setState({
      value: value,
      numberOfInputLines: this.getNumberOfLines(value)
    })
  }

  getErrorAnnotations(error) {
    const e = error || this.props.execCtx.output.error;
    if (e) {
      return [{
        row: e.line - 1,
        column: 0,
        type: "error",
        text: e.text
      }];
    }
    return [];
  }

  getNumberOfLines(str) {
    return str.split(/\r\n|\r|\n/).length;
  }

  render() {
    const { classes } = this.props;
    return (
      <div style={{ position: "relative", height: `${this.props.output ? "100%" : undefined}` }}>
        {
          this.props.input
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
          maxLines={this.props.input ? (this.state.isExpanded ? Infinity : this.defaultNumberOfLines) : undefined}
          height={this.props.output ? "100%" : undefined}
          width="100%"
          onLoad={(e) => this.setState({ editor: e })}
          onChange={this.props.input ? this.onUserInput : undefined}
          onBlur={() => this.props.execCtx.updateInput(this.state.value)}
          readOnly={this.props.output}
          value={this.props.input ? this.state.value : this.props.execCtx.output.rawOutput}
          fontSize={this.props.settings.fontSize}
          theme={this.props.settings.darkTheme ? "terminal" : "github"}
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