import React from 'react';
import { Box, TextField, IconButton, SvgIcon, Tooltip, Popover, FormControl } from '@material-ui/core';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import SelectedOption from './SelectedOption';
import ValueSelector from "./ValueSelector";
import { Icon, InlineIcon } from '@iconify/react';
import contentCopy from '@iconify/icons-mdi/content-copy';
import axios from 'axios';

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
      copiedSuccess: false,
      anchorEl: null,
      optionToEdit: null,
      options: []
    }
    this.copyOptionsToClipBoard = this.copyOptionsToClipBoard.bind(this);
    this.handlePasteOptionString = this.handlePasteOptionString.bind(this);
    this.closePopover = this.closePopover.bind(this);
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
    console.log(this.props.args);
    axios.post("http://localhost:8000/string-strategy/encode", {
      args: JSON.stringify(this.props.args)
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
      this.props.setState({ args: res.data });
    }).catch(error => {
      // this.props.createAlert("error", error.message);
    });
  }

  strToArgs(str) {
    let args = {};
    const splitted = str.match(/\w+ \w+/g);
    try {
      splitted.forEach(element => {
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

  closePopover() {
    this.setState({ anchorEl: null, optionToEdit: null });
  }

  render() {
    return (
      <Box style={{ display: "flex", flexGrow: 2 }} mx="1.2rem" my="0.4rem">
        <Autocomplete
          multiple
          fullWidth
          options={this.state.options}
          getOptionLabel={option => option.name}
          // renderOption={option => (<React.Fragment>{option.name}</React.Fragment>)}
          filterOptions={createFilterOptions({
            stringify: option => `${option.name} ${option.shortName} ${option.description} ${option.defaultVal} ${option.values}`
          })}
          filterSelectedOptions
          renderTags={(tags, getTagProps) =>
            tags.map((option, index) => (
              <SelectedOption
                option={option}
                updateArg={this.props.updateArg}
                removeArg={this.props.removeArg}
                args={this.props.args}
                key={index}
                // Seems interesting, but we could also use a simple click
                onDoubleClick={event => this.setState({ anchorEl: event.target, optionToEdit: option })}
                {...getTagProps({ index })}
              />
            ))
          }
          renderInput={params => {
            return (
              <TextField
                {...params}
                variant="outlined"
                // color="contrast"
                placeholder="Vampire Options"
              // onPaste={e => { console.log("Paste"); this.handlePasteOptionString(e) }}
              />
            )
          }
          }
        />

        {`${this.state.anchorEl ? this.state.anchorEl.offsetWidth : ""}`}

        <Popover
          // style={{ width: this.state.anchorEl ? 3.5 * this.state.anchorEl.offsetWidth : "10rem" }}
          anchorEl={this.state.anchorEl}
          open={Boolean(this.state.anchorEl)}
          onClose={this.closePopover}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}
        >
          {
            this.state.anchorEl &&
            <FormControl style={{
              margin: "0.8rem", display: "inline-flex", justifyContent: "center", flexDirection: "row"
            }}>
              <ValueSelector
                option={this.state.optionToEdit}
                updateArg={this.props.updateArg}
                args={this.props.args}
                closePopover={this.closePopover} />
            </FormControl>
          }
        </Popover>

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
      </Box >
    )
  }
}