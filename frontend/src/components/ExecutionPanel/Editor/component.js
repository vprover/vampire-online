import React, { Component } from 'react';
import AceEditor from 'react-ace';
import { Resizable } from 're-resizable'
import LoadInputMenu from './LoadInputMenu';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-terminal';
import { withStyles } from '@material-ui/core/styles';
import useStyles from './EditorStyles';
import axios from 'axios';
import { ExecutionContext } from '../../../contexts/ExecutionContext';
import { EditorSettingsContext } from '../../../contexts/EditorSettingsContext';

class Editor extends Component {

  constructor(props) {
    super(props)
    this.state = {
      editor: undefined,
      height: props.settings.orientation === "row" ? 550 : 300,
      width: props.settings.orientation === "row" ? 500 : 900,
      d: { width: 0, height: 0 }
    }
    this.resize = this.resize.bind(this);
    this.onUserInput = this.onUserInput.bind(this);
    this.callParseAPI = this.callParseAPI.bind(this);
    this.getErrorAnnotations = this.getErrorAnnotations.bind(this);
  }

  callParseAPI(val) {
    const syntax = this.props.execCtx.args["input_syntax"];
    axios.post(`${process.env.REACT_APP_API_HOST}/parse`, { clauses: val, inputSyntax: syntax })
      .then(res => {
        console.log(res);
        this.state.editor.getSession().setAnnotations(this.getErrorAnnotations(res.data.error));
      });
  }

  onUserInput(value) {
    if (this.props.input) {
      this.props.execCtx.updateInput(value);
      this.callParseAPI(value);
    }
  }

  resize(e, dir, ref, d) {
    this.setState(prevState => ({
      width: prevState.width + d.width - prevState.d.width,
      height: prevState.height + d.height - prevState.d.height,
      d: { ...d }
    }));
  }

  componentDidUpdate(prevProps) {
    if (prevProps.settings.orientation !== this.props.settings.orientation) {
      this.setState({
        height: this.props.settings.orientation === "row" ? 550 : 300,
        width: this.props.settings.orientation === "row" ? 500 : 900,
      });
    }
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

  render() {
    const { classes } = this.props;
    return (
      <div style={{ position: "relative" }}>
        {
          this.props.input &&
          <LoadInputMenu />
        }
        <Resizable
          className={classes.resizable}
          size={{ width: this.state.width + 6, height: this.state.height + 6 }}
          enable={{
            top: false, right: true, bottom: true, left: true,
            topRight: false, bottomRight: true, bottomLeft: false, topLeft: false
          }}
          onResizeStart={() => this.setState({ d: { width: 0, height: 0 } })}
          onResize={this.resize}
        >
          <AceEditor
            className={`${this.props.settings.darkTheme ? classes.borderDarkTheme : classes.borderLightTheme}`}
            onLoad={(e) => this.setState({ editor: e })}
            height={`${this.state.height}px`}
            width={`${this.state.width}px`}
            readOnly={this.props.output}
            value={this.props.input ? this.props.execCtx.input : this.props.execCtx.output.rawOutput}
            fontSize={this.props.settings.fontSize}
            theme={this.props.settings.darkTheme ? "terminal" : "github"}
            onChange={this.onUserInput}
            setOptions={{ useWorker: false }}
          />
        </Resizable>
      </div>
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