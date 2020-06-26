import React from 'react'
import ReactDOM from 'react-dom'
import { Tooltip, Chip, Popover, Select, MenuItem, Switch, Input, IconButton, Typography, FormControl } from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';

export default class SelectedOption extends React.Component {
  constructor(props) {
    super(props);

    this.getInitialValue = this.getInitialValue.bind(this);
    if (!this.props.args[this.props.option.name]) {
      this.props.updateArg(this.props.option.name, this.getInitialValue());
    }
  }

  getInitialValue() {
    const [defaultVal, values] = [this.props.option.default, this.props.option.values];
    if (defaultVal === "off") {
      if (!values) return "on";
      else {
        if (values.includes("on")) return "on";
        else return values.filter(v => v !== "off")[0];
      }
    }
    else {
      return defaultVal;
    }
  }

  render() {
    const { option, updateArg, removeArg, onDelete, args, ...otherProps } = this.props;
    const { name, description } = option;
    return (
      <Tooltip title={description}>
        <Chip
          label={
            <Typography>
              {`${name}: ${this.props.args[name]}`}
            </Typography >
          }
          onDelete={e => {
            this.props.removeArg(this.props.option.name);
            onDelete(e);
          }}
          {...otherProps}
        />
      </Tooltip>
    )
  }
}