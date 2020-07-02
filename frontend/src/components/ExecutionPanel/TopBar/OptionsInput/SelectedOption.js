import React from 'react'
import { Tooltip, Chip, Typography } from '@material-ui/core';

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
          size="small"
          label={
            <Typography variant="body2">
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