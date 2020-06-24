import React from 'react';
import AceEditor from 'react-ace';
import { Resizable } from 're-resizable'
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-terminal";
import "./Editor.css";
import axios from 'axios';

export default class Editor extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      prevOrientation: props.settings.orientation,
      value: "",
      error: {},
      height: props.settings.orientation === "row" ? 550 : 300,
      width: props.settings.orientation === "row" ? 500 : 900,
    }
    this.resize = this.resize.bind(this);
    this.onUserInput = this.onUserInput.bind(this);
    this.callParseAPI = this.callParseAPI.bind(this);
  }

  callParseAPI(val) {
    axios.post("http://localhost:8000/parse", { clauses: JSON.stringify(val) })
      .then(res => {
        console.log(res);
        this.setState({
          error: res.data.error
        })
      });
  }

  onUserInput(value) {
    this.setState({
      value: value
    });
    this.props.updateInput(value);
    if (!this.props.readOnly) {
      this.callParseAPI(value);
    }
  }

  resize(e, dir, ref, d) {
    this.setState(prevState => ({
      height: prevState.height + d.height,
      width: prevState.width + d.width,
    }));
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.value === nextState.value || this.props.output !== nextProps.output;
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.settings.orientation !== this.props.settings.orientation) {
      this.setState({
        height: this.props.settings.orientation === "row" ? 550 : 300,
        width: this.props.settings.orientation === "row" ? 500 : 900,
      });
    }
  }

  getErrorAnnotations() {
    let e = this.state.error;
    if (!e) e = this.props.error;
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

  render() {
    return (
      <Resizable
        className={`resizable editor ${this.props.settings.darkTheme ? "border-gray" : "border-black"}`}
        size={{ width: this.state.width + 2, height: this.state.height + 2 }}
        enable={{
          top: false, right: true, bottom: true, left: true,
          topRight: false, bottomRight: true, bottomLeft: false, topLeft: false
        }}
        onResizeStop={this.resize}>
        <AceEditor
          height={this.state.height}
          width={this.state.width}
          readOnly={this.props.readOnly}
          value={this.props.readOnly ? this.props.value : this.state.value}
          fontSize={this.props.settings.fontSize}
          theme={this.props.settings.darkTheme ? "terminal" : "github"}
          onChange={this.onUserInput}
          annotations={this.getErrorAnnotations()}
        />
      </Resizable>
    )
  }
}