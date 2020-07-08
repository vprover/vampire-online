import React from 'react'
import { Tooltip, Chip, Typography } from '@material-ui/core';
import { ExecutionContext } from '../../../contexts/ExecutionContext';

export default class SelectedOption extends React.Component {
  static contextType = ExecutionContext;

  constructor(props, context) {
    super(props);

    this.getInitialValue = this.getInitialValue.bind(this);
    if (!context.args[this.props.option.name]) {
      context.updateArg(this.props.option.name, this.getInitialValue());
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
    const { option, onDelete, ...otherProps } = this.props;
    const { removeArg, args } = this.context;
    const { name, description } = option;
    return (
      <Tooltip title={description}>
        <Chip
          size="small"
          label={
            <Typography variant="body2">
              {`${name}: ${args[name]}`}
            </Typography >
          }
          onDelete={e => {
            removeArg(this.props.option.name);
            onDelete(e);
          }}
          {...otherProps}
        />
      </Tooltip>
    )
  }
}