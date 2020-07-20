import React from 'react';
import { Input, IconButton, Select, MenuItem, Switch, FormControl, FormHelperText } from "@material-ui/core";
import CheckIcon from '@material-ui/icons/Check';
import { ExecutionContext } from "../../../contexts/ExecutionContext";

export default class ValueSelector extends React.Component {
  static contextType = ExecutionContext;
  constructor(props) {
    super(props);
    this.state = { valid: true };
  }

  isValid = (value) => {
    const { restriction } = this.props.option;
    let valid = true;
    if (restriction) {
      if (typeof restriction.maxValue !== 'undefined') valid = valid && value <= restriction.maxValue;
      if (typeof restriction.minValue !== 'undefined') valid = valid && value >= restriction.minValue;
    }
    return valid;
  }

  getErrorMessage = () => {
    const { restriction } = this.props.option;
    if (restriction) {
      if (typeof restriction.maxValue !== 'undefined' && typeof restriction.minValue !== 'undefined') return `${restriction.minValue} <= Number <= ${restriction.maxValue}`;
      if (typeof restriction.maxValue !== 'undefined') return `Number <= ${restriction.maxValue}`;
      if (typeof restriction.minValue !== 'undefined') return `${restriction.minValue} <= Number`;
    }
    return undefined;
  }

  render() {
    const [name, defaultVal, values] = [this.props.option.name, this.props.option.default, this.props.option.values];
    if (values) {
      return (
        <Select
          onClose={() => this.props.closePopover()}
          value={this.context.args[name]}
          onChange={(event) => {
            this.context.updateArg(name, event.target.value);
          }}
        >
          {
            values.map((v, index) => <MenuItem value={v} key={index}>{v}</MenuItem>)
          }
        </Select>
      );
    }
    else {
      if (defaultVal === "on" || defaultVal === "off") {
        return (
          <Switch
            size="small"
            checked={this.context.args[name] === "on"}
            onChange={(event) => {
              this.context.updateArg(name, event.target.checked ? "on" : "off");
              this.props.closePopover();
            }} />
        );
      }
      else {
        return (
          <>
            <FormControl error={!this.state.valid} style={{ width: "65%" }}>
              <Input
                id="input-str-option"
                defaultValue={this.context.args[name]}
                onChange={(event) => this.setState({ valid: this.isValid(event.target.value) })}
                onKeyPress={event => {
                  if (this.state.valid && (event.which == 13 || event.keyCode == 13)) {
                    this.context.updateArg(name, event.target.value);
                    this.props.closePopover();
                    return false;
                  }
                  return true;
                }}
              />
              <FormHelperText>{!this.state.valid ? this.getErrorMessage() : undefined}</FormHelperText>

            </FormControl>
            <IconButton
              onClick={() => {
                const val = document.getElementById("input-str-option").value;
                if (this.state.valid) {
                  this.context.updateArg(name, val);
                  this.props.closePopover();
                }
              }}
            >
              <CheckIcon />
            </IconButton>
          </>
        );
      }
    }
  }
}
