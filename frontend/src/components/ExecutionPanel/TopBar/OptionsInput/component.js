import React from 'react';
import { TextField, IconButton, SvgIcon, Tooltip, Chip } from '@material-ui/core';
import { Icon, InlineIcon } from '@iconify/react';
import contentCopy from '@iconify/icons-mdi/content-copy';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { createFilterOptions } from '@material-ui/lab/Autocomplete';
import axios from 'axios'
import SelectedOption from './SelectedOption';

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
      copiedSuccess: false,
      options: []
    }
    this.copyOptionsToClipBoard = this.copyOptionsToClipBoard.bind(this);
    this.handlePasteOptionString = this.handlePasteOptionString.bind(this);
  }

  componentDidMount() {
    axios.get("http://localhost:8000/options", { sections: false })
      .then(res => this.setState({ options: res.data }))
      .catch(error => console.log(`Could not fetch vampire options: ${error.message}`));
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

  searchBarOnChange(event, newValue, reason) {
    switch (reason) {
      case "select-option":

      case "remove-option":

    }
  }


  render() {
    return (
      <React.Fragment>
        <Autocomplete
          multiple
          fullWidth
          // value={this.props.args}
          onChange={this.searchBarOnChange}
          options={this.state.options}
          getOptionLabel={option => option.name}
          renderOption={option => (<React.Fragment>{option.name}</React.Fragment>)}
          filterOptions={createFilterOptions({
            stringify: option => `${option.name} ${option.shortName} ${option.description} ${option.defaultVal} ${option.values}`
          })}
          renderTags={(tagValue, getTagProps) =>
            tagValue.map((option, index) => (
              <SelectedOption option={option} updateArg={this.props.updateArg} key={index} {...getTagProps({ index })} />
            ))
          }
          renderInput={params => (
            <TextField
              {...params}
              variant="outlined"
              color="secondary"
              value={this.argsToString(this.state.args)}
              placeholder="Vampire Options"
              onPaste={e => this.handlePasteOptionString(e)}
              />
          )}
        />

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