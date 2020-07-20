import React from 'react';
import { ExecutionContext } from '../../../contexts/ExecutionContext';
import { Box, TextField, IconButton, SvgIcon, Tooltip, Popover, FormControl } from '@material-ui/core';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import SelectedOption from './SelectedOption';
import ValueSelector from "./ValueSelector";
import { Icon, InlineIcon } from '@iconify/react';
import contentCopy from '@iconify/icons-mdi/content-copy';
import axios from 'axios';
import useStyles from '../Style';
import { withStyles } from '@material-ui/core/styles';
import { withSnackbar } from 'notistack';

const CopyIcon = (props) => {
  return (
    <SvgIcon {...props}>
      <Icon icon={contentCopy} />
    </SvgIcon >
  )
}

class OptionsInput extends React.Component {
  static contextType = ExecutionContext;

  constructor(props) {
    super(props);
    this.state = {
      selectedOptions: [],
      anchorEl: null,
      optionToEdit: null,
    }
    this.copyOptionsToClipBoard = this.copyOptionsToClipBoard.bind(this);
    this.handlePasteOptionString = this.handlePasteOptionString.bind(this);
    this.closePopover = this.closePopover.bind(this);
  }

  componentDidMount() {
    this.previousContext = this.context;
  }

  componentDidUpdate() {
    if (this.previousContext.args !== this.context.args || this.previousContext.options !== this.context.options) {
      const argNames = Object.keys(this.context.args);
      this.setState({
        selectedOptions: this.context.options.asArray.filter(o => argNames.includes(o.name) && !this.context.options.uiRestricted.includes(o.name)),
      })
    }
    this.previousContext = this.context;
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
    console.log(this.context.args);
    axios.post(`${process.env.REACT_APP_API_HOST}/string-strategy/encode`, {
      args: JSON.stringify(this.context.args)
    }).then(res => {
      this.copyToClipboard(res.data);
      this.props.enqueueSnackbar(`Copied strategy to clipboard`, { variant: "success" });
    }).catch(error => {
      this.props.enqueueSnackbar(`Could not encode options, ${error.message}`, { variant: "error" });
    });
  }

  handlePasteOptionString(event) {
    const str = (event.clipboardData || window.clipboardData).getData('text');
    axios.post(`${process.env.REACT_APP_API_HOST}/string-strategy/decode`, {
      stringStrategy: str
    }).then(res => {
      this.context.clearArgs();
      for (const [name, val] of Object.entries(res.data)) {
        this.context.updateArg(name, val);
      }
      const decodedArgNames = Object.keys(this.context.args);
      this.setState({
        selectedOptions: this.context.options.asArray.filter(o => decodedArgNames.includes(o.name) && !this.context.options.uiRestricted.includes(o.name)),
      });
      this.props.enqueueSnackbar(`Options decoded`, { variant: "success" });
    }).catch(error => {
      const hideTime = 1000 / 2.6 * error.response.data.split(/[\s_:]/).length;
      console.log(hideTime);
      this.props.enqueueSnackbar(<>Could not decode string strategy<br />{error.response.data}</>, { variant: "error", autoHideDuration: hideTime });
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
    const { classes } = this.props;
    return (
      <Box style={{ display: "flex", flexGrow: 2 }} mx="1.2rem" my="0.4rem">
        <Autocomplete
          multiple
          fullWidth
          value={this.state.selectedOptions}
          options={this.context.options.asArray.filter(o => !(o.restriction && o.restriction == true) && !this.context.options.uiRestricted.includes(o.name))}
          onChange={(event, newVal) => {
            this.setState({ selectedOptions: newVal });
            if (newVal.length === 0) this.context.clearArgs();
          }}
          getOptionSelected={(option, value) => option.name === value.name || option === value}
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
                // className={`${classes.textField} ${this.props.tutorial ? classes.extraSmall : undefined}`}
                className={classes.textField}
                variant="outlined"
                placeholder="Vampire Options"
                onPaste={e => { this.handlePasteOptionString(e); }}
              />
            )
          }
          }
        />
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
                closePopover={this.closePopover} />
            </FormControl>
          }
        </Popover>

        <Tooltip title="Copy as strategy">
          <IconButton color="inherit" onClick={this.copyOptionsToClipBoard}>
            <CopyIcon />
          </IconButton>
        </Tooltip>
      </Box >
    )
  }
}

export default withSnackbar(withStyles(useStyles)(OptionsInput));