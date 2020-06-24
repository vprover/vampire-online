import React from 'react'
import { Tooltip, Chip } from '@material-ui/core';

export default class SelectedOption extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.option.default
    }
    console.log(this.props.option);
  }

  render() {
    const { name, shortName, description, values } = this.props.option;
    return (
      <React.Fragment>
        <Tooltip title={description}>
          <Chip label={`${name}: ${this.state.value}`} {...this.props}/>
        </Tooltip>
      </React.Fragment>
    )
  }

}