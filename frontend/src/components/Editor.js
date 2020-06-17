import React from 'react';
import AceEditor from 'react-ace';
import { Resizable } from 're-resizable'
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-terminal";
import "./ResizeableCodeEditor.css";

const style = {
  alignItems: "center",
  justifyContent: "center",
  border: "solid 2px black",
};

export default class Editor extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      prevOrientation: props.settings.orientation,
      value: "",
      height: props.settings.orientation === "row" ? 550 : 300,
      width: props.settings.orientation === "row" ? 500 : 900,
    }
    this.resize = this.resize.bind(this);
    this.onUserInput = this.onUserInput.bind(this);
  }

  onUserInput(value) {
    this.setState({
      value: value
    });
    this.props.updateInput(value);
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
    if (this.props.errors) {
      const annots = this.props.errors.lines.map(l => {
        return {
          row: l - 1,
          column: 0,
          type: "error",
          text: "-"
        }
      });
      return annots;
    }
    return;
  }

  render() {
    return (
      <Resizable
        className="resizable"
        style={style}
        size={{ width: this.state.width + 2, height: this.state.height + 2 }}
        enable={{
          top: false, right: true, bottom: true, left: false,
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