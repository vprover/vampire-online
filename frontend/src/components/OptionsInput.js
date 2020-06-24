import React from 'react';
import { TextField, IconButton, SvgIcon, Tooltip } from '@material-ui/core';
import { Icon, InlineIcon } from '@iconify/react';
import contentCopy from '@iconify/icons-mdi/content-copy';
import axios from 'axios'

const CopyIcon = (props) => {
  return (
    <SvgIcon {...props}>
      <Icon icon={contentCopy} />
    </SvgIcon >
  )
}
export default class OptionsInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      args: {},
      copiedSuccess: false
    }
    this.copyOptionsToClipBoard = this.copyOptionsToClipBoard.bind(this);
    this.handlePasteOptionString = this.handlePasteOptionString.bind(this);
  }

  copyToClipboard(str) {
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }

  copyOptionsToClipBoard() {
    axios.post("http://localhost:8000/string-strategy/encode", {
      args: JSON.stringify(this.state.args)
    }).then(res => {
      this.copyToClipboard(res.data);
      this.setState({ copiedSuccess: true });
    }).catch(error => {
      // this.props.createAlert("error", error.message);
    });
  }

  handlePasteOptionString(event) {
    const str = (event.clipboardData || window.clipboardData).getData('text');
    console.log(`Pasted ${str}`);
    axios.post("http://localhost:8000/string-strategy/decode", {
      optionsString: str
    }).then(res => {
      this.setState({ args: res.data });
    }).catch(error => {
      // this.props.createAlert("error", error.message);
    });
  }

  strToArgs(str) {
    let args = {};
    const splited = str.match(/\w+ \w+/g);
    try {
      splited.forEach(element => {
        let name, value;
        [name, value] = element.split(" ");
        args[name] = value;
      });
      console.log(args);
    }
    finally {
      return args;
    }
  }

  argsToString(args) {
    let str = "";
    Object.keys(args).forEach(key => {
      str += `${key} ${args[key]} `;
    });
    return str;
  }


  render() {
    return (
      <React.Fragment>
        <TextField
          fullWidth
          variant="outlined"
          color="secondary"
          value={this.argsToString(this.state.args)}
          onPaste={e => this.handlePasteOptionString(e)}
          onChange={e => this.setState({ args: this.strToArgs(e.target.value) })} />

        <Tooltip
          title="Copied as strategy"
          leaveDelay={1500}
          open={this.state.copiedSuccess}
          disableHoverListener
          onClose={() => this.setState({ copiedSuccess: false })}>
          <IconButton color="inherit" onClick={this.copyOptionsToClipBoard}>
            <CopyIcon />
          </IconButton>
        </Tooltip>
      </React.Fragment>
    )
  }
}