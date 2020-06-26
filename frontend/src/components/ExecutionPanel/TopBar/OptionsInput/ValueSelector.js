import React from 'react';
import { Input, IconButton, Select, MenuItem, Switch } from "@material-ui/core";
import CheckIcon from '@material-ui/icons/Check';

export default class ValueSelector extends React.Component {
  render() {
    const [name, defaultVal, values] = [this.props.option.name, this.props.option.default, this.props.option.values];
    if (values) {
      return (
        <Select
          onClose={() => this.props.closePopover()}
          value={this.props.args[name]}
          onChange={(event) => {
            this.props.updateArg(name, event.target.value);
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
            checked={this.props.args[name] === "on"}
            onChange={(event) => {
              this.props.updateArg(name, event.target.checked ? "on" : "off");
              this.props.closePopover();
            }} />
        );
      }
      else {
        return (
          <>
            <Input
              style={{ width: "65%" }}
              defaultValue={this.props.args[name]}
              onKeyPress={event => {
                if (event.which == 13 || event.keyCode == 13) {
                  this.props.updateArg(name, event.target.value);
                  this.props.closePopover();
                  return false;
                }
                return true;
              }}
            />
            <IconButton
              onClick={() => {
                this.props.updateArg(name, document.getElementById("input-str-option").value);
                this.props.closePopover();
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
